import React, { useState } from "react";
import { formatDateToFull } from "../../utils/services";

const AccordianTable = ({  cols, rows, cols2 }) => {
  const [openRow, setOpenRow] = useState(null);
  const toggleRow = (index) => {
    setOpenRow(openRow === index ? null : index);
  };
  return (
    <>
      {" "}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {cols?.map((column, index) => (
              <th key={index} className="bg-black text-white px-3 py-2">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, index) => (
            <React.Fragment key={index}>
              <tr
                className="cursor-pointer bg-white hover:bg-gray-100"
                onClick={() => toggleRow(index)}
              >
                {cols.map((col, idx) => {
                  const value = row[col.id];
                  return (
                    <td key={idx} className="border-b p-3">
                      {value}
                    </td>
                  );
                })}
              </tr>
              {openRow === index && (
                <tr>
                  <td colSpan="3" className="p-3 bg-gray-50">
                    <div className="p-3 ">
                    <h2 className="font-medium text-black text-xl mb-3">Memberships</h2>
                      <table className="w-full">
                        <thead>
                          <tr>
                            {cols2.map((col, idx) => {
                              return (
                                <th key={idx} className="bg-black text-white px-3 py-2">

                               
                                  {col.name}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {rows[index]?.activeMembership?.length > 0 &&
                            rows[index]?.activeMembership?.map((rw, i) => {
                              return (
                                <tr>
                                {cols2.map((col,idx)=>{
                                    const val =col?.date?formatDateToFull(rw[col.id],false):rw[col.id]
                                    return(
                                        <td key={idx} className="p-2">{val}</td>

                                    )
                                }) }
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AccordianTable;
