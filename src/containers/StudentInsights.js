import React, { useEffect, useState } from "react";
import { Skeleton, Table, Statistic, Row, Col } from "antd";
import { connect } from "react-redux";
import { getGradedASNTS } from "../store/actions/gradedAssignments";
import { getASNTS } from "../store/actions/assignments";
import Hoc from "../hoc/hoc";
import moment from "moment";
import { getLocalDateTime, getLocalDateTimeStr, filterAssgns } from '../utils';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const columns = [
  {
    title: 'Assignment',
    dataIndex: 'title'
  },
  {
    title: 'Deadline',
    dataIndex: 'deadline',

    render: (deadline) => {
      return getLocalDateTimeStr(deadline);
    }
  },
  {
    title: 'Grade out of 100',
    dataIndex: 'grade',
    render: (grade) => {
      if (grade === null)
        return <b>-</b>;
      return grade
    }
  }
];



function StudentInsights(props) {

  const [dateFilter, setDateFilter] = useState([]);

  useEffect(() => {
    if (props.token !== undefined && props.token !== null) {
      props.getGradedASNTS(props.username, props.token);
      props.getASNTS(props.token);
    }
  }, []);


  useEffect(() => {
    if (props.token !== undefined && props.token !== null) {
      props.getGradedASNTS(props.username, props.token);
      props.getASNTS(props.token);
    }
  }, [props.token]);

  function onDateFilterChange(date) {
    setDateFilter(date);
  }


  // send sorted(by deadline) assgns to filter  

  const filteredAssgns = filterAssgns(
    props.assignments.sort((a, b) => {
      return moment(b.deadline) - moment(a.deadline)
    }),
    dateFilter);

  return (
    <Hoc>
      {props.loading || !filterAssgns ? (
        <Skeleton active />
      ) : (

        <Hoc>
          <h1>Assignment Insights</h1>
          <div style={{ 'marginBottom': '3em' }}>
            <h3 style={{ margin: "16px 0" }}>Filter on deadline:</h3>
            <RangePicker onChange={onDateFilterChange} />
          </div>

          <Row gutter={16} style={{ 'marginBottom': '2em' }}>
            <Col span={6}>
              <Statistic title="Open To Attempt" value={getNofOpenAsnts(filteredAssgns)} />
            </Col>
            <Col span={6}>
              <Statistic title="Attempted" value={getNofAttemptedAsnts(filteredAssgns)} suffix={`/ ${filteredAssgns.length}`} />
            </Col>
            <Col span={6}>
              <Statistic title="Deadline Missed" value={getNofUnAttemptedAsnts(filteredAssgns)} suffix={`/ ${filteredAssgns.length}`} />
            </Col>
            <Col span={6}>
              <Statistic title="Total Score" value={getTotalScore(filteredAssgns)} suffix={`/ ${100 * filteredAssgns.length}`} />
            </Col>
          </Row>

          <Table columns={columns} dataSource={filteredAssgns} rowKey='id' />

        </Hoc>
      )}
    </Hoc>
  );

};

function getTotalScore(assignments) {
  if (!assignments)
    return 0;
  let totalScore = 0;
  // let outOfScore = 100 * assignments.length;
  for (const assgn of assignments) {
    totalScore += assgn.grade;
  }
  return totalScore;
}

function getNofAttemptedAsnts(assignments) {
  if (!assignments)
    return 0;
  let nofAttempted = 0;
  for (const assgn of assignments) {
    if (assgn.grade !== null && assgn.attempt_end_time !== null)
      nofAttempted += 1;
  }
  return nofAttempted;
}

function getNofOpenAsnts(assignments) {
  if (!assignments)
    return 0;
  let nofOpenAsnts = 0;
  for (const assgn of assignments) {
    if (assgn.grade === null && assgn.attempt_start_time === null && moment(assgn.deadline) >= moment())
      nofOpenAsnts += 1;
  }
  return nofOpenAsnts;
}

function getNofUnAttemptedAsnts(assignments) {
  if (!assignments)
    return 0;
  let nofUnAttempted = 0;
  for (let assgn of assignments) {
    if (assgn.grade === null && assgn.attempt_start_time === null && moment(assgn.deadline) < moment())
      nofUnAttempted += 1;
  }
  return nofUnAttempted;
}


const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username,
    gradedAssignments: state.gradedAssignments.assignments,
    assignments: state.assignments.assignments,
    loading: state.gradedAssignments.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getGradedASNTS: (username, token) =>
      dispatch(getGradedASNTS(username, token)),
    getASNTS: token => dispatch(getASNTS(token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentInsights);
