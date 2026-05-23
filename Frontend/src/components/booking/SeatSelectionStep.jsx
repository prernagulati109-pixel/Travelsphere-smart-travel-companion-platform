import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';

export default function SeatSelectionStep() {
  const { bookingState, updateData, clearValidationError } = useBooking();
  const [selectedSeats, setSelectedSeats] = useState(bookingState.seatSelection || []);

  const isBus = bookingState.flowType === 'Bus';

  // Mock occupied seats
  const occupiedSeats = ['1A', '1C', '2B', '3A', '4D', '5B', '6C', '7A', '8D', '12B'];

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;
    
    const maxSeats = 1; // Simplify to 1 seat per passenger for now, or could depend on guests
    
    let updated;
    if (selectedSeats.includes(seatId)) {
      updated = selectedSeats.filter(s => s !== seatId);
    } else {
      if (selectedSeats.length >= maxSeats) {
        updated = [seatId];
      } else {
        updated = [...selectedSeats, seatId];
      }
    }
    
    setSelectedSeats(updated);
    updateData('seatSelection', updated);
    if (updated.length) clearValidationError('seatSelection');
  };

  const getSeatClass = (seatId) => {
    if (occupiedSeats.includes(seatId)) return 'occupied';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  // Generate flight layout (e.g. A B - C D)
  const flightRows = 15;
  
  // Generate bus layout (Sleeper/Seater mix logic)
  const busRows = 10;

  return (
    <div className="booking-step">
      <h3 className="booking-step-title">Select Your Seat</h3>
      <p className="booking-step-desc">Choose where you'd like to sit for the journey.</p>

      <div className="seat-map-container">
        <div className="seat-legend">
          <div className="seat-legend-item"><div className="seat-box available"></div> Available</div>
          <div className="seat-legend-item"><div className="seat-box selected"></div> Selected</div>
          <div className="seat-legend-item"><div className="seat-box occupied"></div> Occupied</div>
        </div>

        <div className="seat-grid">
          {isBus ? (
            // Bus Layout (1-2 configuration)
            Array.from({ length: busRows }).map((_, r) => {
              const row = r + 1;
              return (
                <div key={row} className="seat-row">
                  <div className="seat-row-label">{row}</div>
                  <div 
                    className={`seat ${getSeatClass(`${row}A`)}`}
                    onClick={() => handleSeatClick(`${row}A`)}
                  >
                    {row}A
                  </div>
                  <div className="seat-aisle"></div>
                  <div 
                    className={`seat ${getSeatClass(`${row}B`)}`}
                    onClick={() => handleSeatClick(`${row}B`)}
                  >
                    {row}B
                  </div>
                  <div 
                    className={`seat ${getSeatClass(`${row}C`)}`}
                    onClick={() => handleSeatClick(`${row}C`)}
                  >
                    {row}C
                  </div>
                </div>
              );
            })
          ) : (
            // Flight Layout (A B - C D)
            Array.from({ length: flightRows }).map((_, r) => {
              const row = r + 1;
              return (
                <div key={row} className="seat-row">
                  <div className="seat-row-label">{row}</div>
                  <div 
                    className={`seat ${getSeatClass(`${row}A`)}`}
                    onClick={() => handleSeatClick(`${row}A`)}
                  >
                    A
                  </div>
                  <div 
                    className={`seat ${getSeatClass(`${row}B`)}`}
                    onClick={() => handleSeatClick(`${row}B`)}
                  >
                    B
                  </div>
                  <div className="seat-aisle"></div>
                  <div 
                    className={`seat ${getSeatClass(`${row}C`)}`}
                    onClick={() => handleSeatClick(`${row}C`)}
                  >
                    C
                  </div>
                  <div 
                    className={`seat ${getSeatClass(`${row}D`)}`}
                    onClick={() => handleSeatClick(`${row}D`)}
                  >
                    D
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {bookingState.validationErrors?.seatSelection && (
        <span className="text-red-500 text-xs mt-1">{bookingState.validationErrors.seatSelection}</span>
      )}
    </div>
  );
}
