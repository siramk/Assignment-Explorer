import React from 'react';
import { Table } from 'antd';
import Hoc from '../hoc/hoc';
const columns = [
    {
        title: 'Id',
        dataIndex: 'user_id',
        key: 'user_id'
    },
    {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: 'Grade',
        dataIndex: 'grade',
        key: 'grade'
    }
];

function AttemptedStudents(props) {
    return (
        <Hoc>
            <h2>Attempted Students</h2>
            <Table columns={columns} dataSource={props.data} />
        </Hoc>
    );
}


export default AttemptedStudents;