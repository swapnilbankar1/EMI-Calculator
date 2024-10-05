import React, { useState } from "react";

import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";

import "./LoanDetails.css"; //

type FieldType = {
  loanAmount?: number;
  interestRate?: number;
  tenure?: number;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const LoanDetails: React.FC = () => {
  const [form] = Form.useForm();
  const [emi, setEMI] = useState(0);

  const onClickSubmit = () => {
    const formValues = form.getFieldsValue();
    console.log(formValues.loanAmount);
    console.log(formValues.interestRate);
    console.log(formValues.tenure);
    calculateEMI(
      formValues.loanAmount,
      formValues.interestRate,
      formValues.tenure
    );
    // this.calculateEMI(
    //   formValues.loanAmount,
    //   formValues.interestRate,
    //   formValues.tenure
    // );
  };

  const calculateEMI = (
    principal: number,
    annualRate: number,
    tenureYears: number
  ) => {
    let monthlyRate = annualRate / 12 / 100;
    let tenureMonths = tenureYears * 12;
    let emi: number =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    const fixed = emi.toFixed(2);
    setEMI(+fixed);
  };
  return (
    <>
      <div className="main-container">
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Loan Amount"
            name="loanAmount"
            rules={[
              { required: true, message: "Please input your loan amount!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Interest Rate"
            name="interestRate"
            rules={[
              { required: true, message: "Please input your interest rate!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Tenure"
            name="tenure"
            rules={[{ required: true, message: "Please input your tenure!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="Starting EMI">
            <Input disabled value={emi} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" onClick={onClickSubmit}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default LoanDetails;
