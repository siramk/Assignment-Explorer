import React, { useEffect, useState } from 'react';
import { Button, Skeleton } from 'antd';
import { connect } from "react-redux";
import * as actions from "../store/actions/assignmentInsights";
import Hoc from "../hoc/hoc";
import { useParams } from 'react-router-dom';
import AttemptedStudents from '../components/AttemptedStudents';
import DidntAttemptStudnets from '../components/DidntAttemptStudents';


function TeacherAssgnInsightDetail(props) {
    const params = useParams();
    const [showAttempted, setShowAttempted] = useState(false);
    const [showUnAttempted, setshowUnAttempted] = useState(true);

    function changeState() {
        if (showUnAttempted) {
            setShowAttempted(true);
            setshowUnAttempted(false);
        }
        else {
            setshowUnAttempted(true);
            setShowAttempted(false);
        }
    }

    useEffect(() => {
        if (props.token) {
            props.getTeacherInsightDetail(props.token, params.asntId);
        }
    }, [props.token]);


    return (
        <Hoc>
            {props.loading || !props.insightDetail ?
                <Skeleton />
                :
                <Hoc>
                    <Button type='primary' onClick={changeState} style={{ marginBottom: 10 }}>
                        {showAttempted ? "Show UnAttempted Students" : "Show Attempted Students"}
                    </Button>
                    {
                        showAttempted ?
                            <AttemptedStudents data={props.insightDetail.attempted_students} />
                            :
                            <DidntAttemptStudnets data={props.insightDetail.unattempted_students} />
                    }
                </Hoc>
            }
        </Hoc>
    );
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        insightDetail: state.assignmentsInsights.insightDetail,
        loading: state.assignmentsInsights.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getTeacherInsightDetail: (token, asntId) => dispatch(actions.getTeacherInsightDetail(token, asntId))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeacherAssgnInsightDetail);