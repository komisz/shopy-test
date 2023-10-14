import { getCategories, getProductsByCategory } from '../api/index.js';
import { router } from '../router/index.js';

export default class HomePage extends HTMLElement {
  activeCategories = new Set();

  connectedCallback() {
    this.render();
    this.querySelector('.carousel').addEventListener(
      'click',
      this.handleEventClick
    );
  }

  disconnectedCallback() {
    this.querySelector('.carousel').removeEventListener(
      'click',
      this.handleEventClick
    );
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
      <a href="/product/${product.id}" class="product-nav" data-product-id="${product.id}">${product.title}</a>
    `
      )
      .join('');
  }

  handleToggleCategory(event) {
    const target = event.target;
    if (target.matches('.category-button')) {
      const category = target.getAttribute('data-category');
      if (this.activeCategories.has(category)) {
        this.activeCategories.delete(category);
        target.classList.remove('active');
      } else {
        this.activeCategories.add(category);
        target.classList.add('active');
      }
      this.updateUi();
    }
  }

  handleEventClick = (event) => {
    event.preventDefault();
    if (event.target.matches('.product-nav')) {
      router.loadRoute(event.target.getAttribute('href'));
    } else if (event.target.matches('.category-button')) {
      this.handleToggleCategory(event);
    } else if (event.target.matches('[href="/plp"]')) {
      router.loadRoute('/plp');
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
