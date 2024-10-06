import React, { useState } from "react";

import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { Divider } from "antd";

import NoPrePayment from "../NoPrePayment/NoPrePayment";

import "./LoanDetails.css";
import ReduceTerm from "../ReduceTerm/ReduceTerm";

type FieldType = {
  loanAmount?: number;
  interestRate?: number;
  tenure?: number;
};

type PrePaymentFieldType = {
  monthly?: number;
  yearly?: number;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const LoanDetails: React.FC = () => {
  const [form] = Form.useForm();
  const [prePaymentPlanForm] = Form.useForm();
  const [emi, setEMI] = useState(0);
  const [tenure, setTenure] = useState(0);
  const [PrePaymentArr, setPrePaymentArr] = useState([]);

  const onClickSubmit = () => {
    const formValues = form.getFieldsValue();
    console.log(formValues.loanAmount);
    console.log(formValues.interestRate);
    console.log(formValues.tenure);
    setTenure(formValues.tenure);
    calculateEMI(
      formValues.loanAmount,
      formValues.interestRate,
      formValues.tenure
    );
  };

  const onClickShow = () => {
    const formValues = prePaymentPlanForm.getFieldsValue();
    const arr = [];
    const monthly = formValues.monthly;
    let yearly = formValues.yearly;
    let obj = {};
    if (monthly) {
      obj = {
        month: calculateMonth(tenure),
        amount: calculateAmount(tenure, monthly),
      };
    } else {
      obj = {
        month: calculateMonth(tenure),
        amount: tenure * +yearly,
      };
    }

    arr.push(obj);
  };

  const calculateAmount = (tenure: number, amount: number) => {
    return tenure * 12 * amount;
  };

  const calculateMonth = (tenure: number) => {
    return tenure * 12;
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

        <Divider />
        <div>
          <div>
            {form.getFieldsValue().loanAmount > 0 &&
            form.getFieldsValue().interestRate > 0 &&
            form.getFieldsValue().tenure > 0 ? (
              <NoPrePayment
                loanDetails={{
                  loanAmount: form.getFieldsValue().loanAmount,
                  interestRate: form.getFieldsValue().interestRate,
                  tenure: form.getFieldsValue().tenure,
                }}
              ></NoPrePayment>
            ) : (
              "Payment details will be shown here"
            )}
          </div>
          <div>
            {form.getFieldsValue().loanAmount > 0 &&
            form.getFieldsValue().interestRate > 0 &&
            form.getFieldsValue().tenure > 0 ? (
              <ReduceTerm
                loanDetails={{
                  loanAmount: form.getFieldsValue().loanAmount,
                  interestRate: form.getFieldsValue().interestRate,
                  tenure: form.getFieldsValue().tenure,
                }}
              ></ReduceTerm>
            ) : (
              "Payment details will be shown here"
            )}
          </div>
        </div>

        <Divider></Divider>
        <Form
          form={prePaymentPlanForm}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<PrePaymentFieldType>
            label="Monthly"
            name="monthly"
            rules={[
              { required: true, message: "Please input your loan amount!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<PrePaymentFieldType>
            label="Yearly"
            name="yearly"
            rules={[
              { required: true, message: "Please input your interest rate!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" onClick={onClickShow}>
              Show EMI options
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default LoanDetails;
