// Cart management functions
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Add item to cart
function addToCart(product) {
  // Check if product already exists in cart
  const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
  
  if (existingItemIndex >= 0) {
    // If item exists, increase quantity
    cartItems[existingItemIndex].quantity += 1;
  } else {
    // If new item, add to cart
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  // Save cart to localStorage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartCount();
}

// Remove item from cart
function removeItem(itemId) {
  cartItems = cartItems.filter(item => item.id !== itemId);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartUI();
  updateTotal();
}

// Increase quantity
function increaseQuantity(itemId) {
  const itemIndex = cartItems.findIndex(item => item.id === itemId);
  if (itemIndex >= 0) {
    cartItems[itemIndex].quantity += 1;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartUI();
    updateTotal();
  }
}

// Decrease quantity
function decreaseQuantity(itemId) {
  const itemIndex = cartItems.findIndex(item => item.id === itemId);
  if (itemIndex >= 0 && cartItems[itemIndex].quantity > 1) {
    cartItems[itemIndex].quantity -= 1;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartUI();
    updateTotal();
  }
}

// Calculate total price
function updateTotal() {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;
  
  // Update UI elements
  document.getElementById('subtotal').innerText = formatCurrency(subtotal) + 'đ';
  document.getElementById('shipping').innerText = formatCurrency(shipping) + 'đ';
  document.getElementById('total').innerText = formatCurrency(total) + 'đ';
}

// Update cart UI
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = '';
  
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<div class="alert alert-info">Giỏ hàng của bạn đang trống</div>';
    document.getElementById('checkoutBtn').disabled = true;
    return;
  }
  
  document.getElementById('checkoutBtn').disabled = false;
  
  cartItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'card mb-3';
    itemElement.innerHTML = `
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-2">
            <img src="${item.image || '/api/placeholder/100/100'}" class="img-fluid" alt="${item.name}">
          </div>
          <div class="col-md-4">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">Mã SP: ${item.id}</p>
          </div>
          <div class="col-md-2">
            <div class="input-group">
              <button class="btn btn-outline-secondary btn-sm" onclick="decreaseQuantity('${item.id}')">-</button>
              <input type="number" class="form-control text-center" value="${item.quantity}" min="1" readonly>
              <button class="btn btn-outline-secondary btn-sm" onclick="increaseQuantity('${item.id}')">+</button>
            </div>
          </div>
          <div class="col-md-2">
            <p class="fw-bold">${formatCurrency(item.price * item.quantity)}đ</p>
          </div>
          <div class="col-md-2">
            <button class="btn btn-danger btn-sm" onclick="removeItem('${item.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });
}

// Update cart count in navbar
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Create or find the cart count badge
  let cartCountBadge = document.querySelector('.cart-count');
  if (!cartCountBadge) {
    // Add cart count badge to all cart buttons
    const cartButtons = document.querySelectorAll('a[href$="cart.html"]');
    cartButtons.forEach(button => {
      if (!button.querySelector('.cart-count')) {
        cartCountBadge = document.createElement('span');
        cartCountBadge.className = 'badge bg-danger rounded-pill cart-count';
        cartCountBadge.style.marginLeft = '5px';
        button.appendChild(cartCountBadge);
      }
    });
  }
  
  // Update all cart count badges
  document.querySelectorAll('.cart-count').forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline' : 'none';
  });
}

// Helper function to format currency
function formatCurrency(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Update cart count
  updateCartCount();
  
  // If on cart page, update the cart UI
  if (window.location.pathname.includes('cart.html')) {
    updateCartUI();
    updateTotal();
  }
  
  // Add click event to all product buttons
  const addToCartButtons = document.querySelectorAll('.btn-primary');
  addToCartButtons.forEach(button => {
    if (button.id && !button.id.includes('login')) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const productElement = this.closest('.product');
        if (productElement) {
          const product = {
            id: this.id,
            name: productElement.querySelector('h2').textContent,
            price: parseFloat(productElement.querySelector('.price strong').textContent.replace('$', '')) * 23000, // Convert USD to VND
            image: productElement.querySelector('img').src,
            quantity: 1
          };
          addToCart(product);
          alert('Đã thêm sản phẩm vào giỏ hàng!');
        }
      });
    }
  });
});

// Redirect to homepage after payment
function redirectToThankYouPage(event) {
  if (event) event.preventDefault();
  // Clear cart after successful payment
  localStorage.removeItem('cartItems');
  alert('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
  window.location.href = '../index.html';
  return false;
}