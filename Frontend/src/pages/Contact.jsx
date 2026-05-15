import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Contact.css';

const ContactPage = () => {
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      addNotification('Please fill in all required fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      addNotification('Your message has been sent successfully!', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      addNotification('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar activePage="contact" />
      <motion.div 
      className="contact-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have a question or need assistance? We're here to help.</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-card">
            <h3>Get in Touch</h3>
            <p>Our friendly team would love to hear from you.</p>
            
            <div className="info-details">
              <div className="detail-item">
                <span className="icon">📍</span>
                <p>123 Travel Avenue, New York, NY 10001</p>
              </div>
              <div className="detail-item">
                <span className="icon">📞</span>
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="detail-item">
                <span className="icon">✉️</span>
                <p>support@travelsphere.com</p>
              </div>
            </div>
            
            <div className="social-links-contact">
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
            </div>
          </div>
          
          <div className="map-placeholder">
            <div className="map-embed-mock">
              <span>Google Maps Embed Placeholder</span>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send us a Message</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                placeholder="How can we help you?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
      <Footer />
    </>
  );
};

export default ContactPage;
