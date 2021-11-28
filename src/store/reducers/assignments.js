import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  assignments: [],
  currentAssignment: null,
  error: null,
  loading: false
};

const getASNTListStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
    currentAssignment: null,
  });
};

const getASNTListSuccess = (state, action) => {
  return updateObject(state, {
    assignments: action.assignments,
    error: null,
    loading: false
  });
};

const getASNTListFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const getASNTDetailStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const getASNTDetailSuccess = (state, action) => {
  return updateObject(state, {
    currentAssignment: action.assignment,
    error: null,
    loading: false
  });
};

const getASNTDetailFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const createASNTStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const createASNTSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};

const createASNTFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

// update


const updateASNTStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const updateASNTSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};

const updateASNTFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

//delete
const deleteASNTStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const deleteASNTSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};

const deleteASNTFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};


const authLogout = (state, action) => {
  return updateObject(state, initialState);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ASSIGNMENT_LIST_START:
      return getASNTListStart(state, action);
    case actionTypes.GET_ASSIGNMENTS_LIST_SUCCESS:
      return getASNTListSuccess(state, action);
    case actionTypes.GET_ASSIGNMENTS_LIST_FAIL:
      return getASNTListFail(state, action);
    case actionTypes.GET_ASSIGNMENT_DETAIL_START:
      return getASNTDetailStart(state, action);
    case actionTypes.GET_ASSIGNMENT_DETAIL_SUCCESS:
      return getASNTDetailSuccess(state, action);
    case actionTypes.GET_ASSIGNMENT_DETAIL_FAIL:
      return getASNTDetailFail(state, action);
    case actionTypes.CREATE_ASSIGNMENT_START:
      return createASNTStart(state, action);
    case actionTypes.CREATE_ASSIGNMENT_SUCCESS:
      return createASNTSuccess(state, action);
    case actionTypes.CREATE_ASSIGNMENT_FAIL:
      return createASNTFail(state, action);
    case actionTypes.UPDATE_ASSIGNMENT_START:
      return updateASNTStart(state, action);
    case actionTypes.UPDATE_ASSIGNMENT_SUCCESS:
      return updateASNTSuccess(state, action);
    case actionTypes.UPDATE_ASSIGNMENT_FAIL:
      return updateASNTFail(state, action);
    case actionTypes.DELETE_ASSIGNMENT_START:
      return deleteASNTStart(state, action);
    case actionTypes.DELETE_ASSIGNMENT_SUCCESS:
      return deleteASNTSuccess(state, action);
    case actionTypes.DELETE_ASSIGNMENT_FAIL:
      return deleteASNTFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state;
  }
};

export default reducer;
