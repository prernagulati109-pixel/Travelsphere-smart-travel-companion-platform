import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Star, MapPin, Wifi, Coffee, 
  Wind, ShieldCheck, Calendar, Users,
  Hotel as HotelIcon, CreditCard, Check,
  Download, ChevronRight, Info, Plane, Share2, Heart,
  Tv, Waves, Dumbbell, Utensils, Bath, Car, 
  Clock, Map as MapIcon, ChevronLeft, Award,
  CheckCircle2, AlertCircle, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { allHotels } from '../data/data';
import '../styles/index.css';
import '../styles/hotel-details-booking.css';

// Enhanced Mock Data for Premium Feel
const ROOMS_DATA = [
  {
    id: 1,
    name: "Deluxe King Room",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
    capacity: "2 adults",
    beds: "1 extra-large double bed",
    size: "35 m²",
    features: ["Free WiFi", "Air conditioning", "Private bathroom", "Flat-screen TV", "Soundproofing", "Minibar"],
    price: 0, // Matches base hotel price exactly
    breakfast: true,
    cancellation: "Free cancellation before May 10",
    description: "A spacious and luxurious room featuring a plush king-size bed, elegant decor, and modern amenities designed for absolute comfort and relaxation. Perfect for couples or solo travelers looking for a premium stay.",
    checkIn: "14:00 PM",
    checkOut: "12:00 PM",
    facilities: ["24-hour Room Service", "Daily Housekeeping", "In-room Safe", "Dedicated Work Desk", "Iron & Ironing Board"],
    policies: ["Non-smoking room", "No pets allowed", "Quiet hours 10 PM - 7 AM"]
  },
  {
    id: 2,
    name: "Premium Twin Room",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80",
    capacity: "2 adults",
    beds: "2 single beds",
    size: "32 m²",
    features: ["Free WiFi", "Air conditioning", "Private bathroom", "Flat-screen TV", "Minibar"],
    price: -800, // Budget option — slightly cheaper than base
    breakfast: true,
    cancellation: "Non-refundable",
    description: "Experience comfort in our well-appointed twin room. Designed for friends or colleagues traveling together, it features two premium single beds and a beautiful city view.",
    checkIn: "14:00 PM",
    checkOut: "12:00 PM",
    facilities: ["24-hour Room Service", "Daily Housekeeping", "In-room Safe", "Coffee/Tea Maker"],
    policies: ["Non-smoking room", "No pets allowed"]
  },
  {
    id: 3,
    name: "Executive Suite",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
    capacity: "3 adults",
    beds: "1 extra-large double bed + 1 sofa bed",
    size: "55 m²",
    features: ["Free WiFi", "Air conditioning", "Private bathroom", "Balcony", "Sea view", "Coffee machine"],
    price: 2500, // Premium suite — adds ₹2,500 to base
    breakfast: true,
    cancellation: "Free cancellation",
    description: "Our top-tier suite offering expansive living space, a separate lounge area, and breathtaking sea views from a private balcony. Ultimate luxury and VIP services included.",
    checkIn: "14:00 PM",
    checkOut: "12:00 PM",
    facilities: ["Priority Check-in", "Executive Lounge Access", "Butler Service", "Luxury Toiletries", "Nespresso Machine", "Welcome Fruit Basket"],
    policies: ["Non-smoking room", "Pets allowed (up to 10kg)", "Complimentary late check-out upon availability"]
  }
];

const REVIEWS_DATA = [
  {
    id: 1,
    user: "Rahul Sharma",
    avatar: "RS",
    date: "April 2024",
    rating: 9.0,
    comment: "The staff was exceptionally helpful and the room was spotlessly clean. Great location near the main attractions.",
    tags: ["Cleanliness", "Location"]
  },
  {
    id: 2,
    user: "Sarah Jenkins",
    avatar: "SJ",
    date: "March 2024",
    rating: 8.5,
    comment: "Wonderful experience. The breakfast spread was amazing and the spa facilities are top-notch.",
    tags: ["Breakfast", "Spa"]
  },
  {
    id: 3,
    user: "Anita Desai",
    avatar: "AD",
    date: "February 2024",
    rating: 10,
    comment: "Absolute luxury. Worth every penny for the service and the view from the executive suite.",
    tags: ["Luxury", "Service"]
  }
];

const HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80"
];

function HotelDetailPage() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();
  const [activeImg, setActiveImg] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingCard, setShowBookingCard] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [hotelId]);

  // Find hotel from data or fallback to mock
  const foundHotel = allHotels.find(h => h.id === parseInt(hotelId));
  
  const hotel = foundHotel ? {
    ...foundHotel,
    stars: foundHotel.stars || 5,
    description: foundHotel.description || "Experience luxury at its finest. Our hotel offers world-class amenities, premium rooms, and an unforgettable spa experience in the heart of the city.",
    amenities: foundHotel.amenities || ["Free WiFi", "Swimming Pool", "Spa & Wellness", "Gourmet Breakfast", "AC Rooms", "24/7 Security"],
    price: parseInt(foundHotel.price?.toString().replace(/,/g, '') || 8500),
    reviews: foundHotel.users || 1250,
    rating: foundHotel.rating || 4.8
  } : {
    name: "Grand Royal Oasis & Spa",
    location: "South Delhi, New Delhi",
    price: 8500,
    rating: 4.8,
    reviews: 1250,
    stars: 5,
    description: "Experience luxury at its finest. Our hotel offers world-class amenities, premium rooms, and an unforgettable spa experience in the heart of the city.",
    amenities: ["Free WiFi", "Swimming Pool", "Spa & Wellness", "Gourmet Breakfast", "AC Rooms", "24/7 Security"]
  };

  const images = foundHotel?.images || foundHotel?.img ? [foundHotel.img, ...HOTEL_IMAGES.slice(1)] : HOTEL_IMAGES;

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 1;
    const diffTime = Math.abs(new Date(bookingData.checkOut) - new Date(bookingData.checkIn));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const nights = calculateNights();
  const roomExtraPrice = selectedRoom ? selectedRoom.price : 0;
  const totalAmount = (hotel.price + roomExtraPrice) * nights;

  const handleReserve = () => {
    const bookingDetails = {
      hotelId,
      hotelName: hotel.name,
      roomName: selectedRoom?.name || 'Standard Room',
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      nights,
      totalAmount,
      price: hotel.price + roomExtraPrice
    };

    if (!isLoggedIn) {
      navigate('/auth', { 
        state: { 
          from: `/hotels/${hotelId}/payment`,
          bookingDetails 
        } 
      });
    } else {
      navigate(`/hotels/${hotelId}/payment`, { state: { bookingDetails } });
    }
  };

  return (
    <div className="hotel-details-page">
      <Navbar activePage="hotels" />
      
      <div className="hd-container">
        {/* 1. Breadcrumb */}
        <nav className="hd-breadcrumb">
          <Link to="/">Home</Link> <ChevronRight size={14} /> 
          <Link to="/hotels">Hotels</Link> <ChevronRight size={14} /> 
          <span>{hotel.name}</span>
        </nav>

        {/* 2. Hotel Hero Section (Gallery) */}
        <section className="hd-gallery-section">
          <div className="hd-gallery-grid">
            <div className="hd-gallery-main">
              <img src={images[activeImg]} alt={hotel.name} loading="lazy" />
              <button className="view-all-photos-btn">
                <Share2 size={16} /> View all photos
              </button>
            </div>
            <div className="hd-gallery-side">
              {images.slice(1, 5).map((img, idx) => (
                <div 
                  key={idx + 1} 
                  className={`hd-gallery-thumb ${activeImg === idx + 1 ? 'active' : ''}`}
                  onClick={() => setActiveImg(idx + 1)}
                >
                  <img src={img} alt={`Gallery ${idx + 2}`} loading="lazy" />
                  {idx === 3 && images.length > 5 && (
                    <div className="gallery-overlay">
                      <div className="overlay-content">
                        <Share2 size={24} style={{ marginBottom: '8px' }} />
                        <span>+{images.length - 5}</span>
                        <p>View all photos</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="hd-layout-grid">
          <div className="hd-main-content">
            {/* 3. Hotel Header Info */}
            <header className="hd-header-info">
              <div className="hd-badge-row">
                <span className="hd-badge hd-badge-blue">Hotel</span>
                <span className="hd-badge hd-badge-green">Great location — 9.2</span>
              </div>
              
              <div className="hd-title-row">
                <div>
                  <h1>{hotel.name}</h1>
                  <div className="hd-stars">
                    {[...Array(hotel.stars)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                </div>
                <div className="hd-action-btns" style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="hd-action-btn"
                    onClick={() => toggleWishlist({
                      id: parseInt(hotelId),
                      type: 'hotel',
                      name: hotel.name,
                      image: images[0],
                      location: hotel.location,
                      price: hotel.price
                    })}
                    style={{ 
                      color: isInWishlist(parseInt(hotelId), 'hotel') ? '#ef4444' : '#64748b',
                      border: '1px solid #e2e8f0',
                      padding: '10px',
                      borderRadius: '12px',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <Heart size={20} fill={isInWishlist(parseInt(hotelId), 'hotel') ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    className="hd-action-btn"
                    style={{ 
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      padding: '10px',
                      borderRadius: '12px',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="hd-location-row">
                <MapPin size={16} />
                <span>{hotel.location}</span>
                <span> • </span>
                <a href="#map">Excellent location - show map</a>
              </div>

              <div className="hd-highlights">
                <div className="hd-highlight-tag"><Wifi size={16} /> Free WiFi</div>
                <div className="hd-highlight-tag"><Coffee size={16} /> Breakfast Included</div>
                <div className="hd-highlight-tag"><Waves size={16} /> Swimming Pool</div>
                <div className="hd-highlight-tag"><Car size={16} /> Free Parking</div>
                <div className="hd-highlight-tag"><Plane size={16} /> Airport Shuttle</div>
              </div>
            </header>

            {/* 4. Overview Section */}
            <section className="hd-section" id="overview">
              <h2 className="hd-section-title">Overview</h2>
              <div className="overview-content">
                <p>{hotel.description}</p>
                <div className="overview-cards">
                  <div className="info-card">
                    <Waves size={20} />
                    <span>Distance to Beach</span>
                    <strong>200 meters</strong>
                  </div>
                  <div className="info-card">
                    <Plane size={20} />
                    <span>Airport Distance</span>
                    <strong>12.5 km</strong>
                  </div>
                  <div className="info-card">
                    <Utensils size={20} />
                    <span>Nearby Market</span>
                    <strong>5 mins walk</strong>
                  </div>
                  <div className="info-card">
                    <Clock size={20} />
                    <span>Check-in</span>
                    <strong>14:00 PM</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Amenities Grid */}
            <section className="hd-section" id="amenities">
              <h2 className="hd-section-title">Most Popular Amenities</h2>
              <div className="amenities-grid">
                <div className="amenity-card">
                  <Wifi size={24} />
                  <span>Free WiFi</span>
                </div>
                <div className="amenity-card">
                  <Waves size={24} />
                  <span>Swimming Pool</span>
                </div>
                <div className="amenity-card">
                  <Dumbbell size={24} />
                  <span>Fitness Center</span>
                </div>
                <div className="amenity-card">
                  <Utensils size={24} />
                  <span>Restaurant</span>
                </div>
                <div className="amenity-card">
                  <HotelIcon size={24} />
                  <span>Spa & Wellness</span>
                </div>
                <div className="amenity-card">
                  <Car size={24} />
                  <span>Parking</span>
                </div>
                <div className="amenity-card">
                  <Clock size={24} />
                  <span>24/7 Security</span>
                </div>
                <div className="amenity-card">
                  <Wind size={24} />
                  <span>AC Rooms</span>
                </div>
              </div>
            </section>

            {/* 6. Room Selection Section */}
            <section className="hd-section" id="rooms">
              <h2 className="hd-section-title">Available Rooms</h2>
              <div className="rooms-list">
                {ROOMS_DATA.map(room => {
                  const isExpanded = expandedRoom === room.id;
                  const isActive = selectedRoom?.id === room.id;

                  return (
                    <div 
                      key={room.id} 
                      className={`room-card-wrapper ${isActive ? 'active-selection' : ''}`}
                      onClick={() => {
                        if (!isExpanded) setExpandedRoom(room.id);
                      }}
                    >
                      <div className="room-card">
                        <div className="room-img">
                          <img src={room.image} alt={room.name} />
                        </div>
                        <div className="room-info">
                          <h3>{room.name}</h3>
                          <div className="room-features">
                            <div className="room-feature"><Users size={14} /> {room.capacity}</div>
                            <div className="room-feature"><HotelIcon size={14} /> {room.beds}</div>
                            <div className="room-feature"><TrendingUp size={14} /> {room.size}</div>
                          </div>
                          <div className="room-features" style={{ marginTop: '12px' }}>
                            {room.features.map((f, i) => (
                              <div key={i} className="room-feature" style={{ color: '#474747', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>
                                <Check size={12} /> {f}
                              </div>
                            ))}
                          </div>
                          <div className="room-policy" style={{ marginTop: '16px', color: '#008009', fontWeight: '600', fontSize: '13px' }}>
                            <CheckCircle2 size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            {room.breakfast ? 'Breakfast included' : 'Room only'}
                            <br />
                            <CheckCircle2 size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            {room.cancellation}
                          </div>
                        </div>
                        <div className="room-action">
                          <div className="room-price">₹{(hotel.price + room.price).toLocaleString()}</div>
                          <div style={{ fontSize: '12px', color: '#474747', marginBottom: '12px' }}>Includes taxes & fees</div>
                          <button 
                            className="select-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedRoom(isExpanded ? null : room.id);
                            }}
                          >
                            {isExpanded ? 'Hide Details' : 'View Details'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Section */}
                      <div className={`room-expanded-details ${isExpanded ? 'open' : ''}`}>
                        <div className="expanded-content">
                          <p className="expanded-desc">{room.description}</p>
                          
                          <div className="expanded-grid">
                            <div className="expanded-col">
                              <h4>Room Details</h4>
                              <ul>
                                <li><strong>Size:</strong> {room.size}</li>
                                <li><strong>Bed Type:</strong> {room.beds}</li>
                                <li><strong>Capacity:</strong> {room.capacity}</li>
                              </ul>
                            </div>
                            <div className="expanded-col">
                              <h4>Check-in / Check-out</h4>
                              <ul>
                                <li><strong>Check-in from:</strong> {room.checkIn}</li>
                                <li><strong>Check-out before:</strong> {room.checkOut}</li>
                                <li><strong>Cancellation:</strong> {room.cancellation}</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="expanded-grid" style={{ marginTop: '16px' }}>
                            <div className="expanded-col">
                              <h4>Facilities</h4>
                              <ul className="facilities-list">
                                {room.facilities.map((fac, idx) => <li key={idx}><Check size={12}/> {fac}</li>)}
                              </ul>
                            </div>
                            <div className="expanded-col">
                              <h4>Hotel Policies</h4>
                              <ul className="policies-list">
                                {room.policies.map((pol, idx) => <li key={idx}><AlertCircle size={12}/> {pol}</li>)}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="expanded-footer">
                            <button 
                              className="continue-booking-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRoom(room);
                                setShowBookingCard(true);
                                setTimeout(() => {
                                  const sidebar = document.querySelector('.hd-sticky-sidebar');
                                  if (sidebar) sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 100);
                              }}
                            >
                              Continue Booking
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 7. Reviews Section */}
            <section className="hd-section" id="reviews">
              <h2 className="hd-section-title">Guest Reviews</h2>
              <div className="reviews-container">
                <div className="rating-summary-card">
                  <div className="overall-rating">
                    <div className="rating-score">{hotel.rating}</div>
                    <div className="rating-label">
                      <strong>Excellent</strong>
                      <span>{hotel.reviews} reviews</span>
                    </div>
                  </div>
                  <div className="progress-list">
                    {[
                      { label: "Cleanliness", val: 9.2 },
                      { label: "Comfort", val: 8.9 },
                      { label: "Staff", val: 9.5 },
                      { label: "Location", val: 9.4 },
                      { label: "Value for money", val: 8.7 }
                    ].map((item, i) => (
                      <div key={i} className="progress-item">
                        <div className="progress-labels">
                          <span>{item.label}</span>
                          <span>{item.val}</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${item.val * 10}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="review-list">
                  {REVIEWS_DATA.map(review => (
                    <div key={review.id} className="review-card">
                      <div className="review-user">
                        <div className="user-avatar">{review.avatar}</div>
                        <div>
                          <div style={{ fontWeight: '700' }}>{review.user}</div>
                          <div style={{ fontSize: '12px', color: '#474747' }}>{review.date}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', background: '#003b95', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: '700' }}>
                          {review.rating}
                        </div>
                      </div>
                      <p style={{ margin: '12px 0', fontSize: '14px', color: '#1a1a1a' }}>"{review.comment}"</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {review.tags.map((t, i) => (
                          <span key={i} style={{ fontSize: '11px', background: '#e7f2ff', color: '#006ce4', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 8. Location + Map Section */}
            <section className="hd-section" id="map">
              <h2 className="hd-section-title">Location</h2>
              <div className="map-layout">
                <div className="map-container">
                  <iframe 
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112112.23554746654!2d77.107718!3d28.527218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1d052d0c26bb%3A0x6b42b78a9c2f623!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1714820000000!5m2!1sen!2sin`} 
                    allowFullScreen="" 
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="location-info">
                  <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>What's nearby</h3>
                  <div className="nearby-list">
                    {[
                      { name: "Central Park", dist: "1.2 km" },
                      { name: "City Museum", dist: "0.8 km" },
                      { name: "Metro Station", dist: "0.3 km" },
                      { name: "International Airport", dist: "12.5 km" },
                      { name: "Shopping Mall", dist: "1.5 km" }
                    ].map((place, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                        <span><MapPin size={14} style={{ marginRight: '8px', color: '#64748b' }} /> {place.name}</span>
                        <span style={{ color: '#474747' }}>{place.dist}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 9. Similar Hotels */}
            <section className="hd-section">
              <h2 className="hd-section-title">Similar Hotels You Might Like</h2>
              <div className="similar-grid">
                {allHotels.slice(0, 3).map(h => (
                  <div key={h.id} className="hotel-mini-card">
                    <div className="mini-img">
                      <img src={h.img} alt={h.name} />
                    </div>
                    <div className="mini-info">
                      <h4>{h.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#006ce4', fontWeight: '600' }}>
                        <Star size={14} fill="currentColor" /> {h.rating} Excellent
                      </div>
                      <div style={{ marginTop: '12px', fontWeight: '700', fontSize: '16px' }}>
                        ₹{h.price} <span style={{ fontSize: '12px', fontWeight: '400', color: '#474747' }}>/ night</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Booking Sidebar */}
          <aside className="hd-sticky-sidebar">
            {!showBookingCard ? (
              <div className="booking-card placeholder-card">
                <div className="placeholder-content">
                  <HotelIcon size={48} color="#006ce4" style={{ marginBottom: '16px', opacity: 0.8 }} />
                  <h3>Select a room to continue booking</h3>
                  <p>Choose your preferred room from the available options to see pricing and reserve your spot.</p>
                </div>
              </div>
            ) : (
              <div className="booking-card">
                <div className="booking-price">
                  <h2>₹{(hotel.price + (selectedRoom?.price || 0)).toLocaleString()}</h2>
                  <span>Includes taxes and fees</span>
                </div>
  
                <div className="booking-inputs">
                  <div className="booking-input-group">
                    <label>Check-in</label>
                    <input type="date" value={bookingData.checkIn} onChange={e => setBookingData(prev => ({...prev, checkIn: e.target.value}))} />
                  </div>
                  <div className="booking-input-group">
                    <label>Check-out</label>
                    <input type="date" value={bookingData.checkOut} onChange={e => setBookingData(prev => ({...prev, checkOut: e.target.value}))} />
                  </div>
                  <div className="booking-input-group full">
                    <label>Guests</label>
                    <select value={bookingData.guests} onChange={e => setBookingData(prev => ({...prev, guests: e.target.value}))}>
                      <option value="1">1 adult</option>
                      <option value="2">2 adults</option>
                      <option value="3">3 adults</option>
                      <option value="4">4 adults</option>
                    </select>
                  </div>
                </div>
  
                <button className="reserve-btn" onClick={handleReserve}>
                  Reserve your spot
                </button>
  
                <div className="booking-perks">
                  <div className="perk-item"><Check size={16} /> Free cancellation</div>
                  <div className="perk-item"><Check size={16} /> No prepayment needed</div>
                  <div className="perk-item"><Award size={16} /> Best price guaranteed</div>
                </div>
  
                <div className="price-breakdown">
                  <div className="breakdown-row">
                    <span>{selectedRoom?.name || 'Room'} x {nights} nights</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Taxes & fees</span>
                    <span>₹0</span>
                  </div>
                  <div className="breakdown-total">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
  
                <div style={{ marginTop: '20px', padding: '12px', background: '#fff9e6', borderRadius: '8px', border: '1px solid #ffeeba', fontSize: '12px' }}>
                  <AlertCircle size={14} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#856404' }} />
                  Prices may increase, so book now!
                </div>
              </div>
            )}

            <div style={{ marginTop: '24px', padding: '20px', border: '1px solid #e7e7e7', borderRadius: '12px', display: 'flex', gap: '16px' }}>
              <Info size={24} color="#006ce4" />
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>Need help?</div>
                <div style={{ fontSize: '13px', color: '#474747' }}>Call us 24/7 at +91 1800 123 456</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HotelDetailPage;

