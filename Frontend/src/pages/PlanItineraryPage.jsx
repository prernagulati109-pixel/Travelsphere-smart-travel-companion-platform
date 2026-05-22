import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fullPlaceData } from '../data/data';
import { apiService } from '../services/apiService';
import { pdfGenerator } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, RefreshCcw, Copy, CheckCheck } from 'lucide-react';


// Itinerary templates per destination
const itineraryTemplates = {
  Paris: [
    { day: 1, title: 'Arrival & City Exploration', activities: [
      { time: '09:00 AM', title: 'Arrive at Charles de Gaulle Airport', description: 'Clear customs and take the RER B train or taxi to your hotel in central Paris.', icon: '✈️' },
      { time: '12:00 PM', title: 'Check-in & Lunch', description: 'Settle into your hotel and enjoy a classic Croque Monsieur at a nearby brasserie.', icon: '🏨' },
      { time: '02:00 PM', title: 'Walk along the Seine River', description: 'Stroll along the riverbanks, cross Pont des Arts, and soak in the Parisian ambiance.', icon: '🚶' },
      { time: '05:00 PM', title: 'Eiffel Tower Visit', description: 'Head to the Champ de Mars and ascend the Eiffel Tower for panoramic views of the city.', icon: '🗼' },
      { time: '08:00 PM', title: 'Dinner in Le Marais', description: 'Enjoy French cuisine at a bistro in the trendy Le Marais district.', icon: '🍷' },
    ]},
    { day: 2, title: 'Art & Culture Day', activities: [
      { time: '09:00 AM', title: 'Louvre Museum', description: 'Explore the world\'s largest art museum. See the Mona Lisa, Venus de Milo and more.', icon: '🎨' },
      { time: '01:00 PM', title: 'Lunch at Café de Flore', description: 'Dine at the iconic literary café in Saint-Germain-des-Prés.', icon: '☕' },
      { time: '03:00 PM', title: 'Musée d\'Orsay', description: 'Admire Impressionist masterpieces by Monet, Renoir, and Van Gogh.', icon: '🖼️' },
      { time: '06:00 PM', title: 'Luxembourg Gardens', description: 'Relax in the beautiful gardens and watch the sunset over the palace.', icon: '🌳' },
      { time: '08:30 PM', title: 'Seine River Dinner Cruise', description: 'Enjoy a romantic dinner cruise with views of illuminated Paris landmarks.', icon: '🚢' },
    ]},
    { day: 3, title: 'Montmartre & Shopping', activities: [
      { time: '09:00 AM', title: 'Sacré-Cœur Basilica', description: 'Visit the beautiful white basilica atop Montmartre hill with stunning city views.', icon: '⛪' },
      { time: '11:00 AM', title: 'Place du Tertre Artists', description: 'Watch street artists at work and pick up a unique souvenir painting.', icon: '🎭' },
      { time: '01:00 PM', title: 'Lunch in Montmartre', description: 'Try authentic French crêpes and local wine at a charming café.', icon: '🥐' },
      { time: '03:00 PM', title: 'Champs-Élysées Shopping', description: 'Walk down the famous avenue and shop at luxury boutiques.', icon: '🛍️' },
      { time: '06:00 PM', title: 'Arc de Triomphe', description: 'Climb to the top for spectacular views of the 12 radiating avenues.', icon: '🏛️' },
      { time: '08:00 PM', title: 'Farewell Dinner', description: 'End your Paris trip with a gourmet dinner near the Trocadéro.', icon: '🍽️' },
    ]},
    { day: 4, title: 'Versailles Day Trip', activities: [
      { time: '08:00 AM', title: 'Train to Versailles', description: 'Take the RER C from Paris to the Palace of Versailles (45 mins).', icon: '🚆' },
      { time: '09:30 AM', title: 'Palace of Versailles Tour', description: 'Explore the Hall of Mirrors, Royal Apartments, and opulent state rooms.', icon: '👑' },
      { time: '12:30 PM', title: 'Lunch in Versailles Town', description: 'Try authentic French lunch at a restaurant near the palace.', icon: '🥖' },
      { time: '02:00 PM', title: 'Versailles Gardens', description: 'Wander through the magnificent formal gardens, fountains, and the Grand Canal.', icon: '🌺' },
      { time: '05:00 PM', title: 'Return to Paris', description: 'Head back to Paris and freshen up at the hotel.', icon: '🚆' },
      { time: '07:30 PM', title: 'Moulin Rouge Show', description: 'Experience the legendary cabaret show in Pigalle.', icon: '💃' },
    ]},
    { day: 5, title: 'Hidden Gems & Departure', activities: [
      { time: '09:00 AM', title: 'Notre-Dame & Île de la Cité', description: 'Visit the iconic cathedral (exterior) and explore the charming island.', icon: '⛪' },
      { time: '11:00 AM', title: 'Shakespeare and Company', description: 'Browse the legendary English-language bookshop on the Left Bank.', icon: '📚' },
      { time: '12:30 PM', title: 'Final Parisian Lunch', description: 'Enjoy a leisurely lunch with wine at a traditional bistro.', icon: '🍷' },
      { time: '02:00 PM', title: 'Last-Minute Shopping', description: 'Pick up macarons, cheese, or perfume as gifts.', icon: '🎁' },
      { time: '04:00 PM', title: 'Departure', description: 'Head to the airport for your journey home. Au revoir, Paris!', icon: '✈️' },
    ]},
  ],
  Tokyo: [
    { day: 1, title: 'Arrival & Shibuya', activities: [
      { time: '10:00 AM', title: 'Arrive at Narita/Haneda Airport', description: 'Take the Narita Express or monorail to central Tokyo.', icon: '✈️' },
      { time: '01:00 PM', title: 'Hotel Check-in & Ramen Lunch', description: 'Drop your bags and slurp authentic tonkotsu ramen at a local shop.', icon: '🍜' },
      { time: '03:00 PM', title: 'Shibuya Crossing', description: 'Experience the world\'s busiest intersection from the famous Starbucks viewpoint.', icon: '🚶' },
      { time: '05:00 PM', title: 'Harajuku & Takeshita Street', description: 'Explore quirky fashion shops and try rainbow cotton candy.', icon: '🌈' },
      { time: '07:00 PM', title: 'Dinner in Shinjuku', description: 'Dive into the neon-lit alleys of Omoide Yokocho for yakitori.', icon: '🏮' },
    ]},
    { day: 2, title: 'Traditional Tokyo', activities: [
      { time: '08:00 AM', title: 'Tsukiji Outer Market', description: 'Sample the freshest sushi, tamagoyaki, and seafood for breakfast.', icon: '🍣' },
      { time: '10:30 AM', title: 'Senso-ji Temple', description: 'Visit Tokyo\'s oldest temple in Asakusa and walk through Nakamise-dori.', icon: '⛩️' },
      { time: '01:00 PM', title: 'Lunch & Tokyo Skytree', description: 'Enjoy lunch and ascend the 634m tower for breathtaking views.', icon: '🗼' },
      { time: '04:00 PM', title: 'Meiji Shrine', description: 'Find serenity at this forested Shinto shrine in the heart of the city.', icon: '🌿' },
      { time: '07:00 PM', title: 'Akihabara Night', description: 'Explore anime shops, arcades, and maid cafés in Electric Town.', icon: '🎮' },
    ]},
    { day: 3, title: 'Modern & Pop Culture', activities: [
      { time: '09:00 AM', title: 'teamLab Borderless', description: 'Immerse yourself in stunning digital art installations.', icon: '🎨' },
      { time: '12:00 PM', title: 'Odaiba Waterfront', description: 'See the Rainbow Bridge, Gundam statue, and enjoy seaside shopping.', icon: '🌊' },
      { time: '02:30 PM', title: 'Shibuya Sky Observatory', description: 'Take in 360° views of Tokyo from the rooftop sky stage.', icon: '🏙️' },
      { time: '05:00 PM', title: 'Golden Gai Bar Hopping', description: 'Explore the tiny, atmospheric bars in Shinjuku\'s Golden Gai.', icon: '🍶' },
      { time: '08:00 PM', title: 'Farewell Kaiseki Dinner', description: 'End your Tokyo journey with an exquisite multi-course Japanese meal.', icon: '🍱' },
    ]},
  ],
  Bali: [
    { day: 1, title: 'Arrival & Beach Vibes', activities: [
      { time: '10:00 AM', title: 'Arrive at Ngurah Rai Airport', description: 'Get picked up and transfer to your villa in Seminyak.', icon: '✈️' },
      { time: '12:30 PM', title: 'Beachside Lunch', description: 'Enjoy fresh seafood at a beach club with ocean views.', icon: '🏖️' },
      { time: '03:00 PM', title: 'Seminyak Beach', description: 'Relax on the golden sand or try surfing lessons.', icon: '🏄' },
      { time: '06:00 PM', title: 'Sunset at Tanah Lot', description: 'Watch the spectacular sunset at the iconic sea temple.', icon: '🌅' },
      { time: '08:00 PM', title: 'Dinner in Seminyak', description: 'Dine at a trendy restaurant with live Balinese music.', icon: '🍽️' },
    ]},
    { day: 2, title: 'Ubud Cultural Journey', activities: [
      { time: '07:00 AM', title: 'Tegallalang Rice Terraces', description: 'Walk through the iconic terraced rice paddies at sunrise.', icon: '🌾' },
      { time: '10:00 AM', title: 'Sacred Monkey Forest', description: 'Explore the lush jungle sanctuary with playful macaques.', icon: '🐒' },
      { time: '12:00 PM', title: 'Ubud Palace & Market', description: 'Visit the royal palace and browse the colorful art market.', icon: '👑' },
      { time: '02:00 PM', title: 'Spa & Wellness', description: 'Indulge in a traditional Balinese massage and flower bath.', icon: '💆' },
      { time: '06:30 PM', title: 'Kecak Fire Dance', description: 'Watch the mesmerizing sunset fire dance performance at Uluwatu.', icon: '🔥' },
    ]},
    { day: 3, title: 'Adventure & Departure', activities: [
      { time: '04:00 AM', title: 'Mount Batur Sunrise Trek', description: 'Hike to the summit of an active volcano for a breathtaking sunrise.', icon: '🌋' },
      { time: '09:00 AM', title: 'Hot Springs & Breakfast', description: 'Soak in natural hot springs with volcanic lake views.', icon: '♨️' },
      { time: '12:00 PM', title: 'Tirta Empul Water Temple', description: 'Participate in a traditional water purification ritual.', icon: '⛩️' },
      { time: '03:00 PM', title: 'Last Shopping & Pack-up', description: 'Pick up handcrafted souvenirs and prepare for departure.', icon: '🛍️' },
      { time: '06:00 PM', title: 'Departure', description: 'Transfer to the airport. Sampai jumpa, Bali!', icon: '✈️' },
    ]},
  ],
};

// Generate a generic itinerary for destinations without a template
function generateGenericItinerary(destination, numDays, travelers) {
  const place = fullPlaceData[destination];
  const dayTitles = [
    'Arrival & Exploration',
    'Essential Landmarks',
    'Culture & Local Life',
    'Nature & Adventure',
    'Hidden Gems & Relaxation',
    'Final Exploration',
    'Departure Day',
  ];

  const morningActivities = [
    { title: `Explore ${destination} City Center`, description: 'Walk through the main streets, discover local architecture and vibrant morning markets.', icon: '🚶' },
    { title: 'Visit the Top Attraction', description: place ? `Head to ${place.attractions[0]?.name || 'the main attraction'} for an unforgettable experience.` : 'Visit the most iconic landmark of the city.', icon: '🏛️' },
    { title: 'Local Breakfast Experience', description: 'Try authentic local breakfast at a cafe loved by residents.', icon: '☕' },
    { title: 'Museum & History Tour', description: 'Discover the rich cultural heritage at the city\'s best museum.', icon: '🎨' },
    { title: 'Morning Market Visit', description: 'Explore a bustling local market full of colors, aromas, and crafts.', icon: '🛒' },
  ];

  const afternoonActivities = [
    { title: 'Scenic Viewpoint', description: 'Head to the best viewpoint for panoramic photos and relaxation.', icon: '📸' },
    { title: `${destination} Food Tour`, description: `Sample the best local dishes ${destination} has to offer on a guided food walk.`, icon: '🍽️' },
    { title: 'Shopping & Souvenirs', description: 'Browse local boutiques and markets for unique handcrafted souvenirs.', icon: '🛍️' },
    { title: 'Gardens & Parks', description: 'Enjoy a peaceful afternoon in the city\'s most beautiful green spaces.', icon: '🌳' },
    { title: 'Cultural Workshop', description: travelers === 'Family' ? 'Join a family-friendly craft workshop.' : 'Take a hands-on class in local art or cooking.', icon: '🎭' },
  ];

  const eveningActivities = [
    { title: 'Sunset Experience', description: 'Find the perfect spot to watch a magical sunset over the skyline.', icon: '🌅' },
    { title: 'Fine Dining', description: `Enjoy a ${travelers === 'Couple' ? 'romantic' : 'memorable'} dinner at a top-rated local restaurant.`, icon: '🍷' },
    { title: 'Night Walk & Street Food', description: 'Explore the city after dark and try popular street food.', icon: '🏮' },
    { title: 'Rooftop Experience', description: 'Sip cocktails at a rooftop bar with stunning night views.', icon: '🌃' },
    { title: 'Live Entertainment', description: travelers === 'Friends' ? 'Hit the best nightlife spot in town!' : 'Enjoy a local live performance or concert.', icon: '🎶' },
  ];

  const days = [];
  for (let i = 0; i < numDays; i++) {
    const mIdx = i % morningActivities.length;
    const aIdx = i % afternoonActivities.length;
    const eIdx = i % eveningActivities.length;

    const activities = [];

    if (i === 0) {
      activities.push({ time: '09:00 AM', title: `Arrive in ${destination}`, description: 'Land at the airport, clear customs, and transfer to your accommodation.', icon: '✈️' });
      activities.push({ time: '12:00 PM', title: 'Check-in & Lunch', description: 'Settle in and enjoy your first local meal.', icon: '🏨' });
    } else {
      activities.push({ time: '09:00 AM', ...morningActivities[mIdx] });
      activities.push({ time: '12:00 PM', title: 'Lunch Break', description: 'Savor local cuisine at a recommended spot.', icon: '🍜' });
    }

    activities.push({ time: '02:00 PM', ...afternoonActivities[aIdx] });

    if (place && place.highlights[i % place.highlights.length]) {
      activities.push({ time: '04:30 PM', title: `Visit ${place.highlights[i % place.highlights.length]}`, description: `Don't miss this must-see highlight of ${destination}.`, icon: '⭐' });
    }

    activities.push({ time: '07:00 PM', ...eveningActivities[eIdx] });

    if (i === numDays - 1) {
      activities.push({ time: '09:00 PM', title: 'Pack & Prepare for Departure', description: `Get everything ready for your journey home from ${destination}.`, icon: '🧳' });
    }

    days.push({
      day: i + 1,
      title: dayTitles[i % dayTitles.length],
      activities,
    });
  }
  return days;
}

function PlanItineraryPage() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');
  const [travelers, setTravelers] = useState('Family');
  const [isCreating, setIsCreating] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [searchedDest, setSearchedDest] = useState('');
  const [expandedDay, setExpandedDay] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('summary');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [upiCopied, setUpiCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const { isLoggedIn, setPendingAction } = useAuth();

  // Fallback auth detection: some parts of the app may store user in sessionStorage/localStorage.
  const authLoggedIn = Boolean(isLoggedIn || sessionStorage.getItem('travelsphere_user') || localStorage.getItem('user'));

  // Payment verification states
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  // UPI config
  const UPI_ID   = 'gulatiprerna676@okaxis';
  const UPI_NAME = 'TravelSphere';
  const tripTotal = parseInt(days) * 5000;

  // Automatic mock payment verification on UPI tab click
  useEffect(() => {
    if (paymentMethod === 'scanner' && !paymentVerified && !verifyingPayment) {
      setVerifyingPayment(true);
      const timer = setTimeout(() => {
        setPaymentVerified(true);
        setVerifyingPayment(false);
      }, 6000); // 6 seconds automatic delay
      return () => clearTimeout(timer);
    }
  }, [paymentMethod, paymentVerified, verifyingPayment]);

  const handleCreate = async () => {
    if (!destination.trim()) return;
    setIsCreating(true);

    const numDays = parseInt(days, 10);
    let realAttractions = [];
    
    // Fetch real-time attractions for the destination
    const locationResults = await apiService.searchLocations(destination);
    if (locationResults && locationResults.length > 0) {
      const attractions = await apiService.getAttractions(locationResults[0].locationId);
      if (attractions) {
        realAttractions = attractions;
      }
    }

    // Find matching template (case-insensitive)
    const matchKey = Object.keys(itineraryTemplates).find(
      k => k.toLowerCase() === destination.trim().toLowerCase()
    );

    let result;
    if (matchKey) {
      const template = itineraryTemplates[matchKey];
      result = template.slice(0, numDays);
      // If user wants more days than template has, fill with generic
      if (numDays > template.length) {
        const extra = generateGenericItinerary(matchKey, numDays - template.length, travelers);
        extra.forEach((d, i) => { d.day = template.length + i + 1; });
        result = [...result, ...extra];
      }
    } else {
      // Capitalize
      const capitalDest = destination.trim().charAt(0).toUpperCase() + destination.trim().slice(1).toLowerCase();
      result = generateGenericItinerary(capitalDest, numDays, travelers);
    }

    // Inject real-time attractions into the itinerary if available
    if (realAttractions.length > 0) {
      result = result.map((day, dIdx) => ({
        ...day,
        activities: day.activities.map((act, aIdx) => {
          // Replace generic attractions with real ones
          if (act.icon === '🏛️' || act.icon === '🎨' || act.icon === '⭐') {
            const realAtt = realAttractions[(dIdx * 2 + aIdx) % realAttractions.length];
            if (realAtt) {
              return {
                ...act,
                title: `Visit ${realAtt.name}`,
                description: realAtt.description || act.description,
              };
            }
          }
          return act;
        })
      }));
    }

    setItinerary(result);
    setSearchedDest(destination.trim());
    setIsCreating(false);
    setExpandedDay(0);
  };

 const handleDownloadPDF = () => {
  if (!itinerary) return;

  // If user is not logged in, set a pending action to generate the PDF
  // after successful login and redirect the user to the auth page.
  if (!authLoggedIn) {
    // Store a callable pending action (function value) in auth context
    setPendingAction(() => () => {
      pdfGenerator.generateItineraryPDF({
        destination: searchedDest || destination,
        days: parseInt(days, 10),
        travelers,
        itinerary
      });
    });

    // Optional UX hint before redirecting
    try { window.alert('Please login to download itinerary PDF'); } catch (e) {}

    navigate('/auth', { state: { redirectTo: location.pathname, from: location.pathname } });
    return;
  }

  // If already logged in, generate & download immediately
  pdfGenerator.generateItineraryPDF({
    destination: searchedDest || destination,
    days: parseInt(days, 10),
    travelers,
    itinerary
  });
};

  const handleBookTrip = () => {
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      setShowBookingModal(true);
    }, 1500);
  };

  const confirmBooking = () => {
    setBookingLoading(true);
    setTimeout(() => {
      setIsBooked(true);
      setShowBookingModal(false);
      setPaymentStep('summary');
      setBookingLoading(false);
    }, 2000);
  };

  return (
    <div className="explore-page">
      <Navbar activePage="itinerary" />

      <div className="explore-container">
        {/* Search Bar */}
        <div className="explore-navbar">
          <div className="nav-field">
            <label>Where to?</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
          </div>
          <div className="nav-field">
            <label>How long?</label>
            <div className="input-wrapper">
              <select value={days} onChange={(e) => setDays(e.target.value)}>
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="5">5 Days</option>
                <option value="7">7 Days</option>
              </select>
            </div>
          </div>
          <div className="nav-field">
            <label>Travelers</label>
            <div className="input-wrapper">
              <select value={travelers} onChange={(e) => setTravelers(e.target.value)}>
                <option value="Solo">Solo</option>
                <option value="Couple">Couple</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
              </select>
            </div>
          </div>
          <button
            className={`create-itinerary-btn ${isCreating ? 'loading' : ''}`}
            onClick={handleCreate}
            disabled={isCreating}
          >
            <span className="icon">{isCreating ? '⏳' : '📝'}</span>
            <span>{isCreating ? 'Creating...' : 'Create'}</span>
            <span className="chevron">∨</span>
          </button>
        </div>

        {/* Before Search — Prompt */}
        {!itinerary && !isCreating && (
          <section className="to-empty-prompt">
            <div className="to-empty-icon">📝</div>
            <h2>Plan Your Smart Itinerary</h2>
            <p>Enter a destination, choose how many days, select your travel group, and hit Create to get a personalized day-by-day plan.</p>
          </section>
        )}

        {/* Loading State */}
        {isCreating && (
          <section className="itin-loading">
            <div className="itin-loading-spinner"></div>
            <h3>Creating your personalized itinerary...</h3>
            <p>Planning the perfect {days}-day trip to {destination}</p>
          </section>
        )}

        {/* Itinerary Results */}
        {itinerary && !isCreating && (
          <>
            {/* Route Banner */}
            <div className="to-route-banner">
              <div className="to-route-cities">
                <span className="to-city-name">📍 {searchedDest}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span className="to-route-date">📅 {days} Days</span>
                <span className="to-route-date">👥 {travelers}</span>
              </div>
            </div>

            <section className="itin-results">
              <div className="itin-results-header">
                <div className="header-text">
                  <h2>Your Smart Itinerary</h2>
                  <p>A personalized {itinerary.length}-day plan for your trip to {searchedDest}.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button className="download-pdf-btn" onClick={handleDownloadPDF} style={{ background: '#f1f5f9', color: '#475569', boxShadow: 'none' }}>
                    <span className="icon">📄</span>
                    <span>Download PDF</span>
                  </button>
                  <button 
                    className={`download-pdf-btn ${isBooked ? 'booked' : ''}`} 
                    onClick={handleBookTrip}
                    disabled={bookingLoading}
                    style={{ background: isBooked ? '#10b981' : 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}
                  >
                    <span className="icon">{bookingLoading ? '⏳' : isBooked ? '✅' : '💳'}</span>
                    <span>{bookingLoading ? 'Processing...' : isBooked ? 'Trip Booked!' : 'Book This Trip'}</span>
                  </button>
                </div>
              </div>

              {/* Day Selector Tabs */}
              <div className="itin-day-tabs">
                {itinerary.map((d, idx) => (
                  <button
                    key={d.day}
                    className={`itin-day-tab ${expandedDay === idx ? 'active' : ''}`}
                    onClick={() => setExpandedDay(idx)}
                  >
                    Day {d.day}
                  </button>
                ))}
              </div>

              {/* Active Day Detail */}
              {expandedDay !== null && itinerary[expandedDay] && (
                <div className="itin-day-card slide-down-animation" key={expandedDay}>
                  <div className="itin-day-header">
                    <h3>Day {itinerary[expandedDay].day}: {itinerary[expandedDay].title}</h3>
                  </div>
                  <div className="itin-timeline">
                    {itinerary[expandedDay].activities.map((act, i) => (
                      <div key={i} className="itin-timeline-item">
                        <div className="itin-timeline-left">
                          <span className="itin-time">{act.time}</span>
                          <div className="itin-dot"></div>
                          {i < itinerary[expandedDay].activities.length - 1 && <div className="itin-line"></div>}
                        </div>
                        <div className="itin-timeline-content">
                          <div className="itin-act-icon">{act.icon}</div>
                          <div className="itin-act-info">
                            <h4>{act.title}</h4>
                            <p>{act.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Booking Modal (Reusing logic/styles) */}
      {showBookingModal && (
        <div className="booking-modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'grid', placeItems: 'center', zIndex: 2000, padding: '20px'
        }}>
          <div className="booking-modal-content" style={{
            background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px',
            padding: '40px 30px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
          }}>
            <button 
              onClick={() => {
                setShowBookingModal(false);
                setPaymentStep('summary');
              }}
              style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', zIndex: 10 }}
            >✕</button>

            {paymentStep === 'summary' ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{ width: '60px', height: '60px', background: '#ecfdf5', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 15px' }}>
                    <span style={{ fontSize: '30px' }}>🌍</span>
                  </div>
                  <h2 style={{ margin: 0 }}>Confirm Your Trip</h2>
                  <p style={{ color: '#64748b', marginTop: '8px' }}>Finalize your {days}-day trip to {searchedDest}</p>
                </div>
                
                <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Travelers</span>
                    <strong>{travelers}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Duration</span>
                    <strong>{days} Days</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '10px' }}>
                    <span>Estimated Cost</span>
                    <strong style={{ fontSize: '1.2rem', color: '#1e293b' }}>₹{(parseInt(days) * 5000).toLocaleString()}</strong>
                  </div>
                </div>

                <button 
                  onClick={() => setPaymentStep('payment')}
                  style={{
                    width: '100%', padding: '16px', background: '#1e293b', color: 'white',
                    border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer'
                  }}
                >
                  Proceed to Payment
                </button>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <button 
                    onClick={() => setPaymentStep('summary')}
                    style={{ position: 'absolute', top: '20px', left: '20px', border: 'none', background: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}
                  >← Back</button>
                  <h2 style={{ margin: 0 }}>Payment</h2>
                  <p style={{ color: '#64748b', marginTop: '4px' }}>Complete your transaction</p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '7px', background: paymentMethod === 'card' ? 'white' : 'transparent', fontWeight: '600', cursor: 'pointer' }}
                  >Card</button>
                  <button
                    onClick={() => setPaymentMethod('scanner')}
                    style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '7px', background: paymentMethod === 'scanner' ? 'white' : 'transparent', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >📱 UPI / QR</button>
                </div>

                {paymentMethod === 'card' ? (
                  <div style={{ display: 'grid', gap: '12px', textAlign: 'left' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Card Number</label>
                      <input type="text" placeholder="xxxx xxxx xxxx xxxx" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Expiry</label>
                        <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>CVV</label>
                        <input type="password" placeholder="***" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '4px 0' }}>
                    <p style={{ margin: 0, fontSize: '0.83rem', color: '#475569', textAlign: 'center' }}>Scan with any UPI app (GPay, PhonePe, Paytm…)</p>
                    <div style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '18px', padding: '16px', boxShadow: '0 6px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.9rem' }}>T</div>
                        <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>TravelSphere</span>
                      </div>
                      <QRCodeSVG
                        value={`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${tripTotal}&cu=INR&tn=${encodeURIComponent('Trip Itinerary - TravelSphere')}`}
                        size={180}
                        level="H"
                        includeMargin={false}
                        style={{ borderRadius: '6px' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', borderRadius: '8px', padding: '6px 12px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '0.75rem', color: '#475569' }}>UPI ID:</span>
                        <span style={{ fontSize: '0.77rem', fontWeight: '600', color: '#0f172a' }}>{UPI_ID}</span>
                        <button onClick={() => { navigator.clipboard.writeText(UPI_ID); setUpiCopied(true); setTimeout(() => setUpiCopied(false), 2000); }} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '1px', color: upiCopied ? '#10b981' : '#94a3b8', display: 'flex' }}>
                          {upiCopied ? <CheckCheck size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '6px 16px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                        <span style={{ fontSize: '0.7rem', color: '#065f46', display: 'block' }}>Amount to pay</span>
                        <strong style={{ fontSize: '1.2rem', color: '#059669' }}>₹{tripTotal.toLocaleString()}</strong>
                      </div>

                      {/* Automatic Payment Detector Status */}
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: paymentVerified ? '#bbf7d0' : '#bae6fd',
                        background: paymentVerified ? '#f0fdf4' : '#f0f9ff',
                        color: paymentVerified ? '#15803d' : '#0369a1',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        width: '100%',
                        boxSizing: 'border-box',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        transition: 'all 0.3s'
                      }}>
                        {verifyingPayment ? (
                          <>
                            <RefreshCcw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                            <div style={{ textAlign: 'left' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Waiting for payment detection...</span>
                              <span style={{ display: 'block', fontSize: '0.7rem', color: '#0284c7', fontWeight: 'normal', marginTop: '2px' }}>Please scan and pay using your mobile app.</span>
                            </div>
                          </>
                        ) : paymentVerified ? (
                          <>
                            <CheckCircle2 size={18} />
                            <div style={{ textAlign: 'left' }}>
                              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Payment Verified!</span>
                              <span style={{ display: 'block', fontSize: '0.7rem', color: '#16a34a', fontWeight: 'normal', marginTop: '2px' }}>Mock UPI Ref: TXN{Math.floor(100000 + Math.random() * 900000)}</span>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', opacity: 0.7 }}>
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (<span key={app} style={{ fontSize: '0.65rem', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>{app}</span>))}
                    </div>
                  </div>
                )}

                <button
                  onClick={confirmBooking}
                  disabled={bookingLoading || (paymentMethod === 'scanner' && !paymentVerified)}
                  style={{
                    width: '100%', padding: '16px',
                    background: paymentMethod === 'scanner' ? (paymentVerified ? 'linear-gradient(135deg,#10b981,#059669)' : '#94a3b8') : '#1e293b',
                    color: 'white',
                    border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem',
                    cursor: (bookingLoading || (paymentMethod === 'scanner' && !paymentVerified)) ? 'not-allowed' : 'pointer',
                    marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    boxShadow: paymentMethod === 'scanner' && paymentVerified ? '0 4px 14px rgba(16,185,129,0.35)' : 'none',
                    transition: 'all 0.3s',
                    opacity: (bookingLoading || (paymentMethod === 'scanner' && !paymentVerified)) ? 0.7 : 1,
                  }}
                >
                  {bookingLoading ? 'Processing...' : paymentMethod === 'scanner'
                    ? <><CheckCircle2 size={18} /> I've Paid — Confirm Booking</>
                    : `Pay ₹${tripTotal.toLocaleString()}`
                  }
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success Toast */}
      {isBooked && (
        <div style={{
          position: 'fixed', bottom: '30px', right: '30px', zIndex: 3000,
          background: 'white', padding: '16px 24px', borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)', borderLeft: '6px solid #10b981',
          display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <span style={{ fontSize: '24px' }}>✅</span>
          <div>
            <h4 style={{ margin: 0 }}>Booking Confirmed!</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>Your trip to {searchedDest} is all set.</p>
          </div>
          <button onClick={() => setIsBooked(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1' }}>✕</button>
        </div>
      )}
    </div>
  );
}

export default PlanItineraryPage;
