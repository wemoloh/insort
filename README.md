# OrderedMap

JavaScript (ES6) Map subclass that efficiently maintains a sorted iteration
order.

## Usage

```
> OrderedMap = require('ordered-map');
[Function: OrderedMap]
> m = new OrderedMap([[42, 'foo'], [99, 'bar'], [0, 'quux']],
...                  (a, b) => a - b); // default cmp uses localeCompare
OrderedMap { 0 => 'quux', 42 => 'foo', 99 => 'bar' }
> m.set(59, 'spam');
OrderedMap { 0 => 'quux', 42 => 'foo', 59 => 'spam', 99 => 'bar' }
```

## Requirements

- ES6

## Features

- Simple and small
- Space efficient (adds an extra O(n) sorted Array of key references)
- Time efficient (O(log(n)) inserts and deletes)
- Drop-in replacement for Map

## Caveats

- Because this does a binary search (bisect) on every insert or delete, this
  can be inefficient for large batches (compared to an approach that pre-sorted
  the data).
