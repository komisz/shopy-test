class MyFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <div class="footer top">
          <div class="">Contact us</div>
          <div class="">Shop</div>
          <div class="">Customer Care</div>
          <div class="">Store of Daydreams</div>
          <div class="footer-join">Join our world</div>
        </div>
        <div class="footer bottom">
          <object
            type="image/svg+xml"
            id="logo"
            height="64"
            width="230"
            data="./static/assets/Logo.svg"></object>
        </div>
        <p class="footer copyright">© Copyright 2023</p>
      </footer>
`;
  }
}

customElements.define('my-footer', MyFooter);
