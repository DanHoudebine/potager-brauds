// ============================================
// FIREBASE CONFIG - Potager de Poche
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyCW3UGpWnv96YtqIO_sZ44UsK8iU5gn8bI",
  authDomain: "potager-de-poche.firebaseapp.com",
  databaseURL: "https://potager-de-poche-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "potager-de-poche",
  storageBucket: "potager-de-poche.firebasestorage.app",
  messagingSenderId: "978848610696",
  appId: "1:978848610696:web:4df58c4a4032b59d3be23d",
  measurementId: "G-0KXC9YFHE0"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
