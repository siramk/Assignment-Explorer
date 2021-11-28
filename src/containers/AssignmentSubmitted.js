import React, { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { connect } from "react-redux";
import Hoc from "../hoc/hoc";
import { Progress, Skeleton, Button } from 'antd';
import { getGradedASNTS } from "../store/actions/gradedAssignments";


function AssignmentSubmitted(props) {
    const navigate = useNavigate();
    useEffect(() => {
        if (props.currentAssignment === undefined || props.currentAssignment === null) {
            navigate('/');
            return;
        }
        let asntId = props.currentAssignment.id;
        if (props.token !== undefined && props.token !== null) {
            props.getGradedASNTS(props.username, props.token, asntId);
        }
    }, []);

    useEffect(() => {
        if (props.currentAssignment === undefined || props.currentAssignment === null) {
            navigate('/');
            return;
        }
    });



    var grade = null;
    if (props.gradedAssignments !== undefined && props.gradedAssignments !== null && props.gradedAssignments.length > 0) {
        grade = props.gradedAssignments.at(-1).grade;
    }
    return (
        <Hoc>
            {grade === null ? (
                <Skeleton active />
            ) : (<div>
                <span>Grade of {props.currentAssignment.title}</span>
                <br />
                <br />
                <Progress strokeLinecap="square" type="circle" percent={grade} />
                <br />
                <br />
                <Button type="primary"><Link to="/">Go Back to Assignments List</Link></Button>
            </div>)}
        </Hoc>
    );


}


const mapStateToProps = state => {
    return {
        token: state.auth.token,
        currentAssignment: state.assignments.currentAssignment,
        username: state.auth.username,
        error: state.assignments.error,
        userId: state.auth.userId,
        gradedAssignments: state.gradedAssignments.assignments,
        loading: state.gradedAssignments.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGradedASNTS: (username, token, asntId) =>
            dispatch(getGradedASNTS(username, token, asntId))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssignmentSubmitted);

