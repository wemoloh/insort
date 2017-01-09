/**
 * insort module: provides SortedMap, SortedSet, and SortedObject.
 */

(function() {
  'use strict';

  let insort = {};

  // Module constants
  const CMP = Symbol('insort.CMP');
  const ORDER = Symbol('insort.ORDER');
  const CMP_DEFAULT = (a, b) => String(a).localeCompare(b);

  // Binary search
  let floor = Math.floor;
  function bisect(arr, cmp, val) {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      let mid = floor((lo + hi) / 2);
      if (cmp(val, arr[mid]) > 0) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  }

  /**
   * Map subclass that efficiently maintains a sorted iteration order.
   */
  class SortedMap extends Map {

    /**
     * Create a new SortedMap.
     *
     * @param {Iterable} [entries] - Key-value pairs to initialize map.  They
     * do not have to be pre-sorted.
     * @param {Function} [cmp] - Function to compare two keys, just as in
     * Array#sort().  Default uses String#localeCompare().
     */
    constructor(entries = [], cmp = CMP_DEFAULT) {
      super();

      let order = [];
      for (let [key, val] of entries) {
        let oldSize = this.size;
        super.set(key, val);
        if (oldSize !== this.size) {
          order.push(key);
        }
      }

      this[ORDER] = order.sort(cmp);
      this[CMP] = cmp;
    }

    clear() {
      super.clear();
      this[ORDER].length = 0;
    }

    delete(key) {
      let had = super.delete(key);
      if (had) {
        let order = this[ORDER];
        order.splice(bisect(order, this[CMP], key), 1);
      }
      return had;
    }

    * entries() {
      for (let key of this[ORDER]) {
        yield [key, this.get(key)];
      }
    }

    forEach(f, that) {
      for (let key of this[ORDER]) {
        f.call(that, this.get(key), key, this);
      }
    }

    keys() {
      return this[ORDER][Symbol.iterator]();
    }

    set(key, val) {
      let oldSize = this.size;
      super.set(key, val);
      if (oldSize !== this.size) {
        let order = this[ORDER];
        order.splice(bisect(order, this[CMP], key), 0, key);
      }
      return this;
    }

    * values() {
      for (let key of this[ORDER]) {
        yield this.get(key);
      }
    }
  }

  SortedMap.prototype[Symbol.iterator] = SortedMap.prototype.entries;

  insort.SortedMap = SortedMap;

  /**
   * Set subclass that efficiently maintains a sorted iteration order.
   */
  class SortedSet extends Set {

    /**
     * Create a new SortedSet.
     *
     * @param {Iterable} [entries] - Elements to initialize set.  They do not
     * have to be pre-sorted.
     * @param {Function} [cmp] - Function to compare two elements, just as in
     * Array#sort().  Default uses String#localeCompare().
     */
    constructor(entries = [], cmp = CMP_DEFAULT) {
      super();

      let order = [];
      for (let key of entries) {
        let oldSize = this.size;
        super.add(key);
        if (oldSize !== this.size) {
          order.push(key);
        }
      }

      this[ORDER] = order.sort(cmp);
      this[CMP] = cmp;
    }

    add(key) {
      let oldSize = this.size;
      super.add(key);
      if (oldSize !== this.size) {
        let order = this[ORDER];
        order.splice(bisect(order, this[CMP], key), 0, key);
      }
      return this;
    }

    clear() {
      super.clear();
      this[ORDER].length = 0;
    }

    delete(key) {
      let had = super.delete(key);
      if (had) {
        let order = this[ORDER];
        order.splice(bisect(order, this[CMP], key), 1);
      }
      return had;
    }

    * entries() {
      for (let key of this[ORDER]) {
        yield [key, key];
      }
    }

    forEach(f, that) {
      for (let key of this[ORDER]) {
        f.call(that, key, key, this);
      }
    }

    values() {
      return this[ORDER][Symbol.iterator]();
    }
  }

  SortedSet.prototype.keys = SortedSet.prototype[Symbol.iterator] =
    SortedSet.prototype.values;

  insort.SortedSet = SortedSet;

  /**
   * Object subclass that efficiently maintains a sorted iteration order.
   */
  class SortedObject {

    /**
     * Create a new SortedObject.
     *
     * @param {*} [src] - Source object whose own enumerable properties will be
     * shallow copied.
     * @param {Function} [cmp] - Function to compare two keys, just as in
     * Array#sort().  Default uses String#localeCompare().
     */
    constructor(src = {}, cmp = CMP_DEFAULT) {
      Object.assign(this, src);

      let order = Object.keys(src).sort(cmp);

      return new Proxy(this, {
        ownKeys: () => order,

        set: (that, key, val) => {
          let had = Object.prototype.hasOwnProperty.call(that, key);
          that[key] = val;
          if (!had) {
            order.splice(bisect(order, cmp, key), 0, key);
          }
          return true;
        },

        deleteProperty: (that, key) => {
          let had = Object.prototype.hasOwnProperty.call(that, key);
          if (had) {
            delete that[key];
            order.splice(bisect(order, cmp, key), 1);
          }
          return true;
        }
      });
    }
  }

  insort.SortedObject = SortedObject;

  // export
  if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
    // Node.js
    module.exports = insort;
  } else {
    // browser
    self.insort = insort;
  }
}());
