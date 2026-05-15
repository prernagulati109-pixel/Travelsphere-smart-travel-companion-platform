import React from 'react';
import { motion } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './About.css';

const AboutPage = () => {
  const { addNotification } = useNotification();

  return (
    <>
      <Navbar activePage="about" />
      <motion.div 
      className="about-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Discover the World with TravelSphere</h1>
          <p>Your ultimate companion for seamless and unforgettable travel experiences.</p>
        </div>
      </section>

      <section className="about-mission">
        <div className="mission-container">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>At TravelSphere, we believe that traveling should be effortless and inspiring. Our mission is to empower travelers with smart tools, personalized itineraries, and unparalleled support, turning every journey into a memorable adventure.</p>
          </div>
          <div className="mission-image">
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80" alt="Travel Mission" />
          </div>
        </div>
      </section>

      <section className="about-features">
        <h2>Why Choose TravelSphere?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🤖</div>
            <h3>AI Trip Planner</h3>
            <p>Get personalized itineraries crafted by our intelligent AI assistant in seconds.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🏨</div>
            <h3>Best Stays</h3>
            <p>Access exclusive deals and find the perfect accommodation for your needs.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🗺️</div>
            <h3>Smart Routing</h3>
            <p>Optimize your travel routes and explore destinations efficiently.</p>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="stat-item">
          <h3>10K+</h3>
          <p>Happy Travelers</p>
        </div>
        <div className="stat-item">
          <h3>500+</h3>
          <p>Destinations</p>
        </div>
        <div className="stat-item">
          <h3>50+</h3>
          <p>Countries</p>
        </div>
        <div className="stat-item">
          <h3>4.9/5</h3>
          <p>User Rating</p>
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to start your next adventure?</h2>
        <button 
          className="cta-button"
          onClick={() => {
            addNotification("Welcome aboard! Let's plan your trip.", "success");
            window.location.href = '/explore';
          }}
        >
          Explore Destinations
        </button>
      </section>
    </motion.div>
      <Footer />
    </>
  );
};

export default AboutPage;
