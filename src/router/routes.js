import { PLP, PDP, Home } from '../templates/index.template.js';

const home = new Home();

export default [
  {
    path: '/',
    get: () => '<home-page></home-page>',
  },
  {
    path: '/plp',
    get: (params) => PLP(),
  },
  {
    path: '/pdp',
    get: (params) => PDP(),
  },
  {
    path: '/product/:productId',
    get: (params) => {
      if (params.productId) {
        return `<h1>Product ${params.productId}</h1>`;
      } else {
        return `<h1>Sorry, product not found.</h1>`;
      }
    },
  },
  {
    path: '/404',
    get: () => '<h1>404</h1>',
  },
];
