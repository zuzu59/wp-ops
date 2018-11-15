'use strict'

/**
 * Mock out the "req" objects that get passed around a lot
 */

const chai = require('chai'),
      chaiHttp = require('chai-http');

chai.use(chaiHttp);

module.exports.get = function(/* url, ...   */) {
    let req = chai.request('http://localhost:8085'),
        retval = req.get.apply(req, arguments);
    retval.socket = {};
    return retval;
}
