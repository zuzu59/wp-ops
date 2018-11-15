'use strict';

const httpProxy = require('http-proxy'),
    Document = require('./document.js');

module.exports = OriginServer;

/**
 * @constructor
 */

function OriginServer(config) {
    const proxy = httpProxy.createProxyServer(
        { target: {
            host: config.host,
            port: config.port
        } })

    /**
     * @return { Promise(Document) }
     */
    this.forward = (req) => {
        let msg = new Document.Duplex();
        proxy.web(req, msg);
        return msg;
    }
}

/**
 * @return { Document }
 */
function forward(proxy, req) {

}
