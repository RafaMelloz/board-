// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "boardplus-e9b99.firebaseapp.com",
    projectId: "boardplus-e9b99",
    storageBucket: "boardplus-e9b99.appspot.com",
    messagingSenderId: "469690005717",
    appId: "1:469690005717:web:4d9f5d73c1de2ed051ca5c"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };