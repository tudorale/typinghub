import firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBPuJnN5gI3o_YZeVNlZwOky-7Y6LDGrTI",
    authDomain: "justtype-preview.firebaseapp.com",
    projectId: "justtype-preview",
    storageBucket: "justtype-preview.appspot.com",
    messagingSenderId: "648878251377",
    appId: "1:648878251377:web:e42775dc14919b1475ead0"
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export default fire;
