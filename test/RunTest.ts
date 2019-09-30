import { Reducer } from '../src/Reducer';
import { ReduxStore, ReduxMiddlewareType } from '../src/ReduxStore';
import { combineReducers } from '../src/CombineReducers';


// 测试 1 用的测试类
class Test1 {
  count: number;
  constructor(_count: number) {
    this.count = _count;
  }
}
function RunTest1() {
  let t1state = new Test1(2);

  /*
    注意：action = {type: string,other: any}, 
    action 必须有一个 type 属性表示策略计划
  */
  let reducer: Reducer<Test1> = (state, action) => {
    switch (action.type) {
      case 'square':
        return {
          ...state,
          count: Math.pow(state.count, 2)
        };
      case 'cube':
        return {
          ...state,
          count: Math.pow(state.count, 3)
        };
      default:
        console.log('reducer不正确，修改state无效！');
        return state;
    }
  };

  /*把 reducer 函数交给 store*/
  let t1store = new ReduxStore(reducer, t1state);
  t1store.subscribe(() => {  
    let state = t1store.getState();  
    console.log(`计数器当前state.count为: ${state.count}`);
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

// 测试 2 用的测试类、接口
interface CounterType { 
  count: number 
}
interface StudentType {
  name: string,
  sicnuid: string
}
class Test2 {
  counter: CounterType;
  student: StudentType;
  constructor (_count: number, _name: string, _sicnuid: string) {
    this.counter = {
      count: _count
    };
    this.student = {
      name: _name,
      sicnuid: _sicnuid
    }
  }
}
function RunTest2() {
  // reducer 的合并与拆分
  let t2state = new Test2(5, '王大牛', '2077110359');
  // counter 和 student 各自的 reducer
  let counterReducer: Reducer<CounterType> = (counter, action) => {
    switch (action.type) {
      case 'INCREMENT': 
        return {
          count: counter.count + 1,
        };
      case 'DECREMENT':
        return {
          count: counter.count - 1,
        };
      default: return counter; // 即更改无效
    }
  };
  let studentReducer: Reducer<StudentType> = (student, action) => {
    switch (action.type) {
      case 'SET_NAME':
        return {
          ...student,
          name: action.mutation.name
        };
      case 'SET_SICNUID':
        return {
          ...student,
          sicnuid: action.mutation.sicnuid
        };
      default: return student;  // 即更改无效
    }
  };
  const allReducers = {
    counter: counterReducer,
    student: studentReducer,
  };

  const comReducer = combineReducers<Test2>(allReducers);
  let t2store = new ReduxStore<Test2>(comReducer, t2state);
  t2store.subscribe(() => {
    let state = t2store.getState();
    console.log(`现在的 state 是 -> 
    count: ${state.counter.count}, 
    name: ${state.student.name},
    sicnuid: ${state.student.sicnuid}`);
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

// 测试 3
function RunTest3() {
  console.log('---- Test3.1 （state初始化、拆分与合并） ----');
  // 初始化 state
  let initCountState = {
    count: 0
  };
  let counterReducer: Reducer<typeof initCountState> = (state, action) => {
    /*注意：如果 state 没有初始值，那就给他初始值！！*/  
    if (!state) {
      state = initCountState;
    }
    switch (action.type) {
      case 'INCREMENT':
        return {
          count: state.count + 1
        };
      default:
        return state;
    }
  };
  let t3store = new ReduxStore<typeof initCountState>(counterReducer);
  console.log(`t3store 的 state: ${JSON.stringify(t3store.getState())}`);

  /** ---------- demo6 Middleware 中间件 ---------- */
  console.log('\n---- Test3.2 （Middleware 中间件） ----')
  // 1. 取出原反射器
  const t3next = t3store.dispatch;

  // 2. 编写中间件
  const loggerMiddleware: ReduxMiddlewareType = (store) => (next) => (action) => {
    console.log('t3当前的 state: ', JSON.stringify(store.getState()));
    console.log('传入的 action: ', JSON.stringify(action));
    next(action);
    console.log('t3更新后的 state: ', JSON.stringify(store.getState()));
  }
  const exceptionMiddleware: ReduxMiddlewareType = (store) => (next) => (action) => {
    try {
      next(action);
    } catch (error) {
      console.log('错误报告: ', error);
    }
  };
  const timerMiddleware: ReduxMiddlewareType = (store) => (next) => (action) => {
    console.log('当前时间: ', new Date().toLocaleString());
    next(action);
  };

  // 3. 创建中间件实例
  const logger = loggerMiddleware(t3store);
  const timer = timerMiddleware(t3store);
  const exception = exceptionMiddleware(t3store);

  // 4. 写回反射器
  t3store.dispatch = exception(timer(logger(t3next)));

  // 测试这 3 个中间件
  t3store.dispatch({
    type: 'INCREMENT'
  });
}

// 测试 4 - 专测 应用中间件 的 applyMiddleware 方法
function RunTest4() {
  // 初始化 count 这种 state 的策略
  let initCountState = {
    count: 0
  };
  let counterReducer: Reducer<typeof initCountState> = (state, action) => {
    /*注意：如果 state 没有初始值，那就给他初始值！！*/  
    if (!state) {
      state = initCountState;
    }
    switch (action.type) {
      case 'INCREMENT':
        return {
          count: state.count + 1
        };
      default:
        return state;
    }
  };
  let t4store = new ReduxStore<typeof initCountState>(counterReducer);
  console.log(`t4store 的 初始 state: ${JSON.stringify(t4store.getState())}`);
  
  // 编写中间件
  const loggerMiddleware: ReduxMiddlewareType = (store) => (next) => (action) => {
    console.log('t4当前的 state: ', JSON.stringify(store.getState()));
    console.log('传入的 action: ', JSON.stringify(action));
    next(action);
    console.log('t4更新后的 state: ', JSON.stringify(store.getState()));
  };
  const exceptionMiddleware: ReduxMiddlewareType = (store) => (next) => (action) => {
    try {
      next(action);
    } catch (error) {
      console.log('错误报告: ', error);
    }
  };
  const timerMiddleware: ReduxMiddlewareType = (store) => (next) => (action) => {
    console.log('当前时间: ', new Date().toLocaleString());
    next(action);
  };

  t4store.applyMiddleware(exceptionMiddleware, timerMiddleware, loggerMiddleware);
  // 测试这 3 个中间件
  t4store.dispatch({
    type: 'INCREMENT'
  });
}

// 测试 5 - 专测 unsubscribe 方法
function RunTest5() {
  let initCountState = {
    count: 0
  };
  let counterReducer: Reducer<typeof initCountState> = (state, action) => {
    /*注意：如果 state 没有初始值，那就给他初始值！！*/
    if (!state) {
      state = initCountState;
    }
    switch (action.type) {
      case 'INCREMENT':
        return {
          count: state.count + 1
        };
      default:
        return state;
    }
  };
  let t5store = new ReduxStore<typeof initCountState>(counterReducer);
  const countUnsubscribe = t5store.subscribe(() => {
    let state = t5store.getState();
    console.log(`listener print: 计数器当前state.count为: ${state.count}`);
  });
  countUnsubscribe();
  t5store.dispatch({
    type: "INCREMENT"
  });
  // 应该不会打印 listener print
  console.log(`final print: 计数器当前state.count为: ${t5store.getState().count}`);
}

// Run Those Tests:
console.log('\nTest 1: 到原文: demo-2（带Reducer的状态修改）')
RunTest1();

console.log('\nTest 2: 到原文: demo-3（多Reducer合并）')
RunTest2();

console.log('\nTest 3: 到原文: demo-4')
RunTest3();

console.log('\n---- Test 4: applyMiddleware 方法测试');
RunTest4();

console.log('\n---- Test 5: unsubscribe 测试');
RunTest5();