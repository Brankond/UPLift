// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD6MDdzwdOFHwfrwQ8vFFVSmGrlMSabcaw',
  authDomain: 'uplift-51d7d.firebaseapp.com',
  projectId: 'uplift-51d7d',
  storageBucket: 'uplift-51d7d.appspot.com',
  messagingSenderId: '889460196170',
  appId: '1:889460196170:web:d548491b6b6dd5f84577b3',
  measurementId: 'G-B9H4TP3ZNX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// firestore
export const db = getFirestore(app);

// authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
