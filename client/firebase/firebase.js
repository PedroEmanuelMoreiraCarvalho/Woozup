import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApy5idHwCS_OxYafz5h3liGFJ7CHqF1wU",
  authDomain: "woozup.firebaseapp.com",
  projectId: "woozup",
  storageBucket: "woozup.appspot.com",
  messagingSenderId: "946361456900",
  appId: "1:946361456900:web:5629ba1a9406aa68aed851",
  measurementId: "G-60MLLY9ZGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)