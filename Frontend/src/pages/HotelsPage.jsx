import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  MapPin, Calendar, Users, Star, Wifi, 
  Coffee, Map as MapIcon, List, Filter, 
  Search, X, Tag, Heart, Share2, Info, TrendingUp, 
  ArrowRight, ShieldCheck, PhoneCall, RefreshCcw,
  Navigation, Eye, ChevronLeft, ChevronRight,
  Clock, Zap, Check, Trash2, ArrowUpDown, Menu
} from 'lucide-react';
import { allHotels as staticHotels, destinations as staticDestinations } from '../data/data';
import { useWishlist } from '../context/WishlistContext';
import '../styles/hotels.css';
import '../styles/hotels-premium.css';

const QUICK_FILTERS = [
  "4 Star & Above",
  "Free Cancellation",
  "Breakfast Included",
  "Pay at Hotel",
  "Pool",
  "Free Wi-Fi",
  "Parking"
];

function HotelsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [showBanner, setShowBanner] = useState(true);
  const [hotels, setHotels] = useState([]);
  
  // Initialize from URL params if available
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [checkInOut, setCheckInOut] = useState('');
  const [guestsRooms, setGuestsRooms] = useState('');
  const [appliedSearch, setAppliedSearch] = useState(searchParams.get('search') || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // New states for enhancements
  const [priceRange, setPriceRange] = useState(parseInt(searchParams.get('maxPrice')) || 150000);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get('amenity') ? [searchParams.get('amenity')] : []
  );
  const [minRating, setMinRating] = useState(parseInt(searchParams.get('minRating')) || 0);
  const [showOnlyDeals, setShowOnlyDeals] = useState(searchParams.get('deals') === 'true');
  const [sortBy, setSortBy] = useState('Recommended');
  
  const [activeFilters, setActiveFilters] = useState([]);
  const [quickViewHotel, setQuickViewHotel] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [hoveredHotelId, setHoveredHotelId] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });
  const [visibleCount, setVisibleCount] = useState(6);
  const [isSaleActive, setIsSaleActive] = useState(() => {
    return localStorage.getItem('summerSaleActive') === 'true';
  });

  // Reusable helper logic
  const calculateDiscountedPrice = (priceStr, discountPercent = 30) => {
    if (!priceStr) return "0";
    const price = parseInt(priceStr.replace(/,/g, '') || 0);
    const discounted = Math.floor(price * (1 - discountPercent / 100));
    return discounted.toLocaleString();
  };

  const getActivePrice = (h) => {
    const p = parseInt(h.price?.replace(/,/g, '') || 0);
    return isSaleActive ? Math.floor(p * 0.7) : p;
  };

  const toggleSummerSale = () => {
    const newState = !isSaleActive;
    setIsSaleActive(newState);
    localStorage.setItem('summerSaleActive', newState);
  };

  const applySummerSaleToHotels = (hotelList) => {
    return hotelList.map(h => ({
      ...h,
      displayedPrice: isSaleActive ? calculateDiscountedPrice(h.price) : h.price,
      isSummerSale: isSaleActive
    }));
  };

  // Effect to update filters when URL changes (for chatbot navigation)
  useEffect(() => {
    const search = searchParams.get('search');
    if (search !== null) setSearchQuery(search);
    
    const amenity = searchParams.get('amenity');
    if (amenity) setSelectedAmenities(prev => prev.includes(amenity) ? prev : [...prev, amenity]);
    
    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) setPriceRange(parseInt(maxPrice));
    
    const deals = searchParams.get('deals');
    if (deals === 'true') setShowOnlyDeals(true);
  }, [searchParams]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Enrich hotels with missing data for filtering demonstration if needed
      const enrichedHotels = staticHotels.map(hotel => ({
        ...hotel,
        type: hotel.type || (hotel.stars >= 5 ? 'Resorts' : 'Hotels'),
        amenities: hotel.amenities || ['Free Wi-Fi', 'Pool', 'Breakfast', 'Parking', 'Spa', 'Gym'].filter(() => Math.random() > 0.3),
        hasDeal: hotel.badge?.toLowerCase().includes('off') || hotel.badge?.toLowerCase().includes('deal') || !!hotel.discount || !!hotel.specialOffer
      }));
      setHotels(enrichedHotels);
      setLoading(false);
    }, 1500);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    // Countdown timer for deal
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    const handleClickOutside = () => setShowSuggestions(false);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Filter logic helper - REAL TIME
  const filteredHotels = useMemo(() => {
    let result = hotels.filter(h => {
      // 1. Search filter
      const matchesSearch = !searchQuery || 
                           h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (h.destination && h.destination.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 2. Price filter
      const matchesPrice = getActivePrice(h) <= priceRange;
      
      // 3. Property Type filter
      const matchesPropertyType = selectedPropertyTypes.length === 0 || 
                                 selectedPropertyTypes.includes(h.type);
      
      // 4. Amenities filter
      const matchesAmenities = selectedAmenities.length === 0 || 
                               selectedAmenities.every(amenity => h.amenities?.includes(amenity));
      
      // 5. Guest Rating filter
      const matchesRating = parseFloat(h.rating) >= minRating;
      
      // 6. Deals filter
      const matchesDeals = !showOnlyDeals || h.hasDeal;
      
      // 7. Quick Filters (top chips)
      const matchesQuickFilters = activeFilters.length === 0 || 
                                 activeFilters.every(filter => {
                                   if (filter === "4 Star & Above") return h.stars >= 4;
                                   if (filter === "Free Cancellation") return true; // Mocked
                                   if (filter === "Breakfast Included") return h.amenities?.includes('Breakfast');
                                   if (filter === "Pay at Hotel") return true; // Mocked
                                   if (filter === "Pool") return h.amenities?.includes('Pool');
                                   if (filter === "Free Wi-Fi") return h.amenities?.includes('Free Wi-Fi');
                                   if (filter === "Parking") return h.amenities?.includes('Parking');
                                   return true;
                                 });

      return matchesSearch && matchesPrice && matchesPropertyType && 
             matchesAmenities && matchesRating && matchesDeals && matchesQuickFilters;
    });

    // Sorting logic
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => getActivePrice(a) - getActivePrice(b));
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => getActivePrice(b) - getActivePrice(a));
    } else if (sortBy === 'Rating: High to Low' || sortBy === 'Rating') {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === 'Popularity') {
      result.sort((a, b) => parseInt(b.users || 0) - parseInt(a.users || 0));
    }

    return result;
  }, [hotels, searchQuery, priceRange, selectedPropertyTypes, selectedAmenities, minRating, showOnlyDeals, activeFilters, sortBy, isSaleActive]);

  // Reset visible count when filters change to manage page weight
  useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery, priceRange, selectedPropertyTypes, selectedAmenities, minRating, showOnlyDeals, activeFilters, sortBy]);

  const visibleHotels = useMemo(() => {
    return filteredHotels.slice(0, visibleCount);
  }, [filteredHotels, visibleCount]);

  const clearAllFilters = () => {
    setPriceRange(150000);
    setSelectedPropertyTypes([]);
    setSelectedAmenities([]);
    setMinRating(0);
    setShowOnlyDeals(false);
    setActiveFilters([]);
    setSearchQuery('');
    setAppliedSearch('');
  };

  const toggleFilter = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleSearch = () => {
    setAppliedSearch(searchQuery);
  };

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return staticDestinations
      .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(d => d.name);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-x-hidden">
      <div className="app-shell max-w-[1400px] mx-auto px-4 sm:px-6">
        <Navbar activePage="hotels" />
        
        <main className="py-4 sm:py-8 space-y-8">
          
          {/* Sticky Search & Filter Bar */}
          <div className={`w-full sticky top-[90px] z-40 transition-all duration-300 ${isScrolled ? 'translate-y-[-4px]' : ''}`}>
            <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/30 rounded-2xl sm:rounded-3xl p-4 sm:p-7">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  <div className="relative group" onClick={(e) => e.stopPropagation()}>
                    <SearchInput 
                      label="Destination" 
                      icon={<MapPin className="text-blue-500" size={18} />} 
                      value={searchQuery} 
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                    />
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                        >
                          {suggestions.map(s => (
                            <div 
                              key={s} 
                              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery(s);
                                setShowSuggestions(false);
                              }}
                            >
                              <MapPin size={14} className="text-slate-400" /> 
                              <span className="text-slate-700 font-medium">{s}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <SearchInput 
                    label="Check-in - Check-out" 
                    icon={<Calendar className="text-blue-500" size={18} />} 
                    value={checkInOut} 
                    onChange={(e) => setCheckInOut(e.target.value)}
                    placeholder="Select dates"
                  />
                  <SearchInput 
                    label="Guests & Rooms" 
                    icon={<Users className="text-blue-500" size={18} />} 
                    value={guestsRooms} 
                    onChange={(e) => setGuestsRooms(e.target.value)}
                    placeholder="2 Guests, 1 Room"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Price: Up to ₹{priceRange.toLocaleString()}</label>
                    <div className="relative pt-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="150000" 
                        step="500" 
                        value={priceRange} 
                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase">
                        <span>₹0</span>
                        <span>₹1.5L+</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full lg:w-auto">
                  <button 
                    className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-2xl transition-all"
                    onClick={() => setIsFilterDrawerOpen(true)}
                  >
                    <Filter size={18} /> Filters
                  </button>
                  <button 
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95"
                    onClick={handleSearch}
                  >
                    <Search size={18} /> Search
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  {QUICK_FILTERS.map(filter => (
                    <button 
                      key={filter} 
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${activeFilters.includes(filter) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}
                      onClick={() => toggleFilter(filter)}
                    >
                      {activeFilters.includes(filter) ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><ArrowUpDown size={14} /> Sort By:</span>
                  <select 
                    className="bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating: High to Low</option>
                    <option>Popularity</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Banner */}
          <AnimatePresence>
            {showBanner && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 p-6 sm:p-10 text-white shadow-2xl shadow-blue-200/30"
              >
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 border border-white/20">
                      <Zap size={14} className="text-yellow-300 fill-yellow-300" /> Summer Exclusive
                    </div>
                    <h3 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight italic">Summer Sale is Live!</h3>
                    <p className="text-blue-100 text-lg sm:text-xl font-medium max-w-xl">
                      Unlock elite discounts up to <span className="text-white font-black underline decoration-yellow-400 decoration-4 underline-offset-4">40% OFF</span> on world-class hotels.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`group relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-xl text-base font-black shadow-2xl transition-all ${isSaleActive ? 'bg-emerald-500 text-white' : 'bg-white text-blue-700'}`}
                      onClick={toggleSummerSale}
                    >
                      {isSaleActive ? 'Deal Applied' : 'Grab the Deal Now'}
                    </motion.button>
                    <button className="text-white/60 hover:text-white text-sm font-bold flex items-center gap-2" onClick={() => setShowBanner(false)}>
                      <X size={18} /> Close
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr_320px] gap-8 xl:gap-12">
            
            {/* Sidebar Filters */}
            <aside className="hidden lg:block">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-[180px] h-fit space-y-8">
                <h4 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2"><Filter size={20} className="text-blue-600" /> Filters</h4>
                
                <div className="space-y-4">
                  <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Property Type</h5>
                  <div className="space-y-2.5">
                    {['Hotels', 'Resorts', 'Villas', 'Apartments'].map(type => (
                      <Checkbox 
                        key={type}
                        label={type} 
                        checked={selectedPropertyTypes.includes(type)}
                        onChange={() => {
                          setSelectedPropertyTypes(prev => 
                            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Guest Rating</h5>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 4, 3, 2, 1].map(rating => (
                      <button 
                        key={rating}
                        className={`h-10 rounded-xl text-sm font-bold transition-all ${minRating === rating ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600'}`}
                        onClick={() => setMinRating(rating)}
                      >
                        {rating === 0 ? 'All' : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
                  onClick={clearAllFilters}
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* Listings */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{filteredHotels.length} Properties Found</h2>
                  <p className="text-slate-500 font-medium">Matching your search criteria</p>
                </div>
              </div>

              <div className="space-y-6">
                {loading ? (
                  Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                  <AnimatePresence mode="popLayout">
                    {visibleHotels.map(hotel => (
                      <motion.div
                        key={hotel.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <HotelCard 
                          hotel={hotel} 
                          onClick={() => navigate(`/hotels/${hotel.id}`)} 
                          isSaleActive={isSaleActive}
                          calculateDiscountedPrice={calculateDiscountedPrice}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </section>

            {/* Right Widgets */}
            <aside className="hidden xl:block">
              <div className="sticky top-[180px] space-y-8 h-fit">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-1 border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
                  <div className="relative h-60 rounded-[1.75rem] overflow-hidden bg-slate-200">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/lonlat:77.1025,28.7041,11/600x400?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}')` }} />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">View on Map</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Explore locations visually</p>
                      </div>
                      <button className="bg-slate-900 text-white p-2.5 rounded-xl"><Navigation size={18} /></button>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 text-white shadow-2xl">
                  <h4 className="font-bold mb-3">Price Trends</h4>
                  <p className="text-slate-400 text-sm mb-5 font-medium">Prices are currently <span className="text-emerald-400 font-bold italic">average</span>.</p>
                  <button className="w-full py-3.5 bg-white/10 border border-white/10 rounded-2xl text-sm font-bold">
                    View Detailed Trends
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* Trust Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-slate-100">
            <TrustItem icon={<Tag size={28} className="text-emerald-500" />} title="Best Price Match" desc="Found it cheaper? We'll match it." />
            <TrustItem icon={<RefreshCcw size={28} className="text-blue-500" />} title="Flexible Booking" desc="Cancel up to 24h before." />
            <TrustItem icon={<ShieldCheck size={28} className="text-purple-500" />} title="Verified Stays" desc="50-point quality check." />
            <TrustItem icon={<PhoneCall size={28} className="text-orange-500" />} title="VIP Concierge" desc="24/7 dedicated support." />
          </div>

        </main>
        
        <Footer />
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
              onClick={() => setIsFilterDrawerOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-[320px] bg-white z-[101] shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 italic">Filters</h3>
                <button className="p-2.5 bg-slate-100 rounded-full" onClick={() => setIsFilterDrawerOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-8">
                {/* Simplified mobile filters can be added here */}
                <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black" onClick={() => setIsFilterDrawerOpen(false)}>Apply</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function SearchInput({ label, icon, value, onChange, onFocus, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative flex items-center">
        <div className="absolute left-4 z-10">{icon}</div>
        <input 
          type="text" 
          value={value} 
          onChange={onChange} 
          onFocus={onFocus}
          placeholder={placeholder || `Enter ${label}...`}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>
    </div>
  );
}

function Checkbox({ label, checked = false, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-6 h-6 border-2 border-slate-200 rounded-lg checked:bg-blue-600 transition-all" />
      <span className="text-slate-700 font-bold group-hover:text-blue-600 transition-colors text-sm">{label}</span>
    </label>
  );
}

const HotelCard = React.memo(({ hotel, onClick, isSaleActive, calculateDiscountedPrice }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const hotelIdNum = typeof hotel.id === 'string' ? parseInt(hotel.id) : hotel.id;

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-100 overflow-hidden flex flex-col md:flex-row transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer" onClick={onClick}>
      <div className="relative w-full md:w-[240px] lg:w-[280px] xl:w-[320px] h-60 md:h-auto overflow-hidden">
        <img src={hotel.img || hotel.images?.[0]} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <button 
          className={`absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-2xl backdrop-blur-md border transition-all ${isInWishlist(hotelIdNum, 'hotel') ? 'bg-red-500 border-red-400 text-white' : 'bg-white/80 border-white text-slate-600 hover:text-red-500'}`} 
          onClick={(e) => { 
            e.stopPropagation(); 
            toggleWishlist({ id: hotelIdNum, type: 'hotel', name: hotel.name, image: hotel.img || hotel.images?.[0], location: hotel.location, price: hotel.price });
          }}
        >
          <Heart size={22} fill={isInWishlist(hotelIdNum, 'hotel') ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-none">{hotel.name}</h3>
            <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest">{hotel.badge || 'Bestseller'}</div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-6">
            <MapPin size={16} className="text-blue-500" />
            <span>{hotel.location}</span>
          </div>
        </div>
        <div className="flex justify-between items-end pt-6 border-t border-slate-100">
          <div>
            <div className="text-3xl font-bold text-slate-900 leading-none">₹{isSaleActive ? calculateDiscountedPrice(hotel.price) : hotel.price}<span className="text-xs font-bold text-slate-400 ml-1">/ Night</span></div>
          </div>
          <button className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold text-sm uppercase flex items-center gap-2">View <ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
});

function TrustItem({ icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-5">{icon}</div>
      <h5 className="text-base font-bold text-slate-800 mb-2">{title}</h5>
      <p className="text-slate-500 text-xs font-medium">{desc}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 overflow-hidden flex flex-col md:flex-row h-auto animate-pulse">
      <div className="w-full md:w-[240px] lg:w-[280px] xl:w-[320px] h-60 md:h-auto bg-slate-100" />
      <div className="flex-1 p-5 sm:p-7 space-y-6">
        <div className="h-4 w-32 bg-slate-50 rounded-full" />
        <div className="h-10 w-2/3 bg-slate-50 rounded-2xl" />
        <div className="h-12 w-full bg-slate-50 rounded-xl" />
      </div>
    </div>
  );
}

export default HotelsPage;
