import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    error: null,
    loading: false
};

const sendEmailStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true,
        currentAssignment: null,
    });
};

const sendEmailSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: false
    });
};

const sendEmailFail = (state, action) => {
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
        case actionTypes.SEND_EMAIL_START:
            return sendEmailStart(state, action);
        case actionTypes.SEND_EMAIL_SUCCESS:
            return sendEmailSuccess(state, action);
        case actionTypes.SEND_EMAIL_FAIL:
            return sendEmailFail(state, action);
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state, action);
        default:
            return state;
    }
};

export default reducer;
