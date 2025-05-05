import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { addUser, getUserByEmail } from "./user.entity.js";
import { auth } from "../firebase.js";

// ----------------------
// UI: Toggle between login/signup

document.getElementById("btnChangeSignup").addEventListener("click", () => {
  document.querySelector(".login").style.display = "none";
  document.querySelector(".register").style.display = "block";
});

document.getElementById("btnChangeLogin").addEventListener("click", () => {
  document.querySelector(".register").style.display = "none";
  document.querySelector(".login").style.display = "block";
});

document.getElementById("showForgotPassword").addEventListener("click", () => {
  document.getElementById("forgotPasswordModal").classList.add("active");
});

window.onclick = function (event) {
  if (event.target == document.getElementById("forgotPasswordModal")) {
    document.getElementById("forgotPasswordModal").classList.remove("active");
  }
};

// ----------------------
// ==== LOGIN ====
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email-lg").value.trim();
  const password = document.getElementById("password-lg").value.trim();

  if (!email || !password) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userData = await getUserByEmail(email);
    if (!userData) {
      alert("Tài khoản không tồn tại trong hệ thống người dùng.");
      return;
    }

    // Store user info
    localStorage.setItem("currentUser", email);

    alert("Đăng nhập thành công!");
    location.href = "../index.html";
  } catch (err) {
    console.error(err);
    alert("Sai tài khoản hoặc mật khẩu!");
  }
});

// ==== SIGNUP ====
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email-sp").value.trim();
  const username = document.getElementById("username-sp").value.trim();
  const password = document.getElementById("password-sp").value.trim();

  if (!email || !username || !password) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (password.length < 6) {
    alert("Vui lòng nhập mật khẩu từ 6 kí tự trở lên!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await addUser(email, username); // Include username
    alert("Đăng ký thành công!");
    // chuyen sang dang nhap
    document.querySelector(".register").style.display = "none";
    document.querySelector(".login").style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Email đã được sử dụng hoặc có lỗi xảy ra!");
  }
});
