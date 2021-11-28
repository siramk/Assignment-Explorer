import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { message, Button } from "antd";
import { startGradedASNT } from "../store/actions/gradedAssignments";
import Hoc from "../hoc/hoc";
import { useNavigate, useParams } from "react-router-dom";


function AssignmentStart(props) {
    let navigate = useNavigate();
    const params = useParams();
    const [isClicked, setIsClicked] = useState(false);
    function handleClick(e) {
        props.startGradedASNT(params.asntId, props.username, props.token);
        setIsClicked(true);
    }

    useEffect(() => {
        if (isClicked && !props.loading) {
            if (props.error === null) {
                navigate(`/assignments/${params.asntId}`);
                return;
            }
            else {
                message.error(props.error.message);
            }
        }
    });

    return (
        <Hoc>
            <h1>{params.title}</h1>
            <Button type="primary" onClick={handleClick} >Start Assignment</Button>
        </Hoc>
    );
}



const mapStateToProps = state => {
    return {
        token: state.auth.token,
        loading: state.gradedAssignments.loading,
        error: state.gradedAssignments.error,
        userId: state.auth.userId,
        username: state.auth.username
    };
};

const mapDispatchToProps = dispatch => {
    return {
        startGradedASNT: (asntId, username, token) => dispatch(startGradedASNT(asntId, username, token))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssignmentStart);
