'use strict';

const BufferList = require('bl'),
      when = require('when'),
      BSON = require('bson'),
      Redis = require('ioredis'),
      CachePolicy = require('http-cache-semantics'),
      Document = require('./document');

Redis.Promise = when.promise;

const DEFAULT_CACHE_SIZE_CUTOFF = 1048576 * 20;

module.exports = Cache;

/**
 * @constructor
 */
function Cache (opts) {
    this.redis = new Redis({port: opts.port, host: opts.host,
                            keyPrefix: 'node-proxy-cache:'});
    this.serialize = new BSON();
    this.sizeCutoff = opts.cache.sizeCutoff || DEFAULT_CACHE_SIZE_CUTOFF;
    this.deadline = opts.deadline.cache;
}

Cache.prototype.read = async function(req, opts) {
    const key = this.getCacheKey(req);
    if (! key) return;

    let { deadline, force } = opts;
    if (! deadline) deadline = this.deadline;

    let p = this.redis.get(key);
    if (deadline) {
        p = p.timeout(deadline);
    }

    let payloadText = await p;
    if (payloadText) {
        let { policy, body } = this.serialize.deserialize(payloadText);
        policy = CachePolicy.fromObject(policy);
        if (policy.satisfiesWithoutRevalidation(req) || force) {
            return new Document(200,
                                policy.responseHeaders(),
                                new BufferList(body));
        }
        // Note: we never expire cache entries - We only replace them
        // with new pages out of the origin server.
    }
}

/**
 * "Tee" this document into the cache as we are serving it
 *
 * Does nothing if the document is not cacheable, or too big.
 *
 * @return msg
 */
Cache.prototype.writeBack = function(req, msg) {
    const key = this.getCacheKey(req),
          policy = new CachePolicy(req, doc);

    if (key && policy.storable()) {
        let buf = new BufferList();
        doc.on('data', (data) => {
            if (buf.length <= this.sizeCutoff) {
                buf.append(data);
            }
        });
        doc.on('end', () => {
            if (msg.complete && buf.length <= this.sizeCutoff) {
                this.redis.set(key,
                          this.serialize.serialize({
                              policy: policy.toObject(),
                              body: buf.slice()
                          })).timeout(deadline).catch((e) => logError('setting ' + key, e));
            }
        });
    }

    return msg;
};

Cache.prototype.getCacheKey = function(req) {
    // Config file is in a position to override this to something smarter
    // (e.g. incorporating the Polylang cookie)
    return req.url;
};


function logError (doingWhat, e) {
    console.log ('Error ' + doingWhat, e);
}
