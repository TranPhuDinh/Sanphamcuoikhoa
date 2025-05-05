import { getUserByEmail } from "../dangnhap/user.entity.js";
import { getProductById } from "../trangchu/call_api.js";
import {
  clearCart,
  decreaseQty,
  getCartByEmail,
  increaseQty,
  removeFromCart,
} from "./cart.entity.js";

const email = localStorage.getItem("currentUser");
if (!email) location.href("../html/login.html");

// Render cart -------------------------------------------
async function renderCart() {
  const cart = await getCartByEmail(email);
  const cartItems = cart.products || [];
  //   neu chua co mon hang nao thi chuyen huong sang home => mua sam
  if (!cartItems.length) {
    alert("Hien tai chua co hang trong gio, mua sam thoi nao!");
    location.href = "../index.html";
  }

  let totalCart = 0;

  const cartItemsContainer = document.getElementById("cartItems");
  if (!cartItemsContainer) return;
  // xoa het neu khong sau khi cap nhat se bi hien 2 lan
  cartItemsContainer.innerHTML = "";

  // Always show cart items since we should always have at least default product
  cartItems.forEach(async (item) => {
    const productInfo = await getProductById(item.productId);
    const qty = item.qty;
    totalCart += productInfo.price * qty;

    const itemElement = document.createElement("div");
    itemElement.className = "card mb-3";
    itemElement.id = item.productId;
    itemElement.innerHTML = `
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-2">
            <img src="${
              productInfo.thumbnail || "/api/placeholder/100/100"
            }" class="img-fluid rounded" alt="${productInfo.title}">
          </div>
          <div class="col-md-4">
            <h5 class="card-title">${productInfo.title}</h5>
            <p class="card-text">Mã SP: ${item.productId}</p>
          </div>
          <div class="col-md-2">
            <div class="input-group">
              <button class="btn btn-outline-secondary btn-sm de-btn">-</button>
              <input type="number" class="form-control text-center qty-input" value="${qty}" min="1" readonly>
              <button class="btn btn-outline-secondary btn-sm in-btn">+</button>
            </div>
          </div>
          <div class="col-md-2">
            <p class="fw-bold">$${
              Math.round(productInfo.price * qty * 100) / 100
            }</p>
          </div>
          <div class="col-md-2">
            <button class="btn btn-danger btn-sm remove-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    itemElement.addEventListener("click", async function (e) {
      // add event remove
      if (e.target.classList.contains("remove-btn")) {
        await removeItem(item.productId, productInfo.title);
        return;
      }
      // add event increaseQuantity
      if (e.target.classList.contains("in-btn")) {
        await increaseQuantityUI(item.productId, productInfo.title);
        return;
      }
      // add event decreaseQuantity
      if (e.target.classList.contains("de-btn")) {
        await decreaseQuantityUI(item.productId, productInfo.title);
        return;
      }
    });

    cartItemsContainer.appendChild(itemElement);
    renderSummariesUI(totalCart);
  });
}

// Remove item from cart ------------------------------------------
async function removeItem(itemId, itemName) {
  // Find the item to get its name for the toast mess
  await removeFromCart(email, itemId);
  // xoa trong giao dien
  await renderCart();
  // Show remove success message
  showToast(`${itemName} đã được xóa khỏi giỏ hàng!`);
}

// update cart -----------------------------------------------------
// Increase quantity
async function increaseQuantityUI(itemId, itemName) {
  // Find the item to get its name for the toast mess
  await increaseQty(email, itemId);
  showToast(`Số lượng món hàng ${itemName} đã được cập nhật`);
  // xoa trong giao dien
  await renderCart();
}

// Decrease quantity
async function decreaseQuantityUI(itemId, itemName) {
  // Find the item to get its name for the toast mess
  await decreaseQty(email, itemId);
  // xoa trong giao dien
  await renderCart();
  // Show remove success message
  showToast(`Số lượng món hàng ${itemName} đã được cập nhật`);
}

// total
function renderSummariesUI(product_total) {
  console.log(product_total);
  product_total = Math.floor(product_total * 10) / 10;
  const subTotal = document.getElementById("subtotal");
  subTotal.innerText = `$${product_total}`;
  const shipping = document.getElementById("shipping");
  // mac dinh phi ship la 5$
  shipping.innerText = "$5";
  const totalCost = document.getElementById("total");
  totalCost.innerText = `$${product_total + 5}`;
}

// Toast notification function
function showToast(message) {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "position-fixed bottom-0 end-0 p-3";
    toastContainer.style.zIndex = "1050";
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toastId = "toast-" + Date.now();
  const toastElement = document.createElement("div");
  toastElement.id = toastId;
  toastElement.className = "toast";
  toastElement.setAttribute("role", "alert");
  toastElement.setAttribute("aria-live", "assertive");
  toastElement.setAttribute("aria-atomic", "true");

  // Toast content
  toastElement.innerHTML = `
    <div class="toast-header">
      <strong class="me-auto">Thông báo</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;

  // Add toast to container
  toastContainer.appendChild(toastElement);

  // Initialize Bootstrap toast
  if (typeof bootstrap !== "undefined" && bootstrap.Toast) {
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Remove toast after it's hidden
    toastElement.addEventListener("hidden.bs.toast", function () {
      toastElement.remove();
    });
  } else {
    // Fallback if Bootstrap is not available
    toastElement.style.display = "block";
    setTimeout(() => {
      toastElement.remove();
    }, 5000);
  }
}

// Initialize cart when page loads
document.addEventListener("DOMContentLoaded", async function () {
  // render cart UI ------------------------------
  await renderCart();
});

// xoa gio -----------------------------------------------
document
  .getElementById("clearCartBtn")
  .addEventListener("click", async function () {
    await clearCart(email);
    await renderCart();
  });

// Chuyen trang thanh toan --------------------------------
document
  .getElementById("checkoutBtn")
  .addEventListener("click", async function () {
    const total = document.getElementById("total").innerText;
    let sumQty = 0;
    document.querySelectorAll(".qty-input").forEach((element) => {
      sumQty += parseInt(element.value);
    });

    // luu tam gia tri tong don hang
    localStorage.setItem(
      "totalCart",
      JSON.stringify({ sum: total, qty: sumQty })
    );
    // xoa hết giỏ hàng vì đã thanh toán 
    await clearCart(email);
    // chuyen trang
    location.href = "./payment.html";
  });
