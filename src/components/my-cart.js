export default class ShoppingCart extends HTMLElement {
  constructor() {
    super();
    this.items = [];
    this.render();
  }

  setupEventListeners() {
    const closeCartBtn = this.querySelector('#close-cart-btn');
    const overlay = this.querySelector('#overlay');

    const toggleCart = (open) => {
      const cartDrawer = this.querySelector('#cart-drawer');
      const cartOverlay = this.querySelector('#overlay');
      if (open) {
        setTimeout(() => {
          cartDrawer?.classList.add('open');
          cartOverlay?.classList.add('open');
        }, 0);
      } else {
        cartDrawer?.classList.remove('open');
        cartOverlay?.classList.remove('open');
      }
    };

    closeCartBtn.addEventListener('click', () => toggleCart(false));
    overlay.addEventListener('click', () => toggleCart(false));
  }

  addItem(item) {
    const existingItem = this.items.find(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.selectedSize === item.selectedSize &&
        cartItem.selectedColor === item.selectedColor
    );

    if (existingItem) {
      existingItem.quantity += parseInt(item.quantity);
    } else {
      this.items.push(item);
    }

    this.render();
    this.toggleCart(true);
  }

  toggleCart(open) {
    const toggleCart = (open) => {
      const cartDrawer = this.querySelector('#cart-drawer');
      const cartOverlay = this.querySelector('#overlay');
      if (open) {
        setTimeout(() => {
          cartDrawer?.classList.add('open');
          cartOverlay?.classList.add('open');
        }, 0);
      } else {
        cartDrawer?.classList.remove('open');
        cartOverlay?.classList.remove('open');
      }
    };

    toggleCart(open);
  }

  render() {
    const cartItems = this.items
      .map(
        (item) =>
          `<li>${item.quantity} x ${item.title} - Size: ${item.selectedSize}, Color: ${item.selectedColor}</li>`
      )
      .join('');

    this.innerHTML = `
      <div id="cart-drawer" class="cart-drawer">
        <button class="close-cart-btn" id="close-cart-btn" type="button">
          close
        </button>
        <ul id="cart-items">
          ${cartItems}
        </ul>
      </div>
      <div id="overlay" class="overlay"></div>`;

    this.setupEventListeners();
  }
}

customElements.define('my-cart', ShoppingCart);
