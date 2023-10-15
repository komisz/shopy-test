import { addItemToLocalStorage, getItemFromLocalStorage } from './storage.js';

const fetchData = async (filepath = './src/api/productsSample.json') => {
  try {
    const response = await fetch(filepath);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
};

const lowercaseKeys = (obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({ ...acc, [key.toLowerCase()]: obj[key] }),
    {}
  );

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

const getRandomItems = (items) =>
  Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items.splice(randomIndex, 1)[0];
  });

const addProductOptions = (product) => {
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const allColors = [
    'aliceblue',
    'antiquewhite',
    'aqua',
    'aquamarine',
    'azure',
    'beige',
    'bisque',
    'black',
    'blanchedalmond',
    'blue',
    'blueviolet',
    'brown',
    'burlywood',
    'cadetblue',
    'chartreuse',
    'chocolate',
    'coral',
    'cornflowerblue',
    'cornsilk',
    'crimson',
    'cyan',
    'darkblue',
    'darkcyan',
    'darkgoldenrod',
    'darkgray',
    'darkgreen',
    'darkkhaki',
    'darkmagenta',
    'darkolivegreen',
    'darkorange',
  ];

  const selectedSizes = getRandomItems([...allSizes]);
  const selectedColors = getRandomItems([...allColors]);

  return { ...product, sizes: selectedSizes, colors: selectedColors };
};

const parseData = (data) =>
  data.map((item) => addProductOptions(mapImages(lowercaseKeys(item))));

const _prepareData = async () => {
  try {
    const data = await fetchData();
    const products = parseData(data);
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

const filterNFromArrBy = (arr = [], filters = [], n = 2) =>
  filters.reduce((acc, filter) => {
    const itemsInCategory = arr
      .filter((item) => item.category === filter)
      .slice(0, n);
    return [...acc, ...itemsInCategory];
  }, []);

const getProducts = () => getDataFromLocalStorage('products');
const getProductById = (productId) =>
  getProducts().find((p) => p.id === productId);
const getCategories = () => getDataFromLocalStorage('categories');
const getVendors = () => getDataFromLocalStorage('vendors');

const getProductsByCategory = (filterCategories) => {
  const products = getProducts();
  const categories = getCategories();
  return filterCategories.length
    ? filterNFromArrBy(products, filterCategories, 5)
    : filterNFromArrBy(products, categories);
};

export {
  _prepareData,
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategories,
  getVendors,
};
