'use strict';

const http = require('http'),
      _ = require('lodash'),
      when = require('when'),
      defaultConfig = require('../default-config'),
      Response = require('./request'),
      Response = require('./response'),
      World = require('./world');

var currentlyTimed = false;

module.exports =

/**
 * @constructor
 */
function Proxy (config) {
    config = makeConfig(config);

    const world = new World(this, config);

    server = http.createServer(async function(req, res) {
        
        // XXX Need to delegate to proxy for everything except
        // GET requests
        try {
            await config.serve.call(config, Request.wrap(req),
                                     Response.wrap(res), world)
                .timeout(config.deadline.hard);
            world.change(true);
        } catch (e) {
            if (e instanceof when.TimeoutError) {
                res.serve(503);
            } else {
                res.serve(500, e);
            }
            world.change(e);
        }
    });

    // For slow serving days...
    setInterval(world.change.bind(world), 1000)

    this.serve = function() {
        server.listen(config.cache.port);
    };
};

function makeConfig (userConfig) {
    if (! userConfig) userConfig = {};

    let baseConfig = _.extend({}, ConfigMembers, defaultConfig),
        fullConfig = _.extend(baseConfig, userConfig);
    for (dictField of ['serve', 'proxy', 'wordpress', 'redis']) {
        if (userConfig[dictField]) {
            fullConfig[dictField] = _.extend({}, baseConfigConfig[dictField], userConfig[dictField]);
        }
    }
    return fullConfig;
}

const ConfigMembers = { when };

ConfigMembers.hasWordpressCookie = function(req) {
    return false;  // XXX
};
