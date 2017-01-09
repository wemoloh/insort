let {TidyMap, TidySet, TidyObject} = require('..');
let assert = require('assert');

const SORTED = [['b', 42], ['q', -8], ['x', 23]];
const UNSORTED = [['b', 42], ['x', 23], ['q', -8]];

const SORTED_KEYS = ['b', 'q', 'x'];
const UNSORTED_KEYS = ['b', 'x', 'q'];

const SORTED_OBJECT = {b: 42, q: -8, x: 23};
const UNSORTED_OBJECT = {b: 42, x: 23, q: -8};

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

  describe('#set()', function() {
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

describe('TidySet', function() {
  describe('#constructor()', function() {
    it('no args', function() {
      let s = new TidySet();
      assert.deepStrictEqual([...s], []);
    });

    it('sorted', function() {
      let s = new TidySet(SORTED_KEYS);
      assert.deepStrictEqual([...s], SORTED_KEYS);
    });

    it('unsorted', function() {
      let s = new TidySet(UNSORTED_KEYS);
      assert.deepStrictEqual([...s], SORTED_KEYS);
    });

    it('cmp default', function() {
      // default compare is lexicographic, not numerical
      let s = new TidySet([0, 10, 2]);
      assert.deepStrictEqual([...s], [0, 10, 2]);
    });

    it('cmp custom', function() {
      let s = new TidySet([0, 10, 2],
                          (a, b) => a - b);
      assert.deepStrictEqual([...s], [0, 2, 10]);
    });

    it('inheritance', function() {
      let s = new TidySet();
      assert(s instanceof Set);
    });
  });

  describe('#add()', function() {
    it('at beginning', function() {
      let s = new TidySet(UNSORTED_KEYS);
      assert.strictEqual(s, s.add('a'));
      assert.deepStrictEqual([...s], ['a'].concat(SORTED_KEYS));
    });

    it('at end', function() {
      let s = new TidySet(UNSORTED_KEYS);
      assert.strictEqual(s, s.add('z'));
      assert.deepStrictEqual([...s], SORTED_KEYS.concat(['z']));
    });

    it('in middle', function() {
      let s = new TidySet(UNSORTED_KEYS);
      assert.strictEqual(s, s.add('g'));
      assert.deepStrictEqual([...s], ['b', 'g', 'q', 'x']);
    });

    it('existing', function() {
      let s = new TidySet(UNSORTED_KEYS);
      assert.strictEqual(s, s.add('q'));
      assert.deepStrictEqual([...s], SORTED_KEYS);
    });
  });

  describe('#delete()', function() {
    it('existing', function() {
      let s = new TidySet(UNSORTED_KEYS);
      assert(s.delete(SORTED_KEYS[1]));
      assert.deepStrictEqual([...s], [SORTED_KEYS[0], SORTED_KEYS[2]]);
    });

    it('missing', function() {
      let s = new TidySet(UNSORTED_KEYS);
      assert(!s.delete('g'));
      assert.deepStrictEqual([...s], SORTED_KEYS);
    });
  });

  describe('other overridden methods', function() {
    it('#clear()', function() {
      let s = new TidySet(UNSORTED_KEYS);
      assert.strictEqual(void 0, s.clear());
      assert.deepStrictEqual([...s], []);
    });

    it('#entries()', function() {
      let s = new TidySet(UNSORTED_KEYS);
      let it = s.entries();
      assert.strictEqual(it[Symbol.iterator](), it);
      for (let key of SORTED_KEYS) {
        assert.deepStrictEqual(it.next(), {value: [key, key], done: false});
      }
      assert.deepStrictEqual(it.next(), {value: void 0, done: true});
    });

    it('#forEach()', function() {
      let s = new TidySet(UNSORTED_KEYS);
      let i = 0;
      s.forEach((v, k, that) => {
        let key = SORTED_KEYS[i++];
        assert.deepStrictEqual([k, v], [key, key]);
        assert.strictEqual(that, s);
      });
    });

    it('#keys()', function() {
      let s = new TidySet(UNSORTED_KEYS);
      let it = s.keys();
      assert.strictEqual(it[Symbol.iterator](), it);
      for (let key of SORTED_KEYS) {
        assert.deepStrictEqual(it.next(), {value: key, done: false});
      }
      assert.deepStrictEqual(it.next(), {value: void 0, done: true});
    });

    it('#values()', function() {
      let s = new TidySet(UNSORTED_KEYS);
      let it = s.values();
      assert.strictEqual(it[Symbol.iterator](), it);
      for (let key of SORTED_KEYS) {
        assert.deepStrictEqual(it.next(), {value: key, done: false});
      }
      assert.deepStrictEqual(it.next(), {value: void 0, done: true});
    });
  });

  describe('inherited properties', function() {
    it('#size', function() {
      let s = new TidySet(UNSORTED_KEYS);
      assert.strictEqual(SORTED_KEYS.length, s.size);
      s.add('g');
      assert.strictEqual(SORTED_KEYS.length + 1, s.size);
      s.delete('g');
      assert.strictEqual(SORTED_KEYS.length, s.size);
    });

    it('#has()', function() {
      let s = new TidySet(UNSORTED_KEYS);
      assert(s.has(SORTED_KEYS[0]));
      assert(!s.has('g'));
    });
  });
});

describe('TidyObject', function() {
  describe('#constructor()', function() {
    it('no args', function() {
      let o = new TidyObject();
      assert.deepEqual(o, {});
    });

    it('sorted', function() {
      let o = new TidyObject(SORTED_OBJECT);
      assert.deepEqual(o, SORTED_OBJECT);
      assert.deepStrictEqual(Object.keys(o),
                             Object.keys(SORTED_OBJECT).sort());
    });

    it('unsorted', function() {
      let o = new TidyObject(UNSORTED_OBJECT);
      assert.deepEqual(o, SORTED_OBJECT);
      assert.deepStrictEqual(Object.keys(o),
                             Object.keys(SORTED_OBJECT).sort());
    });

    it('cmp default', function() {
      // default compare is lexicographic, not numerical
      let o = new TidyObject({'0': 42, '10': -8, '2': 23});
      assert.deepStrictEqual(Object.keys(o), ['0', '10', '2']);
    });

    it('cmp custom', function() {
      let o = new TidyObject({'0': 42, '10': -8, '2': 23},
                             (a, b) => parseInt(a, 10) - parseInt(b, 10));
      assert.deepStrictEqual(Object.keys(o), ['0', '2', '10']);
    });
  });

  describe('set', function() {
    it('new at beginning', function() {
      let o = new TidyObject(UNSORTED_OBJECT);
      o.a = 99;
      let expected = Object.assign({}, SORTED_OBJECT, {a: 99});
      assert.deepEqual(o, expected);
      assert.deepStrictEqual(Object.keys(o), Object.keys(expected).sort());
    });

    it('new at end', function() {
      let o = new TidyObject(UNSORTED_OBJECT);
      o.z = 0;
      let expected = Object.assign({}, SORTED_OBJECT, {z: 0});
      assert.deepEqual(o, expected);
      assert.deepStrictEqual(Object.keys(o), Object.keys(expected).sort());
    });

    it('new in middle', function() {
      let o = new TidyObject(UNSORTED_OBJECT);
      o.g = 13;
      let expected = Object.assign({}, SORTED_OBJECT, {g: 13});
      assert.deepEqual(o, expected);
      assert.deepStrictEqual(Object.keys(o), Object.keys(expected).sort());
    });

    it('existing', function() {
      let o = new TidyObject(UNSORTED_OBJECT);
      o.q = 99;
      let expected = Object.assign({}, SORTED_OBJECT, {q: 99});
      assert.deepEqual(o, expected);
      assert.deepStrictEqual(Object.keys(o), Object.keys(expected).sort());
    });
  });

  describe('delete', function() {
    it('existing', function() {
      let o = new TidyObject(UNSORTED_OBJECT);
      delete o.q;
      assert.strictEqual(void 0, o.q);
      let expected = {b: 42, x: 23};
      assert.deepEqual(o, expected);
      assert.deepStrictEqual(Object.keys(o), Object.keys(expected).sort());
    });

    it('missing', function() {
      let o = new TidyObject(UNSORTED_OBJECT);
      delete o.g;
      assert.strictEqual(void 0, o.g);
      assert.deepEqual(o, SORTED_OBJECT);
      assert.deepStrictEqual(Object.keys(o),
                             Object.keys(SORTED_OBJECT).sort());
    });
  });
});
