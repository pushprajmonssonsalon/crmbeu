const CustomTable = ({ columns, rows }) => {
    console.log(rows,"rows")
  return (
    <>
      {" "}
      <div className=" w-full max-w-full overflow-x-scroll">
        <table className="">
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
      </div>
    </>
  );
};

export default CustomTable;
