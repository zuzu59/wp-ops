'use strict';

const httpProxy = require('http-proxy'),
      when = require('when'),
      Document = require('./document.js');

function proxyWithRequestAdapter (target) {
    let proxy = httpProxy.createProxyServer({ target })

    // Provide proxy.request as a request-like for use by ./origin-server.js:
    proxy.request = function(req) {
        // We are going to set events for {selfHandleResponse}, and we
        // need to set event listeners. If we were to re-use proxy
        // defined above, we would need to carefully match their "req"
        // parameter, and remove them, to avoid memory leaks. Well,
        // life is short, and creating a new proxy is just *way*
        // easier.

        let deferred = when.defer(),
            proxy = httpProxy.createProxyServer({
                target,
                selfHandleResponse: true
            })
        proxy.on('proxyRes', function(proxyRes) {
            deferred.resolve(
                new Document(proxyRes.statusCode, proxyRes.headers, proxyRes))
        })
        proxy.on('error', function(err) {
            deferred.reject(err)
        })
        proxy.web(req, {})

        return deferred.promise
    }

    return proxy
}

module.exports = proxyWithRequestAdapter
