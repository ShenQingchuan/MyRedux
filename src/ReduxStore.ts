import { ReduxMiddlewareType } from './ReduxStore';
import { ReducerAction } from "./reducer";
import { Reducer } from './Reducer';

export interface ReduxListener {
  (...listenerArgs: any[]): void
}

export class ReduxStore<T> {
  private state: T;
  private readonly reducer: Reducer<T>;
  private readonly listeners: Array<ReduxListener>;

  /**
   * demo-4 => 由于 可以给 state传入默认值，
   * 则state反而变成了可选参数，而传入的 Reducer 中
   * 一定要有 赋予 state 默认值的策略
   */
  constructor (_reducer: Reducer<T>, _state?: T) {
    this.state = _state;
    this.reducer = _reducer;
    this.listeners = [];

    /**
     * createStore 的时候，用一个不匹配任何 type 的 action，
     * 来触发 state = reducer(state, action)
     * 因为 action.type 不匹配，
     * 每个子 reducer 都会进到 switch-default 项，
     * 返回自己初始化的 state，这样就获得了初始化的 state 树了。
     */
    this.dispatch({type: ''})
  }

  // demo6 中间件，由于我们会修改 dispatch 方法，
  // 所以可以将其变成一个公有、可改的成员变量
  public dispatch: ReduxDispatchType = (action: ReducerAction) => {
    this.state = this.reducer(this.state, action);
    for (let i = 0; i < this.listeners.length; i++) {      
      const listener = this.listeners[i];      
      listener();
    } 
  }
  
  subscribe(listener: ReduxListener) {
    this.listeners.push(listener);
  }
  getState() {
    return this.state;
  };
}


export interface ReduxDispatchType {
  (action: ReducerAction): void
}
export interface ReduxMiddlewareType {
  (store: ReduxStore<any>): (next: ReduxDispatchType) => ReduxDispatchType
}