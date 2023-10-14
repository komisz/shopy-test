import { getProducts } from '../api/index.js';
import MyFilter from '../components/my-filter.js';
import { router } from '../router/index.js';

export default class PLPPage extends HTMLElement {
  constructor() {
    super();
    this.allProducts = getProducts();
    this.currentProducts = this.allProducts.slice();
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.render();
  }

  connectedCallback() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.addEventListener('click', (event) => {
      if (event.target.classList.contains('product-nav')) {
        event.preventDefault();
        router.loadRoute(event.target.getAttribute('href'));
      }
    });

    const myFilter = this.querySelector('my-filter');
    if (!myFilter) {
      console.error('Missing my-filter');
    } else {
      myFilter.addEventListener('filterUpdated', this.handleFilterChange);
    }
  }

  filterProducts(products, filters) {
    return products.filter((product) => {
      for (const filterKey in filters) {
        if (
          filters[filterKey].length > 0 &&
          !filters[filterKey].includes(product[filterKey])
        ) {
          return false;
        }
      }
      return true;
    });
  }

  handleFilterChange(event) {
    this.currentProducts = this.filterProducts(
      this.allProducts,
      event.detail // filter current state
    );
    this.updateUi(this.currentProducts);
  }

  renderProductItems(products) {
    return products
      .map(
        (product) =>
          `<a href="/product/${product.id}" class="product-nav" data-product-id="${product.id}">${product.title}</a>`
      )
      .join('');
  }

  updateUi(products) {
    this.querySelector('.product-grid').innerHTML =
      this.renderProductItems(products);
    this.querySelector('.product-count').textContent = products.length;
  }

  render() {
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
          <span class="product-count">${this.currentProducts.length}</span>
        </div>
        <div class="right">
          <my-filter></my-filter>
        </div>
      </div>

      <div class="product-grid">
        ${this.renderProductItems(this.currentProducts)}
      </div>
    `;
  }
}

customElements.define('plp-page', PLPPage);
