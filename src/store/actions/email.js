import axios from '../../axios';
import * as actionTypes from "./actionTypes";

const sendEmailStart = () => {
    return {
        type: actionTypes.SEND_EMAIL_START
    };
};

const sendEmailSuccess = () => {
    return {
        type: actionTypes.SEND_EMAIL_SUCCESS
    };
};

const sendEmailFail = error => {
    return {
        type: actionTypes.SEND_EMAIL_FAIL,
        error: error
    };
};

export const sendEmail = (token, mail) => {
    return dispatch => {
        dispatch(sendEmailStart());
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };
        axios
            .post("email/", mail)
            .then(res => {
                dispatch(sendEmailSuccess());
            })
            .catch(err => {
                dispatch(sendEmailFail(err));
            });
    };
};
