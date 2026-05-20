import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { destinations as staticDestinations } from '../data/data';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWishlist } from '../context/WishlistContext';
import '../styles/index.css';

// Custom component to handle zoom from external buttons
function ZoomController({ zoomLevel }) {
  const map = useMap();
  map.setZoom(zoomLevel);
  return null;
}

function ExplorePlacesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [budget, setBudget] = useState('25000');
  const [tripDays, setTripDays] = useState('3 Days');
  const [selectedDate, setSelectedDate] = useState('');
  const [travelType, setTravelType] = useState('Family');
  // const [category, setCategory] = useState('Mountains');
  const [isPlanning, setIsPlanning] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [mapCenter, setMapCenter] = useState([20, 78]); // Center of India as default

  const [showAllRecommended, setShowAllRecommended] = useState(false);
  const [showAllPopular, setShowAllPopular] = useState(false);

  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleToggleWishlist = (place, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: place.name,
      type: 'destination',
      name: place.name,
      image: place.image,
      location: place.description || 'Global Destination'
    });
  };

  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const enrichedDestinations = useMemo(() => {
    return staticDestinations.map((d, index) => ({
      ...d,
      rating: (4.0 + (index % 10) * 0.1).toFixed(1),
      trending: ['Paris', 'Maldives', 'Dubai', 'Bali', 'Goa', 'Ladakh'].includes(d.name)
    }));
  }, []);

  const handlePlanTrip = () => {
    setIsPlanning(true);
    setTimeout(() => {
      setIsPlanning(false);
      navigate('/itinerary');
    }, 800);
  };

  // Dummy data to simulate the exact mockup
  const recommendedPlaces = showAllRecommended ? enrichedDestinations : enrichedDestinations.slice(0, 4);
  const popularPlaces = showAllPopular ? enrichedDestinations : enrichedDestinations.slice(4, 10);
  
  // Try to use actual trending ones, fallback if not enough
  let trendingPlaces = enrichedDestinations.filter(d => d.trending).slice(0, 6);
  if (trendingPlaces.length < 6) {
    trendingPlaces = [...trendingPlaces, ...enrichedDestinations.slice(0, 6 - trendingPlaces.length)];
  }

  return (
    <div className="explore-mockup-page">
      <Navbar activePage="explore" />
      
      <div className="explore-container-wide">
        
        {/* Filter Bar */}
        <div className="mockup-filter-bar">
          <div className="mockup-filter-group">
            <label>Where do you want to go?</label>
            <div className="mockup-input-wrap">
              <span className="icon">📍</span>
              <input type="text" placeholder="Search destination..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="mockup-filter-group">
            <label>Budget (₹)</label>
            <div className="mockup-input-wrap">
              <span className="icon">💰</span>
              <input type="number" placeholder="25000" value={budget} onChange={e => setBudget(e.target.value)} />
            </div>
          </div>
          <div className="mockup-filter-group">
            <label>Trip Days</label>
            <div className="mockup-input-wrap">
              <span className="icon">⏱️</span>
              <select value={tripDays} onChange={e => setTripDays(e.target.value)}>
                <option>1 Day</option>
                <option>3 Days</option>
                <option>5 Days</option>
                <option>1 Week</option>
              </select>
            </div>
          </div>
          <div className="mockup-filter-group">
            <label>From Date</label>
            <div className="mockup-input-wrap">
              <span className="icon">📅</span>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            </div>
          </div>
          <div className="mockup-filter-group">
            <label>Travel Type</label>
            <div className="mockup-input-wrap">
              <span className="icon">👥</span>
              <select value={travelType} onChange={e => setTravelType(e.target.value)}>
                <option>Solo</option>
                <option>Couple</option>
                <option>Family</option>
                <option>Friends</option>
              </select>
            </div>
          </div>
          {/* <div className="mockup-filter-group">
            <label>Category</label>
            <div className="mockup-input-wrap">
              <span className="icon">🏔️</span>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option>Mountains</option>
                <option>Beaches</option>
                <option>Cities</option>
              </select>
            </div>
          </div> */}
          <div className="mockup-filter-btn-group">
            <button className="mockup-plan-btn" onClick={handlePlanTrip} style={{ cursor: 'pointer' }}>
              {isPlanning ? 'Planning...' : '✨ Plan My Trip'}
            </button>
          </div>
        </div>

        {/* Recommended Section */}
        <section className="mockup-section">
          <div className="mockup-section-header">
            <div>
              <h2>Recommended for You ✈️</h2>
              {/* <p>Best picks based on your budget (₹{budget}) & {tripDays} trip</p> */}
            </div>
            <a href="#" className="view-all-link" onClick={(e) => { e.preventDefault(); setShowAllRecommended(!showAllRecommended); }}>
              {showAllRecommended ? 'View Less' : 'View All >'}
            </a>
          </div>
          <div className="recommended-grid">
            {recommendedPlaces.map(place => {
              const slug = place.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <div key={place.name} className="rec-card" onClick={() => navigate(`/place/${slug}`)} style={{ cursor: 'pointer' }}>
                  <img src={place.image} alt={place.name} />
                  <div className="rec-overlay">
                    <div className="rec-rating">⭐ {place.rating}</div>
                    <div className="rec-bottom">
                      <h4>📍 {place.name}</h4>
                      <p className="rec-desc">{place.category || 'Beautiful Destination'}</p>
                      <p className="rec-price">₹{parsePrice(place.price).toLocaleString()} <span className="rec-sep">|</span> {tripDays}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Popular Places Section */}
        <section className="mockup-section">
          <div className="mockup-section-header">
            <div>
              <h2>Popular Places to Explore 🌍</h2>
            </div>
            <a href="#" className="view-all-link" onClick={(e) => { e.preventDefault(); setShowAllPopular(!showAllPopular); }}>
              {showAllPopular ? 'View Less' : 'View All >'}
            </a>
          </div>
          <div className="popular-grid">
            {popularPlaces.map(place => {
              const slug = place.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <div key={place.name} className="pop-card" onClick={() => navigate(`/place/${slug}`)} style={{ cursor: 'pointer' }}>
                  <div className="pop-img-box">
                    <img src={place.image} alt={place.name} />
                    <button className={`pop-wishlist ${isInWishlist(place.name, 'destination') ? 'active' : ''}`} onClick={(e) => handleToggleWishlist(place, e)}>
                      {isInWishlist(place.name, 'destination') ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <div className="pop-info">
                    <h4>{place.name}</h4>
                    <p className="pop-desc">{place.description}</p>
                    <div className="pop-footer">
                      <span className="pop-price">₹{parsePrice(place.price).toLocaleString()} - {tripDays}</span>
                      <Link to={`/place/${slug}`} className="pop-explore-btn">Explore</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trending Section */}
        <section className="mockup-section">
          <div className="mockup-section-header">
            <div>
              <h2>Trending Destinations 🔥</h2>
            </div>
            <div className="trending-controls">
              <button className="trend-btn">{'<'}</button>
              <button className="trend-btn">{'>'}</button>
            </div>
          </div>
          <div className="trending-grid">
            {trendingPlaces.map(place => {
              const slug = place.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link to={`/place/${slug}`} key={place.name} className="trend-card">
                  <img src={place.image} alt={place.name} />
                  <div className="trend-overlay">
                    <h4>{place.name}</h4>
                    <span className="trend-badge">🔥 Trending</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Map Section */}
        <section className="mockup-section">
          <div className="mockup-section-header">
            <div>
              <h2>📍 Explore on Map</h2>
              <p>Discover popular destinations around the world</p>
            </div>
          </div>
          <div className="mockup-map-container">
            <MapContainer 
              center={mapCenter} 
              zoom={zoomLevel} 
              style={{ height: '100%', width: '100%', borderRadius: '16px' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <ZoomController zoomLevel={zoomLevel} />
            </MapContainer>

            <div className="map-controls-top">
              <button className="map-btn active">Map</button>
              <button className="map-btn">Satellite</button>
            </div>
            <div className="map-controls-right">
              <button className="map-icon-btn">[ ]</button>
              <div className="map-zoom">
                <button onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}>+</button>
                <button onClick={() => setZoomLevel(prev => Math.max(prev - 1, 2))}>-</button>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}

export default ExplorePlacesPage;

