import { PLP, PDP, Home } from '../templates/index.template.js';
import { getProducts } from '../api/index.js';

export default [
  {
    path: '/',
    get: () => '<home-page></home-page>',
  },
  {
    path: '/plp',
    get: () => '<plp-page></plp-page>',
  },
  {
    path: '/product/:productId',
    get: ({ productId }) => {
      const product = getProducts().find((p) => p.id === productId);

      if (product) {
        return PDP(product);
      } else {
        return '<h1>Sorry, product not found.</h1>';
      }
    },
  },
];
