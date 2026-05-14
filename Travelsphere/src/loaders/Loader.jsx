import React from 'react';
import { motion } from 'framer-motion';
import '../styles/loaders.css';

export const Loader = () => {
  return (
    <div className="global-loader-overlay">
      <motion.div 
        className="global-loader"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <div className="loader-circle"></div>
      </motion.div>
    </div>
  );
};

export default Loader;
