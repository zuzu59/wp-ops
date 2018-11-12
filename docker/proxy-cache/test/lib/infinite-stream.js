/**
 * An almost infinite stream
 */
const assert = require('assert'),
      spigot = require('stream-spigot');

const chunkSizeInPowerOfTwo = 10;
const defaultInfinity = 100 * 1024;   // Will spew 100 Mb of data before stopping

let chunk = 'A';
for(let i = 0; i < chunkSizeInPowerOfTwo; i++) {
    chunk = chunk + chunk;
}

chunk = Buffer.from(chunk);
assert.equal(Math.pow(2, chunkSizeInPowerOfTwo), chunk.length);

/**
 * @constructor
 */
function InfiniteStream(infinity) {
    if (! infinity) infinity = defaultInfinity;
    this.chunksSent = 0;
    return new spigot.sync(() => {
        if (this.chunksSent++ < infinity) return chunk;
    });
}

InfiniteStream.prototype.isAtInfinity = function() {
    return 
}

module.exports = InfiniteStream;
