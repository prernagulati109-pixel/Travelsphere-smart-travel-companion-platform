import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPage = () => {
  return (
    <>
      <Navbar />
      <motion.div 
      className="legal-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', minHeight: '70vh' }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--text-color, inherit)' }}>Privacy Policy</h1>
      <p style={{ color: '#64748b', marginBottom: '40px' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="legal-content" style={{ lineHeight: '1.8', color: 'var(--text-color, inherit)' }}>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
        
        <br/>
        <h2>2. Use of Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect TravelSphere and our users.</p>
        
        <br/>
        <h2>3. Information Sharing</h2>
        <p>We may share your information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
        
        <br/>
        <h2>4. Data Security</h2>
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
      </div>
    </motion.div>
      <Footer />
    </>
  );
};

export default PrivacyPage;
