import { getCategories, getProductsByCategory } from '../api/api.js';
import { router } from '../router/router.js';

export default class HomePage extends HTMLElement {
  activeCategories = new Set();

  constructor() {
    super();
    this.glide = null;
    this.render();
  }

  connectedCallback() {
    this.querySelector('.carousel').addEventListener(
      'click',
      this.handleEventClick
    );
    this.initializeCarousel();
  }

  disconnectedCallback() {
    this.querySelector('.carousel').removeEventListener(
      'click',
      this.handleEventClick
    );
  }

  createCategories(categories) {
    return categories
      .map(
        (category) => `
      <button class="category-button" data-category="${category}">${category}</button>
    `
      )
      .join('');
  }

  createCarouselItems(products) {
    return products
      .map(
        (product) => `
          <li class="glide__slide">
            <a href="/product/${product.id}" class="product-nav" data-product-id="${product.id}">${product.title}</a>
          </li>`
      )
      .join('');
  }

  handleToggleCategory(event) {
    const target = event.target;
    if (target.matches('.category-button')) {
      const category = target.getAttribute('data-category');
      if (this.activeCategories.has(category)) {
        this.activeCategories.delete(category);
        target.classList.remove('active');
      } else {
        this.activeCategories.add(category);
        target.classList.add('active');
      }
      this.updateUi();
    }
  }

  handleEventClick = (event) => {
    event.preventDefault();
    if (event.target.matches('.product-nav')) {
      router.loadRoute(event.target.getAttribute('href'));
    } else if (event.target.matches('.category-button')) {
      this.handleToggleCategory(event);
    } else if (event.target.matches('[href="/plp"]')) {
      router.loadRoute('/plp');
    }
  };

  initializeCarousel() {
    const glideEl = document.querySelector('.glide');

    if (glideEl) {
      this.glide = new Glide(glideEl, {
        type: 'carousel',
        startAt: 0,
        perView: 5,
        autoplay: 1000,
      });
      this.glide.mount();
    }
  }

  updateUi() {
    if (this.glide) {
      this.glide.destroy();
    }

    const glideSlidesEl = this.querySelector('.glide__slides');
    glideSlidesEl.innerHTML = this.createCarouselItems(
      getProductsByCategory(Array.from(this.activeCategories))
    );

    this.initializeCarousel();
  }

  render() {
    const categoriesEl = this.createCategories(getCategories());
    const productsEl = this.createCarouselItems(
      getProductsByCategory(Array.from(this.activeCategories))
    );

    this.innerHTML = `
      <section class="hero">
        <img class="hero-img" src="static/images/Frame-135.png" />
        <img class="hero-img" src="static/images/Frame-114.png" />
      </section>

      <div class="spacer"></div>

      <section class="carousel">
        <div>
          <h3>New in</h3>
        </div>
        <div class="categories">
          ${categoriesEl}
        </div>

         <div class="products glide">
          <div class="glide__track" data-glide-el="track">
            <ul class="glide__slides">
              ${productsEl}
            </ul>
          </div>
        </div>

        <a href="/plp">Shop all</a>
      </section>
    `;
  }
}

customElements.define('home-page', HomePage);
