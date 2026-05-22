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
  CheckCircle2, AlertCircle, TrendingUp,
  SmartphoneNfc, Copy, CheckCheck, RefreshCcw, User, Mail, Phone, FileText
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useBooking } from '../context/BookingContext';
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
  
  const [bookingStep, setBookingStep] = useState('room_selection');
  const [guestDetails, setGuestDetails] = useState({ fullName: '', email: '', phone: '', requests: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  const UPI_ID = 'gulatiprerna676@okaxis';
  const UPI_NAME = 'TravelSphere';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [hotelId]);

  useEffect(() => {
    if (paymentMethod === 'scanner' && !paymentVerified && !verifyingPayment) {
      setVerifyingPayment(true);
      const timer = setTimeout(() => {
        setPaymentVerified(true);
        setVerifyingPayment(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [paymentMethod, paymentVerified, verifyingPayment]);

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

  const isGuestDetailsValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    return (
      guestDetails.fullName.trim().length > 0 &&
      emailRegex.test(guestDetails.email) &&
      phoneRegex.test(guestDetails.phone)
    );
  };

  const handleContinueToPayment = () => {
    if (isGuestDetailsValid()) {
      setBookingStep('payment');
      setTimeout(() => {
        const paymentEl = document.getElementById('payment-section');
        if (paymentEl) paymentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const confirmBooking = () => {
    setBookingLoading(true);
    setTimeout(() => {
      setIsBooked(true);
      setBookingLoading(false);
    }, 2000);
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
                                setBookingStep('guest_details');
                                setTimeout(() => {
                                  const guestForm = document.getElementById('guest-details-section');
                                  if (guestForm) guestForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

            {bookingStep !== 'room_selection' && selectedRoom && (
              <section className="hd-section" id="guest-details-section" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                <h2 className="hd-section-title">Guest Details</h2>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={16} color="#64748b" /> Full Name
                      </label>
                      <input 
                        type="text" 
                        value={guestDetails.fullName}
                        onChange={e => setGuestDetails({...guestDetails, fullName: e.target.value})}
                        placeholder="Enter your full name" 
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s' }} 
                        onFocus={e => e.target.style.borderColor = '#3b82f6'} 
                        onBlur={e => e.target.style.borderColor = '#cbd5e1'} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={16} color="#64748b" /> Email Address
                      </label>
                      <input 
                        type="email" 
                        value={guestDetails.email}
                        onChange={e => setGuestDetails({...guestDetails, email: e.target.value})}
                        placeholder="your@email.com" 
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s' }} 
                        onFocus={e => e.target.style.borderColor = '#3b82f6'} 
                        onBlur={e => e.target.style.borderColor = '#cbd5e1'} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={16} color="#64748b" /> Phone Number
                      </label>
                      <input 
                        type="tel" 
                        value={guestDetails.phone}
                        onChange={e => setGuestDetails({...guestDetails, phone: e.target.value})}
                        placeholder="10-digit mobile number" 
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s' }} 
                        onFocus={e => e.target.style.borderColor = '#3b82f6'} 
                        onBlur={e => e.target.style.borderColor = '#cbd5e1'} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={16} color="#64748b" /> Number of Guests
                      </label>
                      <input 
                        type="number" 
                        value={bookingData.guests}
                        disabled
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#64748b' }} 
                      />
                      <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>Change from sidebar</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={16} color="#64748b" /> Special Requests (Optional)
                    </label>
                    <textarea 
                      value={guestDetails.requests}
                      onChange={e => setGuestDetails({...guestDetails, requests: e.target.value})}
                      placeholder="E.g., early check-in, extra bed..." 
                      rows={3}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical' }} 
                      onFocus={e => e.target.style.borderColor = '#3b82f6'} 
                      onBlur={e => e.target.style.borderColor = '#cbd5e1'} 
                    />
                  </div>
                  
                  {bookingStep === 'guest_details' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button 
                        onClick={handleContinueToPayment}
                        disabled={!isGuestDetailsValid()}
                        style={{
                          padding: '14px 28px',
                          background: isGuestDetailsValid() ? '#006ce4' : '#94a3b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '16px',
                          cursor: isGuestDetailsValid() ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.3s',
                          opacity: isGuestDetailsValid() ? 1 : 0.7
                        }}
                      >
                        Continue to Payment <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {bookingStep === 'payment' && selectedRoom && (
              <section className="hd-section" id="payment-section" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                <h2 className="hd-section-title">Secure Payment</h2>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '7px', background: paymentMethod === 'card' ? 'white' : 'transparent', color: paymentMethod === 'card' ? '#0f172a' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: paymentMethod === 'card' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
                    ><CreditCard size={18} /> Card</button>
                    <button
                      onClick={() => setPaymentMethod('scanner')}
                      style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '7px', background: paymentMethod === 'scanner' ? 'white' : 'transparent', color: paymentMethod === 'scanner' ? '#0f172a' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: paymentMethod === 'scanner' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
                    ><SmartphoneNfc size={18} /> UPI / QR</button>
                  </div>

                  {paymentMethod === 'card' ? (
                    <div style={{ display: 'grid', gap: '16px', textAlign: 'left' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Cardholder Name</label>
                        <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Expiry Date</label>
                          <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '500' }}>CVV</label>
                          <input type="password" placeholder="123" maxLength="4" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '4px 0' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', textAlign: 'center' }}>
                        Scan with any UPI app &nbsp;(GPay, PhonePe, Paytm…)
                      </p>
                      <div style={{
                        background: 'white', border: '2px solid #e2e8f0', borderRadius: '20px', padding: '20px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '300px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1rem'
                          }}>T</div>
                          <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>TravelSphere</span>
                        </div>
                        
                        <div style={{ background: '#fff', padding: '10px', borderRadius: '8px' }}>
                          <QRCodeSVG
                            value={`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('Hotel Booking - TravelSphere')}`}
                            size={180}
                            level="H"
                            includeMargin={false}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', borderRadius: '8px', padding: '7px 14px', border: '1px solid #e2e8f0', width: '100%', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#475569' }}>UPI ID:</span>
                            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#0f172a' }}>{UPI_ID}</span>
                          </div>
                          <button
                            onClick={() => { navigator.clipboard.writeText(UPI_ID); setUpiCopied(true); setTimeout(() => setUpiCopied(false), 2000); }}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', color: upiCopied ? '#10b981' : '#94a3b8', display: 'flex' }}
                            title="Copy UPI ID"
                          >
                            {upiCopied ? <CheckCheck size={14} /> : <Copy size={14} />}
                          </button>
                        </div>

                        <div style={{
                          padding: '12px 16px', borderRadius: '12px', border: '1px solid', borderColor: paymentVerified ? '#bbf7d0' : '#bae6fd',
                          background: paymentVerified ? '#f0fdf4' : '#f0f9ff', color: paymentVerified ? '#15803d' : '#0369a1',
                          fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          gap: '10px', width: '100%', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: 'all 0.3s'
                        }}>
                          {verifyingPayment ? (
                            <>
                              <RefreshCcw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                              <div style={{ textAlign: 'left' }}>
                                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Waiting for payment...</span>
                              </div>
                            </>
                          ) : paymentVerified ? (
                            <>
                              <CheckCircle2 size={18} />
                              <div style={{ textAlign: 'left' }}>
                                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Payment Verified!</span>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={confirmBooking}
                    disabled={bookingLoading || (paymentMethod === 'scanner' && !paymentVerified)}
                    style={{
                      width: '100%', padding: '16px',
                      background: paymentMethod === 'scanner'
                        ? (paymentVerified ? 'linear-gradient(135deg,#10b981,#059669)' : '#94a3b8')
                        : '#006ce4',
                      color: 'white',
                      border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem',
                      cursor: (bookingLoading || (paymentMethod === 'scanner' && !paymentVerified)) ? 'not-allowed' : 'pointer',
                      marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      transition: 'all 0.3s',
                      opacity: (bookingLoading || (paymentMethod === 'scanner' && !paymentVerified)) ? 0.7 : 1,
                      boxShadow: paymentMethod === 'scanner' && paymentVerified ? '0 4px 14px rgba(16,185,129,0.35)' : 'none',
                    }}
                  >
                    {bookingLoading ? (
                      <><RefreshCcw size={20} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
                    ) : paymentMethod === 'scanner' ? (
                      <><CheckCircle2 size={20} /> I've Paid — Confirm Booking</>
                    ) : (
                      `Pay ₹${totalAmount?.toLocaleString()}`
                    )}
                  </button>
                </div>
              </section>
            )}

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
  
                <button 
                  className="reserve-btn" 
                  onClick={() => {
                    if (bookingStep === 'room_selection') {
                      setBookingStep('guest_details');
                      setTimeout(() => {
                        const guestForm = document.getElementById('guest-details-section');
                        if (guestForm) guestForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    } else if (bookingStep === 'guest_details') {
                      handleContinueToPayment();
                    } else if (bookingStep === 'payment') {
                      confirmBooking();
                    }
                  }}
                  disabled={
                    (bookingStep === 'guest_details' && !isGuestDetailsValid()) ||
                    (bookingStep === 'payment' && paymentMethod === 'scanner' && !paymentVerified) ||
                    bookingLoading
                  }
                  style={{
                    opacity: (
                      (bookingStep === 'guest_details' && !isGuestDetailsValid()) ||
                      (bookingStep === 'payment' && paymentMethod === 'scanner' && !paymentVerified) ||
                      bookingLoading
                    ) ? 0.7 : 1,
                    cursor: (
                      (bookingStep === 'guest_details' && !isGuestDetailsValid()) ||
                      (bookingStep === 'payment' && paymentMethod === 'scanner' && !paymentVerified) ||
                      bookingLoading
                    ) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {bookingStep === 'room_selection' ? 'Continue Booking' : 
                   bookingStep === 'guest_details' ? 'Proceed to Payment' : 
                   bookingLoading ? 'Processing...' : 'Confirm & Pay'}
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
                <div style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '13px', marginTop: '12px', display: 'flex', alignItems: 'center' }}>
                  <Clock size={14} style={{ marginRight: '6px' }}/> Only 3 rooms left on our site
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

      {isBooked && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 3000,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'grid', placeItems: 'center', padding: '20px'
        }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '450px', width: '100%', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ width: '80px', height: '80px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'white' }}>
              <CheckCircle2 size={40} />
            </div>
            <h3 style={{ fontSize: '24px', color: '#0f172a', marginBottom: '12px', marginTop: 0 }}>Booking Confirmed!</h3>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'left', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Booking ID</span>
                <strong style={{ color: '#1e293b' }}>#TS{Math.floor(1000000 + Math.random() * 9000000)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Hotel</span>
                <strong style={{ color: '#1e293b' }}>{hotel.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Room</span>
                <strong style={{ color: '#1e293b' }}>{selectedRoom?.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Dates</span>
                <strong style={{ color: '#1e293b' }}>{bookingData.checkIn} to {bookingData.checkOut}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '8px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Total Paid</span>
                <strong style={{ color: '#10b981' }}>₹{totalAmount.toLocaleString()}</strong>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '12px', color: '#0f172a', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                <Download size={18} /> Invoice
              </button>
              <button 
                onClick={() => navigate('/')}
                style={{ flex: 1, padding: '12px', border: 'none', background: '#006ce4', borderRadius: '12px', color: 'white', fontWeight: '600', cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      <Footer />
    </div>
  );
}

export default HotelDetailPage;

