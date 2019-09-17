export interface ReducerAction {
  type: string,
  other?: any,
}

export interface Reducer<T> {
  (state: T, action: ReducerAction): T
}