import { Reducer } from './../src/reducer';
import { ReduxStore } from '../src/ReduxStore';


// 本测试用的测试类
class Test {
  count: number
  constructor(_count: number) {
    this.count = _count;
  }
}
let initState = new Test(2);

/*
  注意：action = {type: string,other: any}, 
  action 必须有一个 type 属性表示策略计划
*/
let reducer: Reducer<Test> = (state, action) => {
  switch (action.type) {
    case 'square':
      return {
        ...state,
        count: Math.pow(state.count, 2)
      }    
    case 'cube':
      return {     
        ...state,
        count: Math.pow(state.count, 3)   
      }    
    default:
      console.log('reducer不正确，修改state无效！');
      return state;
  }
}

/*把 reducer 函数交给 store*/
let store = new ReduxStore(initState, reducer);
store.subscribe(() => {  
  let state = store.getState();  
  console.log(`计数器当前state.count为: ${state.count}`);
});

/* 平方 */
console.log("RunTest Step 1. 即将进行平方运算...");
store.dispatch({  
  type: 'square'
});
/* 立方 */
console.log("RunTest Step 2. 即将进行立方运算...");
store.dispatch({  
  type: 'cube'
});
/* 想随便改的话 计划外的修改会是无效的！*/
// store.dispatch({ count: 'abc'});  <- 这样的代码编译时就会报错
// 因为我们规定了只能先定义 Reducer 策略才能来修改 store 中的 state 数据
/** Error 信息：
 * 类型“{ count: string; }”的参数不能赋给类型“ReducerAction”的参数。
  对象文字可以只指定已知属性，并且“count”不在类型“ReducerAction”中。
 */