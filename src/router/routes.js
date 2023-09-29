import { PLP, Home, PDP } from '../templates/index.template.js';
export default [
  {
    path: '/',
    getTemplate: (params) => Home(),
  },
  {
    path: '/plp',
    getTemplate: (params) => PLP(),
  },
  {
    path: '/pdp',
    getTemplate: (params) => PDP(),
  },
  {
    path: '/product/:productId',
    getTemplate: (params) => {
      if (params.productId) {
        return `<h1>Product ${params.productId}</h1>`;
      } else {
        return `<h1>Sorry, product not found.</h1>`;
      }
    },
  },
  {
    path: '/404',
    getTemplate: () => '<h1>404</h1>',
  },
];
