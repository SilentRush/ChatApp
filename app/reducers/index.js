import { combineReducers } from 'redux';

// Reducers
import utilityReducer from './utility-reducer';

// Combine Reducers
var reducers = combineReducers({
    utilityState: utilityReducer
});

export default reducers;
