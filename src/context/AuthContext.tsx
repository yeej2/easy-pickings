import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../services/firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User,
  } from 'firebase/auth';
 

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return unsubscribe;
    }, []);
  
    const login = async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    };
  
    const register = async (email: string, password: string) => {
      await createUserWithEmailAndPassword(auth, email, password);
    };
  
    const logout = async () => {
      await signOut(auth);
    };
  
    return (
      <AuthContext.Provider value={{ user, login, logout, register }}> {/* ✅ include register */}
        {children}
      </AuthContext.Provider>
    );
  };
  
export const useAuth = () => useContext(AuthContext);
