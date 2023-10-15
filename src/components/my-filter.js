import { getCategories, getVendors } from '../api/index.js';
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
    this.currentFilterState = {
      sortOption: 'title-asc',
    };
  }

  connectedCallback() {
    this.defaultFilterState();
    this.render();
    this.addEventListeners();
  }

  defaultFilterState() {
    for (const filterKey in this.filterOptions) {
      this.updateFilterState(filterKey, []);
    }
  }

  updateFilterState(filterKey, selectedOptions) {
    this.currentFilterState[filterKey] = selectedOptions;
    this.dispatchEvent(
      new CustomEvent('filterUpdated', {
        bubbles: true,
        detail: this.currentFilterState,
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
    sortEl?.addEventListener('change', (event) => {
      const selectedSortOption = event.target.value;
      this.currentFilterState.sortOption = selectedSortOption;
      this.dispatchEvent(
        new CustomEvent('filterUpdated', {
          bubbles: true,
          detail: this.currentFilterState,
        })
      );
    });
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
    `;
  }
}

customElements.define('my-filter', MyFilter);
