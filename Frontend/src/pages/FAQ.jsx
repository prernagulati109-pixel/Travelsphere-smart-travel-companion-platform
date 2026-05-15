import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FAQ.css';

const faqs = [
  {
    category: 'Booking',
    question: 'How do I book a trip?',
    answer: 'You can book a trip by navigating to the "Explore" or "Hotels" section, selecting your desired destination or accommodation, and following the seamless checkout process.'
  },
  {
    category: 'Hotels',
    question: 'Are there hidden fees when booking hotels?',
    answer: 'No, TravelSphere believes in complete transparency. The price you see at checkout includes all standard taxes and fees. Any local city taxes to be paid at the property will be clearly mentioned.'
  },
  {
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and Apple/Google Pay for a secure and quick checkout.'
  },
  {
    category: 'AI Trip Planner',
    question: 'How does the AI Trip Planner work?',
    answer: 'Our AI Planner asks you a few basic questions about your travel style, budget, and destination, then generates a customized day-by-day itinerary instantly.'
  },
  {
    category: 'Account',
    question: 'Can I save my itineraries for later?',
    answer: 'Yes! By creating an account, you can save your favorite hotels to your Wishlist and store AI-generated itineraries in your profile for future access.'
  }
];

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(null);

  const categories = ['All', ...new Set(faqs.map(faq => faq.category))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar activePage="faq" />
      <motion.div 
      className="faq-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about TravelSphere</p>
        
        <div className="faq-search">
          <input 
            type="text" 
            placeholder="Search for answers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="faq-categories">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`faq-category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button 
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="faq-answer-inner">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="faq-empty">
            <p>No FAQs found matching your criteria.</p>
          </div>
        )}
      </div>
    </motion.div>
      <Footer />
    </>
  );
};

export default FAQPage;
