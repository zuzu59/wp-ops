'use strict';

const Wordpress = require('./wordpress'),
      OriginServer = require('./origin-server'),
      Cache = require('./cache');
      

/**
 * @constructor
 */
function World(proxy, config) {
    this.wordpress = new Wordpress(config.wordpress.servingPath);
    this.originServer = new OriginServer(config.wordpress, proxy.request);
    this.cache = new Cache(config);
}

World.prototype.change = function(opt_error) {
    // For now, the world never changes.
    // We could / should write a diary of errors and their causes into
    // this.cache.redis
};
