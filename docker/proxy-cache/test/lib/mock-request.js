'use strict'

var chai = require('chai'), 
    chaiHttp = require('chai-http');

chai.use(chaiHttp);

module.exports.get = function(/* url, ...   */) {
 let req = chai.request({address() { return "zombo.com"}})
 return req.get.apply(req, arguments);
}
