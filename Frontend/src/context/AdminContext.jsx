import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AdminContext = createContext();

export const useAdmin = () => {
  return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Check if user is in 'users' collection with role 'admin'
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setCurrentAdmin({ uid: user.uid, email: user.email, ...userDoc.data() });
          } else {
            // If logged in via firebase but not an admin, sign out immediately
            await signOut(auth);
            setCurrentAdmin(null);
          }
        } else {
          setCurrentAdmin(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setCurrentAdmin(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const loginAdmin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        await signOut(auth);
        throw new Error('User is not an administrator.');
      }
      
      // Immediately set the current admin to avoid race conditions
      setCurrentAdmin({ uid: user.uid, email: user.email, ...userDoc.data() });
      
      return true;
    } catch (error) {
      console.error("Admin login error:", error);
      throw error;
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      setCurrentAdmin(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    currentAdmin,
    loading,
    loginAdmin,
    logoutAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </AdminContext.Provider>
  );
};
