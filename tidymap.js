/**
 * ordered-map module: provides TidyMap class.
 */

(function() {
  'use strict';

  // Module constants
  const CMP = Symbol('compare function');
  const ORDER = Symbol('order array');
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
  class TidyMap extends Map {

    /**
     * Create a new TidyMap.
     *
     * @param {Iterable} [entries] - Key-value pairs to initialize map.  They
     * do not have to be pre-sorted.
     * @param {Function} [cmp] - Function to compare two elements, just as in
     * Array#sort().  Default uses String#localeCompare.
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

    entries() {
      let i = 0;
      let order = this[ORDER];
      return {
        next: () => {
          if (i >= order.length) {
            return {value: void 0, done: true};
          }
          let key = order[i++];
          return {value: [key, this.get(key)], done: false};
        }
      };
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

    values() {
      let i = 0;
      let order = this[ORDER];
      return {
        next: () => {
          if (i >= order.length) {
            return {value: void 0, done: true};
          }
          return {value: this.get(order[i++]), done: false};
        }
      };
    }
  }

  TidyMap.prototype[Symbol.iterator] = TidyMap.prototype.entries;

  // export
  if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
    // Node.js
    module.exports = TidyMap;
  } else {
    // browser
    self.TidyMap = TidyMap;
  }
}());
