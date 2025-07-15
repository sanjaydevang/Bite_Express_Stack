import { StorageService } from '../services/StorageService.js';
import { formatCurrency } from '../utils/currency.js';

export function renderOrder(container) {
  const cart = StorageService.getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax

  function calculateTotal(tipPercentage) {
    return subtotal + tax + (subtotal * (tipPercentage / 100));
  }

  container.innerHTML = `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="card-title h4 mb-4">Order Summary</h2>
              
              <div class="list-group mb-4">
                ${cart.map(item => `
                  <div class="list-group-item">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <img src="${item.image}" alt="${item.name}" 
                             class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
                      </div>
                      <div class="col">
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="mb-0 text-muted small">
                          ${item.quantity} × ${formatCurrency(item.price)}
                        </p>
                      </div>
                      <div class="col-auto">
                        <span class="fw-bold">${formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="card bg-light mb-4">
                <div class="card-body">
                  <div class="mb-3">
                    <div class="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <span>${formatCurrency(subtotal)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span>Tax (10%)</span>
                      <span>${formatCurrency(tax)}</span>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Tip</label>
                      <select id="tipPercentage" class="form-select" onchange="updateTotal()">
                        <option value="0">No tip</option>
                        <option value="10">10% tip</option>
                        <option value="15">15% tip</option>
                        <option value="20">20% tip</option>
                      </select>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span id="totalAmount">${formatCurrency(calculateTotal(0))}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button class="btn btn-primary" onclick="placeOrder()">
                  <i class="bi bi-check-circle me-2"></i>Place Order
                </button>
                <a href="#/cart" class="btn btn-outline-secondary">
                  <i class="bi bi-arrow-left me-2"></i>Back to Cart
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  window.updateTotal = () => {
    const tipPercentage = parseInt(document.getElementById('tipPercentage').value);
    const total = calculateTotal(tipPercentage);
    document.getElementById('totalAmount').textContent = formatCurrency(total);
  };

  window.placeOrder = () => {
    const tipPercentage = parseInt(document.getElementById('tipPercentage').value);
    const total = calculateTotal(tipPercentage);
    const orderId = Date.now().toString();
    
    const order = {
      id: orderId,
      items: cart,
      subtotal,
      tax,
      tip: subtotal * (tipPercentage / 100),
      total,
      status: 'Confirmed',
      date: new Date().toISOString()
    };

    StorageService.addOrder(order);
    StorageService.setCart([]);
    window.location.href = `#/order-confirmed?id=${orderId}`;
  };
}