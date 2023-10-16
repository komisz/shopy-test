import { getProducts } from '../api/api.js';
import MyFilter from '../components/my-filter.js';
import { router } from '../router/router.js';

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

    const sortSelect = this.querySelector('#sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', this.handleSortChange);
    }
  }

  sortProducts(products, sortOption) {
    const [sortKey, sortOrder] = sortOption.split('-');
    return products.sort((a, b) => {
      const aValue = String(a[sortKey]);
      const bValue = String(b[sortKey]);
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue, undefined, { numeric: true });
      } else {
        return bValue.localeCompare(aValue, undefined, { numeric: true });
      }
    });
  }

  filterProducts(products, filters) {
    return products.filter((product) => {
      for (const filterKey in filters) {
        if (filterKey === 'sortOption') {
          continue;
        }
        if (filterKey === 'vendor' && filters.vendor.length > 0) {
          const vendorWords = product[filterKey].split(' '); // 💡 :split vendor name into words to avoid filtering issues
          const matches = filters.vendor.some((filterWord) =>
            vendorWords.includes(filterWord)
          );
          if (!matches) {
            return false;
          }
        } else if (
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
      event.detail // 💡: filter current state
    );
    this.updateUi(
      this.sortProducts(this.currentProducts, event.detail.sortOption)
    );
  }

  createProductItems(products) {
    return products
      .map(
        (product) =>
          `<a href="/product/${product.id}" class="product-nav" data-product-id="${product.id}">${product.title}</a>`
      )
      .join('');
  }

  updateUi(products) {
    this.querySelector('.product-grid').innerHTML =
      this.createProductItems(products);
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
          <span style="color: gray"><i>you can apply multiple select options with cmd/shift + click</i></span>
        </div>
      </div>

      <div class="product-grid">
        ${this.createProductItems(this.currentProducts)}
      </div>
    `;
  }
}

customElements.define('plp-page', PLPPage);
