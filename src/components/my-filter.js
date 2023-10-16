import { getCategories, getVendors } from '../api/api.js';
import MultiSelect from './multi-select.js';

export default class MyFilter extends HTMLElement {
  constructor() {
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
    this.filterState = {
      category: [],
      vendor: [],
      onSale: false,
      sortOption: 'title-asc',
    };
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  updateFilterState(filterKey, selectedOptions) {
    this.filterState[filterKey] = selectedOptions;
    this.dispatchEvent(
      new CustomEvent('filterUpdated', {
        bubbles: true,
        detail: this.filterState,
      })
    );
  }

  addEventListeners() {
    for (const filterKey in this.filterOptions) {
      const multiSelect = this.querySelector(
        `multi-select[data-key="${filterKey}"]`
      );
      if (multiSelect) {
        multiSelect.addEventListener('selectionChange', (event) => {
          this.updateFilterState(filterKey, event.detail.selectedOptions);
        });
      }
    }

    const sortEl = this.querySelector('#sort-select');
    sortEl?.addEventListener('change', (event) =>
      this.updateFilterState('sortOption', event.target.value)
    );

    const checkEl = this.querySelector('#onsale-checkbox');
    checkEl?.addEventListener('change', (event) =>
      this.updateFilterState('onSale', event.target.checked)
    );
  }

  createMultiSelect(key, options) {
    const multiSelectElement = new MultiSelect();
    multiSelectElement.setAttribute('data-options', options);
    multiSelectElement.setAttribute('data-key', key);
    return multiSelectElement;
  }

  render() {
    const filterEls = Object.entries(this.filterOptions).map(
      ([key, options]) => {
        const multiSelectElement = this.createMultiSelect(key, options);
        return multiSelectElement;
      }
    );

    this.innerHTML = '';
    filterEls.forEach((filterEl) => {
      this.appendChild(filterEl);
    });

    this.innerHTML += `
      <label for="sort-select">Sort By:</label>
      <select id="sort-select">
        ${this.sortOptions
          .map((option) => `<option value="${option}">${option}</option>`)
          .join('')}
      </select>

      <label for="onsale-checkbox" class="container">On sale:
        <input type="checkbox" id="onsale-checkbox"
          ${this.filterState.onSale ? 'checked' : ''}
        >
        <span class="checkmark"></span>
      </label>
    `;
  }
}

customElements.define('my-filter', MyFilter);
