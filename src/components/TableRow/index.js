const TableRow = ({ name, categories, tableHeaders }) => {
    const totalSum = categories.reduce((acc, curr) => acc + curr.sumTotal, 0);
    const totalSumWithoutTax =( totalSum/1.18)?.toFixed(2||0)
    return(
    <tr>
      <td>{name}</td>
      {tableHeaders?.slice(1).map((header) => {
        const sumTotal = categories?.find((cat) => cat.category.toUpperCase() === header.toUpperCase())?.sumTotal;
        return <td key={header}>{sumTotal || 0}</td>;
      })}
      <td>{totalSumWithoutTax}</td>
      <td>{totalSum}</td>

    </tr>
    )
    };

export default TableRow