import { formatValue } from "../../utils/services";

const TableRow = ({ name, categories, tableHeaders }) => {
    const totalSum = categories.reduce((acc, curr) => acc + curr.sumTotal, 0);
    return(
    <tr>
      <td>{name}</td>
      {tableHeaders.slice(1,-1).map((header) => {
        const sumTotal = categories.find((cat) => cat.category.toUpperCase() === header.toUpperCase())?.sumTotal;
        return <td key={header}>{formatValue(sumTotal) || 0}</td>;
      })}
      <td>{formatValue(totalSum)}</td>
      <td>{formatValue(totalSum/1.18)}</td>
      
    </tr>
    )
    };

export default TableRow