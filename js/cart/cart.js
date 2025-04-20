// Cart management functions
let cart = [];
try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
} catch (error) {
    console.error("Lỗi khi đọc giỏ hàng từ localStorage:", error);
}


// Add default product to cart if cart is empty
function addDefaultProduct() {
  // Skip if cart already has items
  if (cartItems.length > 0) return;
  
  // Default product details
  const defaultProduct = {
    id: "default001",
    name: "Áo thun basic",
    price: 399000, // 399,000 VNĐ
    image: "/api/placeholder/300/300",
    quantity: 1
  };
  
  // Add default product to cart
  cartItems.push(defaultProduct);
  
  // Save cart to localStorage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
  // Update cart count
  updateCartCount();
}

// Add item to cart with animation
function addToCart(product, sourceElement) {
  // Check authentication status before adding to cart
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    // Save current page URL to return after login
    localStorage.setItem('cartReturnUrl', window.location.href);
    
    // Show login prompt
    const proceed = confirm('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng. Bạn có muốn đăng nhập ngay?');
    if (proceed) {
      window.location.href = './login.html?returnUrl=' + encodeURIComponent(window.location.href);
      return;
    } else {
      return;
    }
  }

  // Create flying element
  const flyingElement = createFlyingElement(sourceElement);
  
  // Add to DOM
  document.body.appendChild(flyingElement);
  
  // Calculate destination (cart icon)
  const cartIcon = document.querySelector('a[href*="cart.html"]');
  if (cartIcon) {
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Set final position
    flyingElement.style.setProperty('--final-top', `${cartRect.top}px`);
    flyingElement.style.setProperty('--final-left', `${cartRect.left}px`);
  }
  
  // Animate cart icon after flying animation completes
  setTimeout(() => {
    animateCartIcon();
    
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
    
    // Show success message
    showToast(`${product.name} đã được thêm vào giỏ hàng!`);
  }, 800);
}

// Create flying element
function createFlyingElement(sourceElement) {
  // Get the source element's position
  const sourceRect = sourceElement.getBoundingClientRect();
  
  // Create a new element
  const flyingElement = document.createElement('div');
  flyingElement.className = 'fly-item';
  
  // Clone the image
  const productImage = sourceElement.closest('.product').querySelector('img');
  const clonedImage = document.createElement('img');
  clonedImage.src = productImage.src;
  clonedImage.style.width = '50px';
  clonedImage.style.height = '50px';
  clonedImage.style.objectFit = 'cover';
  clonedImage.style.borderRadius = '50%';
  
  // Position the flying element
  flyingElement.style.top = `${sourceRect.top}px`;
  flyingElement.style.left = `${sourceRect.left}px`;
  
  // Add the cloned image to the flying element
  flyingElement.appendChild(clonedImage);
  
  // Remove the element after animation completes
  setTimeout(() => {
    flyingElement.remove();
  }, 1000);
  
  return flyingElement;
}

// Animate cart icon
function animateCartIcon() {
  const cartIcon = document.querySelector('a[href*="cart.html"]');
  if (cartIcon) {
    cartIcon.classList.add('cart-pop');
    setTimeout(() => {
      cartIcon.classList.remove('cart-pop');
    }, 500);
  }
}

// Remove item from cart
function removeItem(itemId) {
  // Find the item to get its name for the toast message
  const removedItem = cartItems.find(item => item.id === itemId);
  const itemName = removedItem ? removedItem.name : 'Sản phẩm';

  cartItems = cartItems.filter(item => item.id !== itemId);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
  // Add default product if cart becomes empty
  if (cartItems.length === 0) {
    addDefaultProduct();
  }
  
  updateCartUI();
  updateTotal();
  updateCartCount();
  
  // Show remove success message
  showToast(`${itemName} đã được xóa khỏi giỏ hàng!`);
}

// Clear cart function - modified to keep default product
function clearCart() {
  if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Add default product after clearing
    addDefaultProduct();
    
    updateCartUI();
    updateTotal();
    updateCartCount();
    showToast('Giỏ hàng đã được xóa!');
  }
}

// Increase quantity
function increaseQuantity(itemId) {
  const itemIndex = cartItems.findIndex(item => item.id === itemId);
  if (itemIndex >= 0) {
    cartItems[itemIndex].quantity += 1;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartUI();
    updateTotal();
    updateCartCount();
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
    updateCartCount();
  }
}

// Calculate total price
function updateTotal() {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;
  
  // Update UI elements
  const subtotalElement = document.getElementById('subtotal');
  const shippingElement = document.getElementById('shipping');
  const totalElement = document.getElementById('total');
  
  if (subtotalElement) subtotalElement.innerText = formatCurrency(subtotal) + 'đ';
  if (shippingElement) shippingElement.innerText = formatCurrency(shipping) + 'đ';
  if (totalElement) totalElement.innerText = formatCurrency(total) + 'đ';
  
  // Update order summary if on checkout page
  updateOrderSummary(subtotal, shipping, total);
}

// Update order summary on checkout page
function updateOrderSummary(subtotal, shipping, total) {
  const orderSummaryContainer = document.getElementById('order-summary');
  if (!orderSummaryContainer) return;
  
  let summaryHTML = `
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h4>Tóm tắt đơn hàng</h4>
      </div>
      <div class="card-body">
        <div class="d-flex justify-content-between mb-2">
          <span>Tổng tiền hàng:</span>
          <span>${formatCurrency(subtotal)}đ</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <span>Phí vận chuyển:</span>
          <span>${formatCurrency(shipping)}đ</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between fw-bold">
          <span>Tổng thanh toán:</span>
          <span>${formatCurrency(total)}đ</span>
        </div>
      </div>
    </div>
  `;
  
  orderSummaryContainer.innerHTML = summaryHTML;
}

// Update cart UI - modified to prevent showing empty cart message
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = '';
  
  // Always show cart items since we should always have at least default product
  cartItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'card mb-3';
    itemElement.innerHTML = `
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-2">
            <img src="${item.image || '/api/placeholder/100/100'}" class="img-fluid rounded" alt="${item.name}">
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
  
  // Always enable checkout button
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.disabled = false;
}

// Update cart count in navbar
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Create or find the cart count badge
  let cartCountBadge = document.querySelector('.cart-count');
  if (!cartCountBadge) {
    // Add cart count badge to all cart buttons
    const cartButtons = document.querySelectorAll('a[href*="cart.html"]');
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
    // Always display the badge
    badge.style.display = 'inline';
  });
}

// Checkout function
function proceedToCheckout() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    alert('Vui lòng đăng nhập trước khi thanh toán');
    window.location.href = './login.html?returnUrl=' + encodeURIComponent('./checkout.html');
    return false;
  }
  
  // Always allow checkout since we will always have at least one product
  window.location.href = './checkout.html';
  return true;
}

// Save order to Firebase (placeholder function)
function saveOrderToFirebase(orderData) {
  // This would be implemented once Firebase is properly initialized
  console.log("Saving order to Firebase:", orderData);
  
  // Clear the cart
  cartItems = [];
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
  // Add default product after order is placed
  addDefaultProduct();
  
  // Save order summary in localStorage for confirmation page
  localStorage.setItem('lastOrder', JSON.stringify(orderData));
  
  // Redirect to confirmation page
  window.location.href = './order-confirmation.html';
}

// Handle checkout form submission
function handleCheckoutSubmission(event) {
  if (event) event.preventDefault();
  
  const orderForm = document.getElementById('checkout-form');
  if (!orderForm) return;
  
  // Get form data
  const formData = new FormData(orderForm);
  const checkoutData = {
    customer: {
      name: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      notes: formData.get('notes')
    },
    items: cartItems,
    subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    shipping: 30000,
    total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 30000,
    paymentMethod: formData.get('paymentMethod'),
    orderDate: new Date().toISOString()
  };
  
  // Save order
  saveOrderToFirebase(checkoutData);
}

// Toast notification function
function showToast(message) {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '1050';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toastId = 'toast-' + Date.now();
  const toastElement = document.createElement('div');
  toastElement.id = toastId;
  toastElement.className = 'toast';
  toastElement.setAttribute('role', 'alert');
  toastElement.setAttribute('aria-live', 'assertive');
  toastElement.setAttribute('aria-atomic', 'true');
  
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
  if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
      toastElement.remove();
    });
  } else {
    // Fallback if Bootstrap is not available
    toastElement.style.display = 'block';
    setTimeout(() => {
      toastElement.remove();
    }, 5000);
  }
}

// Helper function to format currency
function formatCurrency(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add the default product if cart is empty
  addDefaultProduct();
  
  // Check if user came from login page after adding to cart
  const cartReturnUrl = localStorage.getItem('cartReturnUrl');
  if (cartReturnUrl && localStorage.getItem('isLoggedIn') === 'true') {
    // Clear the return URL
    localStorage.removeItem('cartReturnUrl');
    
    // Show welcome back message
    const username = localStorage.getItem('username');
    if (username) {
      showToast(`Chào mừng ${username} quay trở lại! Bạn có thể tiếp tục mua sắm.`);
    }
  }
  
  // Add animation styles
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes flyToCart {
      0% {
        opacity: 1;
        transform: scale(1) translateY(0) translateX(0);
      }
      25% {
        opacity: 0.8;
        transform: scale(0.8) translateY(-10px) translateX(10px);
      }
      50% {
        opacity: 0.6;
        transform: scale(0.6) translateY(-20px) translateX(20px);
      }
      75% {
        opacity: 0.4;
        transform: scale(0.4) translateY(-30px) translateX(30px);
      }
      100% {
        opacity: 0;
        transform: scale(0.2) translateY(-50px) translateX(50px);
      }
    }

    .fly-item {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      animation: flyToCart 0.8s ease-in-out forwards;
    }

    @keyframes cartPop {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }

    .cart-pop {
      animation: cartPop 0.5s ease-in-out;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Update cart count
  updateCartCount();
  
  // If on cart page, update the cart UI
  if (window.location.pathname.includes('cart.html')) {
    updateCartUI();
    updateTotal();
    
    // Add clear cart button if not exists
    const actionBtnsContainer = document.querySelector('.cart-action-buttons');
    if (actionBtnsContainer && !document.getElementById('clearCartBtn')) {
      const clearBtn = document.createElement('button');
      clearBtn.id = 'clearCartBtn';
      clearBtn.className = 'btn btn-outline-danger me-2';
      clearBtn.textContent = 'Xóa giỏ hàng';
      clearBtn.onclick = clearCart;
      
      // Insert before checkout button
      actionBtnsContainer.prepend(clearBtn);
    }
  }
  
  // If on checkout page, set up checkout form
  if (window.location.pathname.includes('checkout.html')) {
    updateTotal(); // Update order summary
    
    // Set up form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', handleCheckoutSubmission);
    }
    
    // Pre-fill user information if available
    const username = localStorage.getItem('username');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    
    if (username && fullNameInput) {
      fullNameInput.value = username;
    }
  }
  
  // Setup add to cart buttons
  window.setupAddToCartButtons = function() {
    // This function needs to be callable both on page load and after products are dynamically added
    const addToCartButtons = document.querySelectorAll('.product .btn-primary');
    addToCartButtons.forEach(button => {
      // Remove any existing event listeners to avoid duplicates
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        const productElement = this.closest('.product');
        if (productElement) {
          const priceElement = productElement.querySelector('.price strong');
          const price = parseFloat(priceElement.textContent.replace('$', '')) * 23000; // Convert USD to VND
          
          const product = {
            id: this.id,
            name: productElement.querySelector('h2').textContent,
            price: price,
            image: productElement.querySelector('img').src,
            quantity: 1
          };
          
          // Add to cart with animation
          addToCart(product, this);
        }
      });
    });
  };
  
  // Initial setup
  if (typeof setupAddToCartButtons === 'function') {
    setupAddToCartButtons();
  }
  
  // Listen for product loading events
  const productsObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        // Once products are added to the DOM, set up cart buttons
        if (typeof setupAddToCartButtons === 'function') {
          setupAddToCartButtons();
        }
      }
    });
  });
  
  const productsContainer = document.getElementById('products_list');
  if (productsContainer) {
    productsObserver.observe(productsContainer, { childList: true });
  }
  
  // Add checkout button event listener
  const checkoutButton = document.getElementById('checkoutBtn');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      proceedToCheckout();
    });
  }
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addToCart,
    removeItem,
    clearCart,
    updateCartCount,
    proceedToCheckout,
    addDefaultProduct
  };
}