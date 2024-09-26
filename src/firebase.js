// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQwJRIJSCL_HWM4KJO9_FPLVIal6VfeXs",
  authDomain: "chat-app-ea7c8.firebaseapp.com",
  projectId: "chat-app-ea7c8",
  storageBucket: "chat-app-ea7c8.appspot.com",
  messagingSenderId: "621522370059",
  appId: "1:621522370059:web:bf304902f173462ece910e",
  measurementId: "G-ZZ8E2MF7XR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase

// Initialize Firestore (this part is missing from your setup)
const db = getFirestore(app);

export { db };