import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDz30Z_OBBd1xfrMiA7CodFQq8ZJAwwj48",
  authDomain: "mantenimiento-app-bb003.firebaseapp.com",
  projectId: "mantenimiento-app-bb003",
  storageBucket: "mantenimiento-app-bb003.firebasestorage.app",
  messagingSenderId: "1055067277531",
  appId: "1:1055067277531:web:58beb05ff1c3cb7f3224fe",
  measurementId: "G-7E2R7BL7M2",
  databaseURL: "https://mantenimiento-app-bb003-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
