import { Routes, Route } from 'react-router-dom';
import PlacePage from './pages/PlacePage';
import ExplorePlacesPage from './pages/ExplorePlacesPage';
import HotelsPage from './pages/HotelsPage';
import TravelOptionsPage from './pages/TravelOptionsPage';
import PlanItineraryPage from './pages/PlanItineraryPage';
import AttractionDetailPage from './pages/AttractionDetailPage';
import HotelDetailPage from './pages/HotelDetailPage';
import PaymentPage from './pages/PaymentPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import FAQPage from './pages/FAQ';
import TermsPage from './pages/Terms';
import PrivacyPage from './pages/Privacy';
import Chatbot from './components/chatbot/Chatbot';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/explore" element={<ExplorePlacesPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />
        <Route path="/hotels/:hotelId/payment" element={<PaymentPage />} />
        <Route path="/travel" element={<TravelOptionsPage />} />
        <Route path="/itinerary" element={<PlanItineraryPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/place/:placeName" element={<PlacePage />} />
        <Route path="/place/:placeName/payment" element={<PaymentPage />} />
        <Route path="/place/:placeName/attraction/:attractionId" element={<AttractionDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
