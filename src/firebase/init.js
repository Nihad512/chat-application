// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNN0Acyu0w2GW3As6PgcRp1zKKu8Li294",
  authDomain: "chat-application-1a606.firebaseapp.com",
  projectId: "chat-application-1a606",
  storageBucket: "chat-application-1a606.appspot.com",
  messagingSenderId: "405930942526",
  appId: "1:405930942526:web:ff60a53481b18fd96eb16f",
  measurementId: "G-ML27XTH75W"
};

// Initialize Firebase
initializeApp(firebaseConfig)
export const db= getFirestore()