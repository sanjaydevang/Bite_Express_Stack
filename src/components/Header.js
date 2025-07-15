import { CartCounter } from './CartCounter.js';

export function initHeader() {
  const header = document.getElementById('header');
  
  header.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div class="container">
        <a href="#/" class="navbar-brand fw-bold text-primary">BiteExpress</a>
        <div class="d-flex gap-2">
          <a href="#/contact-us" class="btn btn-secondary">Contact Us</a>
          <a href="#/order-tracking" class="btn btn-outline-primary">
            <i class="bi bi-truck"></i> Track Order
          </a>
          <a href="#/cart" class="btn btn-primary position-relative">
            <i class="bi bi-cart3"></i> Cart
            <span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              0
            </span>
          </a>
        </div>
      </div>
    </nav>
  `;

  new CartCounter(document.getElementById('cartCount'));
}