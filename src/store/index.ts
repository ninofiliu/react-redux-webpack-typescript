import { createStore, combineReducers } from 'redux';

import * as age from './age.reducer';
import * as name from './name.reducer';

// store state
type State = {
    age: age.State,
    name: name.State
}

// all the possible actions that can be dispatched
type Actions = age.Actions | name.Actions;

// redux takes charge of the typing from now on (see below)
const store = createStore<State, Actions, {}, {}>(
    combineReducers<State>({
        age: age.reducer,
        name: name.reducer
    })
);

export { State, Actions, store }