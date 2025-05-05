import { addToCart } from "../giohang/cart.entity.js";

const root_api_url = "https://dummyjson.com/products/";
// Call categories API
// danh sach cate mac dinh
const categories = [
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "sports-accessories",
  "sunglasses",
];
function callCategoriesApi() {
  const ui_list = document.getElementById("categories_list");
  try {
    categories.forEach((category) => {
      ui_list.appendChild(create_category_item({ Name: category }));
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// Call products API (men's clothing category)
async function callProductsApi() {
  const ui_list = document.getElementById("products_list");

  try {
    categories.forEach(async (cate) => {
      const response = await fetch(root_api_url + `category/${cate}`);
      const data = await response.json();
      const products = data.products;

      products.forEach((product) => {
        ui_list.appendChild(create_product_item(product));
      });
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("API not working");
  }
}

// Support functions
function create_category_item(category) {
  const col = document.createElement("div");
  col.className = "col";
  col.textContent = category.Name;
  return col;
}

function create_product_item(product) {
  const article = document.createElement("article");
  article.className = "product";
  article.id = product.id;

  const img = document.createElement("img");
  img.src = product.thumbnail || "https://via.placeholder.com/150";
  img.alt = product.title;
  article.appendChild(img);

  const infoContainer = document.createElement("div");
  infoContainer.className = "info-container";

  const description = document.createElement("div");
  description.classList.add("product-desc");
  description.innerHTML = product.description || "No description available";
  infoContainer.appendChild(description);

  const productInfo = document.createElement("div");
  productInfo.className = "product-info";

  const h2 = document.createElement("h2");
  h2.textContent = product.title;
  productInfo.appendChild(h2);

  const price = document.createElement("div");
  price.className = "price";

  const priceStrong = document.createElement("strong");
  priceStrong.textContent = "$" + product.price;
  price.appendChild(priceStrong);

  infoContainer.appendChild(productInfo);
  productInfo.appendChild(price);

  const button = document.createElement("button");
  button.className = "btn btn-primary add-cart";
  button.textContent = "Thêm vào giỏ hàng";
  button.addEventListener("click", async () => {
    console.log(123);
    await addToCartUI(product.id);
    console.log(123);
  });

  infoContainer.appendChild(button);

  article.appendChild(infoContainer);
  return article;
}

// ------------------------------------------------------
// add to cart functions
// ham ho tro
export async function getProductById(id) {
  try {
    const response = await fetch(root_api_url + `/${id}`);
    const product = await response.json();
    return product;
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("API not working");
  }
}

async function addToCartUI(productId) {
  try {
    const currentUser = localStorage.getItem("currentUser");
    await addToCart(currentUser, productId);
    showToast("Them vao gio hang thanh cong!");
  } catch (error) {
    console.error("Error add to cart:", error);
    alert("Error add to cart");
  }
}

// On page load
document.addEventListener("DOMContentLoaded", async function () {
  const categoriesList = document.getElementById("categories_list");
  if (categoriesList) {
    callCategoriesApi();
  }

  const productsList = document.getElementById("products_list");
  if (productsList) {
    await callProductsApi();
  }
});

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
    }, 3000);
  }
}
