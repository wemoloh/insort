# insort

[![Build Status](https://travis-ci.org/wemoloh/insort.svg?branch=master)](https://travis-ci.org/wemoloh/insort)

JavaScript (ES6) Map, Set, and Object subclasses that efficiently maintain a
sorted iteration order.

## Usage

```js
let {SortedMap, SortedSet, SortedObject} = require('insort');

// compare function (defaults to localeCompare)
let cmp = (a, b) => a - b;

let m = new SortedMap([[42, 'foo'], [99, 'bar'], [0, 'quux']], cmp);
m.set(59, 'spam');
for (let [key, val] of m) {
  console.log(key, val);
}
// 0 'quux'
// 42 'foo'
// 59 'spam'
// 99 'bar'

let s = new SortedSet([42, 99, 0], cmp);
s.add(59);
for (let key of s) {
  console.log(key);
}
// 0
// 42
// 59
// 99

let o = new SortedObject({foo: 42, bar: 99, quux: 0});
o.baz = -8;
for (let key in o) {
  console.log(key, o[key]);
}
// bar 99
// baz -8
// foo 42
// quux 0
```

## Requirements

- ES6

## Features

- Simple and small
- Uses standard APIs; just drop into existing Map-, Set-, or Object-based code
- Space efficient (adds an extra O(n) sorted Array of key references)
- Time efficient (O(1) find and replace, O(log(n)) insert and delete)

## Caveats

- This works fine for a few thousand entries, but for larger datasets you
  probably want something fancier, such as a skip list.
