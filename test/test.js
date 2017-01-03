let TidyMap = require('..');
let assert = require('assert');

const SORTED = [['b', 42], ['q', -8], ['x', 23]];
const UNSORTED = [['b', 42], ['x', 23], ['q', -8]];

describe('TidyMap', function() {
  describe('#constructor()', function() {
    it('no args', function() {
      let m = new TidyMap();
      assert.deepStrictEqual([...m], []);
    });

    it('sorted', function() {
      let m = new TidyMap(SORTED);
      assert.deepStrictEqual([...m], SORTED);
    });

    it('unsorted', function() {
      let m = new TidyMap(UNSORTED);
      assert.deepStrictEqual([...m], SORTED);
    });

    it('cmp default', function() {
      // default compare is lexicographic, not numerical
      let m = new TidyMap([[0, 42], [10, -8], [2, 23]]);
      assert.deepStrictEqual([...m], [[0, 42], [10, -8], [2, 23]]);
    });

    it('cmp custom', function() {
      let m = new TidyMap([[0, 42], [10, -8], [2, 23]],
                             (a, b) => a - b);
      assert.deepStrictEqual([...m], [[0, 42], [2, 23], [10, -8]]);
    });

    it('inheritance', function() {
      let m = new TidyMap();
      assert(m instanceof Map);
    });
  });

  describe('#set', function() {
    it('new at beginning', function() {
      let m = new TidyMap(UNSORTED);
      assert.strictEqual(m, m.set('a', 99));
      assert.deepStrictEqual([...m], [['a', 99]].concat(SORTED));
    });

    it('new at end', function() {
      let m = new TidyMap(UNSORTED);
      assert.strictEqual(m, m.set('z', 0));
      assert.deepStrictEqual([...m], SORTED.concat([['z', 0]]));
    });

    it('new in middle', function() {
      let m = new TidyMap(UNSORTED);
      assert.strictEqual(m, m.set('g', 13));
      assert.deepStrictEqual([...m],
                             [['b', 42], ['g', 13], ['q', -8], ['x', 23]]);
    });

    it('existing', function() {
      let m = new TidyMap(UNSORTED);
      assert.strictEqual(m, m.set('q', 99));
      assert.deepStrictEqual([...m], [['b', 42], ['q', 99], ['x', 23]]);
    });
  });

  describe('#delete()', function() {
    it('existing', function() {
      let m = new TidyMap(UNSORTED);
      assert(m.delete(SORTED[1][0]));
      assert.deepStrictEqual([...m], [SORTED[0], SORTED[2]]);
    });

    it('missing', function() {
      let m = new TidyMap(UNSORTED);
      assert(!m.delete('g'));
      assert.deepStrictEqual([...m], SORTED);
    });
  });

  describe('other overridden methods', function() {
    it('#clear()', function() {
      let m = new TidyMap(UNSORTED);
      assert.strictEqual(void 0, m.clear());
      assert.deepStrictEqual([...m], []);
    });

    it('#entries()', function() {
      let m = new TidyMap(UNSORTED);
      let it = m.entries();
      assert.strictEqual(it[Symbol.iterator](), it);
      for (let entry of SORTED) {
        assert.deepStrictEqual(it.next(), {value: entry, done: false});
      }
      assert.deepStrictEqual(it.next(), {value: void 0, done: true});
    });

    it('#forEach()', function() {
      let m = new TidyMap(UNSORTED);
      let i = 0;
      m.forEach((v, k, that) => {
        assert.deepStrictEqual([k, v], SORTED[i++]);
        assert.strictEqual(that, m);
      });
    });

    it('#keys()', function() {
      let m = new TidyMap(UNSORTED);
      let it = m.keys();
      assert.strictEqual(it[Symbol.iterator](), it);
      for (let [key,] of SORTED) {  // eslint-disable-line comma-spacing
        assert.deepStrictEqual(it.next(), {value: key, done: false});
      }
      assert.deepStrictEqual(it.next(), {value: void 0, done: true});
    });

    it('#values()', function() {
      let m = new TidyMap(UNSORTED);
      let it = m.values();
      assert.strictEqual(it[Symbol.iterator](), it);
      for (let [, value] of SORTED) {
        assert.deepStrictEqual(it.next(), {value: value, done: false});
      }
      assert.deepStrictEqual(it.next(), {value: void 0, done: true});
    });
  });

  describe('inherited properties', function() {
    it('#size', function() {
      let m = new TidyMap(UNSORTED);
      assert.strictEqual(SORTED.length, m.size);
      m.set('g', 13);
      assert.strictEqual(SORTED.length + 1, m.size);
      m.delete('g');
      assert.strictEqual(SORTED.length, m.size);
    });

    it('#get()', function() {
      let m = new TidyMap(UNSORTED);
      for (let [key, value] of SORTED) {
        assert.deepStrictEqual(value, m.get(key));
        assert.strictEqual(void 0, m.get('g'));
      }
    });

    it('#has()', function() {
      let m = new TidyMap(UNSORTED);
      assert(m.has(SORTED[0][0]));
      assert(!m.has('g'));
    });
  });
});
