import { auth } from '../firebase';

const BASE_URL = 'http://localhost:5000/api/admin';

const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const adminApi = {
  // Stats
  getStats: async () => {
    const res = await fetch(`${BASE_URL}/stats`, { headers: await getAuthHeaders() });
    return res.json();
  },

  // Hotels
  getHotels: async () => {
    const res = await fetch(`${BASE_URL}/hotels`, { headers: await getAuthHeaders() });
    return res.json();
  },
  createHotel: async (data) => {
    const res = await fetch(`${BASE_URL}/hotels`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateHotel: async (id, data) => {
    const res = await fetch(`${BASE_URL}/hotels/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteHotel: async (id) => {
    const res = await fetch(`${BASE_URL}/hotels/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    return res.json();
  },

  // Rooms
  getRooms: async () => {
    const res = await fetch(`${BASE_URL}/rooms`, { headers: await getAuthHeaders() });
    return res.json();
  },
  createRoom: async (data) => {
    const res = await fetch(`${BASE_URL}/rooms`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateRoom: async (id, data) => {
    const res = await fetch(`${BASE_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteRoom: async (id) => {
    const res = await fetch(`${BASE_URL}/rooms/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    return res.json();
  },

  // Users
  getUsers: async () => {
    const res = await fetch(`${BASE_URL}/users`, { headers: await getAuthHeaders() });
    return res.json();
  },
  deleteUser: async (id) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    return res.json();
  },
  banUser: async (id, isBanned) => {
    const res = await fetch(`${BASE_URL}/users/${id}/ban`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ isBanned })
    });
    return res.json();
  },

  // Bookings
  getBookings: async () => {
    const res = await fetch(`${BASE_URL}/bookings`, { headers: await getAuthHeaders() });
    return res.json();
  },
  updateBooking: async (id, statusData) => {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(statusData)
    });
    return res.json();
  }
};
