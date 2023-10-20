import {
  getCategories,
  getProductsByCategory,
  getVendors,
} from '../api/api.js';
import { getRandomItems } from '../api/helpers.js';
import { router } from '../router/router.js';

class HomePage extends HTMLElement {
  constructor() {
    super();
    this.categories = getCategories();
    this.vendors = getVendors();
    this.activeCategories = new Set();
    this.glide = null;
    this.render();
    this.handleEventClick = this.handleEventClick.bind(this);
  }

  connectedCallback() {
    this.addEventListener('click', this.handleEventClick);
    this.initializeCarousel();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleEventClick);
  }

  createCarouselButton(category) {
    return `<button class="category-button" data-category="${category}">${category}</button>`;
  }

  createCarouselItem(product) {
    return `<li class="glide__slide">
              <a href="/product/${product.id}" class="product-nav" data-product-id="${product.id}">${product.title}</a>
            </li>`;
  }

  handleToggleCategory(event) {
    const target = event.target;
    if (target.matches('.category-button')) {
      const category = target.getAttribute('data-category');
      this.activeCategories.has(category)
        ? this.activeCategories.delete(category)
        : this.activeCategories.add(category);
      this.updateUi();
    }
  }

  handleEventClick(event) {
    event.preventDefault();
    const target = event.target;
    if (target.matches('.product-nav')) {
      router.loadRoute(target.getAttribute('href'));
    } else if (target.matches('.category-button')) {
      this.handleToggleCategory(event);
    } else if (target.matches('[href="/plp"]')) {
      const queryString = target.getAttribute('data-query');
      router.loadRoute('/plp', queryString);
    } else if (target.matches('.scroll')) {
      const carouselPosition = this.querySelector('.carousel')?.offsetTop - 56; // ?: 56 = header height
      window.scrollTo({ top: carouselPosition, behavior: 'smooth' });
    }
  }

  initializeCarousel() {
    const glideEl = this.querySelector('.glide');
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
    const products = getProductsByCategory(Array.from(this.activeCategories));
    glideSlidesEl.innerHTML = products.map(this.createCarouselItem).join('');
    this.initializeCarousel();
  }

  createHeroContent(side) {
    const key = side.key;
    const categories = getRandomItems(this[key], this[key].length);
    const catsEl = categories
      .map((cat) => `<a href="/plp" data-query='${key}=${cat}'>${cat}</a>`)
      .join('');
    return `
      <div style="position:relative">
        <div class="ctr">
          <div class="content">
            <p style="margin-bottom:8px">${side.label}</p>
            <p class="title">${side.title}</p>
            <div class="nav-ctr">${catsEl}</div>
          </div>
        </div>
        <img class="hero-img" src=${side.imgPath} />
      </div>
      `;
  }

  render() {
    const heroSides = [
      {
        key: 'categories',
        label: 'New in',
        title: 'Spring Summer Collection',
        imgPath: 'static/images/Frame-135.png',
      },
      {
        key: 'vendors',
        label: 'New brand',
        title: 'Gray Label',
        imgPath: 'static/images/Frame-114.png',
      },
    ];

    const scrollButton = `<div style="position:absolute; bottom: -16px; left:0; right:0; display: flex; justify-content:center; background: transparent">
      <button class="scroll">
        <object type="image/svg+xml" data="../static/assets/chevron-down.svg"></object>
      </button>
    </div>`;

    const heroContent = heroSides
      .map(this.createHeroContent.bind(this))
      .join('');
    const categoriesEl = this.categories
      .map(this.createCarouselButton)
      .join('');
    const productsEl = getProductsByCategory(Array.from(this.activeCategories))
      .map(this.createCarouselItem)
      .join('');

    this.innerHTML = `
      <section id="hero">
        ${heroContent}
        ${scrollButton}
      </section>
      <div class="spacer"></div>
      <section class="carousel">
        <div>
          <h3>New in</h3>
        </div>
        <div class="categories">${categoriesEl}</div>
        <div class="products glide">
          <div class="glide__track" data-glide-el="track">
            <ul class="glide__slides">${productsEl}</ul>
          </div>
        </div>
        <a href="/plp">Shop all</a>
      </section>`;
  }
}

customElements.define('home-page', HomePage);
