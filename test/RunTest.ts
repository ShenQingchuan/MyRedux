import { Reducer } from './../src/reducer';
import { ReduxStore } from '../src/ReduxStore';
import { combineReducers } from '../src/CombineReducers';


// 本测试用的测试类
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
  let t1store = new ReduxStore(t1state, reducer);
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
  let t2store = new ReduxStore<Test2>(t2state, comReducer);
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


// Run Those Tests:
console.log('Test 1: 到原文: demo-2（带Reducer的状态修改）')
RunTest1();

console.log('Test 2: 到原文: demo-3（多Reducer合并）')
RunTest2();
