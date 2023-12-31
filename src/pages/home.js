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
    this.isMobile = window.innerWidth <= 768;

    this.render();
    this.handleEventClick = this.handleEventClick.bind(this);
  }

  connectedCallback() {
    this.addEventListener('click', this.handleEventClick);
    window.addEventListener('resize', this.handleResize.bind(this));
    this.initializeCarousel(this.isMobile);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleEventClick);
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile !== this.isMobile) {
      this.isMobile = isMobile;
      this.updateUi();
    }
  }

  createCarouselButton(category) {
    return `<button class="category-button" data-category="${category}" aria-label="category-tab-selector">${category}</button>`;
  }

  createCarouselProduct(product) {
    const heartIcon = `<object type="image/svg+xml" width="32" height="32" data="../static/assets/heart.svg"></object>`;
    const { id, title, images, vendor, onSale, price, salePrice } = product;
    return `
      <li class="glide__slide">
      <a href="/product/${product.id}" class="product-nav" data-product-id="${
      product.id
    }" aria-label="Navigate to the product's detail page.">
        <div class="product-card">
          <img src='${images[0]}' alt=${images[0]}></img>
          ${heartIcon}
          <div class="label-ctr">
            ${
              onSale
                ? `<span class="label">${Math.ceil(
                    ((price - salePrice) / price) * -100
                  )}%</span>`
                : ''
            }
          </div>
          <div class="content">
            <div>
              <p class="title">${title}</p>
              <p class="description">${vendor}</p>
            </div>
            <div class="price-ctr">
              ${
                onSale
                  ? `<p class="price original"><strong>€ ${price},00</strong></p>`
                  : ''
              }
              <p class="price"><strong>€ ${
                onSale ? salePrice : price
              },00</strong></p>
            </div>
          </div>
        </div>
        </a>
      </li>`;
  }

  handleEventClick(event) {
    event.preventDefault();

    const target = event.target;
    const productNav = target.closest('.product-nav');
    const categoryButton = target.closest('.category-button');
    const plpLink = target.closest('[href="/plp"]');
    const scrollButton = target.closest('.scroll');

    if (productNav) {
      router.loadRoute(productNav.getAttribute('href'));
    } else if (categoryButton) {
      this.handleToggleCategory(categoryButton);
    } else if (plpLink) {
      const queryString = plpLink.getAttribute('data-query');
      router.loadRoute('/plp', queryString);
    } else if (scrollButton) {
      this.handleScrollClick();
    }
  }

  handleToggleCategory(button) {
    const category = button.getAttribute('data-category');
    button.classList.toggle('active');

    if (this.activeCategories.has(category)) {
      this.activeCategories.delete(category);
    } else {
      this.activeCategories.add(category);
    }

    this.updateUi();
  }

  handleScrollClick() {
    const carouselPosition = this.querySelector('.carousel')?.offsetTop - 56; // ?: 56 = header height
    window.scrollTo({ top: carouselPosition, behavior: 'smooth' });
  }

  initializeCarousel(isMobile = false) {
    const glideEl = this.querySelector('.glide');
    if (glideEl) {
      this.glide = new Glide(glideEl, {
        type: 'carousel',
        startAt: 0,
        perView: isMobile ? 1.6 : 4.2,
        autoplay: 2000,
        gap: 8,
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
    glideSlidesEl.innerHTML = products.map(this.createCarouselProduct).join('');

    const productNavElements = glideSlidesEl.querySelectorAll('.product-nav');
    productNavElements.forEach((element) => {
      element.addEventListener('click', this.handleEventClick);
    });

    this.initializeCarousel(this.isMobile);
  }

  createHeroContent(side) {
    const key = side.key;
    const categories = getRandomItems(this[key], 3);
    const catsEl = categories
      .map(
        (cat) =>
          `<a href="/plp" class="nav-link" data-query='${key}=${cat}' aria-label="Navigate to the product list page.">${cat}</a>`
      )
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
        <img class="hero-img" src=${side.imgPath} alt=${side.label} />
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

    const scrollButton = `
        <button class="scroll" aria-label="scroll-button">
          <object type="image/svg+xml" data="../static/assets/chevron-down.svg"></object>
      </button>`;

    const heroContent = heroSides
      .map(this.createHeroContent.bind(this))
      .join('');
    const categoriesEl = this.categories
      .map(this.createCarouselButton)
      .join('');
    const productsEl = getProductsByCategory(Array.from(this.activeCategories))
      .map(this.createCarouselProduct)
      .join('');

    this.innerHTML = `
      <section id="hero">
        ${heroContent}
        ${scrollButton}
      </section>
      <div class="spacer"></div>
      <section class="carousel">
        <h3>New in</h3>
        <div class="products glide">
          <div class="categories">
            ${categoriesEl}
            <div class="glide__arrows" data-glide-el="controls">
              <button class="glide__arrow glide__arrow--prev scroll" data-glide-dir="<"  aria-label="carousel-prev-product-button">
                <object type="image/svg+xml" width="24" height="24" data="../static/assets/left-arrow.svg" style="  pointer-events: none;"></object>
              </button>
              <button class="glide__arrow glide__arrow--next scroll" data-glide-dir=">" aria-label="carousel-next-product-button">
                <object type="image/svg+xml" width="24" height="24" data="../static/assets/right-arrow.svg" style="  pointer-events: none;"></object>
              </button>
            </div>
          </div>
          <div class="glide__track" data-glide-el="track">
            <ul class="glide__slides">${productsEl}</ul>
          </div>
        </div>
        <a class="nav-link wide" href="/plp" aria-label="Go to the product list page.">Shop all</a>
      </section>`;
  }
}

customElements.define('home-page', HomePage);
