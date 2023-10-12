export default class MultiSelect extends HTMLElement {
  static get observedAttributes() {
    return ['data-options', 'data-key'];
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  get options() {
    return this.getAttribute('data-options')?.split(',') || [];
  }

  get filterKey() {
    return this.getAttribute('data-key') || '';
  }

  render() {
    this.innerHTML = `
      <div>
        <label id="selectedOptionsLabel" for="multiselect">${
          this.filterKey
        }</label>
        <select id="multiselect" multiple data-key=${this.filterKey}>
          ${this.options
            .map((option) => `<option value=${option}>${option}</option>`)
            .join('')}
        </select>
      </div>
    `;
  }

  addEventListeners() {
    const selectEl = this.querySelector('#multiselect');
    const selectedOptionsCountEl = this.querySelector('#selectedOptionsLabel');

    selectEl.addEventListener('change', (e) => {
      const selectedOptions = Array.from(selectEl.selectedOptions).map(
        (o) => o.value
      );

      selectedOptionsCountEl.textContent = `${this.filterKey}${
        ': ' + selectedOptions.length
      }`;

      const event = new CustomEvent('selectionChange', {
        bubbles: true,
        detail: {
          selectedOptions,
          filterKey: this.filterKey,
        },
      });

      this.dispatchEvent(event);
    });
  }
}

customElements.define('multi-select', MultiSelect);
