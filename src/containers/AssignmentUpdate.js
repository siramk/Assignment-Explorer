import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Form, message, Button, Spin } from "antd";
import Hoc from "../hoc/hoc";
import { updateASNT, deleteASNT, getASNTSDetail } from "../store/actions/assignments";
import { useNavigate, useParams } from "react-router-dom";
import AssignmentForm from "../components/AssignmentForm";
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


function AssignmentUpdate(props) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const params = useParams();
    let navigate = useNavigate();

    //fetch asnt
    useEffect(() => {
        if (props.token !== undefined && props.token !== null) {
            props.getASNTSDetail(props.token, params.id);
        }
    }, [props.token]);


    useEffect(() => {
        if (props.error === null && (isSubmitted || isDeleted) && !props.loading) {
            if (isSubmitted)
                message.success("Successfully updated your assignment!");
            else
                message.success("Successfully deleted your assignment!");
            setIsSubmitted(false);
            navigate(`/`);
            return;
        }
        else if (props.error !== undefined && props.error !== null && isSubmitted) {
            setIsSubmitted(false);
            message.error(props.error.message);
            console.log("error occurred in AssignmentUpdated.js");
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
                    id: props.asnt.id,
                    teacher: props.username,
                    title: values.title,
                    duration: parseInt(values.duration),
                    deadline: values.deadline.utc().format(),
                    questions
                };

                props.updateASNT(props.token, asnt, props.asnt.id);
                setIsSubmitted(true);
            }
        });
    };

    const handleDelete = () => {
        props.deleteASNT(props.token, props.asnt.id);
        message.success("Deletion in process...")
        setIsDeleted(true);
    };

    return (
        <Hoc>
            <AssignmentForm {...props} isSubmitted={isSubmitted} formTitle="Update the Assignment" onSubmit={handleSubmit} />
            <Button onClick={handleDelete} style={{ color: "red" }}>{props.loading && isDeleted ? <Spin indicator={antIcon} /> : "Delete"}</Button>
        </Hoc>
    );


}


const WrappedAssignmentUpdate = Form.create()(AssignmentUpdate);

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        asnt: state.assignments.currentAssignment,
        username: state.auth.username,
        loading: state.assignments.loading,
        error: state.assignments.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateASNT: (token, asnt, asntId) => dispatch(updateASNT(token, asnt, asntId)),
        deleteASNT: (token, asntId) => dispatch(deleteASNT(token, asntId)),
        getASNTSDetail: (token, id) => dispatch(getASNTSDetail(token, id))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedAssignmentUpdate);
