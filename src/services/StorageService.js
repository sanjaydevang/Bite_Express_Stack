import { EventBus } from '../utils/events.js';

export const StorageService = {
  getCart() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
  },

  setCart(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
    EventBus.emit('cart:updated', items);
  },

  addToCart(item) {
    const cart = this.getCart();
    const existingItem = cart.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    
    this.setCart(cart);
  },

  removeFromCart(itemId) {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    this.setCart(updatedCart);
  },

  getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
  },

  addOrder(order) {
    const orders = this.getOrders();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    this.setCart([]);
  },

  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find(order => order.id === orderId);
  }
};