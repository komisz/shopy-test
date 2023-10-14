import { getCategories, getVendors } from '../api/index.js';
import MultiSelect from './multi-select.js';

export default class MyFilter extends HTMLElement {
  constructor() {
    super();
    this.filters = {
      category: getCategories(),
      vendor: getVendors(),
    };
    this.currentFilterState = {};
  }

  connectedCallback() {
    this.defaultFilterState();
    this.render();
    this.addEventListeners();
  }

  defaultFilterState() {
    for (const filterKey in this.filters) {
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
    for (const filterKey in this.filters) {
      const multiSelect = this.querySelector(
        `multi-select[data-key="${filterKey}"]`
      );
      if (multiSelect) {
        multiSelect.addEventListener('selectionChange', (event) => {
          this.updateFilterState(filterKey, event.detail.selectedOptions);
        });
      }
    }
  }

  createMultiSelect(key, options) {
    const multiSelectElement = new MultiSelect();
    multiSelectElement.setAttribute('data-options', options);
    multiSelectElement.setAttribute('data-key', key);
    return multiSelectElement;
  }

  render() {
    const filterEls = Object.entries(this.filters).map(([key, options]) => {
      const multiSelectElement = this.createMultiSelect(key, options);
      return multiSelectElement;
    });

    this.innerHTML = '';
    filterEls.forEach((filterEl) => {
      this.appendChild(filterEl);
    });
  }
}

customElements.define('my-filter', MyFilter);
