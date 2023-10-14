import { router } from '../router/index.js';

class MyHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="header-ctr">
        <div class="left">
          <a href="/">Home</a>
          <a href="/plp">PLP</a>
        </div>
        <a
          href="/"
          style="position: relative, z-index: 120; display: flex;align-items: center; height: 100%">
          <object
            type="image/svg+xml"
            id="logo"
            height="32"
            width="106"
            data="../static/assets/Logo.svg"
            style="position: relative; z-index: -1"></object>
        </a>
        <div class="right">
          <p>Right nav</p>
        </div>
      </div>
`;

    this.querySelectorAll('a').forEach((nav) => {
      nav.addEventListener('click', (e) => {
        e.preventDefault();
        const to = e.target.getAttribute('href');

        if (!to) {
          console.error('href not found');
          return;
        }

        router.loadRoute(to);
      });
    });
  }
}

customElements.define('my-header', MyHeader);
