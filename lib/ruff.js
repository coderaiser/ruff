'use strict';

var emitify = require('emitify/legacy');

module.exports = ruff;

function ruff(generator, args) {
    var gen,
        events  = emitify();
    
    if (!generator)
        throw Error('generator could not be empty!');
    
    if (args && !Array.isArray(args))
        throw Error('args should be array!');
    
    gen = generator.apply(null, args || []);
    
    function nextItem(error, result) {
        var item = gen.next(result);
        
        if (error)
            events.emit('error', error);
        else if (!item.done)
            if (Array.isArray(item.value))
                parallel(item.value, nextItem);
            else
                item.value(nextItem);
        
        if (item.done)
            events.emit('end');
    }
    
    nextItem();
      
    return events;
}

function parallel(arr, callback) {
    var done,
        i   = arr.length,
        fn  = function(error) {
            --i;
        
            if (!i && !done || error) {
                done = true;
                callback(error);
            }
    };
    
    arr.forEach(function(item) {
        item(fn);
    });
}
