// ============================================
// FIREBASE CONFIG - Jardin de Poche
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyA8_VFaqZCvl2d5Z-r9tftkL-rxEK4Ddcw",
  authDomain: "jardin-de-poche.firebaseapp.com",
  databaseURL: "https://jardin-de-poche-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jardin-de-poche",
  storageBucket: "jardin-de-poche.firebasestorage.app",
  messagingSenderId: "813154716183",
  appId: "1:813154716183:web:30d376112ca0b6a5482a52"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
