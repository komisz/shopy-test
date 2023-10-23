export default class ShoppingCart extends HTMLElement {
  constructor() {
    super();
    this.items = [];
    this.render();

    this.headerCartItemsCounter = null;
  }

  connectedCallback() {
    this.headerCartItemsCounter = document
      .querySelector('my-header')
      .querySelector('#cart-control .cart-counter');
    if (!this.headerCartItemsCounter) {
      console.error('My-cart cant find header.');
    }
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

    const removeButtons = this.querySelectorAll('#cart-items button');
    removeButtons.forEach((button) => {
      button.addEventListener('click', this.removeItem.bind(this));
    });
  }

  addItem(item) {
    const existingItem = this.items.find(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.selectedSize === item.selectedSize &&
        cartItem.selectedColor === item.selectedColor
    );

    if (existingItem) {
      existingItem.quantity = parseInt(existingItem.quantity);
      existingItem.quantity += parseInt(item.quantity);
    } else {
      this.items.push(item);
    }

    this.headerCartItemsCounter.textContent = this.items.length;

    this.render(); // rendered closed
    this.toggleCart(); // to play the animation
  }

  removeItem(event) {
    const idx = event.target.getAttribute('data-idx');

    if (idx !== null) {
      this.items.splice(idx, 1);
      this.headerCartItemsCounter.textContent = this.items.length;

      this.render(true);
    }
  }

  toggleCart() {
    const cartDrawer = this.querySelector('#cart-drawer');
    const cartOverlay = this.querySelector('#overlay');
    if (
      !cartDrawer?.classList.contains('open') &&
      !cartOverlay?.classList.contains('open')
    ) {
      setTimeout(() => {
        cartDrawer?.classList.add('open');
        cartOverlay?.classList.add('open');
      }, 0);
    } else {
      cartDrawer?.classList.remove('open');
      cartOverlay?.classList.remove('open');
    }
  }

  calculateTotal(products) {
    let total = 0;
    products.forEach((product) => {
      total += parseInt(product.salePrice || product.price) * product.quantity;
    });
    return total;
  }

  render(open = false) {
    const cartItems = this.items
      .map(
        (item, idx) =>
          `<li class="cart-item">
            <div>
                ${item.quantity} x ${item.title} - Size: ${
            item.selectedSize
          }, Color: ${item.selectedColor} for <strong>${
            item.salePrice || item.price * item.quantity
          }$</strong>
            </div>
            <div>
              <button data-idx="${idx}" type="button" aria-label="remove-item-from-cart-button">
                x
              </button>
            </div>
          </li>`
      )
      .join('');

    const totalAmount = this.calculateTotal(this.items);

    this.innerHTML = `
      <div id="cart-drawer" class="cart-drawer ${open ? 'open' : ''}">
        <div class="cart-top">
          <h3>Your Cart</h3>
          <button class="close-cart-btn" id="close-cart-btn" type="button" aria-label="close-cart-button">
            X
          </button>
        </div>

        <ul id="cart-items">
          ${cartItems}
        </ul>

        <div class="cart-total">
          <strong>Total: ${totalAmount} $</strong>
        </div>
      </div>
      <div id="overlay" class="overlay ${open ? 'open' : ''}"></div>`;

    this.setupEventListeners();
  }
}

customElements.define('my-cart', ShoppingCart);
