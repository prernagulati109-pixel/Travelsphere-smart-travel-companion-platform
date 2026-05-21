import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { Heart, Bell, ChevronDown, Moon, Sun, Check, Trash2 } from 'lucide-react';
import '../styles/index.css';

function Navbar({ activePage }) {
  const { user, isLoggedIn, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { isDarkMode, toggleTheme } = useTheme();
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar-container slide-down">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <img 
              src="https://static.vecteezy.com/system/resources/previews/000/620/372/original/aircraft-airplane-airline-logo-label-journey-air-travel-airliner-symbol-vector-illustration.jpg" 
              alt="Logo" 
            />
          </div>
          <div className="navbar-title">
            <h1>TravelSphere</h1>
            <p>Smart Travel Companion</p>
          </div>
        </Link>
        <nav className="navbar-links">
          <Link to="/" className={activePage === 'home' ? 'active' : ''}>Home</Link>
          <Link to="/about" className={activePage === 'about' ? 'active' : ''}>About</Link>
          <Link to="/explore" className={activePage === 'explore' ? 'active' : ''}>Explore</Link>
          <Link to="/hotels" className={activePage === 'hotels' ? 'active' : ''}>Hotels</Link>
          <Link to="/travel" className={activePage === 'travel' ? 'active' : ''}>Travel</Link>
          <Link to="/itinerary" className={activePage === 'itinerary' ? 'active' : ''}>Itinerary</Link>
          {user?.isAdmin && <Link to="/dashboard" className={activePage === 'dashboard' ? 'active' : ''}>Dashboard</Link>}
        </nav>

        <div className="navbar-right">
          <button 
            className="nav-icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            className={`nav-icon-btn ${activePage === 'wishlist' ? 'active' : ''}`}
            onClick={() => navigate('/wishlist')}
            title="My Likelist"
          >
            <Heart size={20} fill={activePage === 'wishlist' ? 'currentColor' : 'none'} />
            {wishlist.length > 0 && <span className="badge wishlist-badge">{wishlist.length}</span>}
          </button>
          
          <div className="notification-wrapper" ref={notifRef}>
            <button 
              className={`nav-icon-btn ${showNotifications ? 'active' : ''}`}
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown slide-down-anim">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  <div className="notification-actions">
                    <button onClick={markAllAsRead} title="Mark all as read"><Check size={14} /></button>
                    <button onClick={clearAll} title="Clear all"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="notification-body">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`notification-item ${!notif.read ? 'unread' : ''}`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className={`notification-dot ${notif.type}`}></div>
                        <div className="notification-content-text">
                          <p>{notif.message}</p>
                          <span className="notification-time">
                            {notif.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="notification-empty">
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {isLoggedIn ? (
            <div className="user-dropdown">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'User')}&background=random&color=fff&bold=true`} 
                alt={user.name || 'User'} 
              />
              <div className="user-name-wrap">
                <span className="hi-text">Hi, {user.name ? user.name.split(' ')[0] : 'User'}</span>
                <span className="user-name">My Profile</span>
              </div>
              <ChevronDown size={14} />
              
              <div className="logout-menu">
                <button className="logout-item" onClick={() => {
                  logout();
                  navigate('/');
                }}>
                  <span>🚪</span> Log Out
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="navbar-login-btn" 
              onClick={() => navigate('/auth', { state: { from: location.pathname + location.search } })}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

