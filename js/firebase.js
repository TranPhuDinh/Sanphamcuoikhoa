// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore-lite.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCasR4kbKroD5bgfMfijwlvJT4FiLShwjo",
  authDomain: "jsi31-b1282.firebaseapp.com",
  databaseURL:
    "https://jsi31-b1282-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jsi31-b1282",
  storageBucket: "jsi31-b1282.firebasestorage.app",
  messagingSenderId: "972114914831",
  appId: "1:972114914831:web:94c83c72c6a12c9a8ebd7a",
  measurementId: "G-EY7N0X9C7W",
};


// ban du phong
// const firebaseConfig = {
//   apiKey: "AIzaSyDTx864YzUuMfDptKNyT_9R-8BiwsWt0nE",
//   authDomain: "jsi31-7afc1.firebaseapp.com",
//   databaseURL: "https://jsi31-7afc1-default-rtdb.firebaseio.com",
//   projectId: "jsi31-7afc1",
//   storageBucket: "jsi31-7afc1.firebasestorage.app",
//   messagingSenderId: "78876558382",
//   appId: "1:78876558382:web:10e1facacfdd40d4320bbf",
//   measurementId: "G-G5N7S3X01R"
// };

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
