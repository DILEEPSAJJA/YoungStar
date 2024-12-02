// firebase.js
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyAEUxE9ooExtSIA4pEXh3XFtJV8Nd4Lnng",
    authDomain: "getogether-d2297.firebaseapp.com",
    projectId: "getogether-d2297",
    storageBucket: "getogether-d2297.firebasestorage.app",
    messagingSenderId: "698835239891",
    appId: "1:698835239891:web:3ab77d2b2a332e2a44e526"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
