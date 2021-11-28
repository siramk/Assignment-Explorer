import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Form, message } from "antd";
import { createASNT } from "../store/actions/assignments";
import { useNavigate } from "react-router-dom";
import AssignmentForm from "../components/AssignmentForm";



function AssignmentCreate(props) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        if (props.error === null && isSubmitted && !props.loading) {
            message.success("Successfully created your assignment!");
            setIsSubmitted(false);
            navigate(`/`);
            return;
        }
        else if (props.error !== undefined && props.error !== null && isSubmitted) {
            setIsSubmitted(false);
            message.error(props.error.message);
            console.log("error occurred in AssignmentCreated.js")
        }
    });


    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                // console.log("Received values of form: ", values);

                const questions = [];
                for (let i = 0; i < values.questions.length; i += 1) {
                    questions.push({
                        title: values.question[i],
                        choices: values.questions[i].choices,
                        answer: values.answers[i]
                    });
                }
                const asnt = {
                    teacher: props.username,
                    title: values.title,
                    duration: values.duration,
                    deadline: values.deadline.utc().format(),
                    questions
                };
                props.createASNT(props.token, asnt);
                setIsSubmitted(true);
            }
        });
    };



    return (
        <AssignmentForm {...props} isSubmitted={isSubmitted} formTitle="Create the Assignment" onSubmit={handleSubmit} />

    );


}


const WrappedAssignmentCreate = Form.create()(AssignmentCreate);

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.username,
        loading: state.assignments.loading,
        error: state.assignments.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createASNT: (token, asnt) => dispatch(createASNT(token, asnt))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedAssignmentCreate);
