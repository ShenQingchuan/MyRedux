"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var ReduxStore_1 = require("../src/ReduxStore");
var Test = (function () {
    function Test(_count) {
        this.count = _count;
    }
    return Test;
}());
var initState = new Test(2);
var reducer = function (state, action) {
    switch (action.type) {
        case 'square':
            return __assign(__assign({}, state), { count: Math.pow(state.count, 2) });
        case 'cube':
            return __assign(__assign({}, state), { count: Math.pow(state.count, 3) });
        default:
            console.log('reducer不正确，修改state无效！');
            return state;
    }
};
var store = new ReduxStore_1.ReduxStore(initState, reducer);
store.subscribe(function () {
    var state = store.getState();
    console.log("\u8BA1\u6570\u5668\u5F53\u524Dstate.count\u4E3A: " + state.count);
});
console.log("RunTest Step 1. 即将进行平方运算...");
store.dispatch({
    type: 'square'
});
console.log("RunTest Step 2. 即将进行立方运算...");
store.dispatch({
    type: 'cube'
});
