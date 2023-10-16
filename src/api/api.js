import { addItemToLocalStorage, getItemFromLocalStorage } from './storage.js';
import {
  fetchData,
  filterNFromArrBy,
  generateProductOptions,
  lowercaseKeys,
} from './helpers.js';

const mapImages = (product) => {
  const imageProperties = ['img1', 'img2', 'img3', 'img4'];
  const images = imageProperties
    .map((prop) => product[prop])
    .filter((imageUrl) => imageUrl);
  const { img1, img2, img3, img4, ...updatedProduct } = product;

  return {
    ...updatedProduct,
    images,
  };
};

const parseProducts = (data) =>
  data.map((product) =>
    generateProductOptions(mapImages(lowercaseKeys(product)))
  );

const _prepareData = async (filepath) => {
  try {
    if (getProducts()?.length) {
      console.log('Products already fetched, skipping data prep.');
      return;
    }
    const data = await fetchData(filepath);
    const products = parseProducts(data);
    const categories = [...new Set(products.map((p) => p.category))];
    const vendors = [...new Set(products.map((p) => p.vendor))];

    addItemToLocalStorage('data', {
      products,
      categories,
      vendors,
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

const getDataFromLocalStorage = (key) => {
  const storedData = getItemFromLocalStorage('data');
  return storedData ? storedData[key] : null;
};

const getProducts = () => getDataFromLocalStorage('products');
const getProductById = (productId) =>
  getProducts().find((p) => p.id === productId);

const getProductsByCategory = (filterCategories) => {
  const products = getProducts();
  const categories = getCategories();
  return filterCategories.length
    ? filterNFromArrBy(products, filterCategories, 5)
    : filterNFromArrBy(products, categories);
};

const getCategories = () => getDataFromLocalStorage('categories');
const getVendors = () => getDataFromLocalStorage('vendors');

export {
  _prepareData,
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategories,
  getVendors,
};
