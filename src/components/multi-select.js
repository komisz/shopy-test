import { capitalizeFirstLetter } from '../api/helpers.js';

export default class MultiSelect extends HTMLElement {
  static observedAttributes = ['key', 'options', 'default-selected'];

  connectedCallback() {
    this.render();
    this.addEventListener('change', this.handleSelectChange.bind(this));
  }

  get key() {
    return this.getAttribute('key');
  }

  get options() {
    return JSON.parse(this.getAttribute('options')) || [];
  }

  get defaultSelected() {
    return JSON.parse(this.getAttribute('default-selected')) || [];
  }

  handleSelectChange(e) {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    const event = new CustomEvent('selectionChange', {
      bubbles: true,
      detail: { selectedOptions },
    });
    this.dispatchEvent(event);
    this.updateCounterLabel(selectedOptions.length);
  }

  updateCounterLabel(count) {
    this.querySelector('label span').innerText = count;
  }

  render() {
    const label = capitalizeFirstLetter(this.key);
    this.innerHTML = `
      <label for="multiselect-${this.key}">
        <div class="label-ctr">
          <p>${label} &nbsp;</p>
          <span>${this.defaultSelected.length}</span>
        </div>
      </label>
      <select id="multiselect-${this.key}" multiple data-key=${
      this.key
    } style="display:none">
        ${this.options
          .map(
            (option) =>
              `<option value="${option}" ${
                this.defaultSelected.includes(option) ? 'selected' : ''
              }>${option}</option>`
          )
          .join('')}
      </select>
    `;

    this.updateCounterLabel(this.defaultSelected.length);
  }
}

customElements.define('multi-select', MultiSelect);
