const lines = [
  {
    icon: 'phone',
    label: '+31(0) 35 63 15 496',
  },
  {
    icon: 'email',
    label: 'Email',
  },
  {
    icon: 'whatsapp',
    label: 'Whatspapp',
  },
];

class MyFooter extends HTMLElement {
  connectedCallback() {
    const createLineEl = ({ label, icon }) => `
    <div class="line-group">
      <object type="image/svg+xml" data="../static/assets/${icon}.svg"></object>
      <p class="strong">${label}</p>
    </div>
    `;

    this.innerHTML = `
      <footer>
        <div class="footer top">

          <div class="column">
            <div class="group center contact">
              <h3>Contact us</h3>
              <div style="display: flex;flex-direction: column;align-items: flex-start;">
                ${lines.map(createLineEl).join('')}
              </div>
            </div>

            <div class="group center">
              <h3>Visit us</h3>
              <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 4px;align-self: stretch;">
                <p>Naarderstraat 15a</p>
                <p>1251 AX Laren, NL</p>
              </div>
            </div>

            <div class="group center">
              <h3>Follow us</h3>
              <div style="display: flex;align-items: flex-start;gap: 16px;">
                <object type="image/svg+xml" data="../static/assets/facebook.svg"></object>
                <object type="image/svg+xml" data="../static/assets/instagram.svg"></object>
                <object type="image/svg+xml" data="../static/assets/pinterest.svg"></object>
              </div>
            </div>
          </div>

          <div class="column" id="shop">
            <div style="position:relative; width: 100%">
              <h3>Shop</h3>
              <div class="accordion-plus">+</div>
            </div>
            <div class="group">
              <p>Baby</p>
              <p>Girls</p>
              <p>Boys</p>
              <p>Shoes</p>
              <p>Accessories</p>
              <p>Home & Deco</p>
              <p>Toys & Gifts</p>
              <p>Outlet</p>
            </div>
          </div>

          <div class="column" id="care">
            <div style="position:relative; width: 100%">
              <h3>Customer Care</h3>
              <div class="accordion-plus">+</div>
            </div>
            <div class="group">
              <p>Contact us</p>
              <p>Shipping & Deliveries</p>
              <p>Returns</p>
              <p>Payment methods</p>
              <p>FAQ</p>
              <p>Size Advice</p>
              <p>Interior Styling Advice</p>
              <p>Terms & Conditions</p>
              <p>Privacy policy</p>
            </div>
          </div>

          <div class="column">
            <div style="position:relative; width: 100%">
              <h3>Store of Daydreams</h3>
              <div class="accordion-minus"></div>
            </div>
            <div class="group">
              <p>About us</p>
              <p>Stories</p>
              <p>Our Store in Laren</p>
              <p>Brands A-Z</p>
              <p>Jobs</p>
              <p>Sitemap</p>
            </div>

            <object id="butterfly" type="image/svg+xml" data="../static/assets/butterfly.svg" style="align-self: center;"></object>
          </div>

          <div class="column join">
            <h3>Join our world</h3>
            <p> A world where hopes and dreams come together and sky is just the beginning.</p>
            <button>Sign up</button>
          </div>

        </div>

        <div class="footer bottom">
          <object
            type="image/svg+xml"
            id="logo"
            height="64"
            width="230"
            data="./static/assets/Logo.svg"></object>
          <p class="footer copyright">© Copyright 2023</p>
        </div>
      </footer>
`;
  }
}

customElements.define('my-footer', MyFooter);
