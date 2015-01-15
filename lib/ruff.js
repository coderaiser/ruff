(function(global) {
    'use strict';
    
    if (typeof module !== 'undefined' && module.exports)
        module.exports = new Ruff();
    else
        global.ruff = new Ruff();
    
    function Ruff() {
        function ra(generator) {
            var gen     = generator(thunk),
                events  = new Events();
            
            function nextItem(error, result) {
                var item = gen.next(result);
                
                if (error)
                    events.emit('error', error);
                else if (!item.done)
                    item.value(nextItem);
                
                if (item.done)
                    events.emit('end');
            }
            
            nextItem();
          
            return events;
        }
        
        function thunk(fn) {
            var args = [].slice.call(arguments);
            
            args.shift();
            
            return function(callback) {
                args.push(callback);
                fn.apply(null, args);
            };
        }
        
        function Events() {
            this._all = {};
        }
        
        Events.prototype.on = function(event, callback) {
            var funcs = Events[event];
            
            if (funcs)
                funcs.push(callback);
            else
                this._all[event] = [callback];
            
            return ra;
        };
        
        Events.prototype.emit = function(event, data) {
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
