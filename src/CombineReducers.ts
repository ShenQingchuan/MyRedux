import {Reducer} from './Reducer';

export function combineReducers<T>(reducers: any) : Reducer<T> {
  /* 返回合并后的新的reducer函数 */
  return (state: any, action) => {
    /* 生成的新的state */
    let nextState: any = {};

    /* 遍历执行所有的reducers，整合成为一个新的state */
    for (let key in reducers) {
      if (reducers.hasOwnProperty(key)) {
        // 某单个 state 的 reducer, 无法预测则类型为 any
        const reducer: Reducer<any> = reducers[key];
        /* 之前的 key 的 state */
        const previousStateByKey = state[key];
        /* 分别执行reducer，获得新的state */
        nextState[key] = reducer(previousStateByKey, action);
      }
    }
    return nextState;
  }
}