import { useNavigate } from 'react-router';
import { useState } from 'react';
import GridRows from '../pagination/gridRows';
import Pagination from '../pagination';





export default function CustomizedCustomersTables({ headings, data }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const filteredData = [...(data || [])].reverse();
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

 
  return (
    <>
      <table
        className="styled-table"
      >
        <thead>
          <tr>
            {
              headings.map((item, index) => (
                <th key={index}>{item}</th>
              ))
            }

          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((item, index) => (
            <tr key={index}>

              <td className="py-5">{index+1}</td>
              <td className="py-5">{item?.name}</td>
              <td className="py-5">{item?.phoneNumber}</td>
             
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4 items-center">
        <GridRows
          totalItems={data?.length}
          itemsPerPage={rowsPerPage}
          handleRowschange={handleChangeRowsPerPage}
        />
        <Pagination
          totalItems={data?.length}
          itemsPerPage={rowsPerPage}
          currentPage={page}
          onPageChange={handleChangePage}
        />
      </div>
    
    </>

  );
}

  