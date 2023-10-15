import { getProductById } from '../api/index.js';

export default class PDPPage extends HTMLElement {
  constructor() {
    super();
    this.cart = document.querySelector('my-cart');
    this.product = null;
    this.currentSize = null;
    this.currentColor = null;
    this.currentQuantity = 1;
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
        this.currentSize = this.product.sizes[0];
        this.currentColor = this.product.colors[0];
        this.render();
      }
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    const colorSelect = this.querySelector('#color-select');
    const sizeSelect = this.querySelector('#size-select');
    const quantitySelect = this.querySelector('#quantity-select');
    const productImages = Array.from(this.querySelectorAll('.product-img'));

    const updateProductImagesBorderColor = (newColor) => {
      productImages.forEach((img) => {
        img.style.borderColor = newColor;
      });
    };

    colorSelect.addEventListener('change', (event) => {
      const newColor = event.target.value;
      this.currentColor = newColor;
      updateProductImagesBorderColor(newColor);
    });

    sizeSelect.addEventListener('change', (event) => {
      this.currentSize = event.target.value;
    });

    quantitySelect.addEventListener('change', (event) => {
      this.currentQuantity = event.target.value;
    });

    this.querySelector('.open-cart-btn').addEventListener('click', () => {
      const productToCart = {
        ...this.product,
        selectedSize: this.currentSize,
        selectedColor: this.currentColor,
        quantity: this.currentQuantity,
      };
      delete productToCart.sizes;
      delete productToCart.colors;
      delete productToCart.images;
      delete productToCart.handle;

      this.cart.addItem(productToCart);
    });
  }

  generateOptions(options, selectedValue) {
    return options
      .map(
        (option) =>
          `<option value="${option}" ${
            option === selectedValue ? 'selected' : ''
          }>${option}</option>`
      )
      .join('');
  }

  render() {
    const { sizes, colors, images, ...productInfo } = this.product;

    this.innerHTML = `
      <div class="pdp-ctr">
        <div class="product-img-ctr">
          ${images
            .map(
              (image, index) =>
                `<img class="product-img" key=${index} src=${image} style="border-color: ${this.currentColor}" />`
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
            <label id="selectedOptionsLabel" for="quantity-select">Select quantity:</label>
            <select data-key="quantity" id="quantity-select">${this.generateOptions(
              [1, 2, 3, 4, 5, 6, 7, 8, 9],
              this.currentQuantity
            )}</select>
            <label id="selectedOptionsLabel" for="size-select">Select size:</label>
            <select data-key="size" id="size-select">${this.generateOptions(
              sizes,
              this.currentSize
            )}</select>
            <label id="selectedOptionsLabel" for="color-select">Select color:</label>
            <select data-key="color" id="color-select">${this.generateOptions(
              colors,
              this.currentColor
            )}</select>
          </div>
          <button class="open-cart-btn" type="button">Add to cart</button>
        </div>
      </div>
    `;
  }
}

customElements.define('pdp-page', PDPPage);
