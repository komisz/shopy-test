import { router } from '../router/router.js';

class MyHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    const links = Array.from(this.querySelectorAll('a.nav-link'));

    links.forEach((link) => {
      if (link.getAttribute('href') === window.location.pathname) {
        link.classList.add('active');
      }
      link.addEventListener('click', this.handleLinkClick.bind(this));
    });

    document.addEventListener('routeChange', () => {
      this.updateActiveLinks();
    });
  }

  updateActiveLinks() {
    this.querySelectorAll('a.nav-link').forEach((link) => {
      link.classList.remove('active');
    });

    const currentPath = window.location.pathname;
    const activeLink = this.querySelector(`a.nav-link[href="${currentPath}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
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
  }

  render() {
    this.innerHTML = `
    <header>
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
      </header>
    `;
  }
}

customElements.define('my-header', MyHeader);
