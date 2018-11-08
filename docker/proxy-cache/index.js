'use strict';

const Proxy = require('./lib/proxy'),
      process = require('process');

/* The configuration file is where all the decision making happens. 
 * Take a look at default-config.js for detailed explanations
 */
let config;
try {
    config = require(process.env['PROXY_CONFIG_FILE']);
} catch (e) {
    config = undefined;
}

(new Proxy(config)).serve();
