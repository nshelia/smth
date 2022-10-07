import firebase from 'firebase/compat/app'
import "firebase/compat/firestore"
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCASy1o1yXI4pYVUAA-1yn30xyzDqS5JAw",
  authDomain: "test-mk1-48d35.firebaseapp.com",
  projectId: "test-mk1-48d35",
  storageBucket: "test-mk1-48d35.appspot.com",
  messagingSenderId: "802245752773",
  appId: "1:802245752773:web:c33c162b7ca215cb4a3dac"
};


// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);



export const storage = getStorage();

export const storageRef = ref(storage);

export const userImagesRef = ref(storageRef, 'images');

export const db = firebase.firestore()

export const auth = getAuth(app);
