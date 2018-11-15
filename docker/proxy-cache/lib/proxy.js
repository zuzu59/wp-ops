'use strict';

const http = require('http'),
      _ = require('lodash'),
      when = require('when'),
      defaultConfig = require('../default-config'),
      Request = require('./request'),
      Response = require('./response'),
      httpProxy = require('http-proxy'),
      World = require('./world');

var currentlyTimed = false;

module.exports =

/**
 * @constructor
 */
function Proxy (config) {
    config = makeConfig(config);

    let proxy = httpProxy.createProxyServer(
        { target: {
            host: config.wordpress.host,
            port: config.wordpress.port
        } })
    // Provide proxy.request as a request-like for originServer:
    proxy.request = async function(req) {
        let defer = when.deferred()
        someKindOfRes = {
            serve: function(header, body) {
                defer.resolve(XXX)
            }
        }
        proxy.web(req, someKindOfRes)
        return deferred.promise
    }

    const world = new World(proxy, config)


    server = http.createServer(async function(req, res) {
        if (isCacheable(req)) {
            try {
                let doc = await config.serve.call(config, Request.wrap(req), world)
                    .timeout(config.deadline.hard);
                world.change(true);
                res.serve(doc)
            } catch (e) {
                if (e instanceof when.TimeoutError) {
                    res.serve(503);
                } else {
                    res.serve(500, e);
                }
                world.change(e);
            }
        } else {
            proxy.web(req, res, { target: 'http://mytarget.com:8080' });
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
