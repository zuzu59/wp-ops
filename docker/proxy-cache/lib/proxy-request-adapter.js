const httpProxy = require('http-proxy'),
      when = require('when'),
      _ = require('lodash');

function proxyWithAdapter (target) {
    let proxy = httpProxy.createProxyServer({ target })
    // Provide proxy.request as a request-like for originServer:
    proxy.request = async function(req) {
        let deferred = when.defer()
        someKindOfRes = {
            serve: function(header, body) {
                defer.resolve(XXX)
            },
        }

        req = _.extend({ socket: {} }, req)
        proxy.web(req, someKindOfRes)
        return deferred.promise
    }

    return proxy
}

module.exports = proxyWithAdapter
