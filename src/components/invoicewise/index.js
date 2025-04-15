import { useEffect, useRef, useState } from "react";
import { formatDate, formatDateToFull, formatValue, postApiData } from "../../utils/services";
import CustomInputFeild from "../../components/customInput";
import { useDownloadExcel } from "react-export-table-to-excel";
import { FaFilePdf } from "react-icons/fa6";
import { useLocation } from "react-router";
import CustomDatePicker from "../customInput/CustomDatePicker";
import { FaAngleDown, FaCalendarAlt } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import exportToExcel from "../../utils/exportToExcel";
import GridRows from "../pagination/gridRows";
import Pagination from "../pagination";
const InvoiceWise = () => {
  const [viewAppointmentDetails, setViewAppointmentDetails] = useState([]);
  const [loading, setLoading] = useState(false)
  // Use URLSearchParams to parse query parameters
  const [params] = useSearchParams();
  const [showDate, setShowDate] = useState(false)
  const start = params.get("start");
  const end = params.get("end");
   const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const handleChangePage = (newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(1);
    };
  
  // Access a specific query parameter

  const tableRef = useRef(null);

  //date
  const defaultStartDate = formatDate(new Date());
  const [startDate, setStartDate] = useState(
    start ? formatDate(start) : defaultStartDate
  );
  const [endDate, setEndDate] = useState(
    end ? formatDate(end) : defaultStartDate
  );
  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === "startDate") {
      setStartDate(value)
    } else {
      setEndDate(value)
    }

  }
  useEffect(() => {
    const data = {
      type: "crm",
      startDate: startDate,
      endDate: endDate,
    };
    setLoading(true)
    postApiData(
      "appointment/getAppointments",
      data,
      (resp) => {

        if (resp) {
          setViewAppointmentDetails(resp);
          setLoading(false)

        }
      },
      (error) => {
        setLoading(false)

      }
    );
  }, []);
  const searchClick = () => {
    const data = {
      type: "crm",
      startDate: startDate,
      endDate: endDate,
    };
    setLoading(true)

    postApiData(
      "appointment/getAppointments",
      data,
      (resp) => {

        if (resp) {
          setLoading(false)

          setViewAppointmentDetails(resp);
        }
      },
      (error) => {
        setLoading(false)

      }
    );
  };


  const headings = [
    { name: "Date", id: "createdAt" },
    { name: "Invoice No.", id: "invoiceId" },
    { name: "Service/Product", id: "services" }, // or other relevant field
    { name: "Price", id: "subTotal" },
    { name: "Membership Redemption", id: "membershipCreditUsed" },
    { name: "Cash", id: "Cash" }, // Special handling needed based on payment method
    { name: "Upi", id: "Upi" }, // Special handling needed based on payment method
    { name: "Card", id: "Card" }, // Special handling needed based on payment method
    { name: "Online", id: "Online" }, // Special handling needed based on payment method
    { name: "Net", id: "netAmount" }, // Calculate this value
    { name: "Gst", id: "gstAmount" }, // Calculate this value
    { name: "Invoice", id: "invoiceUrl" },
  ];

  // function FormatDate(date) {
  //   const dates = new Date(date);

  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   const formatter = new Intl.DateTimeFormat("en-US", options);
  //   const formattedDate = formatter.format(dates);

  //   return formattedDate;
  // }
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "invoisewise",
    sheet: "invoisewise",
  });

  const handleUrl = (url) => {
    window.open(url, "_blank");
  };

  
  const filteredData = viewAppointmentDetails?.filter((item) => item.status === 3);
  const paginatedData = filteredData?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  return (
    <>
      <div className="flex items-center justify-between">
        <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300 w-full`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center  gap-6">
            <button onClick={() => setShowDate(!showDate)} className="flex border  shadow items-center bg-white gap-2 rounded-[5px] py-[10px] px-[15px]">
              <FaCalendarAlt className="text-customPurple text-sm" />
              <span className="text-secondary text-sm">Year-to-date </span>
              <FaAngleDown className={`text-secondary text-sm ${showDate ? "rotate-180" : ""} `} />

            </button>
            <div className="flex gap-2 font-normal  items-center text-xs text-secondary">
              <span>{formatDate(startDate, true)}</span>
              <span>~</span>
              <span>{formatDate(endDate, true)}</span>
            </div>
          </div>
          <button
          className="w-[150px] bg-ternary font-normal h-[36px] flex items-center justify-center active:bg-ternary/90 transition-colors ease-in duration-100 rounded-[16px] text-white text-sm leading-[24px]"
          onClick={onDownload}
        >
          Export All
        </button>
          </div>
          {showDate && <div className=" flex items-center my-4  gap-3">
            <CustomDatePicker
              startDate={startDate}
              endDate={endDate}
              loading={loading}
              className="bg-white gap-2 rounded-[5px] py-[10px] px-[15px] "
              onSubmit={searchClick}
              onChange={handleDateChange}


            />
          </div>}

        </div>
      
      </div>
       

        {/* <CustomInputFeild
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          submitClick={searchClick}
          loading={loading}
        /> */}
        {/* <CustomizedInvoiceWiseTables headings={headings} data={viewAppointmentDetails}  ref={tableRef}/> */}
        <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">Weekly Report</h2>
          <table className="styled-table " ref={tableRef}>
            <thead className="sticky  top-0 z-2">
              <tr>
                {headings?.map((item, index) => (
                  <th key={index}>{item.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData
                ?.map((row, index) => (
                  <tr key={index}>
                    {headings.map((heading, idx) => (
                      <td key={idx}>
                        {heading.id === "services" ? (
                          (row?.services?.length > 0 && row?.products?.length > 0) ?
                            "Service/Product"
                            : row?.services?.length > 0 ? "Service"
                              : row?.products?.length > 0 ? "Product" : ""
                        ) : heading.id === "netAmount" ? (
                          formatValue((row?.subTotal - (row?.discount || 0)) / 1.18)
                        ) : heading.id === "gstAmount" ? (
                          formatValue(
                            row?.subTotal -
                            (row?.discount || 0) -
                            ((row?.subTotal - (row?.discount || 0)) / 1.18)
                          )
                        ) : heading.id === "invoiceUrl" ? (
                          <FaFilePdf
                            className="text-2xl text-black font-bold cursor-pointer"
                            onClick={() => handleUrl(row[heading.id])}
                          />
                        ) : heading.id === "Cash" ||
                          heading.id === "Upi" ||
                          heading.id === "Card" ||
                          heading.id === "Online" ? (
                          formatValue(row.paymentMethod.find(
                            (method) => method.name === heading.id
                          )?.amount) || 0
                        ) : heading.id === "createdAt" ?
                          formatDateToFull(row[heading.id], false)
                          : (
                            formatValue(row[heading.id])
                          )}
                      </td>
                    ))}
                  </tr>
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
        </div>
     
    </>
  );
};

export default InvoiceWise;
