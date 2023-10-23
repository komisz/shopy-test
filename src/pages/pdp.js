import { getProductById } from '../api/api.js';

export default class PDPPage extends HTMLElement {
  constructor() {
    super();
    this.cart = document.querySelector('my-cart');
    this.product = null;
    this.currentOptions = {
      size: null,
      color: null,
      quantity: 1,
    };
  }

  connectedCallback() {
    const productId = this.getAttribute('product-id');
    if (!productId) {
      this.innerHTML = '<h1>Sorry, product ID not provided.</h1>';
    } else {
      this.product = getProductById(productId);
      if (!this.product) {
        this.innerHTML = '<h1>Sorry, product not found.</h1>';
      } else {
        this.currentOptions.size = this.product.sizes[0];
        this.currentOptions.color = this.product.colors[0];
        this.render();
        this.setupEventListeners();
      }
    }

    const colorThumbnails = this.querySelectorAll('.color-thumbnail');

    colorThumbnails.forEach(function (thumbnail) {
      thumbnail.addEventListener('click', function () {
        colorThumbnails.forEach(function (thumb) {
          thumb.classList.remove('selected');
          thumb.style.borderColor = 'transparent';
        });

        thumbnail.classList.add('selected');
        thumbnail.style.borderColor = thumbnail.getAttribute('data-color');
      });
    });
  }

  setupEventListeners() {
    this.querySelectorAll('.color-thumbnail').forEach((thumbnail) => {
      thumbnail.addEventListener('click', (event) => {
        const key = thumbnail.getAttribute('data-key');
        const color = thumbnail.getAttribute('data-color');
        this.currentOptions[key] = color;
        if (key === 'color' && color) {
          this.handleColorChange(color);
        }
      });
    });

    this.querySelector('select[data-key=size]')?.addEventListener(
      'change',
      (e) => {
        this.currentOptions.size = e.target.value;
      }
    );

    this.querySelector('.open-cart-btn')?.addEventListener('click', () =>
      this.addToCart()
    );
  }

  handleColorChange(color) {
    this.querySelectorAll('.product-img').forEach((img) => {
      img.style.borderColor = color;
    });

    this.querySelector(
      'label[for="color-select"]'
    ).textContent = `Color: ${this.currentOptions.color}`;
  }

  createOptions(options, selectedValue) {
    return options
      .map(
        (option) =>
          `<option value="${option}" ${
            option === selectedValue ? 'selected' : ''
          }>${option}</option>`
      )
      .join('');
  }

  addToCart() {
    const { sizes, colors, images, handle, ...productInfo } = this.product;
    const productToCart = {
      ...productInfo,
      selectedSize: this.currentOptions.size,
      selectedColor: this.currentOptions.color,
      quantity: this.currentOptions.quantity,
    };
    this.cart.addItem(productToCart);
  }

  render() {
    const heartIcon = `<object type="image/svg+xml" width="36" height="36" data="../static/assets/heart.svg"></object>`;
    const {
      sizes,
      colors,
      price,
      images,
      onSale,
      id,
      handle,
      title,
      description,
      category,
      ...productInfo
    } = this.product;

    this.innerHTML = `
      <div class="pdp-ctr">
        <div class="product-img-ctr">
          ${images
            .map(
              (image, index) =>
                `<img class="product-img" key=${index} src=${image} style="border-color:${this.currentOptions.color}" alt=${image} />`
            )
            .join('')}
        </div>

        <div class="product-info">
          <section>
            <div class="labels">
              <object type="image/svg+xml" width="32" height="32" data="../static/assets/leaf.svg"></object>
              <span>New</span>
            </div>
            <div class="first">
              <div style="display:flex; width:100%">
                <h3>${title}</h3>
                ${heartIcon}
              </div>
              <p class="description1">Multicor Sail Boat T-shirt Light Blue</p>
              <p class="price">€ ${price}</p>
            </div>
          </section>

          <section class="second">
            <label for="color-select">Color: ${
              this.currentOptions.color
            }</label>

            <div class="color-selector">
            ${this.product.colors
              .map((color, idx) => {
                return `
              <div class="color-thumbnail ${
                this.currentOptions.color === color ? 'selected' : ''
              }" data-color=${color} data-key="color">
                <img src=${images[0]} alt=${images[0]} />
              </div>
              `;
              })
              .join('')}
          </div>
          </section>


          <section class="third">
            <div style="position:relative; display:flex; width: 100%;">
              <select data-key="size">
                ${sizes.map((s) => `<option>${s}</option>`).join('')}
              </select>
              <div class="arrow">
                <object type="image/svg+xml" width="18" height="18" data="../static/assets/chevron-down.svg"></object>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; width:100%">
              <div class="ctr">
                <p class="secondary"> Size advice</p>
                <object type="image/svg+xml" width="18" height="18" data="../static/assets/ruler.svg"></object>
              </div>

              <div class="ctr">
                <object type="image/svg+xml" width="24" height="24" data="../static/assets/info.svg"></object>
                <p class="tertiary">This product wears one size smaller</p>
              </div>
            </div>
          </section>

          <section class="fourth">
            <div>
              <div style="display:flex; align-items:center;">
                <select data-key="quantity">${this.createOptions(
                  [1, 2, 3, 4, 5, 6, 7, 8, 9],
                  this.currentOptions.quantity
                )}
                </select>
              </div>

              <button class="open-cart-btn" type="button" aria-label="add-product-button">
                <svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="Essentials 24x24"><path fill="white" id="Compound Path" d="M24.0467 21.4855L22.6131 11.7507C22.5906 11.5832 22.5076 11.4297 22.3799 11.319C22.2522 11.2083 22.0884 11.148 21.9194 11.1495H19.6071V10.1553C19.5343 9.24546 19.1215 8.39647 18.4509 7.77735C17.7803 7.15824 16.9011 6.81445 15.9884 6.81445C15.0757 6.81445 14.1964 7.15824 13.5258 7.77735C12.8552 8.39647 12.4424 9.24546 12.3696 10.1553V11.1495H10.0573C9.8883 11.148 9.72454 11.2083 9.59681 11.319C9.46908 11.4297 9.38616 11.5832 9.36363 11.7507L7.95313 21.4855C7.88669 21.9458 7.9202 22.415 8.05138 22.8612C8.18257 23.3073 8.40834 23.72 8.71333 24.0711C9.01832 24.4221 9.39538 24.7034 9.81882 24.8956C10.2423 25.0879 10.7022 25.1866 11.1672 25.1852H20.8326C21.2977 25.1866 21.7576 25.0879 22.181 24.8956C22.6045 24.7034 22.9815 24.4221 23.2865 24.0711C23.5915 23.72 23.8173 23.3073 23.9485 22.8612C24.0796 22.415 24.1132 21.9458 24.0467 21.4855ZM13.757 10.1553C13.8133 9.60264 14.0727 9.09058 14.4849 8.71824C14.8972 8.3459 15.4329 8.13977 15.9884 8.13977C16.5438 8.13977 17.0796 8.3459 17.4918 8.71824C17.904 9.09058 18.1634 9.60264 18.2197 10.1553V11.1495H13.757V10.1553ZM22.2431 23.1735C22.0689 23.3771 21.8526 23.5405 21.6091 23.6523C21.3655 23.7641 21.1006 23.8216 20.8326 23.8209H11.1672C10.901 23.8206 10.638 23.7629 10.3962 23.6516C10.1544 23.5403 9.93941 23.3782 9.76599 23.1762C9.59257 22.9743 9.46478 22.7373 9.39135 22.4814C9.31792 22.2255 9.30058 21.9568 9.34051 21.6936L10.6816 12.5601H12.3927V16.5603C12.3927 16.7443 12.4658 16.9207 12.5959 17.0508C12.726 17.1809 12.9025 17.254 13.0864 17.254C13.2704 17.254 13.4468 17.1809 13.5769 17.0508C13.707 16.9207 13.7801 16.7443 13.7801 16.5603V12.5601H18.2428V16.5603C18.2428 16.7443 18.3159 16.9207 18.446 17.0508C18.5761 17.1809 18.7526 17.254 18.9365 17.254C19.1205 17.254 19.297 17.1809 19.4271 17.0508C19.5571 16.9207 19.6302 16.7443 19.6302 16.5603V12.5601H21.3413L22.6825 21.6936C22.7201 21.9574 22.7004 22.2262 22.6245 22.4816C22.5487 22.737 22.4186 22.973 22.2431 23.1735Z" fill="#231F1E"/></g></svg>
                Add
              </button>
            </div>



            <div style="display: flex; width: 100%; justify-content: space-between">
              <p class="disclaimer">Ordered before <strong>16:00</strong></p>
              <p class="disclaimer">Shipped <strong>Today</strong></p>
            </div>
          </section>

          <section class="fifth">
            <div>
              <object type="image/svg+xml" width="24" height="24" data="../static/assets/box.svg"></object>
              <p>
              <strong>Free delivery</strong> for orders above €100
              </p>
            </div>
            <div>
              <object type="image/svg+xml" width="24" height="24" data="../static/assets/recycle.svg"></object>
              <p>
              <strong>21 days</strong> return period
              </p>
            </div>
            <div>
              <object type="image/svg+xml" width="24" height="24" data="../static/assets/shop.svg"></object>
              <p>
              9.5
              </p>
              <span style="display:flex; align-items: center;">
              <object type="image/svg+xml" width="12" height="12" data="../static/assets/star.svg"></object>
              <object type="image/svg+xml" width="12" height="12" data="../static/assets/star.svg"></object>
              <object type="image/svg+xml" width="12" height="12" data="../static/assets/star.svg"></object>
              <object type="image/svg+xml" width="12" height="12" data="../static/assets/star.svg"></object>
              <object type="image/svg+xml" width="12" height="12" data="../static/assets/star.svg"></object>
              </span>
              <p>out of <u></u>541 reviews</u></p>
            </div>
            <div>
              <object type="image/svg+xml" width="24" height="24" data="../static/assets/box.svg"></object>
              <p>
              Ordered before <strong>16:00</strong>, Shipped Today
              </p>
            </div>
          </section>

          <section class="sixth">
            <p>Need advice? We’re here to help.</p>
            <div>
              <button aria-label="call-button">
                <object type="image/svg+xml" width="32" height="32" data="../static/assets/phone.svg"></object>
                Call
              </button>
              <button aria-label="email-button">
                <object type="image/svg+xml" width="32" height="32" data="../static/assets/email.svg"></object>
                Email
              </button>
              <button aria-label="whatsapp-button">
                <object type="image/svg+xml" width="32" height="32" data="../static/assets/whatsapp.svg"></object>
                Whatsapp
              </button>
            </div>
          </section>

          <section class="seventh">
            <div class="accordion-top">
              Description
              <span>-</span>
            </div>
            <div class="accordion-content">
              <p>Lorem ipsum dolor sit amet consectetur. Feugiat aliquam aliquet tempus eu diam phasellus. Arcu integer morbi sociis feugiat vulputate venenatis magna turpis. Sit et egestas gravida purus pellentesque adipiscing maecenas fermentum. Aliquet scelerisque quis in enim.</p>
            </div>

            <div class="accordion-top closed">
              Material and Care
              <span>+</span>
            </div>

            <div class="accordion-top closed">
              Delivery & Returns
              <span>+</span>
            </div>
          </section>

        </div>
      </div>
    `;

    const mobileView = `
      <div>
        <div style="width: 100%; position:relative; margin-top: 56px">
          <img style="object-fit: contain; max-width: 100%; width: 100%" key=${
            images[0]
          } src=${images[0]} alt=${images[0]} />
          <div class="labels" style="position:absolute; top:8px; left: 28px">
            <object type="image/svg+xml" width="32" height="32" data="../static/assets/leaf.svg"></object>
          </div>
          <div class="labels" style="position:absolute; top:12px; left: 50%; transform: translate(-50%, 0);">
            <span>New</span>
          </div>
          <div style="position:absolute; bottom:32px; right: 32px;">
            1/3
          </div>
          <div style="position:absolute; bottom:-2px; height: 1.5px; width: 33%; background: black">

          </div>
        </div>

        <div style="display:flex; flex-direction:column;gap:32px; margin: 0 32px; margin-top: 32px;">
          <section class="first">
            <div style="display:flex; width:100%;">
              <h3>${title}</h3>
              ${heartIcon}
            </div>
            <p class="description1">Multicor Sail Boat T-shirt Light Blue</p>
            <p class="price">€ ${price}</p>
          </section>

          <section class="second">
            <label for="color-select">Color: ${
              this.currentOptions.color
            }</label>

            <div class="color-selector">
              ${this.product.colors
                .map((color, idx) => {
                  return `
              <div class="color-thumbnail ${
                this.currentOptions.color === color ? 'selected' : ''
              }" data-color=${color} data-key="color">
                <img src=${images[0]} alt=${images[0]} />
              </div>
              `;
                })
                .join('')}
            </div>
          </section>

          <section class="third">
            <div style="position:relative; display:flex; width: 100%;">
              <select data-key="size">
                ${sizes.map((s) => `<option>${s}</option>`).join('')}
              </select>
              <div class="arrow">
                <object type="image/svg+xml" width="18" height="18" data="../static/assets/chevron-down.svg"></object>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; width:100%">
              <div class="ctr">
                <p class="secondary"> Size advice</p>
                <object type="image/svg+xml" width="18" height="18" data="../static/assets/ruler.svg"></object>
              </div>

              <div class="ctr">
                <object type="image/svg+xml" width="24" height="24" data="../static/assets/info.svg"></object>
                <p class="tertiary">This product wears one size smaller</p>
              </div>
            </div>
          </section>

          <section class="fourth">
            <div style="display:flex;">
              <div style="display:flex; align-items:center;">
                <select data-key="quantity">${this.createOptions(
                  [1, 2, 3, 4, 5, 6, 7, 8, 9],
                  this.currentOptions.quantity
                )}
                </select>
              </div>

              <button class="open-cart-btn" type="button" aria-label="add-product-button">
                <svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="Essentials 24x24"><path fill="white" id="Compound Path" d="M24.0467 21.4855L22.6131 11.7507C22.5906 11.5832 22.5076 11.4297 22.3799 11.319C22.2522 11.2083 22.0884 11.148 21.9194 11.1495H19.6071V10.1553C19.5343 9.24546 19.1215 8.39647 18.4509 7.77735C17.7803 7.15824 16.9011 6.81445 15.9884 6.81445C15.0757 6.81445 14.1964 7.15824 13.5258 7.77735C12.8552 8.39647 12.4424 9.24546 12.3696 10.1553V11.1495H10.0573C9.8883 11.148 9.72454 11.2083 9.59681 11.319C9.46908 11.4297 9.38616 11.5832 9.36363 11.7507L7.95313 21.4855C7.88669 21.9458 7.9202 22.415 8.05138 22.8612C8.18257 23.3073 8.40834 23.72 8.71333 24.0711C9.01832 24.4221 9.39538 24.7034 9.81882 24.8956C10.2423 25.0879 10.7022 25.1866 11.1672 25.1852H20.8326C21.2977 25.1866 21.7576 25.0879 22.181 24.8956C22.6045 24.7034 22.9815 24.4221 23.2865 24.0711C23.5915 23.72 23.8173 23.3073 23.9485 22.8612C24.0796 22.415 24.1132 21.9458 24.0467 21.4855ZM13.757 10.1553C13.8133 9.60264 14.0727 9.09058 14.4849 8.71824C14.8972 8.3459 15.4329 8.13977 15.9884 8.13977C16.5438 8.13977 17.0796 8.3459 17.4918 8.71824C17.904 9.09058 18.1634 9.60264 18.2197 10.1553V11.1495H13.757V10.1553ZM22.2431 23.1735C22.0689 23.3771 21.8526 23.5405 21.6091 23.6523C21.3655 23.7641 21.1006 23.8216 20.8326 23.8209H11.1672C10.901 23.8206 10.638 23.7629 10.3962 23.6516C10.1544 23.5403 9.93941 23.3782 9.76599 23.1762C9.59257 22.9743 9.46478 22.7373 9.39135 22.4814C9.31792 22.2255 9.30058 21.9568 9.34051 21.6936L10.6816 12.5601H12.3927V16.5603C12.3927 16.7443 12.4658 16.9207 12.5959 17.0508C12.726 17.1809 12.9025 17.254 13.0864 17.254C13.2704 17.254 13.4468 17.1809 13.5769 17.0508C13.707 16.9207 13.7801 16.7443 13.7801 16.5603V12.5601H18.2428V16.5603C18.2428 16.7443 18.3159 16.9207 18.446 17.0508C18.5761 17.1809 18.7526 17.254 18.9365 17.254C19.1205 17.254 19.297 17.1809 19.4271 17.0508C19.5571 16.9207 19.6302 16.7443 19.6302 16.5603V12.5601H21.3413L22.6825 21.6936C22.7201 21.9574 22.7004 22.2262 22.6245 22.4816C22.5487 22.737 22.4186 22.973 22.2431 23.1735Z" fill="#231F1E"/></g></svg>
                Add
              </button>
            </div>

            <div style="display: flex; width: 100%; justify-content: center; gap:8px">
              <p class="disclaimer">Ordered before <strong>16:00</strong></p>
              <p class="disclaimer">Shipped <strong>Today</strong></p>
            </div>
          </section>

          <section class="fifth" style="margin: 0 -32px">
            <div>
              <object type="image/svg+xml" width="24" height="24" data="../static/assets/box.svg"></object>
              <p>
              <strong>Free delivery</strong> for orders above €100
              </p>
            </div>
            <div>
              <object type="image/svg+xml" width="24" height="24" data="../static/assets/recycle.svg"></object>
              <p>
              <strong>21 days</strong> return period
              </p>
            </div>
            <div>
              <object type="image/svg+xml" width="24" height="24" data="../static/assets/shop.svg"></object>
              <p>
              9.5
              </p>
              <span style="display:flex; align-items: center;">
              <object type="image/svg+xml" width="12" height="12" data="../static/assets/star.svg"></object>
              <object type="image/svg+xml" width="12" height="12" data="../static/assets/star.svg"></object>
              <object type="image/svg+xml" width="12" height="12" data="../static/assets/star.svg"></object>
              <object type="image/svg+xml" width="12" height="12" data="../static/assets/star.svg"></object>
              <object type="image/svg+xml" width="12" height="12" data="../static/assets/star.svg"></object>
              </span>
              <p>out of <u></u>541 reviews</u></p>
            </div>
            <div>
              <object type="image/svg+xml" width="24" height="24" data="../static/assets/box.svg"></object>
              <p>
              Ordered before <strong>16:00</strong>, Shipped Today
              </p>
            </div>
          </section>

          <section class="sixth">
            <p>Need advice? We’re here to help.</p>
            <div>
              <button aria-label="call-button">
                <object type="image/svg+xml" width="32" height="32" data="../static/assets/phone.svg"></object>
                Call
              </button>
              <button aria-label="email-button">
                <object type="image/svg+xml" width="32" height="32" data="../static/assets/email.svg"></object>
                Email
              </button>
              <button aria-label="whatsapp-button">
                <object type="image/svg+xml" width="32" height="32" data="../static/assets/whatsapp.svg"></object>
                Whatsapp
              </button>
            </div>
          </section>

          <section class="seventh">
            <div class="accordion-top">
              Description
              <span>-</span>
            </div>
            <div class="accordion-content">
              <p>Lorem ipsum dolor sit amet consectetur. Feugiat aliquam aliquet tempus eu diam phasellus. Arcu integer morbi sociis feugiat vulputate venenatis magna turpis. Sit et egestas gravida purus pellentesque adipiscing maecenas fermentum. Aliquet scelerisque quis in enim.</p>
            </div>

            <div class="accordion-top closed">
              Material and Care
              <span>+</span>
            </div>

            <div class="accordion-top closed">
              Delivery & Returns
              <span>+</span>
            </div>
          </section>
        </div>
      </div>`;

    this.innerHTML = mobileView;
  }
}

customElements.define('pdp-page', PDPPage);
