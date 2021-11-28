import React from "react";
import { Form, Input, Button } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import Hoc from "../hoc/hoc";

const FormItem = Form.Item;

let id = 0;

class QuestionForm extends React.Component {
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    if (keys.length === 1) return;
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(++id);
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  // componentDidMount() {
  //   if (this.props.question) {
  //     for (let i = 0; i < this.props.question.choices.length; i++) {
  //       this.add();
  //     }
  //   }
  // }

  componentDidUpdate(prevProps) {

    const currChoicesLength = this.props.question ? this.props.question.choices.length : null;
    const prevChoicesLength = prevProps.question ? prevProps.question.choices.length : null;
    if (this.props.question && (!prevChoicesLength || currChoicesLength !== prevChoicesLength)) {
      for (let i = 0; i < this.props.question.choices.length; i++) {
        this.add();
      }
    }
  }

  render() {
    const question = this.props.question;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => (
      <FormItem label={index === 0 ? "Choices" : ""} key={index}>
        {getFieldDecorator(`questions[${this.props.id}].choices[${index}]`, {
          validateTrigger: ["onChange", "onBlur"],
          initialValue: question ? question.choices[index] : "",
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input a choice to the question"
            }
          ]
        })(<Input placeholder="Enter the choice" />)}
        {keys.length > 1 ? (

          <MinusCircleOutlined className="dynamic-delete-button"
            onClick={() => this.remove(k)}
            disabled={keys.length === 1} />

        ) : null}
      </FormItem>
    ));
    return (
      <Hoc>
        <FormItem label="Question: ">
          {getFieldDecorator(`question[${this.props.id}]`, {
            validateTrigger: ["onChange", "onBlur"],
            initialValue: question ? question.question : "",
            rules: [
              {
                required: true,
                message: "Please input a question"
              }
            ]
          })(<Input placeholder="Add a question" />)}
        </FormItem>
        <FormItem label="Answer: ">
          {getFieldDecorator(`answers[${this.props.id}]`, {
            validateTrigger: ["onChange", "onBlur"],
            initialValue: question ? question.answer : "",
            rules: [
              {
                required: true,
                message: "Please input an answer to this question"
              }
            ]
          })(<Input placeholder="Enter the answer" />)}
        </FormItem>
        {formItems}
        <FormItem>
          <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
            <PlusCircleOutlined /> Add a choice
          </Button>
        </FormItem>
      </Hoc>
    );
  }
}

export default QuestionForm;
