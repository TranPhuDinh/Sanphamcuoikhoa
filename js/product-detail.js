// product-detail.js
document.addEventListener("DOMContentLoaded", function () {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    const container = document.getElementById("productDetail");
  
    if (!product) {
      container.innerHTML = "<p class='text-danger'>Không tìm thấy sản phẩm.</p>";
      return;
    }
  
    container.innerHTML = `
      <div class="col-md-6">
        <img src="${product.DefaultProductImage}" alt="${product.DisplayName}" class="img-fluid rounded shadow-sm" />
      </div>
      <div class="col-md-6">
        <h1>${product.DisplayName}</h1>
        <p class="price">$${product.ListPrice}</p>
        <p>${product.Description || "Không có mô tả chi tiết."}</p>
        <button class="btn btn-primary mt-3">Thêm vào giỏ hàng</button>
      </div>
    `;
  });
  