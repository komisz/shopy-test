import { _prepareData } from './src/api/index.js';

import './src/pages/home.js';
import './src/pages/pdp.js';
import './src/pages/plp.js';

import './src/components/header.js';
import './src/components/footer.js';
import './src/components/my-filter.js';
import './src/components/my-cart.js';

(async () => _prepareData())();
