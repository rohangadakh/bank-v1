// firebase.ts (or firebaseConfig.ts)
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlnFcl37KjE4gHtWt-JpFxvY5gBeAxo9A",
  authDomain: "management-v2-27-11.firebaseapp.com",
  databaseURL: "https://management-v2-27-11-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "management-v2-27-11",
  storageBucket: "management-v2-27-11.firebasestorage.app",
  messagingSenderId: "500822653027",
  appId: "1:500822653027:web:be629a8fc8cb17269ee056",
  measurementId: "G-FG0F12YHBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the database
const database = getDatabase(app);
export { database };
