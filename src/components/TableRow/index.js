import { calculateGst, formatValue } from "../../utils/services";

const TableRow = ({ name, categories, tableHeaders,endDate }) => {
    const totalSum = categories.reduce((acc, curr) => acc + curr.sumTotal, 0);
    const {baseAmount}=calculateGst(totalSum,endDate)
    return(
    <tr>
      <td>{name}</td>
      {tableHeaders.slice(1,-1).map((header) => {
        const sumTotal = categories.find((cat) => cat.category.toUpperCase() === header.toUpperCase())?.sumTotal;
        return <td key={header}>{formatValue(sumTotal) || 0}</td>;
      })}
      <td>{formatValue(totalSum)}</td>
      <td>{formatValue(baseAmount)}</td>
      
    </tr>
    )
    };

export default TableRow