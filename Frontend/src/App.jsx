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
import BookingFlowManager from './components/booking/BookingFlowManager';

// Admin Imports
import { AdminProvider } from './context/AdminContext';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import HotelManagement from './pages/admin/HotelManagement';
import UserManagement from './pages/admin/UserManagement';
import BookingManagement from './pages/admin/BookingManagement';
import Analytics from './pages/admin/Analytics';
import RoleGuard from './components/RoleGuard';

function App() {
  return (
    <AdminProvider>
      <RoleGuard>
        <Routes>
          {/* User Routes */}
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

        {/* Admin Routes */}
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
        
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="hotels" element={<HotelManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="messages" element={<div className="p-8">Messages (Coming Soon)</div>} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Routes>
      
      {/* Show Chatbot only if not on an admin route (this can be checked via location hook, but keeping it simple for now) */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Chatbot />} />
      </Routes>
      <BookingFlowManager />
      </RoleGuard>
    </AdminProvider>
  );
}

export default App;
