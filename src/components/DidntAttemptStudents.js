import React from 'react';
import { Table } from 'antd';
import Email from './Email';
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
        title: 'Action',
        dataIndex: 'email',
        key: 'email',
        render: email => {
            return <Email buttonTitle={"Send Email"} emails={[email]} />;
        }
    }
];

function DidntAttemptStudnets(props) {

    return (
        <Hoc>
            <h2>UnAttempted Students</h2>
            <Table columns={columns} dataSource={props.data} />
            <Email emails={getEmails(props.data)} buttonTitle={"Send Emails to All UnAttempted Students"} />
        </Hoc>
    );
}

function getEmails(data) {
    const emails = [];
    for (let student of data) {
        emails.push(student.email);
    }
    return emails;
}


export default DidntAttemptStudnets;