import axios from '../../axios';
import * as actionTypes from "./actionTypes";

const getGradedASNTListStart = () => {
  return {
    type: actionTypes.GET_GRADED_ASSIGNMENT_LIST_START,
    assignments: []
  };
};

const getGradedASNTListSuccess = assignments => {
  return {
    type: actionTypes.GET_GRADED_ASSIGNMENTS_LIST_SUCCESS,
    assignments
  };
};

const getGradedASNTListFail = error => {
  return {
    type: actionTypes.GET_GRADED_ASSIGNMENTS_LIST_FAIL,
    error: error
  };
};

export const getGradedASNTS = (username, token, asntId = null) => {
  let url = `graded-assignments/?username=${username}`
  if (asntId !== null) url += `&asntId=${asntId}`

  return dispatch => {
    dispatch(getGradedASNTListStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(url)
      .then(res => {
        const assignments = res.data;
        dispatch(getGradedASNTListSuccess(assignments));
      })
      .catch(err => {
        dispatch(getGradedASNTListFail(err));
      });
  };
};



const createGradedASNTStart = () => {
  return {
    type: actionTypes.CREATE_GRADED_ASSIGNMENT_START
  };
};

const createGradedASNTSuccess = () => {
  return {
    type: actionTypes.CREATE_GRADED_ASSIGNMENT_SUCCESS
  };
};

const createGradedASNTFail = error => {
  return {
    type: actionTypes.CREATE_GRADED_ASSIGNMENT_FAIL,
    error: error
  };
};


export const createGradedASNT = (token, asnt) => {
  return dispatch => {
    dispatch(createGradedASNTStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .put(`graded-assignments/update/`, asnt)
      .then(res => {
        dispatch(createGradedASNTSuccess());
      })
      .catch(err => {
        dispatch(createGradedASNTFail(err));
      });
  };
};


const startGradedASNTStart = () => {
  return {
    type: actionTypes.START_GRADED_ASSIGNMENT_START
  };
};

const startGradedASNTSuccess = () => {
  return {
    type: actionTypes.START_GRADED_ASSIGNMENT_SUCCESS
  };
};

const startGradedASNTFail = error => {
  return {
    type: actionTypes.START_GRADED_ASSIGNMENT_FAIL,
    error: error
  };
};



export const startGradedASNT = (asntId, username, token) => {
  return dispatch => {
    dispatch(startGradedASNTStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .post(`graded-assignments/create/`, { asntId, username })
      .then(res => {
        dispatch(startGradedASNTSuccess());
      })
      .catch(err => {
        dispatch(startGradedASNTFail(err));
      });
  };
};