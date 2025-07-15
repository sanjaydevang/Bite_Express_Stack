import {StorageService} from '../services/StorageService.js';

export function renderOrderConfirmed(container) {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const orderId = urlParams.get('id');
    const order = StorageService.getOrderById(orderId);

    container.innerHTML = `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="card-title h4 mb-4">Order Confirmed</h2>
              
              <div class="card bg-light">
    <div class="card-body">
      <div class="d-flex align-items-center mb-2">
        <div class="bg-primary bg-opacity-10 p-3 rounded-circle me-4">
          <i class="bi bi-box-seam text-primary h3 mb-0"></i>
        </div>
        <div class="d-flex flex-fill">
            <div class="flex-fill">
              <h3 class="h5 mb-1">Order #${orderId}</h3> 
              <div class="d-flex">
                <p class="mb-0 me-2">Paid: $${order.total.toFixed(2)}</p>
                <span class="badge bg-success lh-1">${order.status}</span>
              </div>
               <p class="text-muted mb-0">
                    ${new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
            
            <div class="d-flex flex-shrink-1 align-items-center ">
              <button class="btn btn-primary" onclick="window.location.href='#/order-tracking'">
                Track Order
              </button>   
            </div>
        </div>
      </div>
      </div>
      </div>
              

            </div>
          </div>
        </div>
      </div>
    </div>
  `;


}