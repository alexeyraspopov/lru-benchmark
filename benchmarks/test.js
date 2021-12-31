#!/usr/bin/env node

let assert = require("assert/strict");
let colors = require("picocolors");
let DLLLRUCachePointer = require("../implementations/DLLLRUCachePointer.js");
let DLLLRUCache = require("../implementations/DLLLRUCache.js");
let LRUMap = require("../implementations/LRUMap.js");

let hashlru = require("hashlru");
let simpleLruCache = require("simple-lru-cache");
let quickLru = require("quick-lru");
let lru = require("lru");
let modernLru = require("modern-lru");
let lruCache = require("lru-cache");

test("Single Map", () => {
  let cache = new LRUMap(3);
  assertCacheImpl(cache);
});

test("DLL Map", () => {
  let cache = DLLLRUCache(3);
  assertCacheImpl(cache);
});

test("Pointers DLL Map", () => {
  let cache = DLLLRUCachePointer(3);
  assertCacheImpl(cache);
});

// test("hashlru", () => {
//  let cache = hashlru(3);
//  assertCacheImpl(cache);
// });

test("simple-lru-cache", () => {
  let cache = new simpleLruCache({ maxSize: 3 });
  cache.has = (k) => k in cache.cache;
  assertCacheImpl(cache);
});

// test("quick-lru", () => {
//  let cache = new quickLru({ maxSize: 3 });
//  assertCacheImpl(cache);
// });

test("lru", () => {
  let cache = new lru(3);
  cache.has = (k) => k in cache.cache;
  assertCacheImpl(cache);
});

test("modern-lru", () => {
  let cache = new modernLru(3);
  assertCacheImpl(cache);
});

test("lru-cache", () => {
  let cache = new lruCache({ max: 3 });
  assertCacheImpl(cache);
});

function assertCacheImpl(cache) {
  // assert.equal(cache.size, 0);

  cache.set("a", 1);
  cache.set("b", 2);
  cache.set("c", 3);

  assert.equal(cache.get("c"), 3);

  cache.set("d", 4);

  // assert.equal(cache.size, 3);
  assert.equal(cache.get("a"), undefined);
  assert.equal(cache.get("b"), 2);

  cache.set("a", 1);
  cache.set("e", 5);
  cache.set("f", 6);

  assert.equal(cache.has("b"), false);
  assert.equal(cache.has("a"), true);
  assert.equal(cache.has("e"), true);
  assert.equal(cache.has("f"), true);

  cache.set("a", 10);
  cache.set("g", 11);

  assert.equal(cache.has("e"), false);
  assert.equal(cache.get("a"), 10);
}

function test(name, fn) {
  try {
    fn();
    console.log(colors.green("✓ " + name));
  } catch (error) {
    console.log(colors.red("✗ " + name));
    console.log(error);
  }
}
