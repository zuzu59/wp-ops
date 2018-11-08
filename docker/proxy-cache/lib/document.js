'use strict';

const BufferList = require('bl'),
      http = require('http');

/**
 * A document served either out of the origin server, the filesystem,
 * or the cache.
 *
 * "Adopts" instances of @link http.IncomingMessage as-is;
 * "synthesizes" instances for other document sources (cache or
 * filesystem)
 */

module.exports = Document;

/**
 * @constructor
 *
 * Creates a synthetic document from headers and 
 *
 * @param {Object} headers
 * @param {Stream.Readable} body
 */
function Document(headers, body) {
    this.headers = headers;
    this._lc_headers = {};
    for (var h in headers) {
        this._lc_headers[h.toLowerCase()] = headers[h];
    }
    this.body = body;
}

Document.prototype.getHeader = function(h) {
    return this._lc_headers[h.toLowerCase()];
}

/**
 * @returns True iff `what` works like a Document
 */
Document.isA = function(what) {
    return (what instanceof Document ||
            what instanceof http.IncomingMessage);
}

/**
 * A Document that also looks like an @link http.ServerResponse
 *
 * Used to intercept responses served by the `http-proxy` NPM module
 * so as to further process them (e.g. cache them)
 *
 * @constructor
 */
Document.Duplex = function() {
    
    let doc = new Document();
    this.XXX;
};

