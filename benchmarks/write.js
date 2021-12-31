#!/usr/bin/env node

let benchmark = require("benchmark");
let colors = require("picocolors");
let DLLLRUCachePointer = require("../implementations/DLLLRUCachePointer.js");
let DLLLRUCache = require("../implementations/DLLLRUCache.js");
let LRUMap = require("../implementations/LRUMap.js");

let hashlru = require("hashlru");
let simpleLruCache = require("simple-lru-cache");
let quickLru = require("quick-lru");
let lru = require("lru");

(async () => {
  await runWriteSuite({ capacity: 256, iterations: 256 * 8 });
  await runWriteSuite({ capacity: 256 * 4, iterations: 256 * 8 });
  await runWriteSuite({ capacity: 256 * 16, iterations: 256 * 8 });
})();

function runWriteSuite({ capacity, iterations }) {
  return new Promise((resolve, reject) => {
    let out;
    let suite = new benchmark.Suite();

    console.log(
      colors.bold(
        "capacity: " + colors.green(capacity) + " iterations: " + colors.green(iterations),
      ),
    );
    suite
      .add("Single Map", () => {
        let map = new LRUMap(capacity);
        for (let i = 0; i < iterations; i++) map.set(i.toString(), i);
        out = map;
      })
      .add("DLL Map", () => {
        let map = DLLLRUCache(capacity);
        for (let i = 0; i < iterations; i++) map.set(i.toString(), i);
        out = map;
      })
      .add("Pointers DLL Map", () => {
        let cache = DLLLRUCachePointer(capacity);
        for (let i = 0; i < iterations; i++) cache.set(i.toString(), i);
        out = cache;
      })
      // .add("hashlru", () => {
      //  let cache = hashlru(capacity);
      //  for (let i = 0; i < iterations; i++) cache.set(i.toString(), i);
      //  out = cache;
      // })
      .add("simple-lru-cache", () => {
        let cache = new simpleLruCache({ maxSize: capacity });
        for (let i = 0; i < iterations; i++) cache.set(i.toString(), i);
        out = cache;
      })
      // .add("quick-lru", () => {
      //  let cache = new quickLru({ maxSize: capacity });
      //  for (let i = 0; i < iterations; i++) cache.set(i.toString(), i);
      //  out = cache;
      // })
      .add("lru", () => {
        let cache = new lru(capacity);
        for (let i = 0; i < iterations; i++) cache.set(i.toString(), i);
        out = cache;
      })
      .on("cycle", (event) => {
        let name = event.target.name.padEnd(20);
        let hz = formatNumber(event.target.hz.toFixed(0)).padStart(5);
        process.stdout.write(`${name}${colors.bold(hz)} ops/sec\n`);
      })
      .on("error", (event) => reject(event.target.error))
      .on("complete", () => resolve())
      .run();
  });
}

function formatNumber(number) {
  return String(number)
    .replace(/\d{3}$/, ",$&")
    .replace(/^(\d|\d\d)(\d{3},)/, "$1,$2");
}
