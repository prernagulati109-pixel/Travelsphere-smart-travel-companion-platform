import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { Briefcase, Coffee, Star, Shield } from 'lucide-react';

export default function AddOnsStep() {
  const { bookingState, updateData } = useBooking();
  const [selectedAddons, setSelectedAddons] = useState(bookingState.addOns || {});

  const addons = [
    { id: 'baggage', title: 'Extra Baggage (+15kg)', desc: 'Add more weight to your checked-in luggage.', price: 1200, icon: <Briefcase /> },
    { id: 'meal', title: 'Pre-book Meal', desc: 'Enjoy a delicious hot meal during your journey.', price: 450, icon: <Coffee /> },
    { id: 'priority', title: 'Priority Boarding', desc: 'Skip the queue and board early.', price: 600, icon: <Star /> },
    { id: 'insurance', title: 'Travel Insurance', desc: 'Secure your trip against delays and cancellations.', price: 350, icon: <Shield /> }
  ];

  const toggleAddon = (addon) => {
    const updated = { ...selectedAddons };
    if (updated[addon.id]) {
      delete updated[addon.id];
    } else {
      updated[addon.id] = addon;
    }
    setSelectedAddons(updated);
    updateData('addOns', updated);
  };

  return (
    <div className="booking-step">
      <h3 className="booking-step-title">Enhance Your Journey</h3>
      <p className="booking-step-desc">Add extra services to make your trip more comfortable.</p>

      <div className="addons-list">
        {addons.map(addon => (
          <div 
            key={addon.id} 
            className={`addon-card ${selectedAddons[addon.id] ? 'selected' : ''}`}
            onClick={() => toggleAddon(addon)}
          >
            <div className="addon-info">
              <div className="addon-icon">{addon.icon}</div>
              <div className="addon-details">
                <h4>{addon.title}</h4>
                <p>{addon.desc}</p>
              </div>
            </div>
            <div className="addon-price">
              +₹{addon.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
