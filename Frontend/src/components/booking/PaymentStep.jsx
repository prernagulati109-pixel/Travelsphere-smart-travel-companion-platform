import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { CreditCard, SmartphoneNfc, Wallet, Building2, Lock } from 'lucide-react';

export default function PaymentStep() {
  const { bookingState, updateData } = useBooking();
  const [method, setMethod] = useState(bookingState.paymentMethod || 'card');

  const handleMethodSelect = (m) => {
    setMethod(m);
    updateData('paymentMethod', m);
  };

  const getBasePrice = () => bookingState.item?.price || 0;
  const getAddonsTotal = () => Object.values(bookingState.addOns || {}).reduce((total, addon) => total + addon.price, 0);
  const totalAmount = getBasePrice() + getAddonsTotal() + Math.round((getBasePrice() + getAddonsTotal()) * 0.18);

  return (
    <div className="booking-step">
      <h3 className="booking-step-title">Secure Payment</h3>
      <p className="booking-step-desc">Choose your preferred payment method to complete the booking.</p>

      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 font-medium">
          <Lock size={16} /> Secure checkout
        </div>
        <div className="text-xl font-bold">
          ₹{totalAmount.toLocaleString()}
        </div>
      </div>

      <div className="payment-methods">
        <div 
          className={`payment-method-card ${method === 'card' ? 'selected' : ''}`}
          onClick={() => handleMethodSelect('card')}
        >
          <CreditCard size={24} />
          <span className="font-semibold text-sm">Credit / Debit Card</span>
        </div>
        <div 
          className={`payment-method-card ${method === 'upi' ? 'selected' : ''}`}
          onClick={() => handleMethodSelect('upi')}
        >
          <SmartphoneNfc size={24} />
          <span className="font-semibold text-sm">UPI / QR</span>
        </div>
        <div 
          className={`payment-method-card ${method === 'netbanking' ? 'selected' : ''}`}
          onClick={() => handleMethodSelect('netbanking')}
        >
          <Building2 size={24} />
          <span className="font-semibold text-sm">Net Banking</span>
        </div>
        <div 
          className={`payment-method-card ${method === 'wallet' ? 'selected' : ''}`}
          onClick={() => handleMethodSelect('wallet')}
        >
          <Wallet size={24} />
          <span className="font-semibold text-sm">Wallets</span>
        </div>
      </div>

      <div className="mt-6 p-4 border border-slate-200 rounded-xl bg-white">
        {method === 'card' && (
          <div className="space-y-4">
            <div className="booking-form-group mb-0">
              <label>Card Number</label>
              <input type="text" className="booking-input" placeholder="XXXX XXXX XXXX XXXX" />
            </div>
            <div className="booking-grid-2">
              <div className="booking-form-group mb-0">
                <label>Expiry Date</label>
                <input type="text" className="booking-input" placeholder="MM/YY" />
              </div>
              <div className="booking-form-group mb-0">
                <label>CVV</label>
                <input type="password" className="booking-input" placeholder="***" />
              </div>
            </div>
            <div className="booking-form-group mb-0">
              <label>Name on Card</label>
              <input type="text" className="booking-input" placeholder="John Doe" />
            </div>
          </div>
        )}
        
        {method === 'upi' && (
          <div className="text-center py-6">
            <SmartphoneNfc size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-sm text-slate-600 mb-4">Scan QR code or enter UPI ID to pay</p>
            <input type="text" className="booking-input max-w-xs mx-auto text-center" placeholder="username@upi" />
          </div>
        )}

        {method === 'netbanking' && (
          <div className="text-center py-6">
            <p className="text-sm text-slate-600 mb-4">Select your bank from the list below</p>
            <select className="booking-input max-w-xs mx-auto">
              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
            </select>
          </div>
        )}

        {method === 'wallet' && (
          <div className="text-center py-6">
            <p className="text-sm text-slate-600 mb-4">Select your wallet</p>
            <select className="booking-input max-w-xs mx-auto">
              <option>Paytm</option>
              <option>Amazon Pay</option>
              <option>PhonePe</option>
              <option>MobiKwik</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
