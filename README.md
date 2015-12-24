# Ruff

Coroutine with ES6 generators simple as never before.

## Install

```
npm i ruff --save
```

## How to use?

```js
var ruff    = require('ruff'),
    minify  = require('minify');
    
ruff(function*() {
    var mini        = minify.bind(null, 'lib/ruff.js'),
        result      = yield mini;
    
    console.log(result)
}).on('error', function(error) {
    console.log(error);
});
```
### Parallel execution

`ruff` supports parallel execution.

```js
var ruff    = require('ruff'),
    minify  = require('minify');
    
ruff(function*() {
    var first       = minify.bind(null, '1.js'),
        second      = minify.bind(null, '2.js');
        
    yield [first, second];
    console.log('done');
}).on('error', function(error) {
    console.log(error);
}).on('end', function() {
    console.log('ok what\'s next?');
});
```

## License

MIT
