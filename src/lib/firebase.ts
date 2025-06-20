
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs6LA4s4C6k0Hr2jnJ4SHe_25so_XadYg",
  authDomain: "ticket-app-2d5a7.firebaseapp.com",
  projectId: "ticket-app-2d5a7",
  storageBucket: "ticket-app-2d5a7.firebasestorage.app",
  messagingSenderId: "791293747687",
  appId: "1:791293747687:web:abce8345f52eda5e275d42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);