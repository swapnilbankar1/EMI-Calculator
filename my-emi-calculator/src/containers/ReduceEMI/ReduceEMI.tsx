import React, { useEffect, useState } from "react";
import { Table, TableProps } from "antd";

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

const ReduceEMI: React.FC<any> = ({ loanDetails }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (loanDetails) {
      calculateEMIAfterPartialPayment(
        loanDetails.loanAmount,
        loanDetails.interestRate,
        loanDetails.tenure,
        loanDetails.partialPayments
      );
    }
  }, [loanDetails]);

  const calculateEMIAfterPartialPayment = (
    principal: number,
    annualRate: number,
    tenureYears: number,
    partialPayments: any
  ) => {
    let monthlyRate = annualRate / 12 / 100;
    let tenureMonths = tenureYears * 12;
    let emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    partialPayments.forEach((payment: any) => {
      // Apply the partial payment to the principal
      principal -= payment.amount;
      // Recalculate EMI based on the new principal
      let remainingMonths = tenureMonths - payment.month;
      emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
        (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    });

    let totalAmountPaid = emi * tenureMonths;
    totalAmountPaid = +totalAmountPaid.toFixed(2);
    let interestPaid = totalAmountPaid - principal;
    interestPaid = +interestPaid.toFixed(2);
    let totalSavings = emi * tenureYears * 12 - totalAmountPaid;
    totalSavings = +totalSavings.toFixed(2);
    tenureMonths = +tenureMonths.toFixed(2);

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
      {
        key: "4",
        field: "Amount Saved",
        value: totalSavings,
      },
      {
        key: "5",
        field: "Remaining Months",
        value: tenureMonths,
      },
    ];

    setData(tempData);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <h3>Reduce EMI</h3>
      <div className="table-width">
        <Table<DataType> columns={columns} dataSource={data} />
      </div>
    </>
  );
};

export default ReduceEMI;
