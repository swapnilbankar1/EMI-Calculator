import { Table, TableProps } from "antd";
import React, { useEffect, useState } from "react";
import "./NoPrePayment.css";

interface DataType {
  key: string;
  amount: number;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Fields",
    dataIndex: "field",
    key: "field",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

const NoPrePayment: React.FC<any> = ({ loanDetails }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (loanDetails) {
      calculateLoanDetails(
        loanDetails.loanAmount,
        loanDetails.interestRate,
        loanDetails.tenure
      );
    }
  }, [loanDetails]);

  const calculateLoanDetails = (
    principal: number,
    annualRate: number,
    tenureYears: number
  ) => {
    let monthlyRate = annualRate / 12 / 100;
    let tenureMonths = tenureYears * 12;
    let emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    let totalAmountPaid = emi * tenureMonths;
    let interestPaid = totalAmountPaid - principal;

    const tempData: any = [
      {
        key: "1",
        field: "Total Amount Paid",
        value: totalAmountPaid,
      },
      {
        key: "2",
        field: "Principle Paid",
        value: principal,
      },
      {
        key: "3",
        field: "Interest Paid",
        value: interestPaid,
      },
    ];
    setData(tempData);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <div className="table-width">
        <Table<DataType> columns={columns} dataSource={data} />
      </div>
    </>
  );
};

export default NoPrePayment;
