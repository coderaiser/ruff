# Ruff

ES6 generators simple as never before.

## Install

```
npm i ruff --save
```

## How to use?

```js
var ruff    = require('./lib/ruff'),
    minify  = require('minify');
    
ruff(function*() {
    var mini        = minify.bind(null, 'lib/ruff.js'),
        result      = yield mini;
    
    console.log(result)
}).on('error', function(error) {
    console.log(error);
});
```

## License

MIT
