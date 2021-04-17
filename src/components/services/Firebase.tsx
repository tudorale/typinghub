import firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";


const firebaseConfig = {
   // not allowed for you
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export default fire;
