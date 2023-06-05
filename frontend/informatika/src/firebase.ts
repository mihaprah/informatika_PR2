// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDoPVLwcGhMm6HUnpzWh3LtzDZ0BWAs2OQ",
    authDomain: "informatika-97440.firebaseapp.com",
    projectId: "informatika-97440",
    storageBucket: "informatika-97440.appspot.com",
    messagingSenderId: "763980465772",
    appId: "1:763980465772:web:29c77db4210b81f690ba49"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;