import { getCategories, getProducts, paginateProducts } from '../api/api.js';
import MyFilter from '../components/my-filter.js';
import { createProductCard } from '../components/createProductCard.js';
import { router } from '../router/router.js';

export default class PLPPage extends HTMLElement {
  constructor() {
    super();
    this.searchParams = new URL(document.location).searchParams;
    this.allProducts = getProducts();
    this.isMobile = window.innerWidth <= 768;

    const filteredProducts = this.filterProducts(
      this.allProducts,
      this.filtersStateFromParams
    );
    this.paginatedProducts = paginateProducts(filteredProducts.slice());
    this.currentIndex = 0;
    this.currentProducts = this.paginatedProducts.data[this.currentIndex];

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

    const myFilterEl = new MyFilter(
      this.filtersStateFromParams,
      this.paginatedProducts.totalItems
    );
    this.insertBefore(myFilterEl, this.children[2]);

    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListener('resize', this.handleResize);
  }

  addEventListeners() {
    window.addEventListener('resize', this.handleResize.bind(this));

    this.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.matches('.product-nav, .product-nav *')) {
        const closestHref = event.target
          .closest('a.product-nav')
          ?.getAttribute('href');
        router.loadRoute(closestHref);
      } else if (event.target.matches('.more, .more *')) {
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

    const scrollButton = this.querySelector('.scroll');
    if (scrollButton) {
      scrollButton.addEventListener('click', this.handleScrollClick.bind(this));
    }
  }

  handleResize() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile !== this.isMobile) {
      this.isMobile = isMobile;
      this.render();
      this.addEventListeners();
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
    this.currentIndex = 0;

    const productCount = this.querySelector('.product-count');
    const productsEl = this.createProductItems(this.currentProducts);
    this.productGrid.innerHTML = productsEl;
    productCount.textContent = this.paginatedProducts.totalItems + ' items ';
    this.pageCounter.textContent = this.currentProducts?.length
      ? `${this.currentProducts.length} / ${this.paginatedProducts.totalItems} products`
      : null;
  }

  handleScrollClick() {
    const carouselPosition = this.querySelector('.left')?.offsetTop - 56; // ?: 56 = header height
    window.scrollTo({ top: carouselPosition, behavior: 'smooth' });
  }

  createProductItems(products) {
    if (!products?.length) {
      return `<div>Products not found.</div>`;
    }
    return products
      .map((p) => createProductCard(p, window.innerWidth <= 768))
      .join('');
  }

  render() {
    const productsEl = this.createProductItems(this.currentProducts);

    const scrollButton = `
      <button class="scroll">
        <object type="image/svg+xml" data="../static/assets/chevron-down.svg"></object>
      </button>`;

    const categoryLabels = getCategories().map((cat) => `<span>${cat}</span>`);

    this.innerHTML = `
      <section id="hero">
        <div>
          <h3>Decoration</h3>
          ${
            this.isMobile
              ? ''
              : `<div class="category-ctr">${categoryLabels.join('')}</div>`
          }
        </div>
        ${
          this.isMobile
            ? ''
            : `<div><img class="hero-img" src="static/images/Frame-125.png" /></div>`
        }
        <div><img class="hero-img" src="static/images/Frame-114.png" /></div>
        ${this.isMobile ? '' : scrollButton}
      </section>
      ${
        this.isMobile
          ? `<div class="category-ctr">${categoryLabels.join('')}</div>`
          : ''
      }

      <!-- MY FILTER append here -->

      ${this.isMobile ? '' : `<div class="spacer"></div>`}
      <div class="product-grid">${productsEl}</div>
      <div class="spacer"></div>
      <div class="page-counter">${this.currentProducts.length} / ${
      this.paginatedProducts.totalItems
    } products</div>
      <div><button class="more">Load more</button></div>
    `;
  }
}

customElements.define('plp-page', PLPPage);
