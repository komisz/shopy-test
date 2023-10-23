export const createProductCard = (product, isMobile = false) => {
  const { id, title, images, vendor, onSale, price, salePrice, colors } =
    product;

  const saleLabel = onSale
    ? `<span class="label">${Math.ceil(
        ((price - salePrice) / price) * -100
      )}%</span>`
    : '';
  const colorSection =
    isMobile && colors.length > 0
      ? `<div class="color-ctr">
        ${colors
          .slice(0, 3)
          .map(
            (color) => `<div class='color' style='background:${color}'></div>`
          )
          .join('')}
        ${colors.length > 3 ? `<p>+${colors.length - 3}</p>` : ''}
      </div>`
      : '';

  const originalPrice = onSale
    ? `<p class="price original"><strong>€ ${price},00</strong></p>`
    : '';
  const currentPrice = `<p class="price"><strong>€ ${
    onSale ? salePrice : price
  },00</strong></p>`;

  const heartIcon = `<object type="image/svg+xml" data="../static/assets/heart.svg"></object>`;

  const buyButton = isMobile
    ? `<button class="buy" aria-label="buy-button">
        <svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="Essentials 24x24"><path fill="white" id="Compound Path" d="M24.0467 21.4855L22.6131 11.7507C22.5906 11.5832 22.5076 11.4297 22.3799 11.319C22.2522 11.2083 22.0884 11.148 21.9194 11.1495H19.6071V10.1553C19.5343 9.24546 19.1215 8.39647 18.4509 7.77735C17.7803 7.15824 16.9011 6.81445 15.9884 6.81445C15.0757 6.81445 14.1964 7.15824 13.5258 7.77735C12.8552 8.39647 12.4424 9.24546 12.3696 10.1553V11.1495H10.0573C9.8883 11.148 9.72454 11.2083 9.59681 11.319C9.46908 11.4297 9.38616 11.5832 9.36363 11.7507L7.95313 21.4855C7.88669 21.9458 7.9202 22.415 8.05138 22.8612C8.18257 23.3073 8.40834 23.72 8.71333 24.0711C9.01832 24.4221 9.39538 24.7034 9.81882 24.8956C10.2423 25.0879 10.7022 25.1866 11.1672 25.1852H20.8326C21.2977 25.1866 21.7576 25.0879 22.181 24.8956C22.6045 24.7034 22.9815 24.4221 23.2865 24.0711C23.5915 23.72 23.8173 23.3073 23.9485 22.8612C24.0796 22.415 24.1132 21.9458 24.0467 21.4855ZM13.757 10.1553C13.8133 9.60264 14.0727 9.09058 14.4849 8.71824C14.8972 8.3459 15.4329 8.13977 15.9884 8.13977C16.5438 8.13977 17.0796 8.3459 17.4918 8.71824C17.904 9.09058 18.1634 9.60264 18.2197 10.1553V11.1495H13.757V10.1553ZM22.2431 23.1735C22.0689 23.3771 21.8526 23.5405 21.6091 23.6523C21.3655 23.7641 21.1006 23.8216 20.8326 23.8209H11.1672C10.901 23.8206 10.638 23.7629 10.3962 23.6516C10.1544 23.5403 9.93941 23.3782 9.76599 23.1762C9.59257 22.9743 9.46478 22.7373 9.39135 22.4814C9.31792 22.2255 9.30058 21.9568 9.34051 21.6936L10.6816 12.5601H12.3927V16.5603C12.3927 16.7443 12.4658 16.9207 12.5959 17.0508C12.726 17.1809 12.9025 17.254 13.0864 17.254C13.2704 17.254 13.4468 17.1809 13.5769 17.0508C13.707 16.9207 13.7801 16.7443 13.7801 16.5603V12.5601H18.2428V16.5603C18.2428 16.7443 18.3159 16.9207 18.446 17.0508C18.5761 17.1809 18.7526 17.254 18.9365 17.254C19.1205 17.254 19.297 17.1809 19.4271 17.0508C19.5571 16.9207 19.6302 16.7443 19.6302 16.5603V12.5601H21.3413L22.6825 21.6936C22.7201 21.9574 22.7004 22.2262 22.6245 22.4816C22.5487 22.737 22.4186 22.973 22.2431 23.1735Z" fill="#231F1E"/></g></svg>
        <p>Add</p>
      </button>`
    : '';

  return `
    <a href="/product/${id}" class="product-nav" data-product-id="${id}" aria-label="Navigate to the product's detail page.">
      <div class="product-card">
        <div class="img-ctr">
          ${saleLabel}
          ${heartIcon}
          ${buyButton}
          <img src='${images[0]}' style="position:relative" alt=${images[0]} />
        </div>
        <div class="content">
          ${colorSection}
          <div>
            <p class="title">${title}</p>
            <p class="description">${vendor}</p>
          </div>
          <div class="price-ctr">
            ${originalPrice}
            ${currentPrice}
          </div>
        </div>
      </div>
    </a>`;
};
