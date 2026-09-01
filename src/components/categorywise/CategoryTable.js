import { formatValue } from "../../utils/services"

const CategoryTable = ({ cols, rows, row }) => {
  return (
    <>

      <div className="table-responsive">
      <table className="styled-table ">
        <thead className="sticky  top-0 z-2">
          <tr>
            {cols?.map((item, index) => (
              <th key={index}>{item.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, index) => (
            <tr key={index}>
              {cols.map((col, idx) => (
                <td key={idx}>
                  {col.id === "totalRevenue"
                    ? formatValue(row[col.id])
                    : formatValue(row[col.id])}
                </td>
              ))}
            </tr>
          ))}

          {row}

        </tbody>
      </table>
      </div>
    </>
  )
}

export default CategoryTable