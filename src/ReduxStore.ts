import { ReducerAction } from "./reducer";
import { Reducer } from './Reducer';

export interface ReduxListener {
  (...listenerArgs: any[]): void
}

export class ReduxStore<T> {
  private state: T;
  private reducer: Reducer<T>;
  private listeners: Array<ReduxListener>;
  constructor (_state: T, _reducer?: Reducer<T>) {
    this.state = _state;
    this.reducer = _reducer;
    this.listeners = [];
  }

  subscribe(listener: ReduxListener) {
    this.listeners.push(listener);
  }
  dispatch(action: ReducerAction) {
    this.state = this.reducer(this.state, action);
    for (let i = 0; i < this.listeners.length; i++) {      
      const listener = this.listeners[i];      
      listener();
    } 
  }
  getState() {
    return this.state;
  };
}