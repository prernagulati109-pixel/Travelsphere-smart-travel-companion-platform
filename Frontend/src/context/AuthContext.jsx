import { createContext, useContext, useState } from 'react';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth } from "../firebase";

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

    const result =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    const u = {
      email:
      result.user.email
    };

    setUser(u);

    sessionStorage.setItem(
      "travelsphere_user",
      JSON.stringify(u)
    );

    return u;
  };


  // REGISTER

  const register =
  async (
    name,
    email,
    password
  ) => {

    const result =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const u = {
      name,
      email:
      result.user.email
    };

    setUser(u);

    sessionStorage.setItem(
      "travelsphere_user",
      JSON.stringify(u)
    );

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