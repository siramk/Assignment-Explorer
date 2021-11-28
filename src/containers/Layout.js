import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { useResolvedPath, useMatch } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";

const { Header, Content, Footer } = Layout;

function MenuItem({ to, children, ...props }) {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Menu.Item className={match ? 'ant-menu-item-selected' : ''} {...props}>
      <Link to={to}>{children}</Link>
    </Menu.Item>
  );
}

function CustomLayout(props) {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: "64px" }}
          selectable={false}
        >
          <Menu.Item key="7" disabled={true}>
            <span style={{ color: "#d9d9d9" }}>Hi, {props.username}</span>
          </Menu.Item>


          {props.token !== null ? (
            <MenuItem key="2" to="/">
              Assignments
            </MenuItem>
          ) : null}


          {props.token !== null && props.is_teacher ? (
            <MenuItem key="3" to="/create">
              Create Assignment
            </MenuItem>
          ) : null}

          {props.token !== null ? (
            <MenuItem key='6' to={props.is_teacher ? '/insights/' : `/student-insights/${props.userId}`}>
              Insights
            </MenuItem>
          ) : null}

          {props.isAuthenticated ? (
            <Menu.Item key="5" onClick={props.logout}>
              Logout
            </Menu.Item>
          ) : (
            <Menu.Item key="5">
              <Link to="/login">Login</Link>
            </Menu.Item>
          )}
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          {props.children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2016 Created by Ant UED
      </Footer>
    </Layout>
  );
}

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    token: state.auth.token,
    is_teacher: state.auth.is_teacher,
    username: state.auth.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.logout())
  };
};

export default
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout);