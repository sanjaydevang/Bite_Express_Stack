import { renderRestaurants } from './pages/Restaurants.js';
import { renderMenu } from './pages/Menu.js';
import { renderCart } from './pages/Cart.js';
import { renderOrder } from './pages/Order.js';
import { renderOrderConfirmed } from './pages/OrderConfirmed.js';
import { renderOrderTracking } from './pages/OrderTracking.js';
import { renderContactUs } from './pages/ContactUs.js';

const routes = {
  '/': renderRestaurants,
  '/menu': renderMenu,
  '/cart': renderCart,
  '/order': renderOrder,
  '/order-confirmed': renderOrderConfirmed,
  '/order-tracking': renderOrderTracking,
  '/contact-us': renderContactUs
};

export function initRouter() {
  function handleRoute() {
    const hash = window.location.hash.slice(1);
    const [path, query] = hash.split('?');
    const cleanPath = path || '/';
    const renderer = routes[cleanPath] || routes['/'];
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    renderer(mainContent);
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}