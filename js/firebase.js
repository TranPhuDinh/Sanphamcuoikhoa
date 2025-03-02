
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCasR4kbKroD5bgfMfijwlvJT4FiLShwjo",
    authDomain: "jsi31-b1282.firebaseapp.com",
    databaseURL: "https://jsi31-b1282-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "jsi31-b1282",
    storageBucket: "jsi31-b1282.firebasestorage.app",
    messagingSenderId: "972114914831",
    appId: "1:972114914831:web:94c83c72c6a12c9a8ebd7a",
    measurementId: "G-EY7N0X9C7W"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
