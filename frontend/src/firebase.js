// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdb4DkZB0Svwyhobwwsxkw_aURo2vrpYo",
  authDomain: "uniconnect-5d6ba.firebaseapp.com",
  projectId: "uniconnect-5d6ba",
  storageBucket: "uniconnect-5d6ba.firebasestorage.app",
  messagingSenderId: "616699197236",
  appId: "1:616699197236:web:03c4d776c4ad3636465761",
  measurementId: "G-7N353ZCGTQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;