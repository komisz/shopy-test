import { getProducts, getCategories } from '../api/index.js';
import { router } from '../router/index.js';

export default class PLPPage extends HTMLElement {
  constructor() {
    super();
    this.products = getProducts();
    this.categories = getCategories();
    this.render();
  }

  connectedCallback() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.querySelector('.product-grid').addEventListener(
      'click',
      this.handleProductClick
    );
    this.querySelector('multi-select').addEventListener(
      'selectionChange',
      this.handleFilterChange.bind(this)
    );
  }

  handleProductClick(event) {
    event.preventDefault();
    router.loadRoute(event.target.getAttribute('href'));
  }

  handleFilterChange(event) {
    const { selectedOptions, filterKey } = event.detail;
    const filteredProducts = this.products.filter((product) =>
      selectedOptions.includes(product[filterKey])
    );
    this.updateUi(filteredProducts);
  }

  renderProductItem(product) {
    return `
      <a href="/product/${product.id}" class="product-nav" data-product-id="${product.id}">${product.title}</a>
    `;
  }

  renderProductItems(products) {
    return products.map(this.renderProductItem).join('');
  }

  updateUi(products) {
    const productsEl = this.renderProductItems(products);
    this.querySelector('.product-grid').innerHTML = productsEl;
    this.querySelector('.product-count').textContent = products.length;
  }

  render() {
    const productsEl = this.renderProductItems(this.products);
    this.innerHTML = `
      <section class="hero">
        <img class="hero-img" src="static/images/Frame-114.png" alt="Hero Image 1">
        <img class="hero-img" src="static/images/Frame-125.png" alt="Hero Image 2">
      </section>

      <div class="spacer"></div>

      <div class="filter-bar">
        <div class="left">
          <p>Filter & Sort</p>
          <p>|</p>
          <span class="product-count">${this.products.length}</span>
        </div>
        <div class="right">
          <multi-select data-options=${this.categories} data-key="category"></multi-select>
        </div>
      </div>

      <div class="product-grid">
        ${productsEl}
      </div>
    `;
  }
}

customElements.define('plp-page', PLPPage);
