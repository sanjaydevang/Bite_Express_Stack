import { StorageService } from '../services/StorageService.js';
import { formatCurrency } from '../utils/currency.js';

export function renderOrderTracking(container) {
  container.innerHTML = `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="card-title h4 mb-4">Track Your Order</h2>
              
              <div class="mb-4">
                <div class="input-group">
                  <input type="text" id="orderIdInput" class="form-control" 
                         placeholder="Enter your order ID">
                  <button class="btn btn-primary" onclick="trackOrder()">
                    <i class="bi bi-search me-2"></i>Track Order
                  </button>
                </div>
              </div>

              <div id="orderDetails"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  window.trackOrder = () => {
    const orderId = document.getElementById('orderIdInput').value.trim();
    const orderDetails = document.getElementById('orderDetails');
    
    if (!orderId) {
      orderDetails.innerHTML = `
        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Please enter an order ID
        </div>
      `;
      return;
    }

    const order = StorageService.getOrderById(orderId);
    
    if (order) {
      orderDetails.innerHTML = `
        <div class="card bg-light">
          <div class="card-body">
            <div class="d-flex align-items-center mb-4">
              <div class="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                <i class="bi bi-box-seam text-primary h4 mb-0"></i>
              </div>
              <div>
                <h3 class="h5 mb-1">Order #${order.id}</h3>
                <p class="text-muted mb-0">
                  <i class="bi bi-calendar3 me-2"></i>
                  ${new Date(order.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="h6 mb-0">Status</span>
                <span class="badge bg-success">${order.status}</span>
              </div>
              <div class="progress" style="height: 4px;">
                <div class="progress-bar bg-success" style="width: 100%"></div>
              </div>
            </div>

            <div class="list-group mb-4">
              ${order.items.map(item => `
                <div class="list-group-item bg-transparent">
                  <div class="row align-items-center">
                    <div class="col">
                      <h6 class="mb-1">${item.name}</h6>
                      <p class="mb-0 text-muted small">
                        Quantity: ${item.quantity} × ${formatCurrency(item.price)}
                      </p>
                    </div>
                    <div class="col-auto">
                      <span class="fw-bold">${formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="border-top pt-3">
              <div class="row">
                <div class="col-6">
                  <p class="mb-1">Subtotal</p>
                  <p class="mb-1">Tax</p>
                  <p class="mb-1">Tip</p>
                  <p class="fw-bold mb-0">Total</p>
                </div>
                <div class="col-6 text-end">
                  <p class="mb-1">${formatCurrency(order.subtotal)}</p>
                  <p class="mb-1">${formatCurrency(order.tax)}</p>
                  <p class="mb-1">${formatCurrency(order.tip)}</p>
                  <p class="fw-bold mb-0">${formatCurrency(order.total)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      orderDetails.innerHTML = `
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-circle me-2"></i>
          Order not found. Please check the order ID and try again.
        </div>
      `;
    }
  };
}