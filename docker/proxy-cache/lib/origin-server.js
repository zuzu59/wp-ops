'use strict';

/**
 * @constructor
 */

function OriginServer(config) {
    const proxy = httpProxy.createProxyServer(
        target: {
            host: config.host,
            port: config.port
        });

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
