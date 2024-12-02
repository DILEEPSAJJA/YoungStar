import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAEUxE9ooExtSIA4pEXh3XFtJV8Nd4Lnng",
    authDomain: "getogether-d2297.firebaseapp.com",
    projectId: "getogether-d2297",
    storageBucket: "getogether-d2297.firebasestorage.app",
    messagingSenderId: "698835239891",
    appId: "1:698835239891:web:3ab77d2b2a332e2a44e526"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };