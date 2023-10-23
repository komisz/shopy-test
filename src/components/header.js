import { getCategories } from '../api/api.js';
import { router } from '../router/router.js';

class MyHeader extends HTMLElement {
  constructor() {
    super();
    this.cartCounter = 0;
    this.categories = getCategories();
    this.isMobile = window.innerWidth <= 768;
    this.render();
    this.setupEventListeners();
  }

  connectedCallback() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
  }

  setupEventListeners() {
    const links = this.querySelectorAll('a.nav-link');
    links.forEach((link) =>
      link.addEventListener('click', this.handleLinkClick.bind(this))
    );

    const cartEl = document.querySelector('my-cart');
    const cartButton = this.querySelector('#cart-control');
    if (cartEl && cartButton) {
      cartButton.addEventListener('click', () => cartEl.toggleCart());
    } else {
      console.error('cart button not found');
    }

    if (this.isMobile) {
      const hamburgerMenu = this.querySelector('#mobile-menu-button');
      const mobileNav = this.querySelector('#mobile-nav');
      if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', () => {
          hamburgerMenu.classList.toggle('open');
          mobileNav.classList.toggle('open');
        });
      }
    }
  }

  handleResize() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile !== this.isMobile) {
      this.isMobile = isMobile;
      this.render();
      this.setupEventListeners();
    }
  }

  handleLinkClick(event) {
    event.preventDefault();
    const target = event.target.closest('a.nav-link');
    if (target) {
      const path = target.getAttribute('href');
      const queryString = target.getAttribute('data-query');
      router.loadRoute(path, queryString);

      if (this.isMobile && !target.id) {
        this.querySelector('#mobile-nav')?.classList.toggle('open');
        this.querySelector('#mobile-menu-button')?.classList.toggle('open');
      }
    } else {
      console.error('href not found');
    }
  }

  renderCategories() {
    return this.categories
      .map((cat) => this.createNavLink('/plp', `categories=${cat}`, cat))
      .join('');
  }

  createNavLink(href, query, text) {
    return `<a class="nav-link" href="${href}" data-query="${query}" aria-label="Navigate to this category's list page.">${text}</a>`;
  }
  render() {
    const categoryNavlinks = this.renderCategories();
    const leftContainerContent = this.isMobile
      ? `
        <button id="mobile-menu-button" aria-label="mobile-menu-button">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>

        <button id="search-button" aria-label="search-button">
          <object type="image/svg+xml" data="../static/assets/search.svg"></object>
        </button>

        <div id="mobile-nav">
          ${categoryNavlinks}
        </div>
      `
      : this.createNavLink('/plp', 'onSale=true', 'Sale') + categoryNavlinks;

    this.innerHTML = `
      <header>
        <div id="left-ctr">${leftContainerContent}</div>

        <div id="logo-ctr">
          <a class="nav-link" id="logo" href="/" aria-label="Navigate to the home page.">
            <object type="image/svg+xml" height="32" width="106" data="../static/assets/Logo.svg" style="pointer-events: none;"></object>
          </a>
        </div>

        <div id="right-ctr">
          <div id="search-ctr">
            <button id="search-button" aria-label="search-button">
              <object type="image/svg+xml" data="../static/assets/search.svg"></object>
            </button>
            <p>What are you looking for?</p>
          </div>
          <p>Stories</p>
          <div id="controls">
            <button id="user-control" aria-label="user-settings-button">
              <object type="image/svg+xml" data="../static/assets/user.svg"></object>
            </button>
            <button id="favourite-control" aria-label="favorite-products-button">
              <object type="image/svg+xml" data="../static/assets/heart.svg"></object>
              <span class="cart-counter" style="pointer-events: none;">13</span>
            </button>
            <button id="cart-control" aria-label="toggle-cart-button">
              <object type="image/svg+xml" data="../static/assets/cart.svg" style="pointer-events: none;"></object>
              <span class="cart-counter" style="pointer-events: none;">${this.cartCounter}</span>
            </button>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('my-header', MyHeader);
