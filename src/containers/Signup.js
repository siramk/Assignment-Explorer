import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { connect } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import * as actions from "../store/actions/auth";
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { getErrorMsg } from '../utils';

const FormItem = Form.Item;
const Option = Select.Option;



function RegistrationForm(props) {

  const [confirmDirty, setConfirmDirty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.isSignUpSuccess)
      navigate("/");
  });

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let is_student = false;
        if (values.userType === "student") is_student = true;
        props.onAuth(
          values.userName,
          values.email,
          values.password,
          values.confirm,
          is_student
        );
      }
      else {
        console.log(err)
      }
    });
  };

  const handleConfirmBlur = e => {
    const value = e.target.value;
    setConfirmDirty(confirmDirty || !!value);
  };


  const compareToFirstPassword = (rule, value, callback) => {
    const form = props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    const form = props.form;
    if (value && confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };




  const { getFieldDecorator } = props.form;

  return (
    <Form onSubmit={handleSubmit}>
      <FormItem>
        {getFieldDecorator("userName", {
          rules: [{ required: true, message: "Please input your username!" }]
        })(
          <Input
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Username"
          />
        )}
      </FormItem>

      <FormItem>
        {getFieldDecorator("email", {
          rules: [
            {
              type: "email",
              message: "The input is not valid E-mail!"
            },
            {
              required: true,
              message: "Please input your E-mail!"
            }
          ]
        })(
          <Input
            prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Email"
          />
        )}
      </FormItem>

      <FormItem>
        {getFieldDecorator("password", {
          rules: [
            {
              required: true,
              message: "Please input your password!"
            },
            {
              validator: validateToNextPassword
            }
          ]
        })(
          <Input
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            placeholder="Password"
          />
        )}
      </FormItem>

      <FormItem>
        {getFieldDecorator("confirm", {
          rules: [
            {
              required: true,
              message: "Please confirm your password!"
            },
            {
              validator: compareToFirstPassword
            }
          ]
        })(
          <Input
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            placeholder="Re-enter password"
            onBlur={handleConfirmBlur}
          />
        )}
      </FormItem>

      <FormItem>
        {getFieldDecorator("userType", {
          rules: [
            {
              required: true,
              message: "Please select a user!"
            }
          ]
        })(
          <Select placeholder="Select a user type">
            <Option value="student">Student</Option>
            <Option value="teacher">Teacher</Option>
          </Select>
        )}
      </FormItem>

      <FormItem>
        <Button
          type="primary"
          htmlType="submit"
          style={{ marginRight: "10px" }}
          disabled={props.loading}
        >
          {props.loading ? "In Process....." : "Signup"}
        </Button>
        Or
        <NavLink style={{ marginLeft: "11px" }} to="/login/">
          login
        </NavLink>
      </FormItem>
      <span style={{ color: 'red' }}>{props.error !== undefined && props.error !== null && getErrorMsg(props.error)}</span>
    </Form>

  );


}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    isSignUpSuccess: state.auth.token !== null,
    error: state.auth.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, email, password1, password2, is_student) =>
      dispatch(
        actions.authSignup(username, email, password1, password2, is_student)
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedRegistrationForm);
