export class QuantityControl {
  constructor(containerId, initialValue = 0) {
    this.container = document.getElementById(containerId);
    this.value = initialValue;
    this.render();
    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelector('.decrease').addEventListener('click', () => this.decrease());
    this.container.querySelector('.increase').addEventListener('click', () => this.increase());
  }

  increase() {
    this.value++;
    this.updateDisplay();
  }

  decrease() {
    if (this.value > 0) {
      this.value--;
      this.updateDisplay();
    }
  }

  getValue() {
    return this.value;
  }

  updateDisplay() {
    this.container.querySelector('.quantity-value').textContent = this.value;
  }

  render() {
    this.container.innerHTML = `
      <div class="btn-group">
        <button class="btn btn-outline-secondary decrease">
          <i class="bi bi-dash"></i>
        </button>
        <span class="btn btn-outline-secondary quantity-value">${this.value}</span>
        <button class="btn btn-outline-secondary increase">
          <i class="bi bi-plus"></i>
        </button>
      </div>
    `;
  }
}