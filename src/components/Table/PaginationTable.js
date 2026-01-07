import React from 'react'
import GridRows from '../pagination/gridRows';
import Pagination from '../pagination';

const PaginationTable = ({columns,rows,rowsPerPage,page,handleRowschange,handlePage,total}) => {
  return (
    <>
       <table className="styled-table shadow-lg ">
        <thead>
          <tr>
            <th className="bg-black text-white px-3 py-2">#</th>
            {columns?.map((column, index) => (
              <th key={index} className="bg-black text-white ">{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, index) => (
            <tr key={index} className="bg-white">
              <td>{index + 1}</td>
              {columns?.map((column, index) => {

                const { id } = column;
                return <td>{row[id]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4 items-center">
        <GridRows
          totalItems={total}
          itemsPerPage={rowsPerPage}
          handleRowschange={handleRowschange}
        />
        <Pagination
          totalItems={total}
          itemsPerPage={rowsPerPage}
          currentPage={page}
          onPageChange={handlePage}
        />
      </div>
      </>
  )
}

export default PaginationTable