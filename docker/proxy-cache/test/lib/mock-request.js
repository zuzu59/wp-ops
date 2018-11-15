'use strict'

const chai = require('chai'),
      chaiHttp = require('chai-http'),
      util = require('util'),
      events = require('events');

chai.use(chaiHttp);

module.exports.get = function(/* url, ...   */) {
 let req = chai.request({address() { return "zombo.com"}})
 return req.get.apply(req, arguments);
}

/**
 * Mock request(req) function (the kind that @link OriginServer likes),
 * and assorted req fakes
 *
 * @constructor
 */
module.exports.MockRequest = function() {
    let getOK      = this.getOK = { url: '/OK' }
    let getFailing = this.getFailing = { url: '/failing' }
    this.request = function(req) {
        let res = { headers: {'content-type': 'text/html'} }
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

util.inherits(module.exports.MockRequest, events.EventEmitter);
