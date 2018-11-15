const express = require('express'),
      when = require('when');

module.exports = MockServer;

function MockServer () {
    app = express();
    app.get('/OK', (req, res) => res.send('Hello World!'));
    app.get('/error', (req, res, next) => next());

    let started = when.defer()

    this.start = function() {
        started = when.defer();

        let listener = app.listen(0, (err) => {
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

}

