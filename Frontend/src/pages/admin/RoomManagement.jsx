import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    hotelId: '',
    title: '',
    price: '',
    maxPeople: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, hotelsRes] = await Promise.all([
        adminApi.getRooms(),
        adminApi.getHotels()
      ]);
      
      if (roomsRes.success) setRooms(roomsRes.data);
      if (hotelsRes.success) setHotels(hotelsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await adminApi.deleteRoom(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete room", error);
      }
    }
  };

  const openModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        hotelId: room.hotelId?._id || room.hotelId || '',
        title: room.title || '',
        price: room.price || '',
        maxPeople: room.maxPeople || '',
        description: room.description || ''
      });
    } else {
      setEditingRoom(null);
      setFormData({ hotelId: hotels.length > 0 ? hotels[0]._id : '', title: '', price: '', maxPeople: '', description: '' });
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
      let imageUrl = editingRoom?.imageUrl || '';

      if (imageFile) {
        const imageRef = ref(storage, `rooms/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const roomData = {
        ...formData,
        price: Number(formData.price),
        maxPeople: Number(formData.maxPeople),
        imageUrl
      };

      if (editingRoom) {
        await adminApi.updateRoom(editingRoom._id, roomData);
      } else {
        await adminApi.createRoom(roomData);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save room:", error);
      alert("Failed to save room.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add New Room
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hotel</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price/Night</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
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
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No rooms found. Add a room to a hotel!
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                          {room.imageUrl ? (
                            <img src={room.imageUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div className="font-medium text-gray-900">{room.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.hotelId?.name || 'Unknown Hotel'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{room.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Max {room.maxPeople} Person(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openModal(room)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteRoom(room._id)}
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

      {/* Add/Edit Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Hotel</label>
                <select 
                  required
                  value={formData.hotelId} 
                  onChange={(e) => setFormData({...formData, hotelId: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="" disabled>Select a hotel...</option>
                  {hotels.map(h => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Title</label>
                <input 
                  type="text" required placeholder="e.g. Deluxe Double Room"
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night (₹)</label>
                  <input 
                    type="number" required
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                  <input 
                    type="number" required min="1"
                    value={formData.maxPeople} onChange={(e) => setFormData({...formData, maxPeople: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Image</label>
                <input 
                  type="file" accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
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
                  disabled={uploading || !formData.hotelId}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-70"
                >
                  {uploading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
