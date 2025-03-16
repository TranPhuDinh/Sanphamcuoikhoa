
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

  

// Lấy các phần tử HTML
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const confirmPassword = document.getElementById('confirmPassword');
const signupBtn = document.getElementById('signupBtn');
const userInfo = document.getElementById('userInfo');
const userEmailDisplay = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

// Hiển thị form đăng ký
document.getElementById('showSignup').addEventListener('click', () => {
  document.querySelector('.login-form').style.display = 'none';
  document.querySelector('.signup-form').style.display = 'block';
});

// Hiển thị form đăng nhập
document.getElementById('showLogin').addEventListener('click', () => {
  document.querySelector('.login-form').style.display = 'block';
  document.querySelector('.signup-form').style.display = 'none';
});

// Đăng ký
signupBtn.addEventListener('click', () => {
  const email = signupEmail.value;
  const password = signupPassword.value;
  const confirmPass = confirmPassword.value;

  if (!email.includes('@')) {
      alert('Email phải có ký tự "@"');
      return;
  }

  if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      alert('Password phải có ít nhất 6 ký tự, 1 ký tự viết hoa, 1 ký tự viết thường và 1 số');
      return;
  }

  if (password !== confirmPass) {
      alert('Mật khẩu xác nhận không khớp');
      return;
  }

  auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
          alert('Đăng ký thành công!');
          showUserInfo(userCredential.user);
      })
      .catch((error) => {
          alert('Đăng ký thất bại: ' + error.message);
      });
});

// Đăng nhập
loginBtn.addEventListener('click', () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
          alert('Đăng nhập thành công!');
          showUserInfo(userCredential.user);
      })
      .catch((error) => {
          alert('Đăng nhập thất bại: ' + error.message);
      });
});

// Hiển thị thông tin người dùng
function showUserInfo(user) {
  document.querySelector('.login-form').style.display = 'none';
  document.querySelector('.signup-form').style.display = 'none';
  userInfo.style.display = 'block';
  userEmailDisplay.textContent = 'Email: ' + user.email;
}

// Đăng xuất
logoutBtn.addEventListener('click', () => {
  auth.signOut()
      .then(() => {
          alert('Đăng xuất thành công!');
          userInfo.style.display = 'none';
          document.querySelector('.login-form').style.display = 'block';
      })
      .catch((error) => {
          alert('Đăng xuất thất bại: ' + error.message);
      });
});