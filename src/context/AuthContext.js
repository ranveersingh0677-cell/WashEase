import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with Email
  const signup = async (email, password, name, phone) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    // Save to Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      phone,
      email,
      role: 'customer',
      createdAt: new Date().toISOString()
    });

    const profileData = { name, phone, email, role: 'customer' };
    localStorage.setItem('washEaseUser', JSON.stringify(profileData));
    setUserData(profileData);
    return user;
  };

  // Login with Email
  const loginWithEmail = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    await fetchAndSetUserData(res.user.uid);
    return res.user;
  };

  // Phone Login Setup
  const setupRecaptcha = (containerId) => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      'size': 'normal',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    return window.recaptchaVerifier;
  };

  const loginWithPhone = (phoneNumber, appVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('washEaseUser');
    setUserData(null);
    return signOut(auth);
  };

  // Fetch user data from Firestore
  const fetchAndSetUserData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        localStorage.setItem('washEaseUser', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Try to get from localStorage first for speed
        const cached = localStorage.getItem('washEaseUser');
        if (cached) {
          setUserData(JSON.parse(cached));
        } else {
          await fetchAndSetUserData(user.uid);
        }
      } else {
        setUserData(null);
        localStorage.removeItem('washEaseUser');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    loginWithEmail,
    setupRecaptcha,
    loginWithPhone,
    logout,
    fetchAndSetUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
