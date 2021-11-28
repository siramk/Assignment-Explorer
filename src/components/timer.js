import React from 'react';
import { useTimer } from 'react-timer-hook';
import { connect } from "react-redux";
import { getGradedASNTS } from "../store/actions/gradedAssignments";


function MyTimer({ expiryTimestamp, startTime, assgnid }) {
  const {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  return (
    <div>
      <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    loading: state.assignments.loading || state.gradedAssignments.loading,
    currentAssignment: state.assignments.currentAssignment,
    username: state.auth.username,
    error: state.gradedAssignments.error,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getGradedASNTS: (username, token, asntId) =>
      dispatch(getGradedASNTS(username, token, asntId))
  };
};



export default connect(mapStateToProps, mapDispatchToProps)(MyTimer);
