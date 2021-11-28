import React, { useState, useEffect } from "react";
import { Button, Form, message } from 'antd';
import { connect } from "react-redux";
import * as actions from "../store/actions/email";
import ModelEmailForm from './ModelEmailForm';




function Email(props) {
    const [visible, setVisible] = useState(false);
    const showModal = () => {
        setVisible(true);
    };

    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (props.error === null && isSubmitted && !props.loading) {
            message.success("Mail sent successfully!");
            setIsSubmitted(false);
        }
        else if (props.error !== undefined && props.error !== null) {
            message.error(props.error.message);
        }
    });


    const handleCancel = () => {
        setVisible(false);
    };

    const handleSendEmail = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                // console.log("Received values of form: ", values);
                const mail = {
                    to: props.emails,
                    subject: values.subject,
                    body: values.body,
                }
                props.sendEmail(props.token, mail);
                props.form.resetFields();
                setVisible(false);
                setIsSubmitted(true);
            }
        });
    };


    return (
        <div>
            <Button type="primary" onClick={showModal}>
                {props.buttonTitle}
            </Button>
            <ModelEmailForm
                emails={props.emails}
                visible={visible}
                onCancel={handleCancel}
                onSendEmail={handleSendEmail}
                {...props}
            />

        </div>
    );
}



const WrappedSendEmail = Form.create()(Email);

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.username,
        loading: state.email.loading,
        error: state.email.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        sendEmail: (token, mail) => dispatch(actions.sendEmail(token, mail))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedSendEmail);
