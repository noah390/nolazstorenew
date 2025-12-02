// Debug script to ensure all buttons work
document.addEventListener('DOMContentLoaded', function() {
  console.log('Debug: DOM loaded, checking buttons...');
  
  // Check cart button
  setTimeout(() => {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
      console.log('✓ Cart button found');
      cartBtn.addEventListener('click', function(e) {
        console.log('Cart button clicked');
        e.preventDefault();
        if (window.cart) {
          window.cart.showCart();
        } else {
          console.error('Cart not initialized');
        }
      });
    } else {
      console.error('✗ Cart button not found');
    }
    
    // Check Pay Now button
    const payNowBtn = document.getElementById('payNowBtn');
    if (payNowBtn) {
      console.log('✓ Pay Now button found');
      payNowBtn.addEventListener('click', function() {
        console.log('Pay Now button clicked');
        if (window.cart) {
          window.cart.payNow();
        } else {
          console.error('Cart not initialized');
        }
      });
    } else {
      console.log('Pay Now button not found (will be added when cart opens)');
    }
    
    // Check checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      console.log('✓ Checkout button found');
      checkoutBtn.addEventListener('click', function() {
        console.log('Checkout button clicked');
        if (window.cart) {
          window.cart.checkout();
        } else {
          console.error('Cart not initialized');
        }
      });
    } else {
      console.log('Checkout button not found (will be added when cart opens)');
    }
    
    // Check clear cart button
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
      console.log('✓ Clear cart button found');
      clearBtn.addEventListener('click', function() {
        console.log('Clear cart button clicked');
        if (window.cart) {
          window.cart.clearCart();
        } else {
          console.error('Cart not initialized');
        }
      });
    } else {
      console.log('Clear cart button not found (will be added when cart opens)');
    }
    
    // Check if cart is initialized
    if (window.cart) {
      console.log('✓ Cart is initialized');
    } else {
      console.error('✗ Cart not initialized');
    }
    
    // Check if makePayment function exists
    if (typeof makePayment === 'function') {
      console.log('✓ makePayment function available');
    } else {
      console.error('✗ makePayment function not found');
    }
    
  }, 2000);
});

// Global function to test payment
window.testPayment = function() {
  if (typeof makePayment === 'function') {
    makePayment(1000, 'test@example.com', 'Test User', '08012345678');
  } else {
    console.error('makePayment function not available');
  }
};