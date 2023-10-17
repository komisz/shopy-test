import { getProducts } from '../api/api.js';
import { queryStringToObject } from '../api/helpers.js';
import MyFilter from '../components/my-filter.js';
import { router } from '../router/router.js';

export default class PLPPage extends HTMLElement {
  constructor() {
    super();
    this.allProducts = getProducts();
    this.currentProducts = this.allProducts.slice();
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.searchParams = new URL(document.location).searchParams;

    this.render();
  }

  // todo: pass it into my-filter
  get filtersStateFromParams() {
    const searchObj = queryStringToObject(this.searchParams.toString());

    const filterState = {
      onSale: !!this.searchParams.get('onSale'),
      categories: this.searchParams.get('categories')
        ? [this.searchParams.get('categories')]
        : [],
      vendors: this.searchParams.get('vendors')
        ? [this.searchParams.get('vendors')]
        : [],
      sortOption: this.searchParams.get('sort') || 'title-asc',
    };

    return filterState;
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
    // ?: 💡 in product attr it uses single instead of multi, so here is a dummy dictionary
    const productKeyDictionary = {
      vendors: 'vendor',
      categories: 'category',
    };

    return products.filter((product) => {
      for (const filterKey in filters) {
        if (filterKey === 'sortOption') {
          break;
        }

        if (
          filterKey === 'onSale' &&
          filters['onSale'] && // ?: 💡 if no onSale checked than return every product
          filters[filterKey] !== product.onSale
        ) {
          return false;
        }

        if (filters[filterKey].length > 0) {
          const matches = filters[filterKey].find(
            (v) => v === product[productKeyDictionary[filterKey]]
          );
          if (!matches) {
            return false;
          }
        }
      }
      return true;
    });
  }

  handleFilterChange(event) {
    const filteredProducts = this.filterProducts(
      this.allProducts,
      event.detail // ?: 💡 filter current state
    );

    const sortedProds = this.sortProducts(
      filteredProducts,
      event.detail.sortOption
    );

    this.filteredProducts = sortedProds;

    this.updateUi(sortedProds);
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
    const filteredProducts = this.filterProducts(
      this.currentProducts,
      this.filtersStateFromParams
    );
    const productsEl = this.createProductItems(
      this.sortProducts(
        filteredProducts,
        this.filtersStateFromParams.sortOption
      )
    );

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
          <span class="product-count">${filteredProducts.length}</span>
        </div>
        <div class="right">
          <span style="color: gray"><i>you can apply multiple select options with cmd/shift + click</i></span>
        </div>
      </div>

      <div class="product-grid">
        ${productsEl}
      </div>
    `;

    // ! todo: shaky
    const rightEl = this.querySelector('.right');
    if (!rightEl) {
      console.error('right not found in PLP');
    } else {
      const myFilterEl = new MyFilter(this.filtersStateFromParams);
      rightEl?.appendChild(myFilterEl);
    }
  }
}

customElements.define('plp-page', PLPPage);
