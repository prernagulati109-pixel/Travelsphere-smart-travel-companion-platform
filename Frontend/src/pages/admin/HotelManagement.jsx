import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    pricePerNight: '',
    rating: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const data = await adminApi.getHotels();
      if (data.success) {
        setHotels(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch hotels", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHotel = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await adminApi.deleteHotel(id);
        fetchHotels();
      } catch (error) {
        console.error("Failed to delete hotel", error);
      }
    }
  };

  const openModal = (hotel = null) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData({
        name: hotel.name || '',
        location: hotel.location || '',
        pricePerNight: hotel.pricePerNight || '',
        rating: hotel.rating || '',
        description: hotel.description || ''
      });
    } else {
      setEditingHotel(null);
      setFormData({ name: '', location: '', pricePerNight: '', rating: '', description: '' });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingHotel?.imageUrl || '';

      if (imageFile) {
        const imageRef = ref(storage, `hotels/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const hotelData = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        rating: Number(formData.rating),
        imageUrl
      };

      if (editingHotel) {
        await adminApi.updateHotel(editingHotel._id, hotelData);
      } else {
        await adminApi.createHotel(hotelData);
      }

      setIsModalOpen(false);
      fetchHotels();
    } catch (error) {
      console.error("Failed to save hotel:", error);
      alert("Failed to save hotel.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Hotel Management</h1>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add New Hotel
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hotel</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (per night)</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
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
              ) : hotels.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No hotels found. Add your first hotel!
                  </td>
                </tr>
              ) : (
                hotels.map((hotel) => (
                  <tr key={hotel._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                          {hotel.imageUrl ? (
                            <img src={hotel.imageUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div className="font-medium text-gray-900">{hotel.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hotel.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{hotel.pricePerNight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {hotel.rating || 'N/A'} ★
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openModal(hotel)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteHotel(hotel._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Hotel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" required
                  value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night (₹)</label>
                  <input 
                    type="number" required
                    value={formData.pricePerNight} onChange={(e) => setFormData({...formData, pricePerNight: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input 
                    type="number" step="0.1" max="5" min="1"
                    value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Image</label>
                <input 
                  type="file" accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
                {editingHotel?.imageUrl && !imageFile && (
                  <p className="mt-1 text-xs text-gray-500">Current image will be kept if no new file is selected.</p>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-70"
                >
                  {uploading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : 'Save Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;
