class LRUMap extends Map {
  constructor(capacity) {
    super();
    this.capacity = capacity;
    this.iter = this.keys();
  }

  get(key) {
    let value = super.get(key);
    if (typeof value !== "undefined") {
      super.delete(key);
      super.set(key, value);
      return value;
    }
  }

  set(key, value) {
    if (super.has(key)) {
      super.delete(key);
      super.set(key, value);
    } else {
      super.set(key, value);
      if (this.size > this.capacity) {
        super.delete(this.iter.next().value);
      }
    }
  }
}

module.exports = LRUMap;
