import { _prepareData } from './src/api/index.js';

import './src/templates/home.template.js';
import './src/templates/pdp.template.js';
import './src/templates/plp.template.js';

import './src/components/header.js';
import './src/components/footer.js';
import './src/components/my-filter.js';
import './src/components/my-cart.js';

(async () => _prepareData())();
