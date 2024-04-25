import React from "react";
import TableRow from "../TableRow";

const tableHeaders = [
    "EMPLLOYEE NAME",
    "HAIR",
    "SPA",
    "BEAUTY",
    "NAIL",
    "HAND & FEET",
    "MAKEUP",
    "TOTAL"
  ];

const ReportTable = ({data}) => {
  console.log("employeerevenues",data)
  return(
    <table className="styled-table">
      <thead className="">
        <tr >
          {tableHeaders.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map(({ name, categories }) => (
          <TableRow key={name} name={name} categories={categories} tableHeaders={tableHeaders} />
        ))}
      </tbody>
    </table>
  )
};
  
  export default ReportTable;