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

  // demo6 中间件，由于我们会修改 dispatch 方法，
  // 所以可以将其变成一个公有、可改的成员变量
  public dispatch: ReduxDispatchType = (action: ReducerAction) => {
    this.state = this.reducer(this.state, action);

    // 通知所有订阅者
    for (let i = 0; i < this.listeners.length; i++) {      
      const listener = this.listeners[i];      
      listener();
    } 
  };

  // 优化中间件使用方式
  public applyMiddleware = (...middlewares: ReduxMiddlewareType[]) => {
    // 给每一个 middleware 传入本 store 对象
    const chain = middlewares.map(middleware => middleware(this));
    // 取出旧的 dispatch
    let oldDispatch = this.dispatch;
    // 实现中间件注册到 dispatch 上
    chain.reverse().map(middleware => {
      oldDispatch = middleware(oldDispatch);
    });
    // 重写 dispatch
    this.dispatch = oldDispatch;
  };

  /**
   * demo-4 => 由于 可以给 state传入默认值，
   * 则state反而变成了可选参数，而传入的 Reducer 中
   * 一定要有 赋予 state 默认值的策略
   */
  constructor (_reducer: Reducer<T>, _init_state?: T) {
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
    this.dispatch({type: ''})
  }

  
  subscribe(listener: ReduxListener) {
    this.listeners.push(listener);
    // 返回退订方法
    return () => {
      const index = this.listeners.indexOf(listener);
      this.listeners.splice(index, 1);
    }
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