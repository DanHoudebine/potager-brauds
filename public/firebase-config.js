// ============================================
// FIREBASE CONFIG - Jardin de Poche
// (Le projet Firebase conserve son identifiant d'origine.)
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyCa3WsaPWR7Lqit9GSlz6YMQ7LJXJEQKNI",
  authDomain: "le-potager-des-brauds.firebaseapp.com",
  databaseURL: "https://le-potager-des-brauds-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "le-potager-des-brauds",
  storageBucket: "le-potager-des-brauds.firebasestorage.app",
  messagingSenderId: "126725590831",
  appId: "1:126725590831:web:de5126d62b0f0aaf259bda"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
