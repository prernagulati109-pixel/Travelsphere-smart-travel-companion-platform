import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  googleLogin: async () => {},
  pendingAction: null,
  setPendingAction: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('travelsphere_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [pendingAction, setPendingAction] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.success) {
        const u = response.data.user;
        setUser(u);
        sessionStorage.setItem('travelsphere_user', JSON.stringify(u));
        return u;
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password });
      if (response.data.success) {
        const u = response.data.user;
        setUser(u);
        sessionStorage.setItem('travelsphere_user', JSON.stringify(u));
        return u;
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('travelsphere_user');
  };

  const googleLogin = async (name, email) => {
    // For google login, we'll auto-register or login on the backend
    try {
      const response = await axios.post(`${API_URL}/register`, { 
        name, 
        email, 
        password: 'google-auth-placeholder' // In a real app, use OAuth tokens
      });
      const u = response.data.user || { name, email, isAdmin: false };
      setUser(u);
      sessionStorage.setItem('travelsphere_user', JSON.stringify(u));
      return u;
    } catch (error) {
      // If user exists, try to login or just set user
      const u = { name, email, isAdmin: false };
      setUser(u);
      sessionStorage.setItem('travelsphere_user', JSON.stringify(u));
      return u;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout, googleLogin, pendingAction, setPendingAction }}>
      {children}
    </AuthContext.Provider>
  );
}
