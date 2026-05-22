import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { User, Mail, Phone, Hash } from 'lucide-react';

export default function PassengerStep() {
  const { bookingState, updateData } = useBooking();
  const [formData, setFormData] = useState(bookingState.passengerDetails || {
    fullName: '',
    age: '',
    gender: 'Male',
    email: '',
    phone: '',
    passport: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    updateData('passengerDetails', updated);
    
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const isFlight = bookingState.flowType === 'Flight';

  return (
    <div className="booking-step">
      <h3 className="booking-step-title">Passenger Details</h3>
      <p className="booking-step-desc">Please enter the details for the primary traveler.</p>
      
      <div className="booking-form">
        <div className="booking-form-group">
          <label>Full Name</label>
          <div className="relative flex items-center">
            <User size={18} className="absolute left-3 text-slate-400" />
            <input 
              type="text" 
              name="fullName"
              className={`booking-input pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>}
        </div>

        <div className="booking-grid-2">
          <div className="booking-form-group">
            <label>Age</label>
            <input 
              type="number" 
              name="age"
              className="booking-input"
              placeholder="25"
              value={formData.age}
              onChange={handleChange}
              min="1"
            />
          </div>
          <div className="booking-form-group">
            <label>Gender</label>
            <select 
              name="gender" 
              className="booking-input"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="booking-grid-2">
          <div className="booking-form-group">
            <label>Email Address</label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3 text-slate-400" />
              <input 
                type="email" 
                name="email"
                className="booking-input pl-10"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="booking-form-group">
            <label>Phone Number</label>
            <div className="relative flex items-center">
              <Phone size={18} className="absolute left-3 text-slate-400" />
              <input 
                type="tel" 
                name="phone"
                className="booking-input pl-10"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {isFlight && (
          <div className="booking-form-group">
            <label>Passport Number (Optional)</label>
            <div className="relative flex items-center">
              <Hash size={18} className="absolute left-3 text-slate-400" />
              <input 
                type="text" 
                name="passport"
                className="booking-input pl-10 uppercase"
                placeholder="A1234567"
                value={formData.passport}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
