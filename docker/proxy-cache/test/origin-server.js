const chai = require('chai'),
      MockServer = require('./lib/mock-server.js'),
      OriginServer = require('../lib/origin-server.js'),
      Document = require('../lib/document.js'),
      assert = require('assert'),
      buildAProxy = require('../lib/proxy-request-adapter.js'),
      MockRequest = require('./lib/mock-request.js').MockRequest;

require("long-stack-traces");

chai.should();

describe('Origin server: unit tests', function() {
    let mockConfig = {}

    it('forwards a GET with success', async function() {
        let mr = new MockRequest()

        let server = new OriginServer(mockConfig, mr.request),
            req = mr.getOK

        let response = await(server.forward(req));
        assert.equal(response.statusCode, 200);
        assert(Document.isA(response));
    });

    it('forwards a GET with error', async function() {
        let mr = new MockRequest();

        let server = new OriginServer(mockConfig, mr.request),
            req = mr.getFailing

        let response = await(server.forward(req));
        assert.equal(response.statusCode, 500);
        assert(Document.isA(response));
    });
});

describe('Origin server: integration with http-proxy', function() {
    let mockServer, proxy;

    before(async function() {
        mockServer = new MockServer();
        await mockServer.start();
        proxy = buildAProxy({host: 'localhost', port: mockServer.port});
    });


    it('forwards a GET with success', async function() {
        let config = {
            host: mockServer.host,
            port: mockServer.port,
        };
        let server = new OriginServer(config, proxy.request);
        
        let req = mockServer.okRequest()
        let response = await(server.forward(req));
        assert(Document.isA(response));
        assert.equal(response.statusCode, 200);
    });

    it('forwards a GET with error', async function() {
        let config = {
            host: mockServer.host,
            port: mockServer.port,
        };
        let server = new OriginServer(config, proxy.request);
        
        let req = mockServer.failingRequest()
        let response = await(server.forward(req));
        assert(Document.isA(response));
        assert.equal(response.statusCode, 500);
        
    });

    after(function() {
        mockServer.stop();
    });
});
