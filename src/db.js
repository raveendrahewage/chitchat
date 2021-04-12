import firebase from "firebase/app";
import "firebase/database";

const config = {
    apiKey: "AIzaSyAeFDCvU1sBbgOq8E9t6JFwLPc_iaK-kgA",
    authDomain: "chitchat-a63f5.firebaseapp.com",
    projectId: "chitchat-a63f5",
    storageBucket: "chitchat-a63f5.appspot.com",
    messagingSenderId: "505396042354",
    appId: "1:505396042354:web:771406fbde9f997c8d00eb"
}

const db = firebase.initializeApp(config);
export default db;