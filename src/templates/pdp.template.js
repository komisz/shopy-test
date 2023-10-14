import { getProductById } from '../api/index.js';

export default class PDPPage extends HTMLElement {
  connectedCallback() {
    const productId = this.getAttribute('product-id');
    const product = getProductById(productId);

    if (!product) {
      this.innerHTML = '<h1>Sorry, product not found.</h1>';
    } else {
      this.render(product);
    }
  }

  render(product) {
    this.innerHTML = `
      <div class="pdp-ctr">
        ${JSON.stringify(product)}
      </div>
    `;
  }
}

customElements.define('pdp-page', PDPPage);
