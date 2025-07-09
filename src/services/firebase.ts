// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_MHNmr4fQqnH05hND-mOzbGH9iCrvkUA",
  authDomain: "easy-pickings.firebaseapp.com",
  projectId: "easy-pickings",
  storageBucket: "easy-pickings.firebasestorage.app",
  messagingSenderId: "644579920111",
  appId: "1:644579920111:web:38304d37e10a1f3eb3331a",
  measurementId: "G-VPV9KW8HBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);