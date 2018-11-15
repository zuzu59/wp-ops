'use strict';

const Document = require('./document.js');

module.exports = OriginServer;

/**
 * @constructor
 */

function OriginServer(config, request) {

    /**
     * @return { Promise(Document) }
     */
    this.forward = (req) => {
        return request(req).then((res) => Document.coerce(res))
    }
}
