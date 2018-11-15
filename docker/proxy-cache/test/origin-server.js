const chai = require('chai'),
      expect = chai.expect,
      MockServer = require('./lib/mock-server.js'),
      OriginServer = require('../lib/origin-server.js'),
      Document = require('../lib/document.js'),
      assert = require('assert'),
      mockRequest = require('./lib/mock-request.js');

chai.should();

describe('Origin server', function() {
    let mockServer;

    before(async function() {
        mockServer = new MockServer();
        await mockServer.start();
    });


    it('forwards a GET with success', async function() {
        let config = {
            host: mockServer.host,
            port: mockServer.port,
        };
        let server = new OriginServer(config);
        
        // TODO Mock req
        let req = mockServer.okRequest()
        let response = await(server.forward(req));
        assert(Document.isA(response));
        assert.equal(response.status, 200);
    });

    it('forwards a GET with error', async function() {
        let config = {
            host: mockServer.host,
            port: mockServer.port,
        };
        let server = new OriginServer(config);
        
        // TODO Mock req
        let req = mockServer.failingRequest()
        let response = await(server.forward(req));
        assert(Document.isA(response));
        assert.equal(response.status, 500);
        
    });

    after(function() {
        mockServer.stop();
    });
});
