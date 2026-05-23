import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    price: '',
    duration: '',
    description: '',
    availableSeats: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await adminApi.getPackages();
      if (data.success) {
        setPackages(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id) => {
    if (window.confirm("Are you sure you want to delete this travel package?")) {
      try {
        await adminApi.deletePackage(id);
        fetchPackages();
      } catch (error) {
        console.error("Failed to delete package", error);
      }
    }
  };

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        title: pkg.title || '',
        destination: pkg.destination || '',
        price: pkg.price || '',
        duration: pkg.duration || '',
        description: pkg.description || '',
        availableSeats: pkg.availableSeats || ''
      });
    } else {
      setEditingPackage(null);
      setFormData({ title: '', destination: '', price: '', duration: '', description: '', availableSeats: '' });
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
      let image = editingPackage?.image || '';

      if (imageFile) {
        const imageRef = ref(storage, `packages/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        image = await getDownloadURL(imageRef);
      }

      const packageData = {
        ...formData,
        price: Number(formData.price),
        availableSeats: Number(formData.availableSeats || 10),
        image
      };

      if (editingPackage) {
        await adminApi.updatePackage(editingPackage._id, packageData);
      } else {
        await adminApi.createPackage(packageData);
      }

      setIsModalOpen(false);
      fetchPackages();
    } catch (error) {
      console.error("Failed to save package:", error);
      alert("Failed to save package.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Packages</h1>
          <p className="text-sm text-gray-500">Manage all travel and tour packages.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add New Package
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Package</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Destination</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
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
              ) : packages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No packages found. Add your first travel package!
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                          {pkg.image ? (
                            <img src={pkg.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div className="font-medium text-gray-900">{pkg.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{pkg.price?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openModal(pkg)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors tooltip"
                        title="Edit Package"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deletePackage(pkg._id)}
                        className="text-red-600 hover:text-red-900 transition-colors tooltip"
                        title="Delete Package"
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

      {/* Add/Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingPackage ? 'Edit Package' : 'Add New Package'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
                <input 
                  type="text" required
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input 
                  type="text" required
                  value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    type="number" required
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                  <input 
                    type="number"
                    value={formData.availableSeats} onChange={(e) => setFormData({...formData, availableSeats: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g. 5 Days / 4 Nights)</label>
                <input 
                  type="text" required
                  value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  required rows="3"
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Image</label>
                <input 
                  type="file" accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
                {editingPackage?.image && !imageFile && (
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
                  {uploading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageManagement;
