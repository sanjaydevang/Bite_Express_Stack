import { StorageService } from '../services/StorageService.js';
import { QuantityControl } from '../components/QuantityControl.js';
import { formatCurrency } from '../utils/currency.js';

// The function is now async
export async function renderMenu(container) {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const restaurantId = parseInt(urlParams.get('id'));

  // --- NEW: Fetch menu items from the API ---
  let items = []; // Start with an empty array
  try {
    const response = await fetch(`http://localhost:3001/api/restaurants/${restaurantId}/menu`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    items = await response.json(); // Assign the fetched data
  } catch (error) {
    console.error('Failed to fetch menu:', error);
    container.innerHTML = '<p class="text-center text-danger p-5">Could not load menu. Is the backend server running or is the menu data missing?</p>';
    return; // Stop execution if fetch fails
  }

  // The rest of your rendering code stays exactly the same
  container.innerHTML = `
    <div class="container py-4">
      <div class="row g-4">
        ${items.map(item => `
          <div class="col-md-6">
            <div class="card h-100">
              <div class="row g-0">
                <div class="col-4">
                  <!-- CORRECTED: Image source now points to the local /images folder -->
                  <img src="./images/${item.image}" alt="${item.name}" class="object-fit-cover rounded-start menu-item-image h-100">
                </div>
                <div class="col-8">
                  <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text fw-bold">${formatCurrency(item.price)}</p>
                    <div class="d-flex align-items-center gap-8">
                      <div id="quantity-control-${item.id}"></div>
                      <button class="btn btn-primary" onclick="addItemToCart(${item.id})">
                        <i class="bi bi-cart-plus"></i> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // The rest of your interactivity code also stays the same
  const quantityControls = {};
  items.forEach(item => {
    quantityControls[item.id] = new QuantityControl(`quantity-control-${item.id}`);
  });

  window.addItemToCart = (itemId) => {
    const item = items.find(i => i.id === itemId);
    const quantity = quantityControls[itemId].getValue();
    
    if (quantity > 0) {
      StorageService.addToCart({ ...item, quantity });
      quantityControls[itemId] = new QuantityControl(`quantity-control-${itemId}`);
      
      const toast = document.createElement('div');
      toast.className = 'position-fixed bottom-0 end-0 p-3';
      toast.style.zIndex = '11';
      toast.innerHTML = `
        <div class="toast show" role="alert">
          <div class="toast-header">
            <strong class="me-auto">Added to Cart</strong>
            <button type="button" class="btn-close" onclick="this.closest('.toast').remove()"></button>
          </div>
          <div class="toast-body">
            ${item.name} x${quantity} added to cart
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };
}
