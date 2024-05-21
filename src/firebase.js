// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZadI3EDBQfoQMB8hA3XRkL_RzSl7kgIM",
  authDomain: "image-1f3bf.firebaseapp.com",
  projectId: "image-1f3bf",
  storageBucket: "image-1f3bf.appspot.com",
  messagingSenderId: "257353217561", 
  appId: "1:257353217561:web:a6546a4251205354bc1c88" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);