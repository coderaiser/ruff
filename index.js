var ruff    = require('./lib/ruff'),
    minify  = require('minify');
    
ruff(function*(thunk) {
    var mini        = thunk(minify, 'lib/ruff.js'),
        result      = yield mini;
    
    console.log(result)
}).on('error', function(error) {
    console.log(error);
});