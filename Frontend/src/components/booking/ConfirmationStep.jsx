import React, { useEffect, useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { Download, Share2, CheckCircle } from 'lucide-react';

export default function ConfirmationStep() {
  const { bookingState, closeBooking } = useBooking();
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    // Generate random booking ID
    const id = 'TS' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setBookingId(id);
  }, []);

  return (
    <div className="booking-step text-center py-8">
      <div className="flex justify-center mb-6">
        <svg className="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path className="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
      </div>

      <h3 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
      <p className="text-slate-500 mb-8">Your {bookingState.flowType?.toLowerCase() || 'travel'} has been successfully booked.</p>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-sm mx-auto mb-8">
        <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-1">Booking ID</p>
        <p className="text-2xl font-black text-blue-600 tracking-wider m-0">{bookingId}</p>
      </div>

      <div className="flex justify-center gap-4">
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all">
          <Download size={18} /> Ticket
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all">
          <Download size={18} /> Invoice
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all">
          <Share2 size={18} /> Share
        </button>
      </div>

      <div className="mt-12">
        <button 
          onClick={closeBooking}
          className="text-blue-600 font-bold hover:underline"
        >
          Return to home
        </button>
      </div>
    </div>
  );
}
