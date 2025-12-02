// Shopping Cart Functionality
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('nolazCart')) || [];
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.updateCartCount();
        this.bindEvents();
        this.renderCart();
      });
    } else {
      this.updateCartCount();
      this.bindEvents();
      this.renderCart();
    }
  }

  bindEvents() {
    // Cart button with mobile support
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
      // Add both click and touchend for mobile
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showCart();
      });
      cartBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.showCart();
      });
      console.log('Cart button event listeners added');
    } else {
      console.error('Cart button not found');
    }

    // Modal close - multiple selectors for better compatibility
    const closeBtns = document.querySelectorAll('#cartModal .close, .modal .close');
    closeBtns.forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideCart();
      });
      closeBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.hideCart();
      });
    });

    // Modal background click
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.hideCart();
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.checkout());
    }

    // Clear cart button
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearCart());
    }

    // Pay Now button
    const payNowBtn = document.getElementById('payNowBtn');
    if (payNowBtn) {
      payNowBtn.addEventListener('click', () => this.payNow());
    }
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: parseInt(product.price),
        image: product.image,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.updateCartCount();
    this.renderCart();
    this.showAddedNotification(product.name);
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartCount();
    this.renderCart();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
      }
    }
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.items = [];
      this.saveCart();
      this.updateCartCount();
      this.renderCart();
    }
  }

  saveCart() {
    localStorage.setItem('nolazCart', JSON.stringify(this.items));
  }

  updateCartCount() {
    const count = this.items.reduce((total, item) => total + item.quantity, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
      cartCountEl.textContent = count;
      console.log('Cart count updated to:', count);
    } else {
      console.error('Cart count element not found');
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  renderCart() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (!cartItemsEl) return;

    if (this.items.length === 0) {
      cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      if (cartTotalEl) cartTotalEl.textContent = '0';
      return;
    }

    const itemsHTML = this.items.map(item => `
      <div class="cart-item">
        <img src="${item.image || 'https://via.placeholder.com/60x60'}" alt="${item.name}">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>₦${item.price.toLocaleString()}</p>
        </div>
        <div class="quantity-controls">
          <button onclick="window.cart.updateQuantity('${item.id}', ${item.quantity - 1})" ontouchend="window.cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button onclick="window.cart.updateQuantity('${item.id}', ${item.quantity + 1})" ontouchend="window.cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
        </div>
        <div class="item-total">
          ₦${(item.price * item.quantity).toLocaleString()}
        </div>
        <button class="remove-btn" onclick="window.cart.removeItem('${item.id}')" ontouchend="window.cart.removeItem('${item.id}')">&times;</button>
      </div>
    `).join('');

    cartItemsEl.innerHTML = itemsHTML;
    
    if (cartTotalEl) {
      cartTotalEl.textContent = this.getTotal().toLocaleString();
    }
    
    // Re-bind close button events after rendering
    setTimeout(() => this.bindCloseEvents(), 100);
  }
  
  bindCloseEvents() {
    const closeBtns = document.querySelectorAll('#cartModal .close');
    closeBtns.forEach(closeBtn => {
      if (!closeBtn.hasAttribute('data-cart-close-bound')) {
        closeBtn.setAttribute('data-cart-close-bound', 'true');
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.hideCart();
        });
        closeBtn.addEventListener('touchend', (e) => {
          e.preventDefault();
          this.hideCart();
        });
      }
    });
  }

  showCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
      this.renderCart(); // Ensure cart is up to date
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      // Ensure close button works
      setTimeout(() => this.bindCloseEvents(), 100);
    }
  }

  hideCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  checkout() {
    if (this.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const orderDetails = this.items.map(item => 
      `• ${item.name} (x${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const message = `Hello! I'd like to place an order:

${orderDetails}

*Total: ₦${this.getTotal().toLocaleString()}*

Please confirm my order and provide payment details.`;

    const whatsappUrl = `https://wa.me/2349046456469?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  payNow() {
    if (this.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    this.showPaymentForm();
  }

  showPaymentForm() {
    const total = this.getTotal();
    
    // Remove any existing payment form
    const existingModal = document.getElementById('paymentFormModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    const formHTML = `
      <div id="paymentFormModal" class="modal" style="display: block;">
        <div class="modal-content flw-payment-form">
          <div class="flw-form-header">
            <h3>Complete Your Payment</h3>
            <p>Secure checkout powered by Flutterwave</p>
            <span class="close" onclick="cart.hidePaymentForm()">&times;</span>
          </div>
          <div class="flw-form-body">
            <div class="flw-amount-display">
              <div class="flw-amount-label">Total Amount</div>
              <div class="flw-amount-value">₦${total.toLocaleString()}</div>
            </div>
            <form id="customerInfoForm">
              <div class="flw-form-group">
                <label for="customerName">Full Name *</label>
                <input type="text" id="customerName" name="customerName" placeholder="Enter your full name" required>
              </div>
              <div class="flw-form-group">
                <label for="customerEmail">Email Address *</label>
                <input type="email" id="customerEmail" name="customerEmail" placeholder="Enter your email address" required>
              </div>
              <div class="flw-form-group">
                <label for="customerPhone">Phone Number *</label>
                <input type="tel" id="customerPhone" name="customerPhone" placeholder="Enter your phone number" required>
              </div>
              <div class="flw-security-info">
                <div class="flw-security-icon">🔒</div>
                <p class="flw-security-text">Your payment information is secure and encrypted</p>
              </div>
              <button type="submit" class="flw-submit-btn">Proceed to Payment</button>
            </form>
          </div>
          <div class="flw-form-footer">
            <p class="flw-powered-by">Powered by <a href="https://flutterwave.com" target="_blank">Flutterwave</a></p>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    document.body.style.overflow = 'hidden';
    
    // Hide cart modal
    this.hideCart();
    
    // Bind form submit event
    setTimeout(() => {
      const form = document.getElementById('customerInfoForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.processPayment();
        });
      }
    }, 100);
  }

  hidePaymentForm() {
    const modal = document.getElementById('paymentFormModal');
    if (modal) {
      modal.remove();
      document.body.style.overflow = 'auto';
    }
  }

  processPayment() {
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    
    if (!name || !email || !phone) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const total = this.getTotal();
    this.hidePaymentForm();
    makePayment(total, email, name, phone);
  }

  showAddedNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        ✅ ${productName} added to cart!
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide and remove notification
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
  }
}

// Initialize cart when DOM is ready
let cart;

function initializeCart() {
  cart = new ShoppingCart();
  console.log('Cart initialized');
  
  // Ensure global functions are available
  window.cart = cart;
  
  // Periodically update cart count to ensure sync
  setInterval(() => {
    if (cart) {
      cart.updateCartCount();
    }
  }, 1000);
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCart);
} else {
  initializeCart();
}

// Fallback cart button handler and count updater
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for cart to initialize
  setTimeout(() => {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn && !cartBtn.hasAttribute('data-cart-initialized')) {
      cartBtn.setAttribute('data-cart-initialized', 'true');
      cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Cart button clicked');
        if (window.cart) {
          window.cart.showCart();
        } else {
          console.error('Cart not initialized');
          alert('Cart is loading, please try again.');
        }
      });
      console.log('Cart button event listener added');
    }
    
    // Force update cart count on page load
    if (window.cart) {
      window.cart.updateCartCount();
    }
  }, 500);
});

// Additional fallback for cart button
setInterval(() => {
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn && !cartBtn.hasAttribute('data-cart-initialized') && window.cart) {
    cartBtn.setAttribute('data-cart-initialized', 'true');
    cartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.cart.showCart();
    });
    console.log('Cart button initialized via fallback');
  }
}, 1000);

// Global function to add to cart (called from product cards)
if (typeof window.addToCart === 'undefined') {
  window.addToCart = function(productId) {
    console.log('Cart.js addToCart called for:', productId);
    const product = window.productsData?.find(p => p.id === productId);
    if (product && window.cart) {
      window.cart.addItem(product);
    } else {
      console.error('Product not found or cart not ready:', productId);
      alert('Product not found. Please try again.');
    }
  };
}

// Global function to close cart
if (typeof window.closeCart === 'undefined') {
  window.closeCart = function() {
    if (window.cart) {
      window.cart.hideCart();
    }
  };
}

// Global function to show product details
if (typeof window.showProductDetails === 'undefined') {
  window.showProductDetails = function(productId) {
    console.log('Cart.js showProductDetails called for:', productId);
    
    const product = window.productsData?.find(p => p.id === productId);
    if (!product) {
      console.error('Product not found:', productId);
      alert('Product details not available.');
      return;
    }
    
    const details = `Product Details:

Name: ${product.name}
Price: ₦${parseInt(product.price || 0).toLocaleString()}
Description: ${product.description || 'No description'}
Category: ${product.category || 'Uncategorized'}
Product ID: ${product.id}

Contact us on WhatsApp to place your order!`;
    
    alert(details);
  };
}