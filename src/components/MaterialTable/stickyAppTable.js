import * as React from "react";
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
import { useState } from "react";
import { useEffect } from "react";
import { MdOutlineGridView } from "react-icons/md";
import ViewServicesModal from "../modals/ViewServicesModal";
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
  "Payment Mode",
  "Action",
  "Payment Method",
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
  selectClick,
  data,
  handlePrint,
  cancelPress,
  submitPress,
}) {
  const [selectedRow,setSelectedRow]=useState({})
  const [showServiceModal,setShowServiceModal]=useState(false)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
  const handleSelect =(item)=>{
    setSelectedRow(item)
    setShowServiceModal(true)

  }
  useEffect(() => {
    
  }, [data]);
  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                .filter((type) => type.appointmentType === "app")
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
                          <button onClick={() => handleSelect(item)} className="text-center 0000000000 p-3 rounded-md bg-green-500 text-white">
                            <MdOutlineGridView size={25} />
                          </button>
                        </div>
                 
                      </TableCell>
                      {/* <TableCell>
                        {item?.services.slice(0, 3).map((itemdata, index) => (
                          <React.Fragment key={index}>
                            <h1>{itemdata.name}</h1>
                          </React.Fragment>
                        ))}
                      </TableCell>
                      <TableCell>
                        {item?.products.map((itemdata, index) => (
                          <React.Fragment key={index}>
                            <h1>{itemdata.name}</h1>
                          </React.Fragment>
                        ))}
                      </TableCell>
                      <TableCell>
                        {item?.services.map((itemdata, index) => (
                          <React.Fragment key={index}>
                            <h1>{itemdata.satffName}</h1>
                          </React.Fragment>
                        ))}
                      </TableCell> */}
                      <TableCell>{item.total}</TableCell>
                      <TableCell>
                        {item.membershipUsed ? item.membershipCreditUsed : 0}
                      </TableCell>
                      <TableCell>
                        <h1
                          className={`font-semibold text-sm ${
                            item.status === 1
                              ? "text-blue-500"
                              : item.status === 2
                              ? "text-red-500"
                              
                              :item.status===4?"text-purple-600": "text-green-600"
                          }`}
                        >
                          {getStatusNumber(item.status)}
                        </h1>
                      </TableCell>
                      <TableCell>
                        <div className="cursor-pointer hover:text-blue-700 font-bold">
                          <div
                            onClick={() => selectClick(item)}
                            className="flex justify-center items-center"
                          >
                            {item.isPaid ? (
                              <button
                                className={`text-xl font-semibold text-white bg-green-600 px-6 py-1 rounded-lg ${
                                  item.status === 3 || item.status === 2
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                PREPAID
                              </button>
                            ) : (
                              
                              <button
                                className={`text-xl font-semibold text-white bg-blue-600 px-6 py-1 rounded-lg hover:bg-blue-800 hover:scale-105 ${
                                  item.status === 3 || item.status === 2
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                PAY
                              </button>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-between items-center gap-x-2">
                          {item.status === 1 && (
                            <Link to={`/viewAppoinment/${item._id}`}>
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
                            className="cursor-pointer"
                            onClick={() => submitPress(item)}
                          >
                            Submit
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.status === 3 &&
                          item.paymentMethod
                            .filter((item) => item.amount !== 0)
                            .map((item) => item.name)
                            .join("\n")}
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

    </>
  );
}
