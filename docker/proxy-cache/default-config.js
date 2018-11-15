/**
 * Proxy configuration file
 *
 * If you want to author your own configuration file, you may follow
 * the same syntax as below; any fields you omit will revert to their
 * default value defined in this file.
 */

exports.cache = {};
exports.cache.port = 8881;
exports.cache.sizeCutoff = 1048576 * 20;  // 20 megabytes

exports.redis = {};
exports.redis.host = 'localhost';
exports.redis.port = 6379;

exports.wordpress = {};
exports.wordpress.servingPath = '/srv/subdomains';
exports.wordpress.host = 'jahia2wp-httpd';
exports.wordpress.port = 8443;

exports.deadline.cache = 500;
exports.deadline.hard = 120 * 1000;

/**
 * These functions make the routing decisions. Yes, you
 * can override these in your configuration file.
 *
 * @return { Document | Error }
 */
exports.serve = async function(req, world) {  
    let { wordpress, cache, originServer } = world;

    const onDiskAsset = await wordpress.find(req);  // Fast - Filesystem-based
    if (onDiskAsset) {
        return onDiskAsset;
    }

    if (! originServer) {
        // Serverless mode: try hard to serve from cache
        return cache.read(req, { deadline: this.deadline.hard });
    }

    if (req.match(this.hasWordpressCookie)) {
        return this.serve.loggedIn(req, res, world);
    }

    let cached = cache.read(req, this.deadline.cache);
    if (cached instanceof this.when.TimeoutError) {
        return originServer.forward(req);
    } else if (cached) {
        return cached;
    }

    return cache.writeBack(req, originServer.forward(req));
}

exports.serve.loggedIn = function(req, res, world) {
    // Gives Mrs. Secretary a handle on the cache:
    world.cache.invalidate(key);
    // No cache write-through on any logged-in traffic:
    return originServer.forward(req);
}

/**
 * Override the caching headers for some requests.
 */
exports.cacheHeaders = function(req, doc) {
    // This is the place where you could force some caching despite
    // the origin server not serving headers.
    //
    // E.g.
    //
    // if (req.match(/wp-admin/) {
    //   return { 'Cache-Control': 'public, max-age=60' }
    // };
};
