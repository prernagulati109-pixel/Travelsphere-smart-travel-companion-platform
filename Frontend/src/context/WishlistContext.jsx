import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5000/api/wishlist';

const WishlistContext = createContext({
  wishlist: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
  loading: false
});

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${user.id}`);
      setWishlist(response.data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (item) => {
    if (!user) {
      alert('Please login to save to wishlist');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/toggle`, {
        userId: user.id,
        item
      });
      if (response.data.success) {
        setWishlist(response.data.items);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const isInWishlist = (id, type) => {
    return wishlist.some(i => String(i.id) === String(id) && i.type === type);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}
