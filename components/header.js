const headerTemplate = document.createElement('template');

headerTemplate.innerHTML = `
  <link rel="stylesheet" href="components/header.css" />
  <div class="header-ctr">
    <div class="header-left">
      <p>Left</p>
    </div>

    <a href="/" style="position: relative, z-index: 1; display: flex;align-items: center; height: 100%">
      <object type="image/svg+xml" id="logo" height="32" width="106" data="../static/assets/Logo.svg" style="position: relative; z-index: -1;">
      </object>
    </a>
    <div class="header-right">
      <p>Right</p>
    </div>
</div>
</slot>
`;

class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(headerTemplate.content);
  }
}

customElements.define('my-header', Header);
