import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => {
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
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--text-color, inherit)' }}>Terms of Service</h1>
      <p style={{ color: '#64748b', marginBottom: '40px' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="legal-content" style={{ lineHeight: '1.8', color: 'var(--text-color, inherit)' }}>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using TravelSphere, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        
        <br/>
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on TravelSphere for personal, non-commercial transitory viewing only.</p>
        
        <br/>
        <h2>3. Disclaimer</h2>
        <p>The materials on TravelSphere are provided on an 'as is' basis. TravelSphere makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        
        <br/>
        <h2>4. Limitations</h2>
        <p>In no event shall TravelSphere or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TravelSphere.</p>
      </div>
    </motion.div>
      <Footer />
    </>
  );
};

export default TermsPage;
