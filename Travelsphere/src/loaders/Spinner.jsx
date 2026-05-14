import React from 'react';
import { motion } from 'framer-motion';
import '../styles/loaders.css';

export const Spinner = ({ size = 24, color = "currentColor" }) => {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        border: `3px solid ${color}40`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        display: 'inline-block'
      }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  );
};

export default Spinner;
