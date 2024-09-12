import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7DY8nV_CUHWNCUHCj7BI2aaOfrXyxYzE",
  authDomain: "dcompetition-a6067.firebaseapp.com",
  projectId: "dcompetition-a6067",
  storageBucket: "dcompetition-a6067.appspot.com",
  messagingSenderId: "383832873244",
  appId: "1:383832873244:web:a715c132cfc35aea5382d9"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export { collection, addDoc };
