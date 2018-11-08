'use strict';

const _ = require('lodash'),
      RequestBase = require('http').ClientRequest;

module.exports =

/**
 * @constructor
 */
function Request() {
};

Request.prototype = _.create(RequestBase.prototype);

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
