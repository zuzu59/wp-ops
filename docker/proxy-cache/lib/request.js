'use strict';

const util = require('util'),
      RequestBase = require('http').ClientRequest;

module.exports =

/**
 * @constructor
 */
function Request() {
};

util.inherits(Request, RequestBase);

Request.wrap = function(req) {
    that = Object.create(Request, res);
    return that;
};

Request.prototype.match = function(what) {
    if (what instanceof Function) {
        return what(this);
    } else {
        throw new Error("Cannot .match on " + typeof(what) + "'s, yet");
    }
};
