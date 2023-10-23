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

const fetchData = async (filepath) => {
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

const getRandomItems = (items, n = 5) => {
  const itemsCopy = [...items]; // Create a copy of the input array
  return Array.from({ length: Math.min(n, itemsCopy.length) }, () => {
    const randomIndex = Math.floor(Math.random() * itemsCopy.length);
    return itemsCopy.splice(randomIndex, 1)[0];
  });
};

const addProductAttributes = (product, idx) => {
  const selectedSizes = getRandomItems([...allSizes]);
  const selectedColors = getRandomItems([...allColors]);

  const updatedProduct = {
    ...product,
    sizes: selectedSizes,
    colors: selectedColors,
    onSale: false,
  };

  // ?: 💡 every 8th product is on sale with random int lower than original price
  if (idx % 8 === 0) {
    Object.assign(updatedProduct, {
      onSale: true,
      salePrice: Math.floor(Math.random() * product.price) + 1,
    });
  }

  return updatedProduct;
};

const filterNFromArrBy = (arr = [], filters = [], n = 2) =>
  filters.reduce((acc, filter) => {
    const itemsInCategory = arr
      .filter((item) => item.category === filter)
      .slice(0, n);
    return [...acc, ...itemsInCategory];
  }, []);

function queryStringToObject(queryString) {
  const queryParams = new URLSearchParams(queryString);

  const queryObject = {};

  for (const [key, value] of queryParams.entries()) {
    if (queryObject.hasOwnProperty(key)) {
      if (Array.isArray(queryObject[key])) {
        queryObject[key].push(value);
      } else {
        queryObject[key] = [queryObject[key], value];
      }
    } else {
      queryObject[key] = value;
    }
  }

  return queryObject;
}

const sliceArrayIntoChunks = (array, chunkLength) =>
  Array.from({ length: Math.ceil(array.length / chunkLength) }, (_, index) =>
    array.slice(index * chunkLength, (index + 1) * chunkLength)
  );

function capitalizeFirstLetter(str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export {
  fetchData,
  lowercaseKeys,
  addProductAttributes,
  filterNFromArrBy,
  queryStringToObject,
  getRandomItems,
  sliceArrayIntoChunks,
  capitalizeFirstLetter,
};
