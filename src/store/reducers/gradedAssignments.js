import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  assignments: [],
  error: null,
  loading: false
};

const getGradedASNTListStart = (state, action) => {
  return updateObject(state, {
    assignments: action.assignments,
    error: null,
    loading: true
  });
};

const getGradedASNTListSuccess = (state, action) => {
  return updateObject(state, {
    assignments: action.assignments,
    error: null,
    loading: false
  });
};

const getGradedASNTListFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};


const createGradedASNTStart = (state, action) => {
  return updateObject(state, {
    assignments: [],
    error: null,
    loading: true
  });
};

const createGradedASNTSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};

const createGradedASNTFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};


const startGradedASNTStart = (state, action) => {
  return updateObject(state, {
    assignments: [],
    error: null,
    loading: true
  });
};

const startGradedASNTSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};

const startGradedASNTFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const authLogout = (state, action) => {
  return updateObject(state, initialState);
};

const getASNTList = (state, action) => {
  return updateObject(state, {
    assignments: []
  });
};



const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_GRADED_ASSIGNMENT_LIST_START:
      return getGradedASNTListStart(state, action);
    case actionTypes.GET_GRADED_ASSIGNMENTS_LIST_SUCCESS:
      return getGradedASNTListSuccess(state, action);
    case actionTypes.GET_GRADED_ASSIGNMENTS_LIST_FAIL:
      return getGradedASNTListFail(state, action);
    case actionTypes.CREATE_GRADED_ASSIGNMENT_START:
      return createGradedASNTStart(state, action);
    case actionTypes.CREATE_GRADED_ASSIGNMENT_SUCCESS:
      return createGradedASNTSuccess(state, action);
    case actionTypes.CREATE_GRADED_ASSIGNMENT_FAIL:
      return createGradedASNTFail(state, action);
    case actionTypes.START_GRADED_ASSIGNMENT_START:
      return startGradedASNTStart(state, action);
    case actionTypes.START_GRADED_ASSIGNMENT_SUCCESS:
      return startGradedASNTSuccess(state, action);
    case actionTypes.START_GRADED_ASSIGNMENT_FAIL:
      return startGradedASNTFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.GET_ASSIGNMENT_LIST_START:
      return getASNTList(state, action);
    default:
      return state;
  }
};

export default reducer;
