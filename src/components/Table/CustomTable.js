const CustomTable = ({ columns, rows }) => {
    
  return (
    <>
      {" "}
        <table className="styled-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="bg-black text-white px-3 py-2">{column.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.map((row, index) => (
              <tr key={index} className="bg-white">
                {columns?.map((column, index) => {

                  const { id } = column;
                  return <td>{row[id]}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
    </>
  );
};

export default CustomTable;
