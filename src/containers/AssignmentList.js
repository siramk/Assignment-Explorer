import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { List, Skeleton, Avatar } from "antd";
import * as actions from "../store/actions/assignments";
import { BookFilled } from '@ant-design/icons';
import Hoc from "../hoc/hoc";
import { DatePicker } from 'antd';
import moment from 'moment';
import { getLocalDateTime, getLocalDateTimeStr, filterAssgns } from '../utils';
const { RangePicker } = DatePicker;


function AssignmentList(props) {
  const [dateFilter, setDateFilter] = useState([]);

  useEffect(() => {
    if (props.token !== undefined && props.token !== null) {
      props.getASNTS(props.token, props.is_teacher);
    }
  }, []);

  useEffect(() => {
    if (props.token !== undefined && props.token !== null) {
      props.getASNTS(props.token, props.is_teacher);
    }
  }, [props.token]);

  function onDateFilterChange(date) {
    setDateFilter(date);
  }

  function renderItem(item) {
    const isAttempted = item.grade;
    const isDeadlineCrossed = getLocalDateTime(item.deadline) < moment();
    const title = (isAttempted || isDeadlineCrossed) ? item.title : (<span style={{ color: '#40a9ff' }}>{item.title}</span>);
    const icon = <BookFilled style={{ color: '#595959' }} />;
    const listItem = <List.Item>
      <List.Item.Meta
        avatar={<Avatar icon={icon} />}
        title={title}
        description={getDescription(item, props.is_teacher)}

      />
    </List.Item>;
    const toUrl = (props.is_teacher ? `/update/${item.id}` : `/assignment-start/${item.id}/${item.title}`);
    return (
      (isAttempted || isDeadlineCrossed) ?
        listItem
        :
        <NavLink style={{ display: 'block' }} to={toUrl}>
          {listItem}
        </NavLink>
    );
  }

  // send sorted(by deadline) assgns to filter  
  const filteredAssgns = filterAssgns(
    props.assignments.sort((a, b) => {
      return moment(b.deadline) - moment(a.deadline)
    }),
    dateFilter);

  return (
    <Hoc>
      {
        props.loading ? (
          <Skeleton active />
        ) : (
          <Hoc>
            <h2 style={{ margin: "16px 0" }}>Assignment List</h2>
            <div style={{ 'marginBottom': '1em' }}>
              <h3 style={{ margin: "16px 0" }}>Filter on deadline:</h3>
              <RangePicker onChange={onDateFilterChange} />
            </div>
            <div>
              <List
                itemLayout="horizontal"
                dataSource={filteredAssgns}
                renderItem={item => renderItem(item)}
              />
            </div>
          </Hoc>
        )
      }
    </Hoc>
  );


}


const getDescription = (assgn, is_teacher) => {
  const isAttempted = assgn.grade !== null;
  const duration = assgn.duration;
  const createdAt = getLocalDateTimeStr(assgn.created_at);
  const deadline = getLocalDateTimeStr(assgn.deadline);
  const grade = !isAttempted ? "-" : assgn.grade;
  const teacher = assgn.teacher;
  const attemptStatus = is_teacher ? "" : getAttemptStatus(assgn);


  const description = (<span>Teacher: {teacher} &nbsp;|&nbsp; Created on: {createdAt} &nbsp;|&nbsp;
    Deadline: {deadline} &nbsp;| &nbsp; Duration:{duration} {duration === 1 ? "min" : "mins"} &nbsp;|
    &nbsp; {is_teacher ? "" : ` Score: ${grade}/100 |`} &nbsp; {attemptStatus} </span >);

  return description;
};


function getAttemptStatus(assgn) {
  const isDeadlineCrossed = new Date(assgn.deadline + 'Z') < new Date();
  const isAttempted = assgn.grade !== null;
  let description;
  let statusColor;

  if (isAttempted) {
    description = "Attempted";
    statusColor = "#389e0d";
  }
  else if (isDeadlineCrossed) {
    description = "Deadline Missed";
    statusColor = "#ff4d4f";
  }
  else {
    description = "Not yet Attempted";
    statusColor = "#faad14";
  }

  return <span style={{ color: statusColor }}>{description}</span>;
}


const mapStateToProps = state => {
  return {
    token: state.auth.token,
    is_teacher: state.auth.is_teacher,
    assignments: state.assignments.assignments,
    loading: state.assignments.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getASNTS: (token, is_teacher) => dispatch(actions.getASNTS(token, is_teacher))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignmentList);
