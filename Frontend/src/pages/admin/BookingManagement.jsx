import React, { useState, useEffect } from 'react';
import { CalendarDays, CheckCircle, XCircle, Eye, Search, Loader2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Mock data if API is not fully ready
  const mockBookings = [
    { _id: 'b1', user: { name: 'John Doe', email: 'john@example.com' }, hotel: { name: 'Taj Palace' }, checkIn: '2023-08-15', checkOut: '2023-08-18', amount: 45000, status: 'pending' },
    { _id: 'b2', user: { name: 'Jane Smith', email: 'jane@example.com' }, hotel: { name: 'Goa Marriott' }, checkIn: '2023-09-10', checkOut: '2023-09-15', amount: 65000, status: 'approved' },
    { _id: 'b3', user: { name: 'Bob Johnson', email: 'bob@example.com' }, hotel: { name: 'Rambagh Palace' }, checkIn: '2023-07-20', checkOut: '2023-07-22', amount: 30000, status: 'cancelled' },
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await adminApi.getBookings(); // Adjust to your actual API call
        if (data && data.success) {
          setBookings(data.data);
        } else {
          setBookings(mockBookings);
        }
      } catch (error) {
        console.error("Failed to fetch bookings", error);
        setBookings(mockBookings);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    if (window.confirm(`Are you sure you want to ${newStatus} this booking?`)) {
      try {
        // Mocking action
        setBookings(bookings.map(b => 
          b._id === bookingId ? { ...b, status: newStatus } : b
        ));
        
        // Real API call here: await adminApi.updateBookingStatus(bookingId, newStatus);
      } catch (error) {
        console.error(`Failed to update booking status`, error);
      }
    }
  };

  const filteredBookings = bookings.filter(booking => 
    booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    booking.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-sm text-gray-500">View and manage all customer bookings.</p>
        </div>
        
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest & Hotel</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{booking.user?.name}</div>
                      <div className="text-sm text-gray-500">{booking.hotel?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>In: {new Date(booking.checkIn).toLocaleDateString()}</div>
                      <div>Out: {new Date(booking.checkOut).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{booking.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(booking._id, 'approved')}
                              className="rounded-lg p-2 text-green-600 hover:bg-green-50 tooltip" title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(booking._id, 'cancelled')}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50 tooltip" title="Cancel"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 tooltip" title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Guest Information</h3>
                <p className="mt-1 font-medium text-gray-900">{selectedBooking.user?.name}</p>
                <p className="text-sm text-gray-600">{selectedBooking.user?.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Hotel Information</h3>
                <p className="mt-1 font-medium text-gray-900">{selectedBooking.hotel?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Check-in</h3>
                  <p className="mt-1 text-gray-900">{new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Check-out</h3>
                  <p className="mt-1 text-gray-900">{new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Amount</h3>
                <p className="mt-1 text-xl font-bold text-gray-900">₹{selectedBooking.amount?.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
