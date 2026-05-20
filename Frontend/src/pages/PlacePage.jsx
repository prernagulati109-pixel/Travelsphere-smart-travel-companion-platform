import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationsData } from '../data/destinations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  MapPin, Star, Share2, Heart, 
  Camera, Info, Clock, Check, 
  ChevronRight, Plus, Minus, Trash2, 
  Search, Filter, 
  Zap, ShieldCheck, HelpCircle, 
  Download, RefreshCcw, Landmark, 
  Utensils, History, Plane, Globe,
  ArrowRight, X, CreditCard, Calendar, CheckCircle2,
  Smartphone
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/index.css';

function PlacePage() {
  const { placeName } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  
  // Dynamic State for Destination Data
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Data Dynamically based on param
  useEffect(() => {
    setLoading(true);
    // Use the slug from URL directly as the key
    const data = destinationsData[placeName];
    
    if (data) {
      setDestination(data);
      // Reset trip plan when destination changes
      setSelectedPlaces([]);
      setTravelers(2);
      setShowItineraryPreview(false);
    } else {
      setDestination(null);
    }
    setLoading(false);
  }, [placeName]);

  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(25000);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Price: Low to High");
  const [showItineraryPreview, setShowItineraryPreview] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [selectedTravelFacility, setSelectedTravelFacility] = useState(null);
  const [showTravelFacilityOptions, setShowTravelFacilityOptions] = useState(false);

  const travelFacilities = [
    { id: 'car', name: 'Standard Sedan', price: 2000, icon: '🚗', desc: 'Up to 4 people' },
    { id: 'suv', name: 'Premium SUV', price: 3500, icon: '🚙', desc: 'Up to 6 people' },
    { id: 'bus', name: 'Mini Bus', price: 6000, icon: '🚐', desc: 'Up to 12 people' }
  ];

  const baseCost = useMemo(() => {
    return selectedPlaces.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  }, [selectedPlaces]);

  const vehicleCost = useMemo(() => {
    const facility = travelFacilities.find(f => f.id === selectedTravelFacility);
    return facility ? facility.price : 0;
  }, [selectedTravelFacility]);

  const totalTripCost = (baseCost * travelers) + vehicleCost;

  const handleAddPlace = (item) => {
    const exists = selectedPlaces.find(p => p.id === item.id);
    if (exists) {
      setSelectedPlaces(selectedPlaces.filter(p => p.id !== item.id));
    } else {
      if (selectedPlaces.length >= 6) return;
      setSelectedPlaces([...selectedPlaces, item]);
    }
  };

  const handleRemove = (id) => setSelectedPlaces(selectedPlaces.filter(p => p.id !== id));
  const handleClear = () => {
    setSelectedPlaces([]);
    setIsBooked(false);
  };

  const handleGenerateItinerary = () => {
    if (selectedPlaces.length === 0) {
      alert("Please select at least one place to visit!");
      return;
    }
    setShowItineraryPreview(true);
  };

  const handleBookTrip = () => {
    const bookingDetails = {
      type: 'trip',
      destination: destination.name,
      travelers: travelers,
      selectedAttractions: selectedPlaces.map(p => ({
        name: p.name,
        price: p.price,
        category: p.category
      })),
      totalPrice: totalTripCost
    };

    if (!user) {
      navigate('/auth', { 
        state: { 
          from: `/place/${placeName}/payment`,
          bookingDetails 
        } 
      });
    } else {
      navigate(`/place/${placeName}/payment`, { state: { bookingDetails } });
    }
  };

  // Filter and Sort Places
  const filteredPlaces = useMemo(() => {
    if (!destination) return [];
    let list = [...destination.places];
    
    if (filterCategory !== "All") {
      list = list.filter(p => p.category === filterCategory);
    }
    
    if (sortOption === "Price: Low to High") {
      list.sort((a, b) => a.price - b.price);
    } else {
      list.sort((a, b) => b.price - a.price);
    }
    
    return list;
  }, [destination, filterCategory, sortOption]);

  if (loading) {
    return <div className="loading-state" style={{ padding: '100px', textAlign: 'center' }}>Loading amazing destination...</div>;
  }

  if (!destination) {
    return (
      <div className="dest-not-found">
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Oops! Destination not found.</h2>
          <p>We couldn't find the place you're looking for. Try exploring other amazing spots!</p>
          <button onClick={() => navigate('/explore')} style={{ marginTop: '20px', padding: '10px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Explore Destinations</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dest-mockup-page">
      <Navbar />
      
      <div className="dest-container">
        {/* Breadcrumb */}
        <nav className="dest-breadcrumb">
          <Link to="/">Home</Link> / <Link to="/explore">Explore</Link> / <span>{destination.country}</span> / <span>{destination.name}</span>
        </nav>

        {/* Hero Section */}
        <header className="dest-hero">
          <img src={destination.heroImage} alt={destination.name} className="hero-bg" />
          <div className="hero-overlay">
            <div className="hero-content">
              <div className="hero-badge">
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <span>{destination.rating} ({destination.reviewsCount} reviews)</span>
              </div>
              <h1>{destination.name} <span>{destination.flag}</span></h1>
              <p className="hero-tagline">{destination.tagline} {destination.flag} {destination.name}, {destination.country}</p>
              <p className="hero-desc">{destination.description}</p>
              <div className="hero-btns">
                <button className="btn-plan">Plan Trip to {destination.name}</button>
                <button className="btn-hotels" onClick={() => navigate('/hotels')}>View Hotels</button>
                <button 
                  className={`btn-bookmark ${isInWishlist(destination.name, 'destination') ? 'active' : ''}`}
                  onClick={() => toggleWishlist({
                    id: destination.name,
                    type: 'destination',
                    name: destination.name,
                    image: destination.heroImage,
                    location: `${destination.country}`
                  })}
                  style={{ 
                    color: isInWishlist(destination.name, 'destination') ? '#ef4444' : '#64748b',
                    backgroundColor: isInWishlist(destination.name, 'destination') ? '#fee2e2' : 'white'
                  }}
                >
                  <Heart size={18} fill={isInWishlist(destination.name, 'destination') ? 'currentColor' : 'none'} />
                </button>
                <button className="btn-share" 
                  style={{ backgroundColor: 'white', color: '#64748b' }}
                  onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `TravelSphere - ${destination.name}`,
                      text: `Check out ${destination.name} on TravelSphere!`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}>
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Gallery Strip */}
        <section className="dest-gallery-strip">
          <div className="section-title">
            <h3><Camera size={18} /> Photo Gallery ({destination.gallery.length})</h3>
            <button className="view-all">View all</button>
          </div>
          <div className="gallery-scroll">
            {destination.gallery.map((img, i) => (
              <div key={i} className="gallery-item">
                <img src={img} alt={`${destination.name} ${i}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Info Grid */}
        <div className="overview-layout">
          <section className="about-destination">
            <div className="about-header">
              <h3>About {destination.name}</h3>
              <p className="about-main-desc">{destination.about || destination.description}</p>
            </div>

            <div className="attractions-list-horizontal">
              <h4>Top Places to Visit & Add to Plan</h4>
              <div className="attractions-scroll">
                {destination.places.map(place => {
                  const isSelected = selectedPlaces.some(p => p.id === place.id);
                  return (
                    <div key={place.id} className={`attr-mini-card ${isSelected ? 'selected' : ''}`} onClick={() => handleAddPlace(place)}>
                      <img src={place.image} alt={place.name} />
                      <div className="attr-mini-info">
                        <h5>{place.name}</h5>
                        <p>{place.category}</p>
                        <span className="attr-mini-price">₹{place.price}</span>
                      </div>
                      <div className="attr-mini-action">
                        {isSelected ? <Check size={14} /> : <Plus size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="about-features">
              <div className="feature-box">
                <div className="icon-wrap"><Landmark size={20} /></div>
                <div><h4>Rich Culture</h4><p>Home to art, fashion and heritage</p></div>
              </div>
              <div className="feature-box">
                <div className="icon-wrap"><Utensils size={20} /></div>
                <div><h4>World-Class Cuisine</h4><p>Fine dining & charming cafés</p></div>
              </div>
              <div className="feature-box">
                <div className="icon-wrap"><History size={20} /></div>
                <div><h4>Historic Landmarks</h4><p>Iconic sights to inspire</p></div>
              </div>
            </div>
          </section>

          <section className="quick-info-box">
            <h3>Quick Info</h3>
            <div className="info-grid">
              <div className="info-item"><Calendar size={16} /><div><p>Best Time</p><span>{destination.quickInfo?.bestTime || 'N/A'}</span></div></div>
              <div className="info-item"><Clock size={16} /><div><p>Time Zone</p><span>{destination.quickInfo?.timezone || 'N/A'}</span></div></div>
              <div className="info-item"><Zap size={16} /><div><p>Weather</p><span>{destination.quickInfo?.weather || 'N/A'}</span></div></div>
              <div className="info-item"><Plane size={16} /><div><p>Nearest Airport</p><span>{destination.quickInfo?.airport || 'N/A'}</span></div></div>
              <div className="info-item"><CreditCard size={16} /><div><p>Currency</p><span>{destination.quickInfo?.currency || 'N/A'}</span></div></div>
              <div className="info-item"><Zap size={16} /><div><p>Daily Cost</p><span>{destination.quickInfo?.dailyCost || 'N/A'}</span></div></div>
              <div className="info-item"><Globe size={16} /><div><p>Language</p><span>{destination.quickInfo?.language || 'N/A'}</span></div></div>
              <div className="info-item"><Zap size={16} /><div><p>Voltage</p><span>{destination.quickInfo?.voltage || 'N/A'}</span></div></div>
            </div>
          </section>
        </div>

        {/* Attractions Selector */}
        <div className="selection-layout">
          <div className="select-places">
            <div className="selection-header">
              <h3>Select Places to Visit in {destination.name}</h3>
              <div className="selection-tools">
                <span>Sort:</span>
                <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <button className="filter-btn"><Filter size={14} /> Filter</button>
              </div>
            </div>

            <div className="category-tabs">
              {["All", "Landmarks", "Museums", "Adventure", "Culture"].map(c => (
                <button key={c} className={`tab ${filterCategory === c ? 'active' : ''}`} onClick={() => setFilterCategory(c)}>{c}</button>
              ))}
            </div>

            <div className="places-mock-grid">
              {filteredPlaces.map(item => {
                const isSelected = selectedPlaces.some(p => p.id === item.id);
                return (
                  <div key={item.id} className="place-mock-card">
                    <div className="pm-img">
                      <img src={item.image} alt={item.name} />
                      {item.badge && <span className={`pm-badge ${item.badge.toLowerCase().replace(' ', '-')}`}>{item.badge}</span>}
                    </div>
                    <div className="pm-body">
                      <div className="pm-header">
                        <h4>{item.name}</h4>
                        <div className="pm-rate"><Star size={12} fill="#fbbf24" color="#fbbf24" /><span>{item.rating}</span></div>
                      </div>
                      <p className="pm-time"><Clock size={12} /> {item.time}</p>
                      <p className="pm-desc">Experience the best of {item.name} with our guided tour.</p>
                      <div className="pm-footer">
                        <span className="pm-price">₹{item.price.toLocaleString()}<span>/ person</span></span>
                        <button className={`pm-add-btn ${isSelected ? 'added' : ''}`} onClick={() => handleAddPlace(item)}>
                          {isSelected ? <><Check size={14} /> Added</> : 'Add to Trip'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredPlaces.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No places found for this category.
                </div>
              )}
            </div>
          </div>

          {/* Planner Sidebar */}
          <aside className="trip-plan-sidebar">
            <div className="sticky-sidebar-card">
              <div className="sidebar-header">
                <h3><Calendar size={18} /> Your Trip Plan</h3>
                <span className="count-badge">{selectedPlaces.length}/6 selected</span>
                <button className="clear-all" onClick={handleClear}><Trash2 size={14} /> Clear</button>
              </div>
              <div className="sidebar-list">
                {selectedPlaces.length === 0 ? <p className="sidebar-empty">No places added yet</p> : 
                  selectedPlaces.map((p, idx) => (
                    <div key={p.id} className="sidebar-item">
                      <img src={p.image} alt={p.name} />
                      <div className="item-info"><h4>{p.name}</h4><p>₹{p.price.toLocaleString()}</p></div>
                      <button className="item-remove" onClick={() => handleRemove(p.id)}><X size={14} /></button>
                    </div>
                  ))
                }
              </div>
              <div className="sidebar-totals">
                <div className="total-row"><span>Cost (per person)</span><strong>₹{baseCost.toLocaleString()}</strong></div>
                <div className="total-row"><span>Travelers</span>
                  <div className="traveler-stepper">
                    <button onClick={() => setTravelers(t => Math.max(1, t - 1))}><Minus size={14}/></button>
                    <span>{travelers}</span>
                    <button onClick={() => setTravelers(t => t + 1)}><Plus size={14}/></button>
                  </div>
                </div>
              </div>

                <div className="trip-cost-banner">
                  <div className="cost-split">
                    <span>Places: ₹{(baseCost * travelers).toLocaleString()}</span>
                    {vehicleCost > 0 && <span>Vehicle: ₹{vehicleCost.toLocaleString()}</span>}
                  </div>
                  <div className="cost-total">
                    <span>Total Trip Cost</span>
                    <strong>₹{totalTripCost.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Travel Facility Selection */}
                <div className="travel-facility-section">
                  <button 
                    className={`facility-toggle-btn ${selectedTravelFacility ? 'active' : ''}`}
                    onClick={() => setShowTravelFacilityOptions(!showTravelFacilityOptions)}
                  >
                    <Plane size={16} /> 
                    {selectedTravelFacility 
                      ? travelFacilities.find(f => f.id === selectedTravelFacility)?.name 
                      : 'Add Travel Facility?'}
                    <ChevronRight size={14} style={{ transform: showTravelFacilityOptions ? 'rotate(90deg)' : 'none', marginLeft: 'auto' }} />
                  </button>
                  
                  {showTravelFacilityOptions && (
                    <div className="facility-options slide-down-animation">
                      {travelFacilities.map(f => (
                        <div 
                          key={f.id} 
                          className={`facility-option ${selectedTravelFacility === f.id ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedTravelFacility(selectedTravelFacility === f.id ? null : f.id);
                            setShowTravelFacilityOptions(false);
                          }}
                        >
                          <span className="f-icon">{f.icon}</span>
                          <div className="f-info">
                            <strong>{f.name}</strong>
                            <p>{f.desc}</p>
                          </div>
                          <span className="f-price">+₹{f.price}</span>
                        </div>
                      ))}
                      <button className="go-to-travel-btn" onClick={() => navigate('/travel', { state: { destination: destination.name, fromPlace: true } })}>
                        View All Travel Options <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  className={`generate-itin-btn ${selectedPlaces.length === 0 ? 'disabled' : ''}`} 
                  onClick={handleGenerateItinerary}
                  disabled={selectedPlaces.length === 0}
                >
                  {showItineraryPreview ? 'Itinerary Generated ✨' : 'Generate Itinerary ✨'}
                </button>
                
                {showItineraryPreview && (
                  <div className="itin-preview-mini slide-down-animation">
                    <p className="itin-title">Your Personalized Plan</p>
                    <div className="itin-days-container">
                      {selectedPlaces.map((p, i) => (
                        <div key={i} className="itin-day-item">
                          <div className="day-label">Day {i + 1}</div>
                          <div className="day-content">
                            <span className="dot"></span>
                            <div className="day-info">
                              <strong>{p.name}</strong>
                              <p>Visit {p.name} - {p.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="sidebar-actions">
                  <button className="save-trip-btn" onClick={() => alert("Plan saved to your wishlist!")}>
                    <Heart size={14} /> Save Plan
                  </button>
                  <button 
                    className={`book-trip-btn ${selectedPlaces.length === 0 ? 'disabled' : ''}`}
                    onClick={handleBookTrip}
                    disabled={selectedPlaces.length === 0}
                  >
                    <CreditCard size={16} /> Book Trip Now
                  </button>
                </div>
              </div>
            </aside>
          </div>

      </div>
      <Footer />

      <style>{`
        .dest-mockup-page { background: #fdfdfd; }
        .dest-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .dest-breadcrumb { font-size: 0.85rem; color: #64748b; margin-bottom: 20px; }
        .dest-hero { position: relative; height: 400px; border-radius: 20px; overflow: hidden; margin-bottom: 30px; }
        .hero-bg { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(0deg, rgba(0,0,0,0.7), transparent); display: flex; align-items: flex-end; padding: 40px; color: white; }
        .hero-content h1 { font-size: 3.5rem; margin-bottom: 8px; }
        .hero-btns { display: flex; gap: 10px; margin-top: 20px; }
        .hero-btns button { padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; border: none; }
        .btn-plan { background: #2563eb; color: white; }
        .btn-hotels { background: white; color: #1e293b; }
        
        .gallery-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; }
        .gallery-item { min-width: 200px; height: 130px; border-radius: 12px; overflow: hidden; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
 
        .overview-layout { display: grid; grid-template-columns: 1fr 400px; gap: 40px; margin-top: 40px; }
        
        /* About section enhancements */
        .about-destination h3 { font-size: 1.8rem; margin-bottom: 15px; }
        .about-main-desc { color: #475569; line-height: 1.7; margin-bottom: 30px; }
        .attractions-list-horizontal { margin-bottom: 40px; }
        .attractions-list-horizontal h4 { font-size: 1rem; color: #1e293b; margin-bottom: 15px; }
        .attractions-scroll { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 15px; scrollbar-width: thin; }
        .attr-mini-card { min-width: 180px; background: white; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 10px; cursor: pointer; transition: all 0.2s; position: relative; }
        .attr-mini-card:hover { border-color: #2563eb; transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .attr-mini-card.selected { border-color: #2563eb; background: #eff6ff; }
        .attr-mini-card img { width: 100%; height: 100px; object-fit: cover; border-radius: 10px; margin-bottom: 10px; }
        .attr-mini-info h5 { font-size: 0.85rem; margin: 0 0 4px; }
        .attr-mini-info p { font-size: 0.7rem; color: #64748b; margin: 0; }
        .attr-mini-price { font-size: 0.8rem; font-weight: 700; color: #1e293b; display: block; margin-top: 5px; }
        .attr-mini-action { position: absolute; top: 15px; right: 15px; width: 22px; height: 22px; border-radius: 50%; background: white; display: grid; place-items: center; box-shadow: 0 2px 6px rgba(0,0,0,0.1); color: #2563eb; }
        .attr-mini-card.selected .attr-mini-action { background: #2563eb; color: white; }

        .about-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
        .feature-box { text-align: center; background: #f8fafc; padding: 15px; border-radius: 12px; }
        .icon-wrap { color: #2563eb; margin-bottom: 10px; }

        .quick-info-box { background: #f8fafc; padding: 20px; border-radius: 20px; border: 1px solid #e2e8f0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-item { display: flex; gap: 10px; font-size: 0.85rem; }
        .info-item span { font-weight: 700; display: block; }

        .selection-layout { display: grid; grid-template-columns: 1fr 350px; gap: 40px; margin-top: 40px; }
        .category-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab { padding: 8px 16px; border-radius: 20px; background: #f1f5f9; border: none; cursor: pointer; font-weight: 600; }
        .tab.active { background: #2563eb; color: white; }

        .places-mock-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .place-mock-card { border: 1px solid #e2e8f0; border-radius: 15px; overflow: hidden; }
        .pm-img { height: 150px; position: relative; }
        .pm-img img { width: 100%; height: 100%; object-fit: cover; }
        .pm-badge { position: absolute; top: 10px; left: 10px; background: #10b981; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.7rem; }
        .pm-body { padding: 15px; }
        .pm-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 10px; }
        .pm-add-btn { background: #eff6ff; color: #2563eb; border: 1px solid #2563eb; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
        .pm-add-btn.added { background: #10b981; color: white; border: none; }

        .sticky-sidebar-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px; position: sticky; top: 90px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .sidebar-list { margin: 20px 0; max-height: 300px; overflow-y: auto; }
        .sidebar-item { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; background: #f8fafc; padding: 8px; border-radius: 8px; }
        .sidebar-item img { width: 40px; height: 40px; border-radius: 5px; object-fit: cover; }
        .sidebar-item h4 { font-size: 0.8rem; margin: 0; }
        .item-remove { margin-left: auto; background: none; border: none; color: #ef4444; cursor: pointer; }

        .sidebar-totals { border-top: 1px solid #f1f5f9; padding-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem; }
        .traveler-stepper { display: flex; gap: 10px; align-items: center; }
        .trip-cost-banner { background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 15px 0; }
        .cost-split { display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; color: #64748b; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px dashed #e2e8f0; }
        .cost-total { display: flex; justify-content: space-between; align-items: center; }
        .cost-total strong { color: #1e293b; font-size: 1.1rem; }
        
        .travel-facility-section { margin-bottom: 15px; }
        .facility-toggle-btn { width: 100%; padding: 12px; background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; color: #475569; font-weight: 600; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.2s; }
        .facility-toggle-btn:hover { border-color: #cbd5e1; background: #f8fafc; }
        .facility-toggle-btn.active { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
        
        .facility-options { background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; margin-top: 8px; padding: 8px; display: flex; flex-direction: column; gap: 4px; }
        .facility-option { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .facility-option:hover { background: #f1f5f9; }
        .facility-option.selected { background: #eff6ff; }
        .f-icon { font-size: 1.2rem; }
        .f-info { flex: 1; text-align: left; }
        .f-info strong { display: block; font-size: 0.85rem; }
        .f-info p { font-size: 0.7rem; color: #64748b; margin: 0; }
        .f-price { font-size: 0.85rem; font-weight: 700; color: #1e293b; }
        .go-to-travel-btn { margin-top: 5px; padding: 8px; background: none; border: none; color: #2563eb; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; }
        .go-to-travel-btn:hover { text-decoration: underline; }

        .generate-itin-btn { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s; margin-bottom: 12px; }
        .generate-itin-btn:hover { background: #1e40af; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
        .generate-itin-btn.disabled { background: #cbd5e1; cursor: not-allowed; transform: none; }
        
        .sidebar-actions { display: grid; grid-template-columns: 1fr 1.2fr; gap: 10px; margin-top: 15px; }
        .save-trip-btn { padding: 10px; background: white; border: 1.5px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-weight: 600; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
        .save-trip-btn:hover { background: #f8fafc; border-color: #cbd5e1; color: #1e293b; }
        
        .book-trip-btn { padding: 10px; background: #059669; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.3s; }
        .book-trip-btn:hover { background: #047857; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2); }
        .book-trip-btn.booked { background: #10b981; pointer-events: none; }
        .book-trip-btn.disabled { background: #cbd5e1; cursor: not-allowed; transform: none; }

        .itin-preview-mini { background: #f8fafc; padding: 16px; border-radius: 12px; margin-top: 15px; border: 1px solid #e2e8f0; }
        .itin-title { font-weight: 700; color: #1e293b; margin-bottom: 12px; font-size: 0.9rem; }
        .itin-days-container { display: flex; flex-direction: column; gap: 12px; }
        .itin-day-item { display: flex; gap: 12px; }
        .day-label { font-size: 0.75rem; font-weight: 800; color: #64748b; min-width: 40px; padding-top: 2px; }
        .day-content { position: relative; padding-left: 12px; border-left: 2px solid #e2e8f0; }
        .day-content .dot { position: absolute; left: -7px; top: 6px; width: 12px; height: 12px; border-radius: 50%; background: #2563eb; border: 2px solid white; box-shadow: 0 0 0 2px #eff6ff; }
        .day-info strong { display: block; font-size: 0.85rem; color: #1e293b; }
        .day-info p { font-size: 0.75rem; color: #64748b; margin: 2px 0 0; }

        /* Modal Styles */
        .booking-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: grid; place-items: center; z-index: 2000; padding: 20px; animation: fadeIn 0.3s ease; }
        .booking-modal-content { background: white; border-radius: 24px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .modal-close { position: absolute; top: 20px; right: 20px; background: #f1f5f9; border: none; border-radius: 50%; width: 36px; height: 36px; display: grid; place-items: center; cursor: pointer; color: #64748b; transition: all 0.2s; }
        .modal-close:hover { background: #e2e8f0; color: #1e293b; }
        
        .modal-header { padding: 40px 30px 20px; text-align: center; }
        .success-icon-wrap { width: 80px; height: 80px; background: #ecfdf5; border-radius: 50%; display: grid; place-items: center; margin: 0 auto 20px; }
        .modal-header h2 { margin: 0; font-size: 1.8rem; color: #1e293b; }
        .modal-header p { margin: 8px 0 0; color: #64748b; }

        .modal-body { padding: 0 30px 40px; }
        .summary-section, .itinerary-summary { background: #f8fafc; border-radius: 16px; padding: 20px; margin-bottom: 20px; border: 1px solid #f1f5f9; }
        .summary-section h4, .itinerary-summary h4 { margin: 0 0 15px; font-size: 0.95rem; color: #1e293b; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; }
        .summary-row span { color: #64748b; }
        
        .mini-timeline { display: flex; flex-direction: column; gap: 12px; }
        .timeline-step { display: flex; gap: 12px; align-items: center; }
        .step-num { width: 24px; height: 24px; background: #2563eb; color: white; border-radius: 50%; font-size: 0.75rem; font-weight: 700; display: grid; place-items: center; flex-shrink: 0; }
        .step-info h5 { margin: 0; font-size: 0.85rem; color: #1e293b; }
        .step-info p { margin: 2px 0 0; font-size: 0.75rem; color: #64748b; }

        .payment-summary { margin-top: 30px; text-align: center; border-top: 2px dashed #e2e8f0; padding-top: 20px; }
        .price-total { margin-bottom: 20px; }
        .price-total span { color: #64748b; font-size: 0.9rem; }
        .price-total h2 { margin: 4px 0 0; font-size: 2.2rem; color: #1e293b; font-weight: 800; }
        .confirm-booking-btn { width: 100%; padding: 16px; background: #1e293b; color: white; border: none; border-radius: 14px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.3s; }
        .confirm-booking-btn:hover { background: #0f172a; transform: scale(1.02); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }

        .booking-success-toast { position: fixed; bottom: 30px; right: 30px; z-index: 3000; animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .toast-content { background: white; padding: 16px 24px; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); border-left: 6px solid #10b981; display: flex; align-items: center; gap: 16px; min-width: 350px; }
        .toast-content h4 { margin: 0; font-size: 1rem; color: #1e293b; }
        .toast-content p { margin: 4px 0 0; font-size: 0.85rem; color: #64748b; }
        .toast-content button { background: none; border: none; color: #cbd5e1; margin-left: auto; cursor: pointer; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .slide-down-animation { animation: slideDownAnim 0.4s ease-out; }
        @keyframes slideDownAnim { from { height: 0; opacity: 0; transform: translateY(-10px); } to { height: auto; opacity: 1; transform: translateY(0); } }

        /* New Payment Styles */
        .back-btn { position: absolute; top: 25px; left: 20px; background: none; border: none; color: #2563eb; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .payment-method-tabs { display: flex; gap: 10px; margin-bottom: 24px; background: #f1f5f9; padding: 6px; border-radius: 12px; }
        .pay-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; border: none; background: transparent; color: #64748b; font-weight: 600; border-radius: 8px; transition: all 0.2s; }
        .pay-tab.active { background: white; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        
        .form-group { margin-bottom: 16px; text-align: left; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px; }
        .form-group input { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; outline: none; transition: border-color 0.2s; }
        .form-group input:focus { border-color: #2563eb; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .input-with-icon { position: relative; }
        .input-with-icon svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); }
        .input-with-icon input { padding-left: 36px; }

        .scanner-payment { text-align: center; padding: 10px 0; }
        .qr-container { width: 180px; height: 180px; margin: 0 auto 15px; position: relative; border: 4px solid #f1f5f9; border-radius: 16px; padding: 10px; background: white; }
        .qr-container img { width: 100%; height: 100%; object-fit: contain; }
        .qr-overlay-text { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); background: #2563eb; color: white; padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; white-space: nowrap; }
        .scanner-hint { font-size: 0.85rem; color: #64748b; line-height: 1.5; max-width: 250px; margin: 20px auto 0; }

        .payment-final-action { margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .pay-amount-box { text-align: left; }
        .pay-amount-box span { display: block; font-size: 0.8rem; color: #64748b; }
        .pay-amount-box strong { font-size: 1.5rem; color: #1e293b; font-weight: 800; }
        .payment-final-action .confirm-booking-btn { margin: 0; width: auto; flex: 1; }
      `}</style>
    </div>
  );
}

export default PlacePage;

