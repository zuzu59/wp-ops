'use strict'

const util = require('util'),
      events = require('events');

/**
 * Mock `request(req)` function (the kind that @link OriginServer likes),
 * and fakes for `req` to go with it
 *
 * @constructor
 */
function MockProxy() {
    let getOK      = this.getOK = { url: '/OK' }
    let getFailing = this.getFailing = { url: '/failing' }
    this.request = function(req) {
        let res = { headers: {'content-type': 'text/html'}, on() {} }
        if (req === getOK) {
            res.statusCode = 200
        } else if (req === getFailing) {
            res.statusCode = 500
        } else {
            res.statusCode = 404
        }
        return Promise.resolve(res)
    }
}

util.inherits(MockProxy, events.EventEmitter);

module.exports = MockProxy
