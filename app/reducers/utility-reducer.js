import * as types from '../actions/action-types';

const initialState = {
  Pdfs:{

  }
};

const utilityReducer = function(state = initialState, action) {
  switch(action.type) {

    case types.GET_PDFS_SUCCESS:
      return Object.assign({}, state, { Pdfs: action.Pdfs });

  }

  return state;

}

export default utilityReducer;
