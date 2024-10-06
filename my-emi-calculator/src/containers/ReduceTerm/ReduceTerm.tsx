import { Table, TableProps } from "antd";
import React, { useEffect, useState } from "react";

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

const ReduceTerm: React.FC<any> = ({ loanDetails }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (loanDetails) {
      calculateTenureAfterPartialPayment(
        loanDetails.loanAmount,
        loanDetails.interestRate,
        loanDetails.tenure,
        loanDetails.partialPayments
      );
    }
  }, [loanDetails]);

  const calculateTenureAfterPartialPayment = (
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
      // Recalculate remaining tenure based on the new principal and same EMI
      let remainingMonths =
        Math.log(
          emi / monthlyRate / (emi / monthlyRate - principal * monthlyRate)
        ) / Math.log(1 + monthlyRate);
      tenureMonths = Math.floor(remainingMonths);
    });

    let totalAmountPaid = emi * tenureMonths;
    let interestPaid = totalAmountPaid - principal;

    return {
      newTenureMonths: tenureMonths,
      totalAmountPaid: totalAmountPaid.toFixed(2),
      principalPaid: principal.toFixed(2),
      interestPaid: interestPaid.toFixed(2),
    };
  };

  //   // Example usage
  //   let principal = 1000000; // Loan amount in INR
  //   let annualRate = 12; // Annual interest rate in percentage
  //   let tenureYears = 10; // Tenure in years

  // Partial payments as an array of objects with month and amount
  //   let partialPayments = [
  //     { month: 12, amount: 50000 },
  //     { month: 24, amount: 75000 },
  //   ];

  //   let loanDetails = calculateTenureAfterPartialPayment(
  //     principal,
  //     annualRate,
  //     tenureYears,
  //     partialPayments
  //   );
  //   console.log("New Tenure in Months: " + loanDetails.newTenureMonths);
  //   console.log("Total Amount Paid: ₹" + loanDetails.totalAmountPaid);
  //   console.log("Principal Amount Paid: ₹" + loanDetails.principalPaid);
  //   console.log("Interest Paid: ₹" + loanDetails.interestPaid);

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

export default ReduceTerm;
