import React, { useState, useEffect } from 'react';
import { useLocation, Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { QRCodeSVG } from 'qrcode.react';
import { CreditCard, Smartphone, ArrowRight, RefreshCcw, CheckCircle2, X, ShieldCheck, SmartphoneNfc, Copy, CheckCheck } from 'lucide-react';
import '../styles/index.css';

function PaymentPage() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelId, placeName } = useParams();
  const bookingDetails = location.state?.bookingDetails;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  // Payment verification states
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  // UPI config — update UPI ID / payee name to match your account
  const UPI_ID   = 'gulatiprerna676@okaxis';
  const UPI_NAME = 'TravelSphere';
  const totalAmt = bookingDetails?.totalAmount || bookingDetails?.totalPrice || 0;

  // Authentication check
  if (!isLoggedIn) {
    const returnUrl = hotelId ? `/hotels/${hotelId}/payment` : `/place/${placeName}/payment`;
    return <Navigate to="/auth" state={{ from: returnUrl, bookingDetails }} replace />;
  }

  // Redirect if accessed without booking details
  if (!bookingDetails) {
    const fallbackUrl = hotelId ? `/hotels/${hotelId}` : placeName ? `/place/${placeName}` : '/';
    return <Navigate to={fallbackUrl} replace />;
  }

  const isHotel = bookingDetails.type === 'hotel' || hotelId;
  const isTrip = bookingDetails.type === 'trip' || placeName;

  // Automatic mock payment verification on UPI tab click
  useEffect(() => {
    if (paymentMethod === 'scanner' && !paymentVerified && !verifyingPayment) {
      setVerifyingPayment(true);
      const timer = setTimeout(() => {
        setPaymentVerified(true);
        setVerifyingPayment(false);
      }, 6000); // 6 seconds automatic delay
      return () => clearTimeout(timer);
    }
  }, [paymentMethod, paymentVerified, verifyingPayment]);

  const confirmBooking = () => {
    setBookingLoading(true);
    setTimeout(() => {
      setIsBooked(true);
      setBookingLoading(false);
    }, 2000);
  };

  return (
    <div className="payment-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar activePage="hotels" />
      
      <div className="payment-container" style={{ flex: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '40px 30px', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', position: 'relative' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button 
              onClick={() => navigate(isHotel ? `/hotels/${hotelId}` : `/place/${placeName}`)}
              style={{ position: 'absolute', top: '20px', left: '20px', border: 'none', background: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '50%', color: '#10b981' }}>
                <ShieldCheck size={32} />
              </div>
            </div>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>Secure Payment</h2>
            <p style={{ color: '#64748b', marginTop: '8px' }}>Complete your transaction for {isHotel ? bookingDetails.hotelName : bookingDetails.destination}</p>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
            {isHotel ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Check-in</span>
                  <strong style={{ color: '#1e293b' }}>{bookingDetails.checkIn || 'Not selected'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Check-out</span>
                  <strong style={{ color: '#1e293b' }}>{bookingDetails.checkOut || 'Not selected'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Guests & Nights</span>
                  <strong style={{ color: '#1e293b' }}>{bookingDetails.guests} Guests • {bookingDetails.nights} Nights</strong>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Destination</span>
                  <strong style={{ color: '#1e293b' }}>{bookingDetails.destination}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Travelers</span>
                  <strong style={{ color: '#1e293b' }}>{bookingDetails.travelers} Adults</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Activities</span>
                  <strong style={{ color: '#1e293b' }}>{bookingDetails.selectedAttractions?.length || 0} Places</strong>
                </div>
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '12px' }}>
              <span style={{ color: '#64748b', fontWeight: '500' }}>Total Amount</span>
              <strong style={{ fontSize: '1.25rem', color: '#0f172a' }}>₹{(bookingDetails.totalAmount || bookingDetails.totalPrice)?.toLocaleString()}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            <button
              onClick={() => setPaymentMethod('card')}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '7px', background: paymentMethod === 'card' ? 'white' : 'transparent', color: paymentMethod === 'card' ? '#0f172a' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: paymentMethod === 'card' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
            ><CreditCard size={18} /> Card</button>
            <button
              onClick={() => setPaymentMethod('scanner')}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '7px', background: paymentMethod === 'scanner' ? 'white' : 'transparent', color: paymentMethod === 'scanner' ? '#0f172a' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: paymentMethod === 'scanner' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
            ><SmartphoneNfc size={18} /> UPI / QR</button>
          </div>

          {paymentMethod === 'card' ? (
            <div style={{ display: 'grid', gap: '16px', textAlign: 'left' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Cardholder Name</label>
                <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#cbd5e1'} />
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '4px 0' }}>

              {/* Instruction */}
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', textAlign: 'center' }}>
                Scan with any UPI app &nbsp;(GPay, PhonePe, Paytm…)
              </p>

              {/* QR Code box */}
              <div style={{
                background: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}>
                {/* Payee avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: '700', fontSize: '1rem'
                  }}>T</div>
                  <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>TravelSphere</span>
                </div>

                {/* Actual QR code */}
                <QRCodeSVG
                  value={`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${totalAmt}&cu=INR&tn=${encodeURIComponent('Hotel Booking - TravelSphere')}`}
                  size={200}
                  level="H"
                  includeMargin={false}
                  style={{ borderRadius: '8px' }}
                />

                {/* UPI ID row */}
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

                {/* Amount highlight */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '8px 20px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#065f46', display: 'block' }}>Amount to pay</span>
                  <strong style={{ fontSize: '1.3rem', color: '#059669' }}>₹{totalAmt?.toLocaleString()}</strong>
                </div>

                {/* Automatic Payment Detector Status */}
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: paymentVerified ? '#bbf7d0' : '#bae6fd',
                  background: paymentVerified ? '#f0fdf4' : '#f0f9ff',
                  color: paymentVerified ? '#15803d' : '#0369a1',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s'
                }}>
                  {verifyingPayment ? (
                    <>
                      <RefreshCcw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Waiting for payment detection...</span>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: '#0284c7', fontWeight: 'normal', marginTop: '2px' }}>Please scan and pay using your mobile app.</span>
                      </div>
                    </>
                  ) : paymentVerified ? (
                    <>
                      <CheckCircle2 size={18} />
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Payment Verified!</span>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: '#16a34a', fontWeight: 'normal', marginTop: '2px' }}>Mock UPI Ref: TXN{Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                    </>
                  ) : null}
                </div>

                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                  Scan to pay with any UPI app
                </p>
              </div>

              {/* UPI app icons row */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', opacity: 0.7 }}>
                {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                  <span key={app} style={{ fontSize: '0.7rem', color: '#64748b', background: '#f1f5f9', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>{app}</span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={confirmBooking}
            disabled={bookingLoading || (paymentMethod === 'scanner' && !paymentVerified)}
            style={{
              width: '100%', padding: '16px',
              background: paymentMethod === 'scanner'
                ? (paymentVerified ? 'linear-gradient(135deg,#10b981,#059669)' : '#94a3b8')
                : '#0f172a',
              color: 'white',
              border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem',
              cursor: (bookingLoading || (paymentMethod === 'scanner' && !paymentVerified)) ? 'not-allowed' : 'pointer',
              marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.3s',
              opacity: (bookingLoading || (paymentMethod === 'scanner' && !paymentVerified)) ? 0.7 : 1,
              boxShadow: paymentMethod === 'scanner' && paymentVerified ? '0 4px 14px rgba(16,185,129,0.35)' : 'none',
            }}
          >
            {bookingLoading ? (
              <><RefreshCcw size={20} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
            ) : paymentMethod === 'scanner' ? (
              <><CheckCircle2 size={20} /> I've Paid — Confirm Booking</>
            ) : (
              `Pay ₹${totalAmt?.toLocaleString()}`
            )}
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {isBooked && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 3000,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'grid', placeItems: 'center', padding: '20px'
        }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '400px', width: '100%', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ width: '80px', height: '80px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'white' }}>
              <CheckCircle2 size={40} />
            </div>
            <h3 style={{ fontSize: '24px', color: '#0f172a', marginBottom: '12px', marginTop: 0 }}>Booking Confirmed!</h3>
            <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: '1.6' }}>
              Your {isHotel ? `stay at ${bookingDetails.hotelName}` : `trip to ${bookingDetails.destination}`} has been successfully booked. Check your email for details.
            </p>
            <Link to={isHotel ? "/hotels" : "/explore"} style={{ display: 'inline-block', width: '100%', padding: '14px', background: '#f1f5f9', color: '#0f172a', textDecoration: 'none', borderRadius: '12px', fontWeight: '600' }}>
              Back to {isHotel ? "Hotels" : "Explore"}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default PaymentPage;
