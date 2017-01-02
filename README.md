# TidyMap

JavaScript (ES6) Map subclass that efficiently maintains a sorted iteration
order.

## Usage

```js
let TidyMap = require('tidymap');
// => [Function: TidyMap]

let m = new TidyMap([[42, 'foo'], [99, 'bar'], [0, 'quux']],
                    (a, b) => a - b); // default cmp uses localeCompare
// => TidyMap { 0 => 'quux', 42 => 'foo', 99 => 'bar' }

m.set(59, 'spam');
// => TidyMap { 0 => 'quux', 42 => 'foo', 59 => 'spam', 99 => 'bar' }
```

## Requirements

- ES6

## Features

- Simple and small
- Standard ES6 Map interface
- Space efficient (adds an extra O(n) sorted Array of key references)
- Time efficient (O(log(n)) inserts and deletes)

## Caveats

- This works fine for a few thousand entries, but for larger datasets you
  probably want something fancier like a skip list.
