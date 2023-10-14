import { getCategories, getProductsByCategory } from '../api/index.js';
import { router } from '../router/index.js';

export default class HomePage extends HTMLElement {
  constructor() {
    super();
    this.activeCategories = new Set();
    this.render();
  }

  connectedCallback() {
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  renderCategories(categories) {
    return categories
      .map(
        (category) => `
      <button class="category-button" data-category="${category}">${category}</button>
    `
      )
      .join('');
  }

  renderCarousel(products) {
    return products
      .map(
        (product) => `
      <button class="product-button" data-product-id="${product.id}">${product.title}</button>
    `
      )
      .join('');
  }

  handleToggleCategory(event) {
    const toggledCategoryEl = event.target;
    const category = toggledCategoryEl.getAttribute('data-category');

    if (this.activeCategories.has(category)) {
      this.activeCategories.delete(category);
      toggledCategoryEl.classList.remove('active');
    } else {
      this.activeCategories.add(category);
      toggledCategoryEl.classList.add('active');
    }

    this.updateUi();
  }

  handleGotoProduct(event) {
    const productId = event.target.getAttribute('data-product-id');
    router.loadRoute('product', productId);
  }

  addEventListeners() {
    const container = this.querySelector('.carousel');

    if (container) {
      container.addEventListener('click', this.handleEventClick);
    } else {
      console.error('Container element not found!');
    }
    // document.addEventListener('click', this.handleEventClick);
  }

  removeEventListeners() {
    document.removeEventListener('click', this.handleEventClick);
  }

  handleEventClick = (event) => {
    if (event.target.classList.contains('product-button')) {
      this.handleGotoProduct(event);
    }
    if (event.target.classList.contains('category-button')) {
      this.handleToggleCategory(event);
    }
  };

  updateUi() {
    const productsContainer = this.querySelector('.products');
    productsContainer.innerHTML = this.renderCarousel(
      getProductsByCategory(Array.from(this.activeCategories))
    );
  }

  render() {
    const categoriesEl = this.renderCategories(getCategories());
    const productsEl = this.renderCarousel(
      getProductsByCategory(Array.from(this.activeCategories))
    );

    this.innerHTML = `
      <section class="hero">
        <img class="hero-img" src="static/images/Frame-135.png" />
        <img class="hero-img" src="static/images/Frame-114.png" />
      </section>

      <div class="spacer">spacer</div>

      <section class="carousel">
        <div>
          <h3>New in</h3>
        </div>
        <div class="categories">
          ${categoriesEl}
        </div>
        <div class="products">
          ${productsEl}
        </div>
        <a href="/plp">Shop all</a>
      </section>
    `;
  }
}

customElements.define('home-page', HomePage);
