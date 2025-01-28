// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCVjdLLfh844_1KRhqN2Fd8miz7dRVVwVY",
    authDomain: "studentsphere-64dff.firebaseapp.com",
    projectId: "studentsphere-64dff",
    storageBucket: "studentsphere-64dff.firebasestorage.app",
    messagingSenderId: "1051413047039",
    appId: "1:1051413047039:web:112108761f68fd91b30eca",
    measurementId: "G-NQPJZ2ESH4"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);//authConfig
export const db = getFirestore(app);//firestoreConfig
