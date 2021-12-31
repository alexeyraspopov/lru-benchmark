function LRUCache(capacity) {
  let items = new Map();
  let head = { key: null, value: null, prev: null, next: null };
  let tail = { key: null, value: null, prev: null, next: null };
  head.next = tail;
  tail.prev = head;

  function liftUp(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;

    node.prev = tail.prev;
    node.next = tail;

    tail.prev.next = node;
    tail.prev = node;
  }

  return {
    get(key) {
      let node = items.get(key);
      if (typeof node !== "undefined") {
        liftUp(node);
        return node.value;
      }
    },
    set(key, value) {
      if (items.has(key)) {
        let node = items.get(key);
        node.value = value;
        liftUp(node);
      } else if (items.size === capacity) {
        let node = head.next;
        items.delete(node.key);
        items.set(key, node);
        liftUp(node);
        node.key = key;
        node.value = value;
      } else {
        let node = { key, value, prev: tail.prev, next: tail };
        tail.prev.next = node;
        tail.prev = node;
        items.set(key, node);
      }
    },
    has(key) {
      return items.has(key);
    },
    get size() {
      return items.size;
    },
  };
}

module.exports = LRUCache;
