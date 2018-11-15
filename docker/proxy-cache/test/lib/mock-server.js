const express = require('express'),
      when = require('when'),
      mockRequest = require('./mock-request');

module.exports = MockServer;

function MockServer() {
    app = express();

    function defineRequest(url, servingFn) {
        app.get(url, servingFn);
        return function () {
            return mockRequest.get(url);
        }
    }

    this.okRequest = defineRequest('/OK', (req, res) => res.send('Hello World!'))
    this.failingRequest = defineRequest('/error', (req, res, next) => next('ERROR'))

    let started = when.defer();
    let listener;

    this.start = function () {
        started = when.defer();

        listener = app.listen(0, (err) => {
            if (err) {
                started.reject
            } else {
                this.port = listener.address().port;
                console.log('Listening on port ' + this.port);
                started.resolve();
            }
        });

        return started.promise;
    }

    this.stop = function () {
        listener.close();
    }
}
