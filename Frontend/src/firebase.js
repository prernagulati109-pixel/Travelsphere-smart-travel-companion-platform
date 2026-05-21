import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
<<<<<<< HEAD
=======
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
>>>>>>> 22c89fe (first commit)

const firebaseConfig = {
  apiKey: "AIzaSyBson6HKnEOvtNm8D3R6QEDKwSnwkco7Ho",
  authDomain: "travelsphere-544e3.firebaseapp.com",
  projectId: "travelsphere-544e3",
  storageBucket: "travelsphere-544e3.firebasestorage.app",
  messagingSenderId: "999661378570",
  appId: "1:999661378570:web:8180f5f72e221996fad3f3"
};

const app = initializeApp(firebaseConfig);

// IMPORTANT
export const auth = getAuth(app);
<<<<<<< HEAD
=======
export const db = getFirestore(app);
export const storage = getStorage(app);
>>>>>>> 22c89fe (first commit)

export default app;