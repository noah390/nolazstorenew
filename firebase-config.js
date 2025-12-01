// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI7AyVosXpbQGydrGGRqbhysKGGVg3M0c",
  authDomain: "nolaz-blog.firebaseapp.com",
  projectId: "nolaz-blog",
  storageBucket: "nolaz-blog.firebasestorage.app",
  messagingSenderId: "28266143574",
  appId: "1:28266143574:web:e12d67979e07fc95e8c0f7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
window.auth = auth;
window.db = db;