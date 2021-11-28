import React, { useEffect } from "react";
import { Form, Input, Button, Spin } from "antd";
import { connect } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import * as actions from "../store/actions/auth";
import { LoadingOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { getErrorMsg } from "../utils";

const FormItem = Form.Item;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


function NormalLoginForm(props) {
  const navigate = useNavigate();


  useEffect(() => {
    if (props.token !== null)
      navigate("/");
    return;
  }, [props.token])

  let errorMessage = null;
  if (props.error) {
    errorMessage = <p style={{ color: "red" }}>{getErrorMsg(props.error)}</p>;
  }

  function handleSubmit(e, props) {
    e.preventDefault();

    props.form.validateFields((err, values) => {
      if (!err) {
        props.onAuth(values.userName, values.password);
      }
    });
  };

  const { getFieldDecorator } = props.form;
  return (
    <div>
      {errorMessage}
      {props.loading ? (
        <Spin indicator={antIcon} />
      ) : (
        <Form onSubmit={(e) => { handleSubmit(e, props) }} className="login-form">
          <FormItem>
            {getFieldDecorator("userName", {
              rules: [
                { required: true, message: "Please input your username!" }
              ]
            })(
              <Input
                prefix={
                  <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Username"
              />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                prefix={
                  <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "10px" }}
            >
              Login
            </Button>
            Or
            <NavLink style={{ marginRight: "10px" }} to="/signup/">
              {" "}
              signup
            </NavLink>
          </FormItem>
        </Form>
      )}
    </div>
  );
}




const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token,
    isLoggedIn: !(state.auth.token === null)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, password) =>
      dispatch(actions.authLogin(username, password))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);
