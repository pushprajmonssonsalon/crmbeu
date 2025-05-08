import React, { useState } from "react";
import { formatDateToFull } from "../../utils/services";
import { FaAngleDown } from "react-icons/fa6";
import Pagination from "../pagination";
import GridRows from "../pagination/gridRows";

const AccordianTable = ({ cols, rows, cols2,phoneNumber }) => {
  const [openRow, setOpenRow] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const filteredData = [...(rows || [])].reverse().filter((item) => item.phoneNumber.toString().includes(phoneNumber.toString().trim()));
  const paginatedData = filteredData?.slice(
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
  const toggleRow = (index) => {
    setOpenRow(openRow === index ? null : index);
  };
  return (
    <>
      {" "}
      <table className="styled-table">
        <thead>
          <tr>
            <th>#</th>

            {cols?.map((column, index) => (
              <th key={index} className="bg-black text-white px-3 py-2">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((row, index) => (
            <React.Fragment key={index}>
              <tr
                className="cursor-pointer bg-white hover:bg-gray-100"
              >
                <td>{index + 1}</td>
                {cols.map((col, idx) => {
                  const value = col.id === "details" ?
                    <FaAngleDown onClick={() => toggleRow(index)}
                      className={`cursor-pointer text-xl ${openRow === index ? "rotate-180" : ""}`} />
                    : row[col.id];
                  return (
                    <td key={idx} className="border-b p-3">
                      {value}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td style={{ border: "none" }} colSpan="100%" className="p-0">
                  <div
                    className={`transition-all bg-gray-200 duration-300 ease-in-out overflow-hidden ${openRow === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <table className="w-full ">
                      <thead>
                        <tr>
                          {cols2.map((col, idx) => (
                            <th key={idx} className="bg-black text-white px-3 py-2">
                              {col.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {row?.activeMembership?.length > 0 &&
                          row?.activeMembership?.map((rw, i) => (
                            <tr key={i}>
                              {cols2.map((col, idx) => {
                                const val = col?.date
                                  ? formatDateToFull(rw[col.id], false)
                                  : rw[col.id];
                                return (
                                  <td key={idx} className="p-2">
                                    {val}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4 items-center">
        <GridRows
          totalItems={filteredData?.length}
          itemsPerPage={rowsPerPage}
          handleRowschange={handleChangeRowsPerPage}
        />
        <Pagination
          totalItems={filteredData?.length}
          itemsPerPage={rowsPerPage}
          currentPage={page}
          onPageChange={handleChangePage}
        />
      </div>
    </>
  );
};

export default AccordianTable;
