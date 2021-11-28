import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Divider, DatePicker, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import QuestionForm from "./../containers/QuestionForm";
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Hoc from "../hoc/hoc";
import moment from 'moment';
import { getErrorMsg } from '../utils';

const FormItem = Form.Item;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function AssignmentForm(props) {

    const [questionCount, setQuestionCount] = useState(1);
    useEffect(() => {
        if (props.asnt) {
            setQuestionCount(props.asnt.questions.length);
        }
    }, [props.asnt])

    const remove = () => {
        setQuestionCount(questionCount - 1);
    };

    const add = () => {
        setQuestionCount(questionCount + 1);
    };

    const { getFieldDecorator } = props.form;

    const questions = [];
    for (let i = 0; i < questionCount; i += 1) {
        questions.push(
            <Hoc key={i}>
                {
                    questions.length > 0 ? (
                        <MinusCircleOutlined className="dynamic-delete-button"
                            onClick={() => remove()}
                            disabled={questions.length === 0} />
                    )
                        :
                        null
                }
                <QuestionForm id={i} question={props.asnt ? props.asnt.questions[i] : null}  {...props} />
                <Divider />
            </Hoc>
        );
    }
    return (
        <Hoc>
            <Form onSubmit={props.onSubmit} >
                <h2 style={{ color: 'blue' }}>{props.formTitle}</h2>
                <FormItem label={"Title: "}>
                    {getFieldDecorator(`title`, {
                        validateTrigger: ["onChange", "onBlur"],
                        initialValue: props.asnt ? props.asnt.title : "",
                        rules: [
                            {
                                required: true,
                                message: "Please input a title"
                            }
                        ]
                    })(<Input placeholder="Add a title" />)}
                </FormItem>
                <FormItem label={"Deadline: "}>
                    {getFieldDecorator(`deadline`, {
                        validateTrigger: ["onChange", "onOk"],
                        initialValue: props.asnt ? moment(props.asnt.deadline) : moment(),
                        rules: [
                            {
                                required: true,
                                message: "Please select a deadline"
                            }
                        ]
                    })(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime />)}
                </FormItem>
                <FormItem label={"Duration in mins: "}>
                    {getFieldDecorator(`duration`, {
                        validateTrigger: ["onChange"],
                        initialValue: props.asnt ? props.asnt.duration : 30,
                        rules: [
                            {
                                required: true,
                                message: "Please input a duration"
                            },
                            {
                                pattern: /^[0-9]+$/,
                                message: "Input should be a number"
                            }
                        ]
                    })(<Input placeholder="Add a duration" />)}
                </FormItem>
                <Divider />
                <h3 style={{ color: 'blue' }}>Add Questions</h3>
                {questions}
                <FormItem>
                    <Button type="secondary" onClick={add}>
                        <PlusCircleOutlined /> Add question
                    </Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" disabled={props.loading} htmlType="submit">
                        {props.loading && props.isSubmitted ? <Spin indicator={antIcon} /> : "Submit"}
                    </Button>
                </FormItem>
                <span style={{ color: 'red' }}>{props.error !== undefined && props.error !== null && getErrorMsg(props.error)}</span>
            </Form >

        </Hoc>

    );


}


const WrappedAssignmentForm = Form.create()(AssignmentForm);

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.username,
        loading: state.assignments.loading,
        error: state.assignments.error
    };
};


export default connect(
    mapStateToProps,
    null
)(WrappedAssignmentForm);
