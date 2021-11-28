import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Card, Skeleton, message, Statistic } from "antd";
import Questions from "./Questions";
import Choices from "../components/Choices";
import { getASNTSDetail } from "../store/actions/assignments";
import { createGradedASNT, getGradedASNTS } from "../store/actions/gradedAssignments";
import Hoc from "../hoc/hoc";
import { useNavigate, useParams } from "react-router-dom";
import * as dayjs from 'dayjs'

const { Countdown } = Statistic;



const cardStyle = {
    marginTop: "20px",
    marginBottom: "20px"
};


function AssignmentDetail(props) {
    let navigate = useNavigate();
    let params = useParams();
    const [usersAnswers, setUsersAnswers] = useState({});
    const answersRef = useRef(usersAnswers);
    answersRef.current = usersAnswers;
    const [isSubmitted, setIsSubmitted] = useState(false);


    useEffect(() => {
        if (props.token !== undefined && props.token !== null) {
            props.getGradedASNTS(props.username, props.token, params.id);
            props.getASNTSDetail(props.token, params.id);
        }
    }, [props.token]);



    // expiry time setup
    const [expiryTimestamp, setExpiryTimeStamp] = useState(null);
    const [assgnDuration, setAssgnDuration] = useState(null);

    useEffect(() => {

        if (!props.loading && props.currentAssignment && props.currentGradedAssignment) {
            const assgnStartTimeStr = props.currentGradedAssignment.attempt_start_time;
            const newExpiryTimestamp = dayjs(assgnStartTimeStr).add(props.currentAssignment.duration, 'm');

            //set the state
            setExpiryTimeStamp(newExpiryTimestamp);
            setAssgnDuration(props.currentAssignment.duration);

        }

    }, [props.currentGradedAssignment, props.currentAssignment])





    useEffect(() => {
        if (props.error === null && isSubmitted && !props.loading) {
            message.success("Successfully submitted your assignment!");
            navigate(`/assignmentSubmitted/`);
            return;
        }
        else if (props.error !== undefined && props.error !== null) {
            message.error(props.error.message);
        }
    });



    const onChange = (e, qId) => {
        setUsersAnswers({ ...usersAnswers, [qId]: e.target.value });
    };

    function handleSubmit() {
        message.success("Submitting your assignment!");
        const asnt = {
            username: props.username,
            asntId: props.currentAssignment.id,
            answers: answersRef.current
        };
        props.createGradedASNT(props.token, asnt);
        setIsSubmitted(true);
    }
    const { currentAssignment } = props;
    const title = currentAssignment ? currentAssignment.title : null;

    return (
        <Hoc>
            {currentAssignment === null || Object.keys(currentAssignment).length > 0 ? (
                <Hoc>
                    {props.loading || expiryTimestamp === null || !props.currentGradedAssignment ? (
                        <Skeleton active />
                    ) : (<Hoc>

                        <Countdown style={{ 'marginBottom': '1em' }}
                            title="Time Left:"
                            value={expiryTimestamp.valueOf()}
                            onFinish={handleSubmit} />

                        <Card title={title}>
                            <Questions
                                submit={() => handleSubmit()}
                                questions={currentAssignment.questions.map(q => {
                                    return (
                                        <Card
                                            style={cardStyle}
                                            type="inner"
                                            key={q.id}
                                            title={`${q.order}. ${q.question}`}
                                        >
                                            <Choices
                                                questionId={q.id}
                                                choices={q.choices}
                                                change={onChange}
                                                usersAnswers={usersAnswers}
                                            />
                                        </Card>
                                    );
                                })}
                            />
                        </Card>
                    </Hoc>)}
                </Hoc>
            ) : null}

        </Hoc>
    );


};

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        currentAssignment: state.assignments.currentAssignment,
        currentGradedAssignment: state.gradedAssignments.assignments.at(-1),
        loading: state.assignments.loading || state.gradedAssignments.loading,
        username: state.auth.username,
        error: state.gradedAssignments.error,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getASNTSDetail: (token, id) => dispatch(getASNTSDetail(token, id)),
        createGradedASNT: (token, asnt) => dispatch(createGradedASNT(token, asnt)),
        getGradedASNTS: (username, token, asntId) =>
            dispatch(getGradedASNTS(username, token, asntId))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssignmentDetail);
