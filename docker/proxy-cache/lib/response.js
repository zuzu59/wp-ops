'use strict';

const util = require('util'),
      ResponseBase = require('http').ServerResponse,
      Document = require('./document');

module.exports =
/**
 * @constructor
 */
function Response() {
};

util.inherits(Response, ResponseBase);

Response.wrap = function(res) {
    let that = Object.create(Response, res);
    that.serve = function() { return serveIdiomatic.call(res, arguments); }
    return that;
};

function serveIdiomatic (/* Response | ([statusCode], [headers], [bodyOrException]) */) {
    let res = this;

    if (arguments[0] instanceof Document) {
        return serveDocument(res, arguments[0]);
    }

    let lastArg = arguments[arguments.length - 1];
    if (lastArg instanceof Error) {
        if (arguments.length === 1) {
            return serveError(res, 500, lastArg);
        } else if (arguments.length === 2 && typeof(arguments[0]) === 'number') {
            return serveError(res, arguments[0], lastArg);
        }
    }

    let args = Array.prototype.splice.call(arguments, 0),
        statusCode, headers, body;
    statusCode = (typeof(args[0] === 'number')) ? args.shift() : 200;
    headers = (args[0] instanceof Object) ? args.shift() : { 'Content-Type': 'text/html' };
    body = args.shift();
    return serveProxyResponse(statusCode, headers, body);
}

function serveDocument (res, doc) {
    res.writeHead(doc.headers);
    doc.body.pipe(res);
}

function serveProxyResponse (res, statusCode, headers, body) {
    if (! headers) {
        headers = { 'Content-Type': 'text/html' };
    }
    res.writeHead(statusCode, headers);
    res.end(body);
}

function serveError(res, code, e) {
    serveProxyResponse(res, code, undefined,
                       '<h1>Internal Server Error In Proxy</h1><pre>' + e + '</pre>');
}

const standardBodies = {
    '503': '<h1>Service unavailable</h1>',
}
