import { getCategories, getProductsByCategory } from '../api/index.js';
import { router } from '../router/index.js';

function renderCategories(categories) {
  return categories
    .map(
      (category) =>
        `<button class="category-button" data-category=${category} id=${category}>${category}</button>`
    )
    .join('');
}

function renderCarousel(products) {
  return products
    .map((product) => {
      return `<button class="product-button" data-product-id="${product.id}">${product.title}</button>`;
    })
    .join('');
}

function handleGotoProduct(event) {
  const productId = event.target.getAttribute('data-product-id');
  router.loadRoute('product', productId);
}

function addEventListenerByClass(className, callback, event = 'click') {
  document.addEventListener(event, function (event) {
    if (event.target.classList.contains(className)) {
      callback(event);
    }
  });
}

export default function HomeTemplate() {
  const categoriesEl = renderCategories(getCategories());

  const activeCategories = [];
  const products = renderCarousel(getProductsByCategory(activeCategories));

  function handleToggleCategory(event) {
    const toggledCategoryEl = event.target;
    const category = toggledCategoryEl.getAttribute('data-category');

    const idx = activeCategories.findIndex((cat) => cat === category);
    if (idx < 0) {
      activeCategories.push(category);
      toggledCategoryEl.classList.add('active');
    } else {
      activeCategories.splice(idx, 1);
      toggledCategoryEl.classList.remove('active');
    }

    updateUi();
  }

  function updateUi() {
    const filteredProductsEl = renderCarousel(
      getProductsByCategory(activeCategories)
    );
    document.querySelector('.products').innerHTML = filteredProductsEl;
  }

  addEventListenerByClass('product-button', handleGotoProduct);
  addEventListenerByClass('category-button', handleToggleCategory);

  return `
  <section class="hero">
    <img class="hero-img" src="static/images/Frame-135.png" />
    <img class="hero-img" src="static/images/Frame-114.png" />
  </section>

  <div class="spacer">spacer</div>

  <section class="carousel">
    <div>
      <h3>New in</h3>
    </div>
    <div class="categories">
        ${categoriesEl}
    </div>
    <div class="products">
      ${products}
    </div>
      <a href="/pdp">PDP</a>
  </section>
  `;
}
