import { formatValue } from "../../utils/services"

const CategoryTable = ({cols,rows,row}) => {
  return (
    <>

<table className="relative ">
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
    </>
  )
}

export default CategoryTable