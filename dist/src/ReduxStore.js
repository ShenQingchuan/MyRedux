"use strict";
exports.__esModule = true;
var ReduxStore = (function () {
    function ReduxStore(_state, _reducer) {
        this.state = _state;
        this.reducer = _reducer;
        this.listeners = [];
    }
    ReduxStore.prototype.subscribe = function (listener) {
        this.listeners.push(listener);
    };
    ReduxStore.prototype.dispatch = function (action) {
        this.state = this.reducer(this.state, action);
        for (var i = 0; i < this.listeners.length; i++) {
            var listener = this.listeners[i];
            listener();
        }
    };
    ReduxStore.prototype.getState = function () {
        return this.state;
    };
    ;
    return ReduxStore;
}());
exports.ReduxStore = ReduxStore;
