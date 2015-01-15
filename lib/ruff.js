(function(global) {
    'use strict';
    
    if (typeof module !== 'undefined' && module.exports)
        module.exports = new Ruff();
    else
        global.ruff = new Ruff();
    
    function Ruff() {
        function ra(generator) {
            var events  = new Events(),
                gen     = generator();
            
            function nextItem(error, result) {
                var item = gen.next(result);
                
                if (error)
                    events._emit('error', error);
                else if (!item.done)
                    if (Array.isArray(item.value))
                        parallel(item.value, nextItem);
                    else
                        item.value(nextItem);
                
                if (item.done)
                    events._emit('end');
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
        
        function Events() {
            this._all = {};
        }
        
        Events.prototype.on = function(event, callback) {
            var funcs = this._all[event];
            
            if (funcs)
                funcs.push(callback);
            else
                this._all[event] = [callback];
            
            return this;
        };
        
        Events.prototype._emit = function(event, data) {
            var funcs = this._all[event];
            
            if (funcs)
                funcs.forEach(function(fn) {
                    fn(data);
                });
            else if (event === 'error')
                throw data;
        };
        
        return ra;
    }
})(this);
