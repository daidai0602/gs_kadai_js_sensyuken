// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwM9RYvrQ9qaUo2PTrSCf_fjIRLFaRbtU",
  authDomain: "chatapplication-with-cha-27086.firebaseapp.com",
  projectId: "chatapplication-with-cha-27086",
  storageBucket: "chatapplication-with-cha-27086.appspot.com",
  messagingSenderId: "731148394334",
  appId: "1:731148394334:web:5e828b1faf849b8111f9cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);