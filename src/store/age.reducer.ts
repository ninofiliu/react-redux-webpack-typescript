import { Action, Reducer } from './types';

// internal reducer state
type State = { value: number }

// all the possible action cases: only one here, but there can be more
enum ActionCases { SET_VALUE = 'age/SET_VALUE' }

// initial reducer state
const stateInit: State = { value: 20 }

// action creator that can be dispatched
type SetValueAction = Action<ActionCases.SET_VALUE, {value: number}>;
const setValue
    : (value: number) => SetValueAction
    = (value) => ({
        type: ActionCases.SET_VALUE,
        payload: { value }
    });

// all the possible actions: only one here, but there can be more:
// type Actions = ActionType1 | ActionType2 | ...
type Actions = SetValueAction;

const reducer
    : Reducer<State, Actions>
    = (state=stateInit, action) => {
        switch(action.type) {
            case ActionCases.SET_VALUE:
                return {value: action.payload.value};
            default:
                return state;
        }
    };

export { reducer, setValue, State, Actions }