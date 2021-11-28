import React, { useEffect } from 'react';
import { Table, Button } from 'antd';
import { connect } from "react-redux";
import * as actions from "../store/actions/assignmentInsights";
import { Link } from 'react-router-dom';

const columns = [

    {
        title: 'Assignment',
        dataIndex: 'title',
    },
    {
        title: 'No.of students attempted',
        dataIndex: 'nof_students_attempted',
    },
    {
        title: 'No.of students didn\'t attempt',
        dataIndex: 'nof_students_unattempted',
    },
    {
        title: 'Detail',
        dataIndex: 'assignment_id',
        render: assignment_id => {
            return (
                <Button type="primary">
                    <Link to={`/insight-detail/${assignment_id}`}>Detail Insight</Link>
                </Button>
            );
        }
    },
];


function TeacherAssgnInsights(props) {

    useEffect(() => {
        if (props.token) {
            props.getTeacherAssgnInsights(props.token);
        }
    }, [props.token]);


    return (
        <div>
            <h2 style={{ 'marginBottom': '1em' }}>Assignment Insights</h2>
            <Table columns={columns} dataSource={props.insights} scroll={{ y: 1300 }} rowKey="assignment_id" />
        </div>
    );

}



const mapStateToProps = state => {
    return {
        token: state.auth.token,
        insights: state.assignmentsInsights.Insights,
        loading: state.assignmentsInsights.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getTeacherAssgnInsights: token => dispatch(actions.getTeacherAssgnInsights(token))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeacherAssgnInsights);
