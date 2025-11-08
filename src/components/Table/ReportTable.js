import TableRow from "../TableRow";

const tableHeaders = [
  "EMPLLOYEE NAME",
  "HAIR",
  "SPA",
  "BEAUTY",
  "NAIL",
  "HAND & FEET",
  "MAKEUP",
  "TOTAL",

];

const ReportTable = ({ data ,endDate}) => {

  return (
    <table className="styled-table">
      <thead className="">
        <tr >
          {tableHeaders.map((header) => (
            <th key={header}>{header}</th>
          ))}
          <th >NET TOTAL</th>

        </tr>
      </thead>
      <tbody>
        {data?.map(({ name, categories }) => (
          <TableRow endDate={endDate} key={name} name={name} categories={categories} tableHeaders={tableHeaders} />
        ))}
      </tbody>
    </table>
  )
};

export default ReportTable;