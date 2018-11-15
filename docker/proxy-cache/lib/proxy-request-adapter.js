'use strict';

const httpProxy = require('http-proxy'),
      _ = require('lodash'),
      Document = require('./document.js');

function proxyWithAdapter (target) {
    let proxy = httpProxy.createProxyServer({ target })
    // Provide proxy.request as a request-like for ./origin-server.js:
    proxy.request = function(req) {
        let res = new Document.Duplex()

        proxy.web(req, res)
        return res.promise
    }

    return proxy
}

module.exports = proxyWithAdapter
