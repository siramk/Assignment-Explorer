import React from 'react';
import { Modal, Form, Input } from 'antd';




class ModelEmailForm extends React.Component {
    render() {
        const { visible, onCancel, onSendEmail, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="Mail"
                okText="Send"
                onCancel={onCancel}
                onOk={onSendEmail}
            >
                <Form layout="vertical">
                    <Form.Item label="To">
                        {getFieldDecorator('to', {
                            initialValue: this.props.emails ? this.props.emails : null,
                            rules: [{ required: true, message: 'Please enter the sender email address' }],
                        })(<Input disabled={true} />)}
                    </Form.Item>
                    <Form.Item label="Subject">
                        {getFieldDecorator('subject', {
                            rules: [{ required: true, message: 'Please write the subject' }]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Body">
                        {getFieldDecorator('body', {
                            rules: [{ required: true, message: 'Please write the description' }],
                        })(<Input type="textarea" />)}
                    </Form.Item>

                </Form>
            </Modal>
        );
    }
};


export default ModelEmailForm;