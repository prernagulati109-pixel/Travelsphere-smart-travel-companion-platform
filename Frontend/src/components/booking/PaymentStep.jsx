import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useBooking } from '../../context/BookingContext';
import { CheckCheck, CheckCircle2, Copy, CreditCard, Lock, RefreshCcw, SmartphoneNfc } from 'lucide-react';

export default function PaymentStep() {
  const { bookingState, updateData } = useBooking();
  const [method, setMethod] = useState(bookingState.paymentMethod || 'card');
  const [paymentVerified, setPaymentVerified] = useState(bookingState.paymentVerified || false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  const UPI_ID = 'gulatiprerna676@okaxis';
  const UPI_NAME = 'TravelSphere';
  const basePrice = bookingState.item?.price || 0;
  const addonsTotal = Object.values(bookingState.addOns || {}).reduce((total, addon) => total + addon.price, 0);
  const totalAmount = basePrice + addonsTotal + Math.round((basePrice + addonsTotal) * 0.18);

  useEffect(() => {
    updateData('paymentMethod', method);
    updateData('paymentVerified', method === 'card' ? true : paymentVerified);
  }, []);

  useEffect(() => {
    if (method === 'scanner' && !paymentVerified && !verifyingPayment) {
      setVerifyingPayment(true);
      const timer = setTimeout(() => {
        setPaymentVerified(true);
        setVerifyingPayment(false);
        updateData('paymentVerified', true);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [method, paymentVerified, verifyingPayment, updateData]);

  const handleMethodSelect = (nextMethod) => {
    setMethod(nextMethod);
    updateData('paymentMethod', nextMethod);
    updateData('paymentVerified', nextMethod === 'card' ? true : paymentVerified);
  };

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

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
        <button
          onClick={() => handleMethodSelect('card')}
          style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '7px', background: method === 'card' ? 'white' : 'transparent', color: method === 'card' ? '#0f172a' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: method === 'card' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
        >
          <CreditCard size={18} /> Card
        </button>
        <button
          onClick={() => handleMethodSelect('scanner')}
          style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '7px', background: method === 'scanner' ? 'white' : 'transparent', color: method === 'scanner' ? '#0f172a' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: method === 'scanner' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
        >
          <SmartphoneNfc size={18} /> UPI / QR
        </button>
      </div>

      <div className="mt-6 p-4 border border-slate-200 rounded-xl bg-white">
        {method === 'card' ? (
          <div className="space-y-4">
            <div className="booking-form-group mb-0">
              <label>Cardholder Name</label>
              <input type="text" className="booking-input" placeholder="John Doe" />
            </div>
            <div className="booking-form-group mb-0">
              <label>Card Number</label>
              <input type="text" className="booking-input" placeholder="0000 0000 0000 0000" />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '4px 0' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', textAlign: 'center' }}>
              Scan with any UPI app &nbsp;(GPay, PhonePe, Paytm...)
            </p>

            <div style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1rem' }}>T</div>
                <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>TravelSphere</span>
              </div>

              <QRCodeSVG
                value={`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(`${bookingState.flowType || 'Travel'} Booking - TravelSphere`)}`}
                size={180}
                level="H"
                includeMargin={false}
                style={{ borderRadius: '8px' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', borderRadius: '8px', padding: '7px 14px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569' }}>UPI ID:</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#0f172a' }}>{UPI_ID}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(UPI_ID); setUpiCopied(true); setTimeout(() => setUpiCopied(false), 2000); }}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', color: upiCopied ? '#10b981' : '#94a3b8', display: 'flex' }}
                  title="Copy UPI ID"
                >
                  {upiCopied ? <CheckCheck size={14} /> : <Copy size={14} />}
                </button>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '8px 20px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#065f46', display: 'block' }}>Amount to pay</span>
                <strong style={{ fontSize: '1.3rem', color: '#059669' }}>₹{totalAmount.toLocaleString()}</strong>
              </div>

              <div style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid', borderColor: paymentVerified ? '#bbf7d0' : '#bae6fd', background: paymentVerified ? '#f0fdf4' : '#f0f9ff', color: paymentVerified ? '#15803d' : '#0369a1', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: 'all 0.3s' }}>
                {verifyingPayment ? (
                  <>
                    <RefreshCcw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Waiting for payment...</span>
                    </div>
                  </>
                ) : paymentVerified ? (
                  <>
                    <CheckCircle2 size={18} />
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Payment Verified!</span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
