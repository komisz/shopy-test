import { getCategories, getProducts } from '../api/index.js';
import MultiSelect from '../components/multi-select.js';

function renderProductItem(product) {
  return `
    <div class="grid-item" id="${product.id}">
      ${product.id}, ${product.title}, ${product.price}
    </div>
  `;
}

function createMultiSelect(key, categories) {
  const multiSelectElement = new MultiSelect();
  multiSelectElement.setAttribute('data-options', categories);
  multiSelectElement.setAttribute('data-key', key);
  return multiSelectElement;
}

export default function PLPTemplate() {
  const products = getProducts();
  const categories = getCategories();

  function updateProducts(selectedOptions, filterKey) {
    // Filter products based on selected options and filter key
    const filteredProducts = products.filter((product) => {
      return selectedOptions.includes(product[filterKey]);
    });

    // Render filtered products
    const productsEl = filteredProducts.map(renderProductItem).join('');

    // Update the product grid with filtered products
    document.querySelector('.product-grid').innerHTML = productsEl;
    document.querySelector('.product-count').textContent =
      filteredProducts.length;
  }

  const productsEl = products.map(renderProductItem).join('');
  const multiSelectElement = createMultiSelect('category', categories);

  document
    .querySelector('main')
    .addEventListener('selectionChange', (event) => {
      const selectedOptions = event.detail.selectedOptions;
      const filterKey = event.detail.filterKey;

      // Handle the selected options and filterKey
      console.log(
        'Selected Options:',
        selectedOptions,
        'in filter:',
        filterKey
      );

      updateProducts(selectedOptions, filterKey);
    });

  return `
    <section class="hero">
      <img class="hero-img" src="static/images/Frame-114.png" alt="Hero Image 1">
      <img class="hero-img" src="static/images/Frame-125.png" alt="Hero Image 2">
    </section>

    <div class="spacer"></div>

    <div class="filter-bar">
      <div class="left">
        <p>Filter & Sort</p>
        <p>|</p>
        <span class="product-count">${products.length}</span>
      </div>

      <div class="right">
        ${multiSelectElement.outerHTML}
      </div>
    </div>

      <div class="product-grid">
        ${productsEl}
      </div>
  `;
}
