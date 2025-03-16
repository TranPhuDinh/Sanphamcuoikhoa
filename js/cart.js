// Cart management functions
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Add item to cart with animation
function addToCart(product, sourceElement) {
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
    badge.style.display = totalItems > 0 ? 'inline' : 'none';
  });
}

// Helper function to format currency
function formatCurrency(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
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
  }
  
  // Setup add to cart buttons
  function setupAddToCartButtons() {
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
  }
  
  // Initial setup
  setupAddToCartButtons();
  
  // Check if we're on the index page which loads products dynamically
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    // Wait for products to be loaded
    const productsObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          // Once products are added to the DOM, set up cart buttons
          setupAddToCartButtons();
        }
      });
    });
    
    const productsContainer = document.getElementById('products_list');
    if (productsContainer) {
      productsObserver.observe(productsContainer, { childList: true });
    }
  }