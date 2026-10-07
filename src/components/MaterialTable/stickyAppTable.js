import * as React from "react";
import { IoDocumentText } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { MdOutlineEdit, MdOutlineLocalPrintshop, MdOutlinePayment } from "react-icons/md";
import ViewServicesModal from "../modals/ViewServicesModal";
import { formatValue, getStatusColor } from "../../utils/services";
import { RxCrossCircled } from "react-icons/rx";
import GridRows from "../pagination/gridRows";
import Pagination from "../pagination";
// Action-column sizing copied from components/Table/MyService.js: explicit
// h-/w- on the icon (rather than font-size 1em, which a flex parent can shrink)
// and a fixed-size round button that never shrinks - keeps the controls tappable
// on tablet/phone.
const iconClass = "h-[18px] w-[18px] sm:h-5 sm:w-5 lg:h-[22px] lg:w-[22px]";

const actionBtnClass =
  "shrink-0 grid place-items-center h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-transparent transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95";

const headings = [
  "Name",
  "Mobile No.",
  "Appointments Date/Time",
  "Services/Product",
  // "Products",
  // "Employee",
  "Amount",
  "Membership Credit Used",
  "Status",
  "Payment",
  "Action",
];

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  {
    id: "mobile",
    label: "Mobile No.",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "Appointments Date/Time",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "Services",
    label: "Services",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "Products",
    label: "Products",
    minWidth: 270,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "Employee",
    label: "Employee",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "Amount",
    label: "Amount",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "membership",
    label: "Membership Credit Used",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "Status",
    label: "Status",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "Payment",
    label: "Payment Mode",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "Action",
    label: "Action",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "Payment",
    label: "Payment Method",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

export default function StickyAppHeadTable({
  tab,
  selectClick,
  data,
  handlePrint,
  cancelPress,
  submitPress,
}) {
  const [selectedRow, setSelectedRow] = useState({})
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (newPage) => {
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
  const filteredData = data.filter((type) => type.appointmentType === "app");
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
  const handleSelect = (item) => {
    setSelectedRow(item)
    setShowServiceModal(true)

  }
  useEffect(() => {

  }, [data]);
  return (
    <>
      <div className="table-responsive">
        <table className="w-full mx-auto" style={{ height: "40px" }}>
          <thead>
            <tr>
              <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>#</th>
              {headings.map((column, ci) => (
                <th
                  key={ci}
                  className={'border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm' +
                    (column === "Action" ? ' sticky right-0 z-[5]' : '')}
                >{column}</th>
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
                        <div className="">
                          <div
                            className="flex justify-center items-center"
                          >
                            {item.status === 3 ?
                              item.paymentMethod
                                .filter((item) => item.amount !== 0)
                                .map((item) => item.name)
                                .join("\n") : (
                                tab == "app" ? getStatusNumber(item.status) :
                                  <button
                                    onClick={() => selectClick(item)}
                                    className={`text-xl text-ternary ${item.status === 3 || item.status === 2
                                      ? "cursor-not-allowed"
                                      : "cursor-pointer"
                                      }`}
                                  >
                                    <MdOutlinePayment />

                                  </button>
                              )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm sticky right-0 z-[5]'>

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






                      <div className="flex w-fit flex-nowrap items-center gap-1 sm:gap-2">
                        {item.status === 1 && (
                          <Link
                            to={`/viewappoinment/${item._id}`}
                            className={actionBtnClass + " text-secondaryGreen"}
                            aria-label="Edit"
                          >
                            <MdOutlineEdit className={iconClass} />
                          </Link>
                        )}
                        <button
                          type="button"
                          className={actionBtnClass + " text-primaryPurple"}
                          onClick={() => handlePrint(item)}
                          aria-label="Print"
                        >
                          <MdOutlineLocalPrintshop className={iconClass} />
                        </button>

                        <button
                          type="button"
                          className={actionBtnClass + " text-red-600 hover:bg-red-50"}
                          onClick={() => cancelPress(item)}
                          aria-label="Cancel"
                        >
                          <RxCrossCircled className={iconClass} />
                        </button>
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

      <ViewServicesModal show={showServiceModal} setShow={setShowServiceModal} data={selectedRow} />

    </>
  );
}
