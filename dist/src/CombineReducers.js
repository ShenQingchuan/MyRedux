"use strict";
exports.__esModule = true;
function combineReducers(reducers) {
    /* 返回合并后的新的reducer函数 */
    return function (state, action) {
        /* 生成的新的state */
        var nextState = {};
        /* 遍历执行所有的reducers，整合成为一个新的state */
        for (var key in reducers) {
            if (reducers.hasOwnProperty(key)) {
                // 某单个 state 的 reducer, 无法预测则类型为 any
                var reducer = reducers[key];
                /* 之前的 key 的 state */
                var previousStateByKey = state[key];
                /* 分别执行reducer，获得新的state */
                nextState[key] = reducer(previousStateByKey, action);
            }
        }
        return nextState;
    };
}
exports.combineReducers = combineReducers;
