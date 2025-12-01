// Firebase Configuration Template
// Copy this file to firebase-config.js and replace with your actual Firebase config

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  
  // Initialize services
  if (firebase.auth && firebase.firestore) {
    window.auth = firebase.auth();
    window.db = firebase.firestore();
    console.log('Firebase initialized successfully');
  }
} else {
  console.warn('Firebase SDK not loaded');
}