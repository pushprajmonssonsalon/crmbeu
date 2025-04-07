import { IoDocumentText } from "react-icons/io5";
import { Link } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";

import ViewServicesModal from "../modals/ViewServicesModal";
import { useState } from "react";
import ApplyMembership from "../modals/ApplyMembership";
import { formatValue, getStatusColor } from "../../utils/services";
import { MdOutlineEdit, MdOutlineLocalPrintshop, MdOutlinePayment } from "react-icons/md";
import GridRows from "../pagination/gridRows";
import Pagination from "../pagination";
const headings = [
  "Name",
  "Mobile No.",
  "Appointments Date/Time",
  "Services/Product",

  "Amount",
  "Membership Credit Used",
  // "Apply Membership",
  "Status",
  "Payment",
  "Action",
];
// const headings = [
//   "Name",
//   "Mobile No.",
//   "Appointments Date/Time",
//   "Services",
//   "Products Sold",
//   "Edit UsedProduct quantity",
//   "Products Used",
//   "Employee",
//   "Amount",
//   "Membership Credit Used",
//   "Status",
//   "Payment Mode",
//   "Action",
//   "Payment Method",
// ];



export default function StickyHeadTable({
  data,
  selectClick,
  handlePrint,
  cancelPress,
  submitPress,
  setShowQuantityPopup,
  showQuantityPopup,
  setApptId,
  apptId,
  setAlreadyAddedProduct,
  loading,
}) {
  const [selectedRow, setSelectedRow] = useState({})
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showMembership, setShowMembership] = useState(false)
  const handleChangePage = ( newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  const getStatusNumber = (status) => {

    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Canceled";
      case 3:
        return "Completed";
      case 4:
        return "Half Completed";
      default:
        // Handle other cases if needed
        return null; // or 'N/A'
    }
  };
  const filteredData = data.filter((type) => type.appointmentType === "crm");
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  

  function formatDateTime(timestamp) {


    // Parse the timestamp
    const [dateString, timeString] = timestamp.split("T");
    const [year, month, day] = dateString.split("-").map(Number);
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    // Create a new Date object with UTC values
    const date = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds)
    );

    // Format date
    const formattedDate = `${year}-${month}-${day}`;

    // Format time to AM/PM
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedTime = `${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;


    return `${formattedDate} ${formattedTime}`;
  }

  const handleProductQuantityModal = (id, products) => {
    setApptId(id);
    setAlreadyAddedProduct(products);
    setShowQuantityPopup(true);
    setShowServiceModal(false);
  };
  const handleSelect = (item) => {
    setSelectedRow(item)
    setShowServiceModal(true)

  }
 
  
 
  return (
    <>
      <table className="w-full mx-auto overflow-x-auto" style={{ height: "40px" }}>
        <thead>
          <tr>
            <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>#</th>
            {headings.map((column) => (
              <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>{column}</th>
            ))}

          </tr>
        </thead>
        <tbody>
          {paginatedData
            .map((item, index) => {
              return (
                <tr >
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>{index + 1}</td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>{item.customer.name}</td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.customer.phoneNumber}</td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{formatDateTime(item.appointmentDate)}</td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>  <div className="flex items-center justify-center">
                    <button onClick={() => handleSelect(item)} className="text-ternaryYellow">
                      <IoDocumentText size={20} />
                    </button>
                  </div></td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{formatValue(item.total)}</td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>
                    {item.membershipUsed ? formatValue(item.membershipCreditUsed) : 0}
                  </td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>
                    <h1
                      className={` text-sm ${getStatusColor(item.status)} rounded-[9.5px] py-[2px]  px-2 text-center`}
                    >
                      {getStatusNumber(item.status)}
                    </h1>
                  </td>
                  <td className='border-0 border-b bg-white  border-lightGray font-normal text-ternaryGray text-sm'>
                  <div className="flex items-center justify-center">
                    {(item.status === 3 || item.status === 4) ?
                      item?.paymentMethod
                        .filter((item) => item.amount !== 0)
                        .map((item) => item.name)
                        .join("\n") + `${item?.comment ? ` (${item?.comment})` : ''}` : <button
                          onClick={() => selectClick(item)}
                          className={`text-xl w-[40px] font-semibold text-ternary  ${(item.status === 3 || item.status === 2)
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                            }`}
                        >
                        <MdOutlinePayment />
                      </button>}
                      </div>
                  </td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>

                    {/* <button
                        className={`text-sm w-[40px] font-semibold text-ternary   `}
                        onClick={() =>
                          handleProductQuantityModal(
                            item._id,
                            item?.productUsed
                          )
                        }
                      >
                        <FaWeightHanging />

                      </button> */}






                    <div className="flex items-center gap-x-2">
                      {item.status === 1 && (
                        <Link to={`/viewappoinment/${item._id}`}>
                          <MdOutlineEdit className="text-secondaryGreen text-xl cursor-pointer" />
                        </Link>
                      )}
                      <MdOutlineLocalPrintshop
                        className={`text-primaryPurple text-xl cursor-pointer `}
                        onClick={() => handlePrint(item)}
                      />

                      <RxCrossCircled
                        className="text-red-600 text-xl cursor-pointer"
                        onClick={() => cancelPress(item)}
                      />
                      {/* <button
                          className="cursor-pointer  text-ternary rounded-md h-[40px] font-medium  "
                          onClick={() => submitPress(item)}
                          disabled={loading[item?._id] || item?.status === 2 || item?.status === 3}
                        >
                          {loading[item._id] ? "loading..." : "Submit"}
                        </button> */}
                    </div>

                  </td>



                </tr>
              );
            })}

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
       
      <ViewServicesModal showQuantityModal={handleProductQuantityModal} show={showServiceModal} setShow={setShowServiceModal} data={selectedRow} />
      <ApplyMembership show={showMembership} setShow={setShowMembership} data={selectedRow} />
    </>
  );
}
