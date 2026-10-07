import { useState } from "react";
import Pagination from "../pagination";
import GridRows from "../pagination/gridRows";

const CustomTable = ({ columns, rows }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const paginatedData = rows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  return (
    <>
      {" "}
      <div className="table-responsive">
      <table className="styled-table">
        <thead>
          <tr>
            <th className="bg-black text-white px-3 py-2">#</th>
            {columns?.map((column, index) => (
              <th key={index} className="bg-black text-white px-3 py-2">{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((row, index) => (
            <tr key={index} className="bg-white">
              <td>{index + 1}</td>
              {columns?.map((column, index) => {

                const { id, get } = column;
                return <td key={index}>{get ? get(row) : row[id]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-4 items-center gap-2">
        <GridRows
          totalItems={rows?.length}
          itemsPerPage={rowsPerPage}
          handleRowschange={handleChangeRowsPerPage}
        />
        <Pagination
          totalItems={rows?.length}
          itemsPerPage={rowsPerPage}
          currentPage={page}
          onPageChange={handleChangePage}
        />
      </div>
    </>

  );
};

export default CustomTable;
