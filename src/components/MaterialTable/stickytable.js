import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { IoPrintSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdOutlineGridView } from "react-icons/md";
import ViewServicesModal from "../modals/ViewServicesModal";
import { useState } from "react";
import ApplyMembership from "../modals/ApplyMembership";
import { formatValue } from "../../utils/services";
const headings = [
  "Name",
  "Mobile No.",
  "Appointments Date/Time",
  "Services/Product",

  "Amount",
  "Membership Credit Used",
  // "Apply Membership",
  "Status",
  "Action",
  "Payment Method",
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showMembership, setShowMembership] = useState(false)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
  };
  const handleSelect = (item) => {
    setSelectedRow(item)
    setShowServiceModal(true)

  }
  const handleApplyMembership = (item) => {
    setSelectedRow(item)
    setShowMembership(true)

  }
  return (
    <>
    <Paper sx={{ width: "97%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              {headings.map((column) => (
                <TableCell className={`${column==="Membership Credit Used"?"w-[100px]":""}`}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .filter((type) => type.appointmentType === "crm")
              .map((item) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>{item.customer.name}</TableCell>
                    <TableCell>{item.customer.phoneNumber}</TableCell>
                    <TableCell>
                      {formatDateTime(item.appointmentDate)}
                    </TableCell>
                    <TableCell>
                    <div className="flex items-center justify-center">
                    <button onClick={()=>handleSelect(item)} className="text-center bg-gray-600">
                        <MdOutlineGridView size={25} />
                      </button>
                    </div>
                    
                    </TableCell>
                    {/* <TableCell>
               
                    {/* <TableCell>
                      <button
                        className={`text-md font-semibold text-white bg-green-600 px-3 py-1 rounded-lg hover:bg-green-800 hover:scale-105 `}
                        onClick={() =>
                          handleProductQuantityModal(
                            item._id,
                            item?.productUsed
                          )
                        }
                      >
                        Quantity Used
                      </button>
                    </TableCell> */}
                    {/* <TableCell>
                      {item?.productUsed.map((itemdata, index) => (
                        <React.Fragment key={index}>
                          <h1>{itemdata.name}</h1>
                          {index < item.productUsed.length - 1 && (
                            <span>, </span>
                          )}
                        </React.Fragment>
                      ))}
                    </TableCell> */}
                    {/* <TableCell>
                      {item?.services.map((itemdata, index) => (
                        <React.Fragment key={index}>
                          <h1>{itemdata.satffName}</h1>
                        </React.Fragment>
                      ))}
                    </TableCell> */}
                    <TableCell>{formatValue(item.total)}</TableCell>
                    <TableCell>
                      {item.membershipUsed ? formatValue(item.membershipCreditUsed) : 0}
                    </TableCell>
                    {/* <TableCell>
                     <button onClick={()=>handleApplyMembership(item)} className="font-medium text-sm w-full">Apply</button>
                    </TableCell> */}
                      <TableCell>
                        <h1
                          className={`font-semibold text-sm ${item.status === 1
                              ? "text-blue-500"
                              : item.status === 2
                                ? "text-red-500"
                                : item.status === 4 ?
                                  "text-purple-600"
                                  : "text-green-600"
                            }`}
                        >
                          {getStatusNumber(item.status)}
                        </h1>
                      </TableCell>
                      {/* <TableCell>
                      <div
                        className="cursor-pointer hover:text-blue-700 font-bold"
                        onClick={() => selectClick(item)}
                      >
                        <div className="flex justify-center items-center">
                          <button
                            className={`text-xl font-semibold text-white bg-green-600 px-6 py-1 rounded-lg hover:bg-green-800 hover:scale-105 ${
                              item.status === 3 || item.status === 2
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            PAY
                          </button>
                        </div>
                      </div>
                    </TableCell> */}
                      <TableCell>
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="flex items-center w-full">
                            <button
                              className={`text-sm py-2 w-full font-semibold text-white bg-green-600 px-6  rounded-lg hover:bg-green-800 hover:scale-105  `}
                              onClick={() =>
                                handleProductQuantityModal(
                                  item._id,
                                  item?.productUsed
                                )
                              }
                            >
                              Quantity Used
                            </button>
                          </div>

                          <div className="flex  items-center w-full">
                            <button
                              onClick={() => selectClick(item)}
                              className={`text-xl w-full font-semibold text-white bg-green-600 px-6 py-1 rounded-lg hover:bg-green-800 hover:scale-105 ${(item.status === 3 || item.status === 2)
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                                }`}
                            >
                              PAY
                            </button>

                          </div>
                          <div className="flex justify-between items-center gap-x-2">
                            {item.status === 1 && (
                              <Link to={`/viewappoinment/${item._id}`}>
                                <FaEdit className="text-black text-xl cursor-pointer" />
                              </Link>
                            )}
                            <IoPrintSharp
                              className={`text-green-600 text-xl cursor-pointer hover:text-green-950`}
                              onClick={() => handlePrint(item)}
                            />
                            <GiCancel
                              className="text-red-600 text-xl cursor-pointer"
                              onClick={() => cancelPress(item)}
                            />
                            <button
                              className="cursor-pointer bg-green-600/80  text-white rounded-md h-[40px] font-medium px-2 "
                              onClick={() => submitPress(item)}
                              disabled={loading[item?._id] || item?.status === 2 || item?.status === 3}
                            >
                              {loading[item._id] ? "loading..." : "Submit"}
                            </button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(item.status === 3 || item.status === 4) &&
                          item?.paymentMethod
                            .filter((item) => item.amount !== 0)
                            .map((item) => item.name)
                            .join("\n") +  `${item?.comment?` (${item?.comment})`:''}`}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ViewServicesModal show={showServiceModal} setShow={setShowServiceModal} data={selectedRow} />
      <ApplyMembership show={showMembership} setShow={setShowMembership} data={selectedRow} />
    </>
  );
}
