// CONFIG - Replace these with your actual values
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTU0jwvRkIPHLCwoOk0JC-01c3oP1bXTXB7zugyRW5ijxYlKTyQndXyTZ1h6M75fCqEGUySou8yOJ5C/pub?gid=0&single=true&output=csv';
const WHATSAPP_NUMBER = '2349046456469';

// Normalize category names to match expected format
function normalizeCategory(category) {
  if (!category) return '';
  
  const normalized = category.toLowerCase().trim();
  
  // Map common variations to standard categories
  const categoryMap = {
    'clothes': 'clothing',
    'cloth': 'clothing',
    'apparel': 'clothing',
    'fashion': 'clothing',
    'jewellery': 'jewelry',
    'jewelery': 'jewelry',
    'accessories': 'jewelry',
    'shoe': 'shoes',
    'footwear': 'shoes',
    'sneakers': 'shoes',
    'bag': 'bags',
    'handbag': 'bags',
    'handbags': 'bags',
    'purse': 'bags',
    'purses': 'bags',
    'electronic': 'electronics',
    'tech': 'electronics',
    'gadget': 'electronics',
    'gadgets': 'electronics'
  };
  
  return categoryMap[normalized] || normalized;
}

// Parse CSV data into JavaScript objects
function csvToArray(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines.shift().split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.map(line => {
    // Handle CSV with quoted fields
    const cols = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cols.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    cols.push(current.trim());
    
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cols[i] || '').replace(/"/g, '');
    });
    return obj;
  });
}

// Create product card HTML
function createProductCard(product) {
  const div = document.createElement('div');
  div.className = 'card';
  
  const normalizedCategory = normalizeCategory(product.category);
  div.setAttribute('data-category', normalizedCategory);
  
  const imageUrl = product.image || 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image';
  const price = product.price ? `₦${parseInt(product.price).toLocaleString()}` : 'Price on request';
  const categoryDisplay = normalizedCategory ? normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1) : 'Product';
  
  div.innerHTML = `
    <div class="card-image">
      <img src="${imageUrl}" alt="${product.name}" loading="lazy">
      <div class="card-badge" onclick="filterByCategory('${normalizedCategory}')">${categoryDisplay}</div>
    </div>
    <div class="card-content">
      <h3>${product.name}</h3>
      <p class="desc">${product.description || 'No description available'}</p>
      <div class="price">${price}</div>
      <div class="actions">
        <button class="btn-buy" onclick="addToCart('${product.id}')" ontouchend="addToCart('${product.id}')">
          Add to Cart
        </button>
        <a class="btn-info" href="#" onclick="showProductDetails('${product.id}')" ontouchend="showProductDetails('${product.id}')">
          Details
        </a>
      </div>
    </div>
  `;
  
  return div;
}

// Filter by category when clicking product badge
function filterByCategory(category) {
  if (category) {
    window.location.href = `shop.html?category=${category}`;
  }
}

// Generate WhatsApp link
function generateWhatsAppLink(product) {
  const message = `Hello! I'm interested in:\n\n*${product.name}*\nPrice: ₦${parseInt(product.price || 0).toLocaleString()}\nProduct ID: ${product.id}\n\nCould you please provide more details?`;
  
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Show loading state
function showLoading() {
  const productsEl = document.getElementById('products');
  if (productsEl) {
    productsEl.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px;">
        <div style="font-size: 24px; margin-bottom: 16px;">🔄</div>
        <p style="color: var(--muted);">Loading products...</p>
      </div>
    `;
  }
}

// Show error state
function showError(message) {
  const productsEl = document.getElementById('products');
  if (productsEl) {
    productsEl.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px;">
        <div style="font-size: 24px; margin-bottom: 16px;">⚠️</div>
        <p style="color: var(--muted); margin-bottom: 16px;">${message}</p>
        <button onclick="init()" class="btn">Try Again</button>
      </div>
    `;
  }
}

// Show empty state
function showEmpty() {
  const productsEl = document.getElementById('products');
  if (productsEl) {
    productsEl.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px;">
        <div style="font-size: 24px; margin-bottom: 16px;">📦</div>
        <p style="color: var(--muted); margin-bottom: 16px;">No products available yet</p>
        <a href="admin.html" class="btn">Add Products</a>
      </div>
    `;
  }
}

// Sample products for testing
function getSampleProducts() {
  return [
    {
      id: '1',
      name: 'Premium Cotton T-Shirt',
      price: '15000',
      description: 'Comfortable premium cotton t-shirt perfect for everyday wear',
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '2',
      name: 'Gold Chain Necklace',
      price: '45000',
      description: 'Elegant gold-plated chain necklace for special occasions',
      category: 'jewelry',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '3',
      name: 'Designer Handbag',
      price: '40000',
      description: 'Stylish designer handbag made from premium materials',
      category: 'bags',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '4',
      name: 'Running Sneakers',
      price: '35000',
      description: 'Comfortable running sneakers for daily activities',
      category: 'shoes',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '5',
      name: 'Wireless Headphones',
      price: '55000',
      description: 'High-quality wireless headphones with noise cancellation',
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      status: 'active'
    },
    {
      id: '6',
      name: 'Casual Denim Jeans',
      price: '25000',
      description: 'Classic blue denim jeans with modern fit',
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
      status: 'active'
    }
  ];
}

// Initialize the store with both Firebase and Google Sheets
async function init() {
  const productsEl = document.getElementById('products');
  if (!productsEl) return;
  
  showLoading();
  
  let allProducts = [];
  
  // Load from Firebase Firestore
  try {
    if (window.db) {
      const firestoreSnapshot = await db.collection('products').get();
      firestoreSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.name && data.price && data.status !== 'inactive') {
          allProducts.push({
            id: doc.id,
            source: 'Firebase',
            category: normalizeCategory(data.category),
            ...data
          });
        }
      });
      console.log('Products loaded from Firebase:', allProducts.length);
    }
  } catch (error) {
    console.warn('Failed to load from Firebase:', error);
  }
  
  // Load from Google Sheets
  if (SHEET_CSV_URL && !SHEET_CSV_URL.includes('REPLACE_WITH')) {
    try {
      const response = await fetch(SHEET_CSV_URL);
      
      if (response.ok) {
        const csvData = await response.text();
        const sheetProducts = csvToArray(csvData);
        
        sheetProducts.forEach(product => {
          if (product.name && product.price && (product.status || 'active').toLowerCase() !== 'inactive') {
            allProducts.push({
              id: product.id || 'sheet_' + Date.now() + Math.random(),
              source: 'Google Sheets',
              category: normalizeCategory(product.category),
              ...product
            });
          }
        });
        
        console.log('Products loaded from Google Sheets:', sheetProducts.length);
      }
    } catch (error) {
      console.warn('Failed to load from Google Sheets:', error);
    }
  }
  
  // If no products loaded, use sample products
  if (allProducts.length === 0) {
    allProducts = getSampleProducts();
    console.log('Using sample products:', allProducts.length);
  }
  
  // Store products globally
  window.productsData = allProducts;
  
  if (allProducts.length === 0) {
    showEmpty();
    return;
  }
  
  // Clear loading and add products
  productsEl.innerHTML = '';
  allProducts.forEach(product => {
    productsEl.appendChild(createProductCard(product));
  });
  
  console.log('Total products loaded:', allProducts.length);
  return allProducts;
}

// Global functions for cart and product details
window.addToCart = function(productId) {
  console.log('Adding to cart:', productId);
  if (window.cart) {
    const product = window.productsData?.find(p => p.id === productId);
    if (product) {
      window.cart.addItem(product);
    } else {
      alert('Product not found. Please try again.');
    }
  } else {
    alert('Cart is loading, please try again.');
  }
};

window.showProductDetails = function(productId) {
  const product = window.productsData?.find(p => p.id === productId);
  if (!product) {
    alert('Product details not available.');
    return;
  }
  
  const modal = document.getElementById('productModal');
  const detailsContainer = document.getElementById('productDetails');
  
  if (!modal || !detailsContainer) {
    const details = `Product Details:\n\nName: ${product.name}\nPrice: ₦${parseInt(product.price || 0).toLocaleString()}\nDescription: ${product.description || 'No description'}\nCategory: ${product.category || 'Uncategorized'}\nProduct ID: ${product.id}`;
    alert(details);
    return;
  }
  
  const price = product.price ? `₦${parseInt(product.price).toLocaleString()}` : 'Price on request';
  const categoryDisplay = product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Product';
  
  detailsContainer.innerHTML = `
    <div class="product-detail-content">
      <div class="product-detail-image">
        <img src="${product.image || 'https://via.placeholder.com/400x300'}" alt="${product.name}">
      </div>
      <div class="product-detail-info">
        <div class="product-category">${categoryDisplay}</div>
        <h2>${product.name}</h2>
        <div class="product-price">${price}</div>
        <p class="product-description">${product.description || 'No description available'}</p>
        <div class="product-actions">
          <button class="btn btn-primary" onclick="addToCart('${product.id}'); closeProductModal();">Add to Cart</button>
          <button class="btn btn-success" onclick="contactWhatsApp('${product.id}')">Contact via WhatsApp</button>
        </div>
      </div>
    </div>
  `;
  
  modal.style.display = 'block';
};

window.closeProductModal = function() {
  const modal = document.getElementById('productModal');
  if (modal) modal.style.display = 'none';
};

window.contactWhatsApp = function(productId) {
  const product = window.productsData?.find(p => p.id === productId);
  if (!product) return;
  
  const whatsappLink = generateWhatsAppLink(product);
  window.open(whatsappLink, '_blank');
};

// Filter and sort functionality
function setupFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.querySelector('.search-btn');
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterAndSort);
  }
  
  if (sortFilter) {
    sortFilter.addEventListener('change', filterAndSort);
  }
  
  if (searchInput && window.location.pathname.includes('shop.html')) {
    searchInput.addEventListener('input', filterAndSort);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }
  
  if (searchBtn && window.location.pathname.includes('shop.html')) {
    searchBtn.addEventListener('click', handleSearch);
  }
}

function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.trim();
  
  if (window.location.pathname.includes('shop.html')) {
    filterAndSort();
    return;
  }
  
  if (searchTerm) {
    window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
  } else {
    window.location.href = 'shop.html';
  }
}

function filterAndSort() {
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const searchInput = document.getElementById('searchInput');
  const productsEl = document.getElementById('products');
  
  if (!window.productsData || !productsEl) return;
  
  let filteredProducts = [...window.productsData];
  
  // Filter by category
  if (categoryFilter && categoryFilter.value) {
    const selectedCategory = categoryFilter.value.toLowerCase();
    filteredProducts = filteredProducts.filter(p => {
      const productCategory = normalizeCategory(p.category);
      return productCategory === selectedCategory;
    });
  }
  
  // Filter by search term
  if (searchInput && searchInput.value.trim()) {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      (p.description && p.description.toLowerCase().includes(searchTerm)) ||
      (p.category && normalizeCategory(p.category).toLowerCase().includes(searchTerm))
    );
  }
  
  // Sort products
  if (sortFilter) {
    const sortValue = sortFilter.value;
    switch (sortValue) {
      case 'price-low':
        filteredProducts.sort((a, b) => parseInt(a.price || 0) - parseInt(b.price || 0));
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => parseInt(b.price || 0) - parseInt(a.price || 0));
        break;
      case 'name':
      default:
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
  }
  
  // Render filtered products
  productsEl.innerHTML = '';
  if (filteredProducts.length === 0) {
    productsEl.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px;">
        <div style="font-size: 24px; margin-bottom: 16px;">🔍</div>
        <p style="color: var(--text-muted);">No products found matching your criteria</p>
        <button onclick="clearFilters()" class="btn" style="margin-top: 16px;">Clear Filters</button>
      </div>
    `;
  } else {
    filteredProducts.forEach(product => {
      productsEl.appendChild(createProductCard(product));
    });
  }
}

function clearFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');
  
  if (categoryFilter) categoryFilter.value = '';
  if (searchInput) searchInput.value = '';
  
  filterAndSort();
}

// Handle URL parameters for category filtering
function handleUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const search = urlParams.get('search');
  
  if (category) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.value = category;
    }
  }
  
  if (search) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = decodeURIComponent(search);
    }
  }
  
  setTimeout(() => {
    filterAndSort();
  }, 100);
}

// Setup modal events
function setupModalEvents() {
  window.addEventListener('click', (e) => {
    const cartModal = document.getElementById('cartModal');
    const productModal = document.getElementById('productModal');
    
    if (e.target === cartModal) {
      cartModal.style.display = 'none';
    }
    if (e.target === productModal) {
      productModal.style.display = 'none';
    }
  });
}

// Wait for Firebase to initialize before loading products
if (window.firebase) {
  firebase.auth().onAuthStateChanged(() => {
    init().then(() => {
      setupFilters();
      
      if (window.location.pathname.includes('shop.html')) {
        setTimeout(handleUrlParams, 200);
      }
      
      setupModalEvents();
    });
  });
} else {
  window.addEventListener('DOMContentLoaded', () => {
    init().then(() => {
      setupFilters();
      
      if (window.location.pathname.includes('shop.html')) {
        setTimeout(handleUrlParams, 200);
      }
      
      setupModalEvents();
    });
  });
}