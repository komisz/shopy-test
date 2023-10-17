import { getProductById } from '../api/api.js';

export default class PDPPage extends HTMLElement {
  constructor() {
    super();
    this.cart = document.querySelector('my-cart');
    this.product = null;
    this.currentOptions = {
      size: null,
      color: null,
      quantity: 1,
    };
  }

  connectedCallback() {
    const productId = this.getAttribute('product-id');
    if (!productId) {
      this.innerHTML = '<h1>Sorry, product ID not provided.</h1>';
    } else {
      this.product = getProductById(productId);
      if (!this.product) {
        this.innerHTML = '<h1>Sorry, product not found.</h1>';
      } else {
        this.currentOptions.size = this.product.sizes[0];
        this.currentOptions.color = this.product.colors[0];
        this.render();
        this.setupEventListeners();
      }
    }
  }

  setupEventListeners() {
    this.querySelectorAll('select').forEach((select) => {
      select.addEventListener('change', (event) => {
        const key = select.getAttribute('data-key');
        this.currentOptions[key] = event.target.value;
        if (key === 'color') {
          this.handleColorChange(event.target.value);
        }
      });
    });

    this.querySelector('.open-cart-btn').addEventListener('click', () =>
      this.addToCart()
    );
  }

  handleColorChange(color) {
    this.querySelectorAll('.product-img').forEach((img) => {
      img.style.borderColor = color;
    });
  }

  createOptions(options, selectedValue) {
    return options
      .map(
        (option) =>
          `<option value="${option}" ${
            option === selectedValue ? 'selected' : ''
          }>${option}</option>`
      )
      .join('');
  }

  addToCart() {
    const { sizes, colors, images, handle, ...productInfo } = this.product;
    const productToCart = {
      ...productInfo,
      selectedSize: this.currentOptions.size,
      selectedColor: this.currentOptions.color,
      quantity: this.currentOptions.quantity,
    };
    this.cart.addItem(productToCart);
  }

  render() {
    const { sizes, colors, images, onSale, ...productInfo } = this.product;

    this.innerHTML = `
      <div class="pdp-ctr">
        <div class="product-img-ctr">
          ${images
            .map(
              (image, index) =>
                `<img class="product-img" key=${index} src=${image} style="border-color:${this.currentOptions.color}" />`
            )
            .join('')}
        </div>
        <div class="product-info">
          <ul>
            ${Object.entries(productInfo)
              .map(([key, value]) => `<li><p>${key}: ${value}</p></li>`)
              .join('')}
          </ul>
          <div class="product-options">
            <label for="quantity-select">Select quantity:</label>
            <select data-key="quantity">${this.createOptions(
              [1, 2, 3, 4, 5, 6, 7, 8, 9],
              this.currentOptions.quantity
            )}</select>
            <label for="size-select">Select size:</label>
            <select data-key="size">${this.createOptions(
              sizes,
              this.currentOptions.size
            )}</select>
            <label for="color-select">Select color:</label>
            <select data-key="color">${this.createOptions(
              colors,
              this.currentOptions.color
            )}</select>
          </div>
          <button class="open-cart-btn" type="button">Add to cart</button>
        </div>
      </div>
    `;
  }
}

customElements.define('pdp-page', PDPPage);
