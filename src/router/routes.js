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
    get: ({ productId }) => `<pdp-page product-id=${productId}></pdp-page>`,
  },
];
