// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyD04RuSLzBbnfI_8LMAw7ucOIFsVo6gpzA",
  authDomain: "e-commerce-vue-78e3e.firebaseapp.com",
  projectId: "e-commerce-vue-78e3e",
  storageBucket: "e-commerce-vue-78e3e.appspot.com",
  messagingSenderId: "898426384949",
  appId: "1:898426384949:web:b0c57d1712c3004658b77c",
  measurementId: "G-8EZ1K5TB9B",
};


const app = initializeApp(firebaseConfig);
 const db = await getFirestore(app);
const storage = getStorage();
const auth = getAuth(app);
export{db,storage,auth}