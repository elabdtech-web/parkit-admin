import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDX6Pn7SSNcniNZAG4qz7n7CC5HNrsYx_A",
  authDomain: "parkit-23d8d.firebaseapp.com",
  databaseURL: "https://parkit-23d8d-default-rtdb.firebaseio.com",
  projectId: "parkit-23d8d",
  storageBucket: "parkit-23d8d.firebasestorage.app",
  messagingSenderId: "69889111926",
  appId: "1:69889111926:web:b528379805b4923c0c2c57"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db, app};