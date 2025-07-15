import { menuItems } from '../data/menuItems.js';
import { StorageService } from '../services/StorageService.js';
import { QuantityControl } from '../components/QuantityControl.js';
import { formatCurrency } from '../utils/currency.js';

export function renderMenu(container) {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const restaurantId = parseInt(urlParams.get('id'));
  const items = menuItems[restaurantId];

  container.innerHTML = `
    <div class="container py-4">
      <div class="row g-4">
        ${items.map(item => `
          <div class="col-md-6">
            <div class="card h-100">
              <div class="row g-0">
                <div class="col-4">
                  <img src="${item.image}" alt="${item.name}" class="object-fit-cover rounded-start menu-item-image h-100">
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