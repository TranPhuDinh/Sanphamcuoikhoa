import { getUserByEmail } from "../dangnhap/user.entity.js";

let loginHref = "";
let cartHref = "";
if (location.href.includes("/html/")) {
  loginHref = "./login.html";
  cartHref = "./cart.html";
} else {
  loginHref = "./html/login.html";
  cartHref = "./html/cart.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = localStorage.getItem("currentUser");

  const cartBtn = document.getElementById("cart");
  cartBtn.href = cartHref;
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");
  const userGreeting = document.getElementById("userGreeting");

  // lay du lieu user thong qua email duoc luu trong local storage
  const user = await getUserByEmail(currentUser);

  if (currentUser) {
    // ✅ User is logged in
    if (cartBtn) cartBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "none";
    if (userGreeting) {
      userGreeting.style.display = "inline";
      userGreeting.textContent = `Xin chào, ${user.username}`;
    }

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      alert("Bạn đã đăng xuất.");
      location.href = loginHref;
    });
  } else {
    // ❌ User is not logged in
    if (cartBtn) {
      cartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Vui lòng đăng nhập trước khi xem giỏ hàng!");
        window.location.href = loginHref;
      });
      cartBtn.style.display = "none";
    }

    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (userGreeting) userGreeting.style.display = "none";
  }
});
