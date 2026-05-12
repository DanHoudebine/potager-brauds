// ============================================
// FIREBASE CONFIG - Le Potager des Brauds
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyCa3WsaPWR7Lqit9GSlz6YMQ7LJXJEQKNI"
    authDomain: "potager-brauds.firebaseapp.com",
    databaseURL: "https://potager-brauds-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "potager-brauds",
    storageBucket: "potager-brauds.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
