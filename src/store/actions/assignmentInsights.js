import axios from '../../axios';
import * as actionTypes from "./actionTypes";

const getTeacherAssgnInsightsStart = () => {
    return {
        type: actionTypes.GET_ASSIGNMENTS_INSIGHTS_START
    };
};

const getTeacherAssgnInsightsSuccess = Insights => {
    return {
        type: actionTypes.GET_ASSIGNMENTS_INSIGHTS_SUCCESS,
        Insights
    };
};

const getTeacherAssgnInsightsFail = error => {
    return {
        type: actionTypes.GET_ASSIGNMENTS_INSIGHTS_FAIL,
        error: error
    };
};

export const getTeacherAssgnInsights = token => {
    return dispatch => {
        dispatch(getTeacherAssgnInsightsStart());
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };
        axios
            .get("assignments-insights/teacher/")
            .then(res => {
                const Insights = res.data;
                dispatch(getTeacherAssgnInsightsSuccess(Insights));
            })
            .catch(err => {
                dispatch(getTeacherAssgnInsightsFail(err));
            });
    };
};




// get insights detail

const getTeacherInsightDetailStart = () => {
    return {
        type: actionTypes.GET_INSIGHT_DETAIL_START
    };
};

const getTeacherInsightDetailSuccess = insightDetail => {
    return {
        type: actionTypes.GET_INSIGHT_DETAIL_SUCCESS,
        insightDetail
    };
};

const getTeacherInsightDetailFail = error => {
    return {
        type: actionTypes.GET_INSIGHT_DETAIL_FAIL,
        error: error
    };
};



export const getTeacherInsightDetail = (token, asntId) => {
    return dispatch => {
        dispatch(getTeacherInsightDetailStart());
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };
        axios
            .get(`assignments-insights/teacher/${asntId}/`)
            .then(res => {
                const insightDetail = res.data;
                dispatch(getTeacherInsightDetailSuccess(insightDetail));
            })
            .catch(err => {
                dispatch(getTeacherInsightDetailFail(err));
            });
    };
};