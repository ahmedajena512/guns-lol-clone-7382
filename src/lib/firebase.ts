import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your Firebase project configuration
// Get these from: console.firebase.google.com -> Project Settings
const firebaseConfig = {
    apiKey: "AIzaSyAxszsKynG_DDuS_Yy4lfUi23fR7d9Z53Q",
    authDomain: "ahmedaj-portfolio.firebaseapp.com",
    projectId: "ahmedaj-portfolio",
    storageBucket: "ahmedaj-portfolio.firebasestorage.app",
    messagingSenderId: "794862394682",
    appId: "1:794862394682:web:7e231a91cc762a424bc403"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
