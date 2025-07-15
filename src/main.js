import { initRouter } from './router.js';
import { initHeader } from './components/Header.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initRouter();
});