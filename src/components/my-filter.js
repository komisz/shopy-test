import { getCategories, getVendors } from '../api/api.js';
import { queryStringToObject } from '../api/helpers.js';
import MultiSelect from './multi-select.js';

export default class MyFilter extends HTMLElement {
  static observedAttributes = ['key', 'options', 'default-selected'];

  constructor(defaultFilterState) {
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
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
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

  addEventListeners() {
    this.querySelectorAll('multi-select')?.forEach((select) => {
      select?.addEventListener('selectionChange', (e) => {
        const key = e.target.key;
        this.updateFilterState(key, e.detail.selectedOptions);
      });
    });

    const sortEl = this.querySelector('#sort-select');
    sortEl?.addEventListener('change', (event) =>
      this.updateFilterState('sortOption', event.target.value)
    );

    const checkEl = this.querySelector('#onsale-checkbox');
    checkEl?.addEventListener('change', (event) =>
      this.updateFilterState('onSale', event.target.checked)
    );
  }

  render() {
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
      <label for="sort-select">Sort By:</label>
      <select id="sort-select">
        ${sortOptionsEl}
      </select>

      <label for="onsale-checkbox" class="container">On sale:
        <input type="checkbox" id="onsale-checkbox" ${
          this.filterState?.onSale ? 'checked' : ''
        }>
        <span class="checkmark"></span>
      </label>
    `;

    this.appendChild(vendorSelectorEl);
    this.appendChild(categorySelectorEl);
    this.innerHTML += otherFilters;
  }
}

customElements.define('my-filter', MyFilter);
