import { EventBus } from '../utils/events.js';
import { StorageService } from '../services/StorageService.js';

export class CartCounter {
  constructor(element) {
    this.element = element;
    this.render();
    this.bindEvents();
  }

  bindEvents() {
    EventBus.on('cart:updated', () => this.render());
  }

  render() {
    const count = StorageService.getCart().length;
    this.element.textContent = count;
  }
}