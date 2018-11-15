'use strict';

const BufferList = require('bl'),
      http = require('http'),
      when = require('when'),
      events = require('events'),
      util = require('util');

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
 * Override for the "instanceof" operator with Document
 */
// Class-less example syntax found here:
// https://github.com/babel/babel/issues/2286#issuecomment-136131040
Object.defineProperty(Document, Symbol.hasInstance,
                      { value: (what) => (('headers' in what) &&
                                          ('on' in what)) })

Document.coerce = function(what) {
    if (what instanceof Document) {
        return what
    } else {
        throw new Error("I don't know how to cast " + what + " into a Document")
    }
}

/**
 * A Document that is also an @link http.ServerResponse
 *
 * Used to intercept responses served by the `http-proxy` NPM module
 * so as to further process them (e.g. cache them)
 *
 * @constructor
 */
Document.Duplex = function() {
    let doc = new Document(),
        e = new events.EventEmitter(),
        deferred = when.defer(),
        headers = {},
        headersSent = false;

    return {
        promise: deferred.promise,
        setHeader(header, value) {
            console.log('setHeader(' + header + ', ' + value + ')');
            doc.headers[header.toLowerCase()] = value
        },
        writeHead(statusCode, headers) {
            doc.statusCode = statusCode;
            for (header in headers) {
                doc.setHeader(header, headers[header]);
            }
            headersSent = true
        },
        headersSent: () => headersSent,
        write() {
            console.log('duplex write');
        },
        end() {
            console.log('duplex end');
            deferred.resolve(doc)
        }
    }
};
util.inherits(Document, events.EventEmitter)
