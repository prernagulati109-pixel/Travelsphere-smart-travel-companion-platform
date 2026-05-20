import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

export default app;