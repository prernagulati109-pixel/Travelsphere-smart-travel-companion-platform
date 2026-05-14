import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-icon">✈️</span>
            <h3>TravelSphere</h3>
          </div>
          <p>Your smart travel companion. Discover new places, plan itineraries, and find the best hotel deals all in one place.</p>
          <div className="social-links">
            <a href="#" className="social-link" title="Twitter">𝕏</a>
            <a href="#" className="social-link" title="Instagram">📸</a>
            <a href="#" className="social-link" title="Facebook">📘</a>
          </div>
        </div>
        
        <div className="footer-links-group">
          <div className="footer-column">
            <h4>Explore</h4>
            <Link to="/explore">Destinations</Link>
            <Link to="/hotels">Hotels</Link>
            <Link to="/travel">Flights</Link>
            <Link to="/itinerary">Itinerary</Link>
          </div>
          
          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQs</Link>
            <Link to="#">Help Center</Link>
          </div>
          
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TravelSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
