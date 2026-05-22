import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { MapPin } from 'lucide-react';

export default function BookingSummaryStep() {
  const { bookingState } = useBooking();
  const { item, passengerDetails, seatSelection, addOns, flowType } = bookingState;

  const getBasePrice = () => {
    return item?.price || 0;
  };

  const getAddonsTotal = () => {
    return Object.values(addOns || {}).reduce((total, addon) => total + addon.price, 0);
  };

  const basePrice = getBasePrice();
  const addonsTotal = getAddonsTotal();
  const taxes = Math.round((basePrice + addonsTotal) * 0.18); // 18% GST
  const grandTotal = basePrice + addonsTotal + taxes;

  return (
    <div className="booking-step">
      <h3 className="booking-step-title">Review Your Booking</h3>
      <p className="booking-step-desc">Please confirm your details before making the payment.</p>

      <div className="summary-box">
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-200">
          <div>
            <h4 className="font-bold text-lg text-slate-800 m-0">{item?.name || 'Booking Service'}</h4>
            <p className="text-sm text-slate-500 m-0">{item?.type || flowType}</p>
          </div>
          <div className="text-right">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {flowType}
            </span>
          </div>
        </div>

        {passengerDetails?.fullName && (
          <div className="mb-4">
            <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Passenger Info</h5>
            <p className="text-sm text-slate-700 font-medium m-0">{passengerDetails.fullName} ({passengerDetails.gender}, {passengerDetails.age})</p>
            <p className="text-xs text-slate-500 m-0">{passengerDetails.email} • {passengerDetails.phone}</p>
          </div>
        )}

        {seatSelection && seatSelection.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Seat Details</h5>
            <p className="text-sm text-slate-700 font-medium m-0">Seat(s): {seatSelection.join(', ')}</p>
          </div>
        )}

        {Object.values(addOns || {}).length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Selected Add-ons</h5>
            {Object.values(addOns).map(addon => (
              <div key={addon.id} className="flex justify-between text-sm text-slate-700 mb-1">
                <span>{addon.title}</span>
                <span>₹{addon.price}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200">
          <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Fare Breakdown</h5>
          <div className="summary-row">
            <span>Base Fare</span>
            <span>₹{basePrice.toLocaleString()}</span>
          </div>
          {addonsTotal > 0 && (
            <div className="summary-row">
              <span>Add-ons Total</span>
              <span>₹{addonsTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Taxes & GST (18%)</span>
            <span>₹{taxes.toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>Grand Total</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
