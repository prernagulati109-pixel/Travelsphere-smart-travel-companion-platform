import { createContext, useContext, useState } from 'react';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
    const saved =
      sessionStorage.getItem(
        'travelsphere_user'
      );

    return saved
      ? JSON.parse(saved)
      : null;
  });

  const [pendingAction,
    setPendingAction] =
    useState(null);


  // LOGIN

  const login = async (
    email,
    password
  ) => {

    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user is an admin
    let isAdmin = false;
    let role = 'user';
    try {
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        isAdmin = true;
        role = 'admin';
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
    }

    const u = {
      email: result.user.email,
      uid: result.user.uid,
      isAdmin,
      role
    };

    setUser(u);
    sessionStorage.setItem("travelsphere_user", JSON.stringify(u));
    return u;
  };


  // REGISTER

  const register =
  async (
    name,
    email,
    password
  ) => {
    // Create auth user first
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Prepare user object and set it immediately so UI reflects logged-in state
    const u = {
      name,
      email: result.user.email,
      uid: result.user.uid,
      isAdmin: false,
      role: 'user'
    };

    setUser(u);
    sessionStorage.setItem("travelsphere_user", JSON.stringify(u));

    // Save default user role in Firestore (best-effort). If it fails, log error but do not block user login.
    try {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name,
        email: result.user.email,
        role: 'user',
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error saving user to Firestore (non-blocking):", err);
    }

    return u;
  };


  // LOGOUT

  const logout =
  async () => {

    await signOut(auth);

    setUser(null);

    sessionStorage.removeItem(
      "travelsphere_user"
    );

  };


  // GOOGLE LOGIN MOCK
  const googleLogin =
  async (name,email)=>{

    const u={
      name,
      email
    };

    setUser(u);

    sessionStorage.setItem(
      "travelsphere_user",
      JSON.stringify(u)
    );

    return u;
  };


  return (

    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        googleLogin,
        pendingAction,
        setPendingAction
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}