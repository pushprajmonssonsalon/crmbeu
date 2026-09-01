import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import GridRows from '../pagination/gridRows';
import Pagination from '../pagination';
import { MdOutlineLocalPrintshop } from 'react-icons/md';
import { formatDate } from '../../utils/services';





export default function CustomizedCustomerTables({ headings, data }) {
  const navigate = useNavigate();
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

  const handlePrint = (item) => {
    if (item.status === 2 || item.status === 1) {
      toast.error("Appointment is not completed!");
    } else {
      navigate("/invoicegenerator", { state: item });
    }
    //  window.open(item.invoiceUrl,'_blank');
  };
  return (
    <>
      <div className="table-responsive">
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

              <td className="py-5">{item?.customer.name}</td>
              <td className="py-5">{item?.customer.phoneNumber}</td>
              <td className="py-5">{formatDate(item?.createdAt)}</td>
              <td className="py-5 max-w-[100px]">
                {item.services.map((data, dataIndex) => (
                  <div key={dataIndex}>
                    {data.miniSubcategory}
                  </div>
                ))}
              </td>
              <td className="py-5 max-w-[100px]">{item.products.map((data, dataIndex) => (
                <div key={dataIndex}>
                  {data.name}
                </div>
              ))}</td>

              <td className="py-5">
                {item.total}
              </td>
              <td
              >
                {item.status == 1 ? "pending" : item.status == 2 ? "cancelled" : "completed"}
              </td>

              <td className="py-5">
                {item?.membershipCreditUsed}
              </td>

              <td className="py-5">
                <MdOutlineLocalPrintshop onClick={() => handlePrint(item)} className='cursor-pointer text-xl' />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-4 items-center gap-2">
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

