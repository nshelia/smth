import firebase from 'firebase/compat/app'
import "firebase/compat/firestore"
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBARbKoiif8qvZIJYfNDJQKjDQZ7OwwOpg",
  authDomain: "hackproject-27248.firebaseapp.com",
  projectId: "hackproject-27248",
  storageBucket: "hackproject-27248.appspot.com",
  messagingSenderId: "1083847045054",
  appId: "1:1083847045054:web:3eb8759e75699eed6713ef",
  measurementId: "G-S31NBXT9RX"
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);

export const storage = getStorage();

export const storageRef = ref(storage);

export const userImagesRef = ref(storageRef, 'images');

export const db = firebase.firestore()

export const auth = getAuth(app);
