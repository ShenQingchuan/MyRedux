"use strict";
exports.__esModule = true;
var ReduxStore = /** @class */ (function () {
    /**
     * demo-4 => 由于 可以给 state传入默认值，
     * 则state反而变成了可选参数，而传入的 Reducer 中
     * 一定要有 赋予 state 默认值的策略
     */
    function ReduxStore(_reducer, _init_state) {
        var _this = this;
        // demo6 中间件，由于我们会修改 dispatch 方法，
        // 所以可以将其变成一个公有、可改的成员变量
        this.dispatch = function (action) {
            _this.state = _this.reducer(_this.state, action);
            // 通知所有订阅者
            for (var i = 0; i < _this.listeners.length; i++) {
                var listener = _this.listeners[i];
                listener();
            }
        };
        // 优化中间件使用方式
        this.applyMiddleware = function () {
            var middlewares = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                middlewares[_i] = arguments[_i];
            }
            // 给每一个 middleware 传入本 store 对象
            var chain = middlewares.map(function (middleware) { return middleware(_this); });
            // 取出旧的 dispatch
            var oldDispatch = _this.dispatch;
            // 实现中间件注册到 dispatch 上
            chain.reverse().map(function (middleware) {
                oldDispatch = middleware(oldDispatch);
            });
            // 重写 dispatch
            _this.dispatch = oldDispatch;
        };
        this.state = _init_state;
        this.reducer = _reducer;
        this.listeners = [];
        /**
         * createStore 的时候，用一个不匹配任何 type 的 action，
         * 来触发 state = reducer(state, action)
         * 因为 action.type 不匹配，
         * 每个子 reducer 都会进到 switch-default 项，
         * 返回自己初始化的 state，这样就获得了初始化的 state 树了。
         */
        this.dispatch({ type: '' });
    }
    ReduxStore.prototype.subscribe = function (listener) {
        var _this = this;
        this.listeners.push(listener);
        // 返回退订方法
        return function () {
            var index = _this.listeners.indexOf(listener);
            _this.listeners.splice(index, 1);
        };
    };
    ReduxStore.prototype.getState = function () {
        return this.state;
    };
    ;
    return ReduxStore;
}());
exports.ReduxStore = ReduxStore;
