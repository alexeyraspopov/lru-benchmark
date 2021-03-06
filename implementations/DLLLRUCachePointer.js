function LRUCache(capacity) {
  let forward = createPointerArray(capacity);
  let backward = createPointerArray(capacity);
  let keys = new Array(capacity);
  let values = new Array(capacity);
  let cursor = 0;
  let head = 0;
  let tail = 0;
  let items = new Map();

  function liftUp(pointer) {
    if (head === pointer) {
      return;
    }

    let prev = backward[pointer];
    let next = forward[pointer];

    if (tail === pointer) {
      tail = prev;
    } else {
      backward[next] = prev;
    }

    forward[prev] = next;
    forward[pointer] = head;
    backward[head] = pointer;
    head = pointer;
  }

  return {
    has(key) {
      return items.has(key);
    },
    get(key) {
      let pointer = items.get(key);

      if (typeof pointer !== "undefined") {
        liftUp(pointer);
        return values[pointer];
      }
    },
    set(key, value) {
      let pointer = items.get(key);

      if (typeof pointer !== "undefined") {
        liftUp(pointer);
        values[pointer] = value;
        return;
      }

      if (cursor < capacity) {
        pointer = cursor++;
      } else {
        pointer = tail;
        tail = backward[pointer];
        items.delete(keys[pointer]);
      }

      items.set(key, pointer);
      keys[pointer] = key;
      values[pointer] = value;

      forward[pointer] = head;
      backward[head] = pointer;
      head = pointer;
    },
    get size() {
      return items.size;
    },
  };
}

const MAX_8BIT_INTEGER = Math.pow(2, 8) - 1;
const MAX_16BIT_INTEGER = Math.pow(2, 16) - 1;
const MAX_32BIT_INTEGER = Math.pow(2, 32) - 1;

function createPointerArray(size) {
  let maxIndex = size - 1;

  if (maxIndex <= MAX_8BIT_INTEGER) {
    return new Uint8Array(size);
  }

  if (maxIndex <= MAX_16BIT_INTEGER) {
    return new Uint16Array(size);
  }

  if (maxIndex <= MAX_32BIT_INTEGER) {
    return new Uint32Array(size);
  }

  return new Float64Array(size);
}

module.exports = LRUCache;
