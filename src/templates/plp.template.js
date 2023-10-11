import { getProducts } from '../api/index.js';

function renderProducts(products) {
  return products
    .map(
      (product) =>
        `<div class="grid-item" id={product.id}>${product.id}, ${product.title}, ${product.price}</div>`
    )
    .join('');
}

export default function PLPTemplate() {
  const productsEl = renderProducts(getProducts());

  return `
      <section class="hero">
        <img class="hero-img" src="static/images/Frame-114.png"></img>
        <img class="hero-img" src="static/images/Frame-125.png"></img>
      </section>

      <div class="spacer"></div>

      <div class="filter-bar">
        <div class="left">LEFT filter bar</div>
        <div class="right">RIGHT filter bar</div>
      </div>
      <div class="product-grid">
        ${productsEl}
      </div>
    </div>`;
}
