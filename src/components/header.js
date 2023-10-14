import { router } from '../router/index.js';

class MyHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    const links = Array.from(this.querySelectorAll('a.nav-link'));
    const initialPath = window.location.pathname;

    links.forEach((link) => {
      if (link.getAttribute('href') === initialPath) {
        link.classList.add('active');
      }
      link.addEventListener('click', this.handleLinkClick.bind(this));
    });
  }

  handleLinkClick(event) {
    event.preventDefault();
    const target = event.target.closest('a.nav-link');

    if (!target) {
      console.error('href not found');
      return;
    }

    const path = target.getAttribute('href');
    router.loadRoute(path);

    this.querySelectorAll('a.nav-link').forEach((link) => {
      link.classList.remove('active');
    });

    target.classList.add('active');
  }

  render() {
    this.innerHTML = `
      <div class="header-ctr">
        <div class="left">
          <a class="nav-link" href="/">Home</a>
          <a class="nav-link" href="/plp">PLP</a>
        </div>
        <a href="/" style="position: relative; z-index: 120; display: flex; align-items: center; height: 100%">
          <object type="image/svg+xml" id="logo" height="32" width="106" data="../static/assets/Logo.svg" style="position: relative; z-index: -1"></object>
        </a>
        <div class="right">
          <p>Right nav</p>
        </div>
      </div>
    `;
  }
}

customElements.define('my-header', MyHeader);
