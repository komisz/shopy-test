import { getCategories, getVendors } from '../api/api.js';
import MultiSelect from './multi-select.js';

export default class MyFilter extends HTMLElement {
  constructor(defaultFilterState, productCount) {
    super();
    this.sortOptions = [
      'title-asc',
      'title-desc',
      'price-asc',
      'price-desc',
      'vendor-asc',
      'vendor-desc',
    ];
    this.filterOptions = {
      category: getCategories(),
      vendor: getVendors(),
    };
    this.filterState = defaultFilterState;
    this.productCount = productCount;
    this.isMobile = window.innerWidth <= 768;
    this.render();
  }

  connectedCallback() {
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListener('resize', this.handleResize);
  }

  updateFilterState(filterKey, selectedOptions) {
    this.filterState[filterKey] = selectedOptions;
    this.dispatchFilterUpdatedEvent();
  }

  dispatchFilterUpdatedEvent() {
    const event = new CustomEvent('filterUpdated', {
      bubbles: true,
      detail: this.filterState,
    });
    this.dispatchEvent(event);
  }

  createMultiSelect(key, options, defaultState) {
    const selectEl = document.createElement('multi-select');
    selectEl.setAttribute('key', key);
    selectEl.setAttribute('options', JSON.stringify(options));
    selectEl.setAttribute('default-selected', JSON.stringify(defaultState));
    return selectEl;
  }

  handleToggleOpen() {
    const elements = [
      ...this.querySelectorAll('select'),
      ...this.querySelectorAll('input'),
    ];
    elements.forEach(
      (el) =>
        (el.style.display =
          el.style.display === 'none' ? 'inline-block' : 'none')
    );
  }

  addEventListeners() {
    window.addEventListener('resize', this.handleResize.bind(this));

    this.addEventListener('click', (e) => {
      if (!e.target.matches('input') && !e.target.matches('select')) {
        e.preventDefault();
        this.handleToggleOpen();
      }
    });

    this.querySelectorAll('multi-select').forEach((select) => {
      select?.addEventListener('selectionChange', (e) => {
        const key = e.target.getAttribute('key');
        this.updateFilterState(key, e.detail.selectedOptions);
      });
    });

    this.querySelector('#sort-select')?.addEventListener('change', (event) =>
      this.updateFilterState('sortOption', event.target.value)
    );

    this.querySelector('#onsale-checkbox')?.addEventListener(
      'change',
      (event) => this.updateFilterState('onSale', event.target.checked)
    );
  }

  handleResize() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile !== this.isMobile) {
      this.isMobile = isMobile;
      this.render();
      this.addEventListeners();
    }
  }

  render() {
    const filterIcon = `<object type="image/svg+xml" width="24" height="24" data="../static/assets/filter.svg"></object>`;
    const vendorSelectorEl = this.createMultiSelect(
      'vendors',
      this.filterOptions.vendor,
      this.filterState.vendors
    );
    const categorySelectorEl = this.createMultiSelect(
      'categories',
      this.filterOptions.category,
      this.filterState.categories
    );
    const sortOptionsEl = this.sortOptions
      .map((option) => `<option value="${option}">${option}</option>`)
      .join('');

    const otherFilters = `
      <div style="position:relative">
        <label for="sort-select">Sort by ${this.filterState.sortOption}</label>
        <select id="sort-select" style="display:none">${sortOptionsEl}</select>
      </div>
      <div style="position:relative">
        <label for="onsale-checkbox" style="pointer-events: none;">On sale</label>
        <input type="checkbox" id="onsale-checkbox" ${
          this.filterState?.onSale ? 'checked' : ''
        } style="display:none">
        <span class="checkmark"></span>
      </div>
    `;

    this.innerHTML = this.isMobile
      ? `<div class="left">
          <span class="product-count">${this.productCount} items
          </span>
        </div>
        <div class="right"><button type="button" id="toggle" aria-label="toggle-filters-button">${filterIcon}</button><p>Filter & Sort</p><span>${
          this.filterState.vendors.length + this.filterState.categories.length
        }</span></div>`
      : `<div class="left"><button type="button" id="toggle" aria-label="toggle-filters-button">${filterIcon}</button><p>Filter & Sort</p><p>|</p><span class="product-count">${this.productCount} items</span></div>
         <div class="right">${vendorSelectorEl.outerHTML}${categorySelectorEl.outerHTML}${otherFilters}</div>`;
  }
}

customElements.define('my-filter', MyFilter);
