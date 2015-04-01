(function(global) {
    'use strict';
    
    var Events;
    
    if (typeof module !== 'undefined' && module.exports) {
        Events          = require('events').EventEmitter;
        module.exports  = new Ruff();
    } else {
        Events          = Emitify;
        global.ruff     = new Ruff();
    }
    
    function Ruff() {
        function ruff(generator) {
            var gen,
                events  = new Events();
            
            if (!generator)
                throw(Error('generator could not be empty!'));
            
            gen = generator();
            
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
        
        return ruff;
    }
    
    /* 
     * Emitify v1.1.2
     *
     * https://github.com/coderaiser/emitify
     *
     */
    function Emitify() {
        this._all = {};
    }
    
    Emitify.prototype._check = function(event, callback) {
        var isTwo = arguments.length === 2;
        
        if (typeof event !== 'string')
            throw(Error('event should be string!'));
        
        if (isTwo && typeof callback !== 'function')
            throw(Error('callback should be function!'));
    };
    
    Emitify.prototype.on   = function(event, callback) {
        var funcs = this._all[event];
        
        this._check(event, callback);
        
        if (funcs)
            funcs.push(callback);
        else
            this._all[event] = [callback];
        
        return this;
    };
    
    Emitify.prototype.addListener =
    Emitify.prototype.on;
    
    Emitify.prototype.once  = function(event, callback) {
        var self = this;
        
        self._check(event, callback);
        
        self.on(event, function fn() {
            callback();
            self.off(event, fn);
        });
    };
    
    Emitify.prototype.off   = function(event, callback) {
        var events  = this._all[event] || [],
            index   = events.indexOf(callback);
        
        this._check(event, callback);
        
        while (~index) {
            events.splice(index, 1);
            index = events.indexOf(callback);
        }
    };
    
    Emitify.prototype.removeListener    =
    Emitify.prototype.off;
    
    Emitify.prototype.emit = function(event) {
        var args    = [].slice.call(arguments, 1),
            funcs   = this._all[event];
        
        this._check(event);
        
        if (funcs)
            funcs.forEach(function(fn) {
                fn.apply(null, args);
            });
        else if (event === 'error')
            throw args[0];
    };
    
})(this);
