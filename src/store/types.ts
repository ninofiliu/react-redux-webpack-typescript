type Action<TType, TPayload> = {
    type: TType,
    payload: TPayload
};
type Reducer<TState, TAction> = (state: TState, action: TAction) => TState;

export { Action, Reducer }
