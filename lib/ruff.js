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
                    events.emit('error', error);
                else if (!item.done)
                    item.value(nextItem);
                
                if (item.done)
                    events.emit('end');
            }
            
            nextItem();
          
            return events;
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
            
            return events;
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
