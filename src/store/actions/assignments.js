import axios from '../../axios';
import * as actionTypes from "./actionTypes";

const getASNTListStart = () => {
  return {
    type: actionTypes.GET_ASSIGNMENT_LIST_START
  };
};

const getASNTListSuccess = assignments => {
  return {
    type: actionTypes.GET_ASSIGNMENTS_LIST_SUCCESS,
    assignments
  };
};

const getASNTListFail = error => {
  return {
    type: actionTypes.GET_ASSIGNMENTS_LIST_FAIL,
    error: error
  };
};

export const getASNTS = (token, is_teacher) => {
  const url = is_teacher ? 'assignments/' : 'assignments-with-grades/'
  return dispatch => {
    dispatch(getASNTListStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(url)
      .then(res => {
        const assignments = res.data;
        dispatch(getASNTListSuccess(assignments));
      })
      .catch(err => {
        dispatch(getASNTListFail(err));
      });
  };
};

const getASNTDetailStart = () => {
  return {
    type: actionTypes.GET_ASSIGNMENT_DETAIL_START
  };
};

const getASNTDetailSuccess = assignment => {
  return {
    type: actionTypes.GET_ASSIGNMENT_DETAIL_SUCCESS,
    assignment
  };
};

const getASNTDetailFail = error => {
  return {
    type: actionTypes.GET_ASSIGNMENT_DETAIL_FAIL,
    error: error
  };
};

export const getASNTSDetail = (token, id) => {
  return dispatch => {
    dispatch(getASNTDetailStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`assignments/${id}/`)
      .then(res => {
        const assignment = res.data;
        dispatch(getASNTDetailSuccess(assignment));
      })
      .catch(err => {
        dispatch(getASNTDetailFail(err));
      });
  };
};

const createASNTStart = () => {
  return {
    type: actionTypes.CREATE_ASSIGNMENT_START
  };
};

const createASNTSuccess = () => {
  return {
    type: actionTypes.CREATE_ASSIGNMENT_SUCCESS
  };
};

const createASNTFail = error => {
  return {
    type: actionTypes.CREATE_ASSIGNMENT_FAIL,
    error: error
  };
};

export const createASNT = (token, asnt) => {
  return dispatch => {
    dispatch(createASNTStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .post(`assignments/`, asnt)
      .then(res => {
        dispatch(createASNTSuccess());
      })
      .catch(err => {
        dispatch(createASNTFail(err));
      });
  };
};

// update

const updateASNTStart = () => {
  return {
    type: actionTypes.UPDATE_ASSIGNMENT_START
  };
};

const updateASNTSuccess = () => {
  return {
    type: actionTypes.UPDATE_ASSIGNMENT_SUCCESS
  };
};

const updateASNTFail = error => {
  return {
    type: actionTypes.UPDATE_ASSIGNMENT_FAIL,
    error: error
  };
};

export const updateASNT = (token, asnt, asntId) => {
  return dispatch => {
    dispatch(updateASNTStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .put(`assignments/${asntId}/`, asnt)
      .then(res => {
        dispatch(updateASNTSuccess());
      })
      .catch(err => {
        dispatch(updateASNTFail(err));
      });
  };
};


// delete

const deleteASNTStart = () => {
  return {
    type: actionTypes.DELETE_ASSIGNMENT_START
  };
};

const deleteASNTSuccess = () => {
  return {
    type: actionTypes.DELETE_ASSIGNMENT_SUCCESS
  };
};

const deleteASNTFail = error => {
  return {
    type: actionTypes.DELETE_ASSIGNMENT_FAIL,
    error: error
  };
};

export const deleteASNT = (token, asntId) => {
  return dispatch => {
    dispatch(deleteASNTStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .delete(`assignments/${asntId}/`)
      .then(res => {
        dispatch(deleteASNTSuccess());
      })
      .catch(err => {
        dispatch(deleteASNTFail(err));
      });
  };
};