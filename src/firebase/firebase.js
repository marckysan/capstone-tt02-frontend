import firebase from "firebase/compat/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDY5_Z80ttqGOetr5jjCUeJbYYQXCw06Qc",
    authDomain: "capstone-fe.firebaseapp.com",
    projectId: "capstone-fe",
    storageBucket: "capstone-fe.appspot.com",
    messagingSenderId: "185196815190",
    appId: "1:185196815190:web:35c51f46c15efb5c092cf7",
    measurementId: "G-LRK3BVSCYJ"
};

firebase.initializeApp(firebaseConfig);

export const firebaseStorage = getStorage(firebase);