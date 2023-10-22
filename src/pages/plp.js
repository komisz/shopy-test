import { getProducts, paginateProducts } from '../api/api.js';
import MyFilter from '../components/my-filter.js';
import { router } from '../router/router.js';

export default class PLPPage extends HTMLElement {
  constructor() {
    super();
    this.allProducts = getProducts();
    this.paginatedProducts = paginateProducts(this.allProducts.slice());
    this.currentIndex = 0;
    this.currentProducts = this.paginatedProducts.data[this.currentIndex];
    this.searchParams = new URL(document.location).searchParams;

    this.render();
  }

  get filtersStateFromParams() {
    const filterState = {
      onSale: !!this.searchParams?.get('onSale'),
      categories: this.searchParams?.get('categories')
        ? [this.searchParams?.get('categories')]
        : [],
      vendors: this.searchParams?.get('vendors')
        ? [this.searchParams?.get('vendors')]
        : [],
      sortOption: this.searchParams?.get('sort') || 'title-asc',
    };

    return filterState;
  }

  connectedCallback() {
    this.productGrid = this.querySelector('.product-grid');
    this.productCount = this.querySelector('.product-count');
    this.pageCounter = this.querySelector('.page-counter');
    this.addEventListeners();
  }

  addEventListeners() {
    this.addEventListener('click', (event) => {
      if (event.target.classList.contains('product-nav')) {
        event.preventDefault();
        router.loadRoute(event.target.getAttribute('href'));
      }
      if (event.target.classList.contains('more')) {
        event.preventDefault();
        this.loadMoreProducts();
      }
    });

    const myFilter = this.querySelector('my-filter');
    if (myFilter) {
      myFilter.addEventListener(
        'filterUpdated',
        this.handleFilterChange.bind(this)
      );
    }

    const sortSelect = this.querySelector('#sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', this.handleSortChange.bind(this));
    }
  }

  handleFilterChange(event) {
    const filters = event.detail;
    const filteredProducts = this.filterProducts(this.allProducts, filters);
    const sortedProducts = this.sortArr(filteredProducts, filters.sortOption);
    this.paginatedProducts = paginateProducts(sortedProducts);
    this.currentProducts = this.paginatedProducts.data[0];
    this.updateUi();
  }

  handleSortChange(event) {
    const sortOption = event.target.value;
    const sortedProducts = this.sortArr(
      this.paginatedProducts.data.flat(),
      sortOption
    );

    const pag = paginateProducts(sortedProducts);
    this.paginatedProducts = pag;
    this.currentProducts = pag.data[0];
    this.updateUi();
  }

  filterProducts(products, filters) {
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
          filters['onSale'] &&
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

  sortArr(arr, sortOption) {
    const [sortKey, sortOrder] = sortOption.split('-');
    return arr.sort((a, b) => {
      const aValue = String(a[sortKey]);
      const bValue = String(b[sortKey]);
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue, undefined, { numeric: true });
      } else {
        return bValue.localeCompare(aValue, undefined, { numeric: true });
      }
    });
  }

  loadMoreProducts() {
    if (this.currentIndex + 1 < this.paginatedProducts.totalChunks) {
      this.currentIndex += 1;

      const nextProducts = this.paginatedProducts.data[this.currentIndex];

      this.currentProducts = [...this.currentProducts, ...nextProducts];
      this.productGrid.innerHTML += this.createProductItems(nextProducts);
      this.pageCounter.textContent = `${this.currentProducts.length} / ${this.paginatedProducts.totalItems} products`;
    }
  }

  updateUi() {
    const productsEl = this.createProductItems(this.currentProducts);
    this.productGrid.innerHTML = productsEl;

    this.productCount.textContent = this.paginatedProducts.totalItems;
    this.pageCounter.textContent = `${this.currentProducts.length} / ${this.paginatedProducts.totalItems} products`;
  }

  createProductItems(products) {
    const heartIcon = `<object type="image/svg+xml" width="32" height="32" data="../static/assets/heart.svg"></object>`;
    return products
      .map(
        ({ id, title, images, vendor, onSale, price, salePrice }) => `
    <a href="/product/${id}" class="product-nav" data-product-id="${id}">
        <div class="product-card">
          <img src='${images[0]}'></img>
          ${heartIcon}
          <div class="label-ctr">
            ${
              onSale
                ? `<span class="label">${Math.ceil(
                    ((price - salePrice) / price) * -100
                  )}%</span>`
                : ''
            }
          </div>
          <div class="content">
            <div>
              <p class="title">${title}</p>
              <p class="description">${vendor}</p>
            </div>
            <div class="price-ctr">
              ${
                onSale
                  ? `<p class="price original"><strong>€ ${price},00</strong></p>`
                  : ''
              }
              <p class="price"><strong>€ ${
                onSale ? salePrice : price
              },00</strong></p>
            </div>
          </div>
        </div>
        </a>`
      )
      .join('');
  }

  render() {
    const productsEl = this.createProductItems(this.currentProducts);
    this.innerHTML = `
      <section id="hero">
        <!-- Your hero content here -->
      </section>

      <div class="spacer"></div>
      <div class="filter-bar">
        <div class="left">
          <p>Filter & Sort</p>
          <p>|</p>
          <span class="product-count">${this.paginatedProducts.totalItems}</span>
        </div>
        <div class="right">
          <span style="color: gray"><i>you can apply multiple select options with cmd/shift + click</i></span>
        </div>
      </div>

      <div class="product-grid">
        ${productsEl}
      </div>
      <div class="spacer"></div>
      <div class="page-counter" style="text-align: center; margin-bottom: 32px">
        ${this.currentProducts.length} / ${this.paginatedProducts.totalItems} products
      </div>
      <div>
        <button class="more">Load more</button>
      </div>
    `;

    const rightEl = this.querySelector('.right');
    if (rightEl) {
      const myFilterEl = new MyFilter(this.filtersStateFromParams);
      rightEl.appendChild(myFilterEl);
    }
  }
}

customElements.define('plp-page', PLPPage);
