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
var CombineReducers_1 = require("../src/CombineReducers");
// 本测试用的测试类
var Test1 = /** @class */ (function () {
    function Test1(_count) {
        this.count = _count;
    }
    return Test1;
}());
function RunTest1() {
    var t1state = new Test1(2);
    /*
      注意：action = {type: string,other: any},
      action 必须有一个 type 属性表示策略计划
    */
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
    /*把 reducer 函数交给 store*/
    var t1store = new ReduxStore_1.ReduxStore(t1state, reducer);
    t1store.subscribe(function () {
        var state = t1store.getState();
        console.log("\u8BA1\u6570\u5668\u5F53\u524Dstate.count\u4E3A: " + state.count);
    });
    /* 平方 */
    console.log("RunTest Step 1. 即将进行平方运算...");
    t1store.dispatch({
        type: 'square'
    });
    /* 立方 */
    console.log("RunTest Step 2. 即将进行立方运算...");
    t1store.dispatch({
        type: 'cube'
    });
    /* 想随便改的话 计划外的修改会是无效的！*/
    // store.dispatch({ count: 'abc'});  <- 这样的代码编译时就会报错
    // 因为我们规定了只能先定义 Reducer 策略才能来修改 store 中的 state 数据
    /** Error 信息：
     * 类型“{ count: string; }”的参数不能赋给类型“ReducerAction”的参数。
      对象文字可以只指定已知属性，并且“count”不在类型“ReducerAction”中。
    */
}
var Test2 = /** @class */ (function () {
    function Test2(_count, _name, _sicnuid) {
        this.counter = {
            count: _count
        };
        this.student = {
            name: _name,
            sicnuid: _sicnuid
        };
    }
    return Test2;
}());
function RunTest2() {
    // reducer 的合并与拆分
    var t2state = new Test2(5, '王大牛', '2077110359');
    // counter 和 student 各自的 reducer
    var counterReducer = function (counter, action) {
        switch (action.type) {
            case 'INCREMENT':
                return {
                    count: counter.count + 1
                };
            case 'DECREMENT':
                return {
                    count: counter.count - 1
                };
            default: return counter; // 即更改无效
        }
    };
    var studentReducer = function (student, action) {
        switch (action.type) {
            case 'SET_NAME':
                return __assign(__assign({}, student), { name: action.mutation.name });
            case 'SET_SICNUID':
                return __assign(__assign({}, student), { sicnuid: action.mutation.sicnuid });
            default: return student; // 即更改无效
        }
    };
    var allReducers = {
        counter: counterReducer,
        student: studentReducer
    };
    var comReducer = CombineReducers_1.combineReducers(allReducers);
    var t2store = new ReduxStore_1.ReduxStore(t2state, comReducer);
    t2store.subscribe(function () {
        var state = t2store.getState();
        console.log("\u73B0\u5728\u7684 state \u662F -> \n    count: " + state.counter.count + ", \n    name: " + state.student.name + ",\n    sicnuid: " + state.student.sicnuid);
    });
    /* Counter 自增 */
    console.log('即将修改 count ...');
    t2store.dispatch({
        type: 'INCREMENT'
    });
    /*修改 name*/
    console.log('即将修改 student.name ...');
    t2store.dispatch({
        type: 'SET_NAME',
        mutation: {
            name: '张二狗'
        }
    });
}
// Run Those Tests:
console.log('Test 1: 到原文: demo-2（带Reducer的状态修改）');
RunTest1();
console.log('Test 2: 到原文: demo-3（多Reducer合并）');
RunTest2();
