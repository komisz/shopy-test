const footerTemplate = document.createElement('template');

footerTemplate.innerHTML = `
  <link rel="stylesheet" href="components/footer.css" />
  <footer>
      <div class="footer-ctr">
        <div class="">Contact us</div>
        <div class="">Shop</div>
        <div class="">Customer Care</div>
        <div class="">Store of Daydreams</div>
        <div class="footer-join">Join our world</div>
      </div>
      <div class="footer-bottom">
        <object
          type="image/svg+xml"
          id="logo"
          height="64"
          width="230"
          data="./static/assets/Logo.svg"></object>
      </div>
      <p class="footer-copyright">© Copyright 2023</p>
    </footer>
`;

class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(footerTemplate.content);
  }
}

customElements.define('my-footer', Footer);
