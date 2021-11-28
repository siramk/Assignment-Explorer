import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    Insights: [],
    insightDetail: null,
    error: null,
    loading: false
};

const getTeacherAssgnInsightsStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true,
        currentAssignment: null,
    });
};

const getTeacherAssgnInsightsSuccess = (state, action) => {
    return updateObject(state, {
        Insights: action.Insights,
        error: null,
        loading: false
    });
};

const getTeacherAssgnInsightsFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
};


const getTeacherInsightDetailStart = (state, action) => {
    return updateObject(state, {
        error: null,
        insightDetail: null,
        loading: true,
        currentAssignment: null,
    });
};

const getTeacherInsightDetailSuccess = (state, action) => {
    return updateObject(state, {
        insightDetail: action.insightDetail,
        error: null,
        loading: false
    });
};

const getTeacherInsightDetailFail = (state, action) => {
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
        case actionTypes.GET_ASSIGNMENTS_INSIGHTS_START:
            return getTeacherAssgnInsightsStart(state, action);
        case actionTypes.GET_ASSIGNMENTS_INSIGHTS_SUCCESS:
            return getTeacherAssgnInsightsSuccess(state, action);
        case actionTypes.GET_ASSIGNMENTS_INSIGHTS_FAIL:
            return getTeacherAssgnInsightsFail(state, action);
        case actionTypes.GET_INSIGHT_DETAIL_START:
            return getTeacherInsightDetailStart(state, action);
        case actionTypes.GET_INSIGHT_DETAIL_SUCCESS:
            return getTeacherInsightDetailSuccess(state, action);
        case actionTypes.GET_INSIGHT_DETAIL_FAIL:
            return getTeacherInsightDetailFail(state, action);

        case actionTypes.AUTH_LOGOUT:
            return authLogout(state, action);
        default:
            return state;
    }
};

export default reducer;
