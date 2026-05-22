import { useRef, useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiService } from '../services/apiService';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, ShieldCheck, CreditCard, SmartphoneNfc,
  RefreshCcw, CheckCircle2, Calendar, 
  ArrowRight, Search, Filter, Clock, Star,
  Trash2, Plus, Minus, Copy, CheckCheck
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

// All flights data
const flightsData = [
  { id: 'f1', name: 'Global Airways', type: 'Economy', departure: '06:00 AM', arrival: '08:30 AM', duration: '2h 30m', price: 5500, rating: 4.5, stops: 'Non-stop', amenities: ['Meals', 'Wi-Fi', 'Entertainment'], seatsLeft: 12, badge: 'Best Value' },
  { id: 'f2', name: 'Global Airways', type: 'Business', departure: '06:00 AM', arrival: '08:30 AM', duration: '2h 30m', price: 12000, rating: 4.8, stops: 'Non-stop', amenities: ['Premium Meals', 'Wi-Fi', 'Lounge Access', 'Priority Boarding'], seatsLeft: 4, badge: 'Premium' },
  { id: 'f3', name: 'SkyHigh Airlines', type: 'Economy', departure: '09:15 AM', arrival: '11:50 AM', duration: '2h 35m', price: 4800, rating: 4.2, stops: 'Non-stop', amenities: ['Snacks', 'Entertainment'], seatsLeft: 28 },
  { id: 'f4', name: 'SkyHigh Airlines', type: 'Premium Economy', departure: '09:15 AM', arrival: '11:50 AM', duration: '2h 35m', price: 7500, rating: 4.4, stops: 'Non-stop', amenities: ['Meals', 'Wi-Fi', 'Extra Legroom'], seatsLeft: 8 },
  { id: 'f5', name: 'AirConnect', type: 'Economy', departure: '01:30 PM', arrival: '05:00 PM', duration: '3h 30m', price: 3200, rating: 3.9, stops: '1 Stop (DEL)', amenities: ['Snacks'], seatsLeft: 45, badge: 'Cheapest' },
  { id: 'f6', name: 'JetStream', type: 'Economy', departure: '04:45 PM', arrival: '07:10 PM', duration: '2h 25m', price: 5800, rating: 4.6, stops: 'Non-stop', amenities: ['Meals', 'Wi-Fi', 'Entertainment', 'USB Charging'], seatsLeft: 6 },
  { id: 'f7', name: 'JetStream', type: 'First Class', departure: '04:45 PM', arrival: '07:10 PM', duration: '2h 25m', price: 22000, rating: 4.9, stops: 'Non-stop', amenities: ['Gourmet Dining', 'Lie-flat Seat', 'Lounge', 'Wi-Fi', 'Priority'], seatsLeft: 2, badge: 'Luxury' },
  { id: 'f8', name: 'BudgetWings', type: 'Economy', departure: '07:00 PM', arrival: '10:45 PM', duration: '3h 45m', price: 2800, rating: 3.5, stops: '1 Stop (BOM)', amenities: ['Basic Seat'], seatsLeft: 52 },
  { id: 'f9', name: 'StarLine Air', type: 'Economy', departure: '11:00 PM', arrival: '01:30 AM', duration: '2h 30m', price: 4200, rating: 4.3, stops: 'Non-stop', amenities: ['Meals', 'Wi-Fi'], seatsLeft: 18, badge: 'Red Eye' },
  { id: 'f10', name: 'AirConnect', type: 'Business', departure: '02:00 PM', arrival: '04:30 PM', duration: '2h 30m', price: 9500, rating: 4.1, stops: 'Non-stop', amenities: ['Meals', 'Lounge', 'Wi-Fi', 'Extra Legroom'], seatsLeft: 10 },
];

// All trains data
const trainsData = [
  { id: 't1', name: 'Express Rail', type: 'AC First Class (1A)', departure: '06:30 AM', arrival: '03:15 PM', duration: '8h 45m', price: 3200, rating: 4.6, stops: '4 Stops', amenities: ['AC', 'Meals', 'Bedding', 'Charging Point'], seatsLeft: 8, badge: 'Premium' },
  { id: 't2', name: 'Express Rail', type: 'AC 2-Tier Sleeper (2A)', departure: '06:30 AM', arrival: '03:15 PM', duration: '8h 45m', price: 1800, rating: 4.3, stops: '4 Stops', amenities: ['AC', 'Bedding', 'Charging Point'], seatsLeft: 22 },
  { id: 't3', name: 'Express Rail', type: 'AC 3-Tier Sleeper (3A)', departure: '06:30 AM', arrival: '03:15 PM', duration: '8h 45m', price: 1200, rating: 4.0, stops: '4 Stops', amenities: ['AC', 'Bedding'], seatsLeft: 45, badge: 'Best Value' },
  { id: 't4', name: 'Rajdhani Express', type: 'AC First Class (1A)', departure: '04:00 PM', arrival: '11:30 PM', duration: '7h 30m', price: 3800, rating: 4.8, stops: '2 Stops', amenities: ['AC', 'Premium Meals', 'Bedding', 'Charging', 'Pantry Car'], seatsLeft: 4, badge: 'Fastest' },
  { id: 't5', name: 'Rajdhani Express', type: 'AC 2-Tier Sleeper (2A)', departure: '04:00 PM', arrival: '11:30 PM', duration: '7h 30m', price: 2200, rating: 4.5, stops: '2 Stops', amenities: ['AC', 'Meals', 'Bedding', 'Charging'], seatsLeft: 14 },
  { id: 't6', name: 'Rajdhani Express', type: 'AC 3-Tier Sleeper (3A)', departure: '04:00 PM', arrival: '11:30 PM', duration: '7h 30m', price: 1500, rating: 4.3, stops: '2 Stops', amenities: ['AC', 'Meals', 'Bedding'], seatsLeft: 32 },
  { id: 't7', name: 'Shatabdi Express', type: 'Executive Chair Car', departure: '06:00 AM', arrival: '12:30 PM', duration: '6h 30m', price: 2800, rating: 4.7, stops: '3 Stops', amenities: ['AC', 'Meals', 'Recliner Seat', 'Charging'], seatsLeft: 6 },
  { id: 't8', name: 'Shatabdi Express', type: 'AC Chair Car (CC)', departure: '06:00 AM', arrival: '12:30 PM', duration: '6h 30m', price: 1400, rating: 4.4, stops: '3 Stops', amenities: ['AC', 'Snacks', 'Recliner Seat'], seatsLeft: 38 },
  { id: 't9', name: 'Duronto Express', type: 'AC 2-Tier Sleeper (2A)', departure: '10:00 PM', arrival: '06:00 AM', duration: '8h 00m', price: 2000, rating: 4.2, stops: 'Non-stop', amenities: ['AC', 'Meals', 'Bedding', 'Charging'], seatsLeft: 20, badge: 'Non-Stop' },
  { id: 't10', name: 'Garib Rath', type: 'AC 3-Tier (3A)', departure: '09:30 PM', arrival: '07:30 AM', duration: '10h 00m', price: 800, rating: 3.8, stops: '6 Stops', amenities: ['AC', 'Bedding'], seatsLeft: 65, badge: 'Cheapest' },
];

// All buses data
const busesData = [
  { id: 'b1', name: 'Luxury Coach', type: 'AC Multi-Axle Sleeper', departure: '08:00 PM', arrival: '08:00 AM', duration: '12h 00m', price: 1200, rating: 4.4, stops: '3 Stops', amenities: ['AC', 'Blanket', 'Water Bottle', 'Charging Point'], seatsLeft: 14, badge: 'Best Seller' },
  { id: 'b2', name: 'Luxury Coach', type: 'AC Multi-Axle Seater', departure: '07:00 PM', arrival: '07:00 AM', duration: '12h 00m', price: 800, rating: 4.1, stops: '3 Stops', amenities: ['AC', 'Water Bottle'], seatsLeft: 28 },
  { id: 'b3', name: 'Royal Travels', type: 'Volvo AC Sleeper', departure: '09:00 PM', arrival: '08:30 AM', duration: '11h 30m', price: 1500, rating: 4.6, stops: '2 Stops', amenities: ['AC', 'Blanket', 'Snacks', 'Wi-Fi', 'USB Charging', 'Entertainment'], seatsLeft: 6, badge: 'Premium' },
  { id: 'b4', name: 'Royal Travels', type: 'Volvo AC Seater', departure: '09:00 PM', arrival: '08:30 AM', duration: '11h 30m', price: 1000, rating: 4.3, stops: '2 Stops', amenities: ['AC', 'Water Bottle', 'USB Charging'], seatsLeft: 18 },
  { id: 'b5', name: 'EasyBus', type: 'Non-AC Sleeper', departure: '06:30 PM', arrival: '08:00 AM', duration: '13h 30m', price: 450, rating: 3.5, stops: '5 Stops', amenities: ['Blanket'], seatsLeft: 42, badge: 'Cheapest' },
  { id: 'b6', name: 'EasyBus', type: 'Non-AC Seater', departure: '06:30 PM', arrival: '08:00 AM', duration: '13h 30m', price: 350, rating: 3.2, stops: '5 Stops', amenities: ['Basic Seat'], seatsLeft: 55 },
  { id: 'b7', name: 'Metro Express', type: 'AC Seater (2+1)', departure: '10:00 PM', arrival: '09:00 AM', duration: '11h 00m', price: 950, rating: 4.2, stops: '3 Stops', amenities: ['AC', 'Extra Legroom', 'Charging', 'Water Bottle'], seatsLeft: 20 },
  { id: 'b8', name: 'GreenLine Travels', type: 'AC Sleeper (Single Berth)', departure: '08:30 PM', arrival: '07:00 AM', duration: '10h 30m', price: 1800, rating: 4.7, stops: '1 Stop', amenities: ['AC', 'Blanket', 'Snacks', 'Wi-Fi', 'TV', 'Charging', 'Curtains'], seatsLeft: 3, badge: 'Luxury' },
  { id: 'b9', name: 'National Travels', type: 'AC Multi-Axle Sleeper', departure: '07:30 PM', arrival: '06:30 AM', duration: '11h 00m', price: 1100, rating: 4.0, stops: '4 Stops', amenities: ['AC', 'Blanket', 'Water Bottle'], seatsLeft: 22 },
  { id: 'b10', name: 'SuperFast Bus', type: 'AC Seater', departure: '11:00 PM', arrival: '10:00 AM', duration: '11h 00m', price: 700, rating: 3.8, stops: '3 Stops', amenities: ['AC', 'Charging'], seatsLeft: 35 },
];

// Airport transfer data
const airportData = [
  { id: 'a1', name: 'Premium Cabs', type: 'Sedan (4 Seater)', departure: 'Flexible', arrival: 'As needed', duration: '30-60 min', price: 800, rating: 4.6, stops: 'Door-to-Airport', amenities: ['AC', 'Water Bottle', 'Professional Driver'], seatsLeft: 10, badge: 'Reliable' },
  { id: 'a2', name: 'Premium Cabs', type: 'SUV (6 Seater)', departure: 'Flexible', arrival: 'As needed', duration: '30-60 min', price: 1200, rating: 4.7, stops: 'Door-to-Airport', amenities: ['AC', 'Extra Space', 'Water Bottle', 'Professional Driver'], seatsLeft: 8, badge: 'Family Friendly' },
  { id: 'a3', name: 'CityRide', type: 'Hatchback (4 Seater)', departure: 'Flexible', arrival: 'As needed', duration: '30-60 min', price: 600, rating: 4.2, stops: 'Door-to-Airport', amenities: ['AC', 'Basic Amenities'], seatsLeft: 15, badge: 'Budget' },
  { id: 'a4', name: 'Airport Express', type: 'Van (8 Seater)', departure: 'Flexible', arrival: 'As needed', duration: '30-60 min', price: 1500, rating: 4.5, stops: 'Door-to-Airport', amenities: ['AC', 'Extra Luggage Space', 'Wi-Fi', 'Professional Driver'], seatsLeft: 5, badge: 'Group Travel' },
  { id: 'a5', name: 'Luxury Transfers', type: 'Luxury Sedan', departure: 'Flexible', arrival: 'As needed', duration: '30-60 min', price: 2000, rating: 4.9, stops: 'Door-to-Airport', amenities: ['AC', 'Premium Service', 'Wi-Fi', 'Refreshments', 'Meet & Greet'], seatsLeft: 3, badge: 'VIP Service' },
];

// Bus stand pickup data
const busStandData = [
  { id: 'bs1', name: 'Local Cabs', type: 'Sedan (4 Seater)', departure: 'Flexible', arrival: 'As needed', duration: '15-30 min', price: 400, rating: 4.3, stops: 'Door-to-Bus Stand', amenities: ['AC', 'Local Knowledge'], seatsLeft: 12, badge: 'Local Expert' },
  { id: 'bs2', name: 'Local Cabs', type: 'Hatchback (4 Seater)', departure: 'Flexible', arrival: 'As needed', duration: '15-30 min', price: 350, rating: 4.1, stops: 'Door-to-Bus Stand', amenities: ['AC', 'Basic Service'], seatsLeft: 18, badge: 'Budget' },
  { id: 'bs3', name: 'City Connect', type: 'Auto Rickshaw', departure: 'Flexible', arrival: 'As needed', duration: '20-40 min', price: 150, rating: 3.8, stops: 'Door-to-Bus Stand', amenities: ['Local Routes'], seatsLeft: 25, badge: 'Cheapest' },
  { id: 'bs4', name: 'Premium Local', type: 'SUV (6 Seater)', departure: 'Flexible', arrival: 'As needed', duration: '15-30 min', price: 700, rating: 4.5, stops: 'Door-to-Bus Stand', amenities: ['AC', 'Comfortable', 'Local Guide'], seatsLeft: 6, badge: 'Comfort' },
];

// Tours and specific places data
const toursData = [
  { id: 't1', name: 'City Explorer', type: 'Half Day City Tour', departure: '09:00 AM', arrival: '01:00 PM', duration: '4h 00m', price: 1200, rating: 4.6, stops: '3-4 Key Places', amenities: ['AC Vehicle', 'Guide', 'Entry Tickets', 'Snacks'], seatsLeft: 8, badge: 'Popular' },
  { id: 't2', name: 'City Explorer', type: 'Full Day City Tour', departure: '08:00 AM', arrival: '06:00 PM', duration: '10h 00m', price: 2200, rating: 4.7, stops: '6-8 Key Places', amenities: ['AC Vehicle', 'Guide', 'Lunch', 'Entry Tickets', 'Photography'], seatsLeft: 6, badge: 'Comprehensive' },
  { id: 't3', name: 'Heritage Walk', type: 'Historical Sites Tour', departure: '10:00 AM', arrival: '04:00 PM', duration: '6h 00m', price: 1800, rating: 4.8, stops: 'Historical Monuments', amenities: ['Expert Guide', 'Entry Fees', 'Cultural Insights'], seatsLeft: 10, badge: 'Cultural' },
  { id: 't4', name: 'Adventure Tour', type: 'Adventure Activities', departure: '07:00 AM', arrival: '07:00 PM', duration: '12h 00m', price: 3500, rating: 4.9, stops: 'Adventure Spots', amenities: ['Equipment', 'Guide', 'Safety Gear', 'Meals', 'Transport'], seatsLeft: 4, badge: 'Adventure' },
  { id: 't5', name: 'Nature Escape', type: 'Nature & Wildlife', departure: '06:00 AM', arrival: '08:00 PM', duration: '14h 00m', price: 2800, rating: 4.5, stops: 'Nature Reserves', amenities: ['Naturalist Guide', 'Binoculars', 'Meals', 'Photography'], seatsLeft: 8, badge: 'Nature' },
  { id: 't6', name: 'Food Tour', type: 'Culinary Experience', departure: '11:00 AM', arrival: '09:00 PM', duration: '10h 00m', price: 2500, rating: 4.6, stops: 'Local Eateries', amenities: ['Food Expert', 'Tastings', 'Local Insights', 'Transport'], seatsLeft: 6, badge: 'Foodie' },
  { id: 't7', name: 'Shopping Tour', type: 'Markets & Malls', departure: '10:00 AM', arrival: '08:00 PM', duration: '10h 00m', price: 1500, rating: 4.3, stops: 'Shopping Districts', amenities: ['Local Guide', 'Bargaining Tips', 'Transport'], seatsLeft: 12, badge: 'Shopping' },
  { id: 't8', name: 'Spiritual Tour', type: 'Temples & Ashrams', departure: '05:00 AM', arrival: '09:00 PM', duration: '16h 00m', price: 2000, rating: 4.7, stops: 'Sacred Places', amenities: ['Spiritual Guide', 'Meditation', 'Local Cuisine'], seatsLeft: 8, badge: 'Spiritual' },
];

// Main summary items
const travelSummary = [
  { id: 'flight', mode: 'Flight', company: 'Global Airways', time: '2h 30m', price: 5500, type: 'Direct', icon: '✈️' },
  { id: 'train', mode: 'Train', company: 'Express Rail', time: '8h 45m', price: 1200, type: 'Sleeper', icon: '🚆' },
  { id: 'bus', mode: 'Bus', company: 'Luxury Coach', time: '12h 00m', price: 800, type: 'AC Multi-Axle', icon: '🚌' },
  { id: 'airport', mode: 'Airport', company: 'Premium Cabs', time: '30-60 min', price: 800, type: 'Door-to-Airport', icon: '🚕' },
  { id: 'busstand', mode: 'BusStand', company: 'Local Cabs', time: '15-30 min', price: 400, type: 'Door-to-Bus Stand', icon: '🚐' },
  { id: 'tours', mode: 'Tours', company: 'City Explorer', time: '4-16h', price: 1200, type: 'Guided Tours', icon: '🎯' },
];

function TravelOptionsPage() {
  const location = useLocation();
  const dateInputRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [activeMode, setActiveMode] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedHotelTravelService, setSelectedHotelTravelService] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [travelType, setTravelType] = useState('intercity');
  const [hotelContext, setHotelContext] = useState(null);
  const [apiTours, setApiTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const { startBooking } = useBooking();

  // Handle hotel booking context
  const mapServiceToMode = (service) => {
    if (service === 'airport') return 'Airport';
    if (service === 'busstand') return 'BusStand';
    if (service === 'tours') return 'Tours';
    if (service === 'local') return 'Bus';
    return null;
  };

  const mapServiceToLabel = (service) => {
    if (service === 'airport') return 'Airport Transfer';
    if (service === 'busstand') return 'Bus Stand Pickup';
    if (service === 'tours') return 'Specific Place Tours';
    if (service === 'local') return 'Local Transportation';
    return '';
  };

  useEffect(() => {
    if (location.state?.fromHotelBooking) {
      const {
        hotelName,
        hotelLocation,
        destination,
        hotelLat,
        hotelLng,
        airportName,
        airportLat,
        airportLng,
        checkIn,
        guests,
        selectedTravelOption
      } = location.state;

      setHotelContext({
        hotelName,
        hotelLocation,
        destination,
        hotelLat,
        hotelLng,
        airportName,
        airportLat,
        airportLng
      });
      setFromCity(airportName || 'Nearest Airport');
      setToCity(destination || '');
      setSelectedDate(checkIn || '');
      setTravelType('local');
      setHasSearched(true);
      setSelectedHotelTravelService(mapServiceToLabel(selectedTravelOption || null));
      const initialMode = mapServiceToMode(selectedTravelOption || null);
      if (initialMode) {
        setActiveMode(initialMode);
      }
    }
  }, [location.state]);

  const openCalendar = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const handleSearch = () => {
    if (fromCity.trim() && toCity.trim()) {
      setHasSearched(true);
      setActiveMode(null);
      setSelectedOption(null);
    }
  };

  const handleModeClick = (mode) => {
    setActiveMode(activeMode === mode ? null : mode);
    setSelectedOption(null);
  };

  const detailData = useMemo(() => {
    if (!activeMode) return [];
    let data = [];
    if (activeMode === 'Flight') data = flightsData;
    if (activeMode === 'Train') data = trainsData;
    if (activeMode === 'Bus') data = busesData;
    if (activeMode === 'Airport') data = airportData;
    if (activeMode === 'BusStand') data = busStandData;
    if (activeMode === 'Tours') {
      data = apiTours.length > 0 ? apiTours : toursData;
    }

    return [...data].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // duration sort: parse "2h 30m" to minutes
      const parseDuration = (d) => {
        const m = d.match(/(\d+)h\s*(\d+)m/);
        return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : 0;
      };
      return parseDuration(a.duration) - parseDuration(b.duration);
    });
  }, [activeMode, sortBy]);

  const handleSelectOption = (id) => {
    setSelectedOption(selectedOption === id ? null : id);
  };
  
  const handleBookNow = (item) => {
    startBooking(activeMode, item);
  };

  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  const airportDistanceKm = hotelContext && hotelContext.hotelLat && hotelContext.hotelLng && hotelContext.airportLat && hotelContext.airportLng
    ? getDistanceKm(hotelContext.airportLat, hotelContext.airportLng, hotelContext.hotelLat, hotelContext.hotelLng)
    : null;

  const airportFare = airportDistanceKm ? Math.max(500, Math.round(airportDistanceKm * 80)) : null;

  const flightDistanceLabel = airportDistanceKm !== null
    ? `${airportDistanceKm} km from ${hotelContext?.airportName} to ${hotelContext?.hotelName}`
    : '';

  const showAirportCabOptions = activeMode === 'Flight' && hotelContext && selectedOption !== null;

  const modeLabel = activeMode === 'Flight' ? 'Flights' : 
                   activeMode === 'Train' ? 'Trains' : 
                   activeMode === 'Bus' ? 'Buses' :
                   activeMode === 'Airport' ? 'Airport Transfers' :
                   activeMode === 'BusStand' ? 'Bus Stand Pickups' :
                   activeMode === 'Tours' ? 'Guided Tours' : '';
                   
  const modeIcon = activeMode === 'Flight' ? '✈️' : 
                   activeMode === 'Train' ? '🚆' : 
                   activeMode === 'Bus' ? '🚌' :
                   activeMode === 'Airport' ? '🚕' :
                   activeMode === 'BusStand' ? '🚐' :
                   activeMode === 'Tours' ? '🎯' : '';

  return (
    <div className="explore-page">
      <Navbar activePage="travel" />

      <div className="explore-container">
        {/* Search Bar */}
        <div className="explore-navbar">
          <div className="nav-field">
            <label>From</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Origin City"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="nav-field">
            <label>To</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Destination City"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="nav-field">
            <label>Date</label>
            <div className="input-wrapper">
              <input
                type="date"
                ref={dateInputRef}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
              <span className="calendar-icon" onClick={openCalendar}>✈️</span>
            </div>
          </div>
          <button className="create-itinerary-btn" onClick={handleSearch}>
            <span className="icon">✈️</span>
            <span>Search</span>
            <span className="chevron">∨</span>
          </button>
        </div>

        {/* Before Search — Prompt */}
        {!hasSearched && (
          <section className="to-empty-prompt">
            <div className="to-empty-icon">
              {location.state?.fromHotelBooking ? '🏨' : '🧭'}
            </div>
            <h2>
              {location.state?.fromHotelBooking 
                ? 'Book Travel for Your Hotel Stay' 
                : 'Search Travel Options'
              }
            </h2>
            <p>
              {location.state?.fromHotelBooking 
                ? `You've booked ${location.state.hotelName} in ${location.state.destination}. Now find airport transfers, bus pickups, or guided tours for your stay.`
                : 'Enter your origin and destination cities, select a date, and hit Search to find the best flights, trains, buses, airport transfers, and tours.'
              }
            </p>
          </section>
        )}

        {/* After Search — Results */}
        {hasSearched && (
          <>
            {/* Route Banner */}
            <div className="to-route-banner">
              <div className="to-route-cities">
                <span className="to-city-name">{fromCity}</span>
                <span className="to-route-arrow">→</span>
                <span className="to-city-name">{toCity}</span>
              </div>
              {selectedDate && <span className="to-route-date">📅 {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>}
            </div>

            {/* Travel Summary Cards */}
            <section className="to-summary-section">
              <h2>Travel Options</h2>
              <p>Find the fastest and cheapest ways to reach your destination.</p>
              {hotelContext && (
              <div className="travel-hotel-context-card">
                <h3>Hotel travel context</h3>
                <p><strong>{hotelContext.hotelName}</strong> in {hotelContext.hotelLocation}</p>
                <p>Airport: {hotelContext.airportName}</p>
                {airportDistanceKm !== null && (
                  <p>{flightDistanceLabel} • Estimated cab fare ₹{airportFare?.toLocaleString()}</p>
                )}
                {selectedHotelTravelService && (
                  <div style={{ marginTop: '12px', padding: '14px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                    <strong>Selected travel facility:</strong>
                    <p style={{ margin: '8px 0 0 0' }}>{selectedHotelTravelService}</p>
                  </div>
                )}
                <button 
                  className="jump-to-airport-btn"
                  onClick={() => setActiveMode('Airport')}
                >
                  🚕 Jump to Airport Transfer
                </button>
              </div>
            )}
            <div className="to-summary-grid">
                {travelSummary.map(option => (
                  <div
                    key={option.id}
                    className={`to-summary-card ${activeMode === option.mode ? 'active' : ''} ${hotelContext && option.mode === 'Airport' ? 'highlighted' : ''}`}
                    onClick={() => handleModeClick(option.mode)}
                  >
                    <div className="to-summary-icon">{option.icon}</div>
                    <div className="to-summary-info">
                      <h4>{option.company} ({option.mode})</h4>
                      <p>{option.type} • {option.time}</p>
                    </div>
                    <div className="to-summary-price">
                      <strong>₹{option.price.toLocaleString()}</strong>
                      <span className="to-starting">starting</span>
                    </div>
                    <div className="to-summary-chevron">{activeMode === option.mode ? '▲' : '▼'}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Detail View */}
            {activeMode && (
              <section className="to-detail-section slide-down-animation">
                <div className="to-detail-header">
                  <div className="to-detail-title">
                    <h2>{modeIcon} Available {modeLabel} {loading && <span className="loader-inline">...</span>}</h2>
                    <p>{detailData.length} options found for {fromCity} → {toCity}</p>
                  </div>
                  <div className="to-sort-controls">
                    <span className="to-sort-label">Sort by:</span>
                    <button className={`to-sort-chip ${sortBy === 'price' ? 'active' : ''}`} onClick={() => setSortBy('price')}>Price</button>
                    <button className={`to-sort-chip ${sortBy === 'duration' ? 'active' : ''}`} onClick={() => setSortBy('duration')}>Duration</button>
                    <button className={`to-sort-chip ${sortBy === 'rating' ? 'active' : ''}`} onClick={() => setSortBy('rating')}>Rating</button>
                  </div>
                </div>

                <div className="to-detail-list">
                  {detailData.map((opt) => (
                    <div
                      key={opt.id}
                      className={`to-detail-card ${selectedOption === opt.id ? 'expanded' : ''}`}
                    >
                      {/* Main Row */}
                      <div className="to-detail-row" onClick={() => handleSelectOption(opt.id)}>
                        <div className="to-detail-left">
                          <div className="to-detail-mode-icon">
                            {activeMode === 'Flight' ? '✈️' : activeMode === 'Train' ? '🚆' : '🚌'}
                          </div>
                          <div className="to-detail-main">
                            <div className="to-detail-name-row">
                              <h4>{opt.name}</h4>
                              {opt.badge && <span className="to-detail-badge">{opt.badge}</span>}
                            </div>
                            <p className="to-detail-type">{opt.type}</p>
                          </div>
                        </div>
                        <div className="to-detail-time-block">
                          <span className="to-time">{opt.departure}</span>
                          <div className="to-time-line">
                            <div className="to-line-dot"></div>
                            <div className="to-line-bar"></div>
                            <div className="to-line-dot"></div>
                          </div>
                          <span className="to-time">{opt.arrival}</span>
                          <span className="to-duration">{opt.duration} • {opt.stops}</span>
                        </div>
                        <div className="to-detail-right">
                          <strong className="to-detail-price">₹{opt.price.toLocaleString()}</strong>
                          <div className="to-detail-rating">⭐ {opt.rating}</div>
                          <span className="to-seats-left">{opt.seatsLeft} seats left</span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedOption === opt.id && (
                        <div className="to-expanded-details">
                          <div className="to-expanded-grid">
                            <div className="to-expanded-col">
                              <h5>🎫 Journey Details</h5>
                              <div className="to-journey-detail-row">
                                <span>Operator</span><strong>{opt.name}</strong>
                              </div>
                              <div className="to-journey-detail-row">
                                <span>Class</span><strong>{opt.type}</strong>
                              </div>
                              <div className="to-journey-detail-row">
                                <span>Route</span><strong>{fromCity} → {toCity}</strong>
                              </div>
                              <div className="to-journey-detail-row">
                                <span>Duration</span><strong>{opt.duration}</strong>
                              </div>
                              <div className="to-journey-detail-row">
                                <span>Stops</span><strong>{opt.stops}</strong>
                              </div>
                            </div>
                            <div className="to-expanded-col">
                              <h5>✨ Amenities</h5>
                              <div className="to-amenities-list">
                                {opt.amenities.map((a, i) => (
                                  <span key={i} className="to-amenity-chip">{a}</span>
                                ))}
                              </div>
                            </div>
                            <div className="to-expanded-col">
                              <h5>💰 Fare Details</h5>
                              <div className="to-journey-detail-row">
                                <span>Base Fare</span><strong>₹{Math.round(opt.price * 0.85).toLocaleString()}</strong>
                              </div>
                              <div className="to-journey-detail-row">
                                <span>Taxes & Fees</span><strong>₹{Math.round(opt.price * 0.15).toLocaleString()}</strong>
                              </div>
                              <div className="to-journey-detail-row to-total-row">
                                <span>Total</span><strong>₹{opt.price.toLocaleString()}</strong>
                              </div>
                            </div>
                          </div>
                          {showAirportCabOptions && (
                            <div className="to-airport-cab-section">
                              <h5>🚕 Airport-to-Hotel Cab Options</h5>
                              <p>{flightDistanceLabel}</p>
                              <div className="to-cab-options-grid">
                                <div className="to-cab-card">
                                  <strong>Standard Taxi</strong>
                                  <p>Estimated ₹{airportFare?.toLocaleString()}</p>
                                  <p>35–45 min • 4 seats</p>
                                </div>
                                <div className="to-cab-card">
                                  <strong>Premium Sedan</strong>
                                  <p>Estimated ₹{airportFare && Math.round(airportFare * 1.25).toLocaleString()}</p>
                                  <p>30–40 min • 3 seats</p>
                                </div>
                                <div className="to-cab-card">
                                  <strong>Shared Shuttle</strong>
                                  <p>Estimated ₹{airportFare && Math.max(350, Math.round(airportFare * 0.75)).toLocaleString()}</p>
                                  <p>40–55 min • 6 seats</p>
                                </div>
                              </div>
                            </div>
                          )}
                           <button 
                             className="to-book-btn"
                             onClick={() => handleBookNow(opt)}
                           >
                             Book Now — ₹{opt.price.toLocaleString()}
                           </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TravelOptionsPage;
