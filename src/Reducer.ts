export interface ReducerAction {
  type: string,
  mutation?: any,
}

export interface Reducer<T> {
  (state: T, action: ReducerAction): T
}