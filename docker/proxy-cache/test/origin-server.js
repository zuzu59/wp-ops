const chai = require('chai'),
      expect = chai.expect,
      MockServer = require('./lib/mock-server.js');
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
    });
    it('forwards a GET with error');
});
