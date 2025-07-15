import { StorageService } from '../services/StorageService.js';
import { formatCurrency } from '../utils/currency.js';

export function renderCart(container) {
  const cart = StorageService.getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // A backup image for any item that doesn't have one
  const placeholderImage = 'https://placehold.co/80x80/eee/ccc?text=No+Image';

  container.innerHTML = `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="card-title h4 mb-4">Your Cart</h2>
              
              ${cart.length === 0 ? `
                <div class="text-center py-5">
                  <i class="bi bi-cart-x display-1 text-muted mb-3"></i>
                  <p class="lead text-muted">Your cart is empty</p>
                  <a href="#/" class="btn btn-primary">
                    <i class="bi bi-shop"></i> Browse Restaurants
                  </a>
                </div>
              ` : `
                <div class="list-group mb-4">
                  ${cart.map(item => `
                    <div class="list-group-item">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          
                          <!-- THIS IS THE ONLY LINE THAT WAS CHANGED -->
                          <img src="${item.image || placeholderImage}" alt="${item.name}" 
                               class="rounded" style="width: 80px; height: 80px; object-fit: cover;">

                        </div>
                        <div class="col">
                          <h5 class="mb-1">${item.name}</h5>
                          <p class="mb-1 text-muted">
                            Quantity: ${item.quantity} × ${formatCurrency(item.price)}
                          </p>
                          <p class="mb-0 fw-bold">
                            ${formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                        <div class="col-auto">
                          <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <div class="card bg-light">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span class="h5 mb-0">Subtotal</span>
                      <span class="h5 mb-0">${formatCurrency(subtotal)}</span>
                    </div>
                    <p class="text-muted small mb-4">
                      Taxes and delivery fees will be calculated at checkout
                    </p>
                    <div class="d-grid gap-2">
                      <a href="#/order" class="btn btn-primary">
                        <i class="bi bi-credit-card me-2"></i>Proceed to Checkout
                      </a>
                      <a href="#/" class="btn btn-outline-secondary">
                        <i class="bi bi-arrow-left me-2"></i>Continue Shopping
                      </a>
                    </div>
                  </div>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  window.removeFromCart = (itemId) => {
    StorageService.removeFromCart(itemId);
    renderCart(container);
  };
}