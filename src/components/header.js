import { router } from '../router/index.js';

class MyHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="header-ctr">
        <div class="left">
          <button type="button" class="my-nav">Home</button>
        <button type="button" class="my-nav">PLP</button>
        <button type="button" class="my-nav">PDP</button>
        <button type="button" class="my-nav" data-customprop="5">Product</button>
        <button
          type="button"
          class="my-nav"
          style="background: yellow"
          data-customprop="">
          Product
        </button>
        <button type="button" class="my-nav" style="background: red">
          Four-o-four
        </button>
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

    const buttons = this.querySelectorAll('.my-nav');

    buttons.forEach((buttonEl) => {
      buttonEl.addEventListener('click', (e) => {
        const slug = e.target.innerText?.toLowerCase();

        if (!slug) {
          return;
        }

        if (slug === 'home') {
          router.loadRoute('');
        } else if (slug === 'product') {
          const productId = buttonEl.dataset.customprop;
          router.loadRoute(slug, productId);
        } else {
          router.loadRoute(slug);
        }
      });
    });
  }
}

customElements.define('my-header', MyHeader);
