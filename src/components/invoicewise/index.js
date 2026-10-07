import { useEffect, useRef, useState } from "react";
import { calculateGst, calculateProductGst, formatDate, formatDateToFull, formatValue, postApiData } from "../../utils/services";
import { FaFilePdf } from "react-icons/fa6";
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
    { name: "Price", id: "price" },
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
  

  const handleUrl = (url) => {
    window.open(url, "_blank");
  };


  const filteredData = viewAppointmentDetails?.filter((item) => item.status === 3);
  const paginatedData = filteredData?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const handleExport = () => {


    if (filteredData?.length > 0) {
      const data = filteredData.map((elm) => {
        const Cash = formatValue(elm?.paymentMethod?.find(
          (method) => method?.name === "Cash"
        )?.amount) || 0
        const Upi = formatValue(elm?.paymentMethod?.find(
          (method) => method?.name === "Upi"
        )?.amount) || 0
        const Online = formatValue(elm?.paymentMethod?.find(
          (method) => method?.name === "Online"
        )?.amount) || 0
        const Card = formatValue(elm?.paymentMethod?.find(
          (method) => method?.name === "Card"
        )?.amount) || 0;
        
        let products = elm.products?.length > 0 ? elm.products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0) || 0 : 0;
    let currentSubtotal=parseInt(elm.subTotal) -elm?.discount||0
  let { gstAmount=0, baseAmount=0 ,finalAmount=0} = calculateGst(currentSubtotal, elm.appointmentDate);
  let { prodGstAmount=0, prodBaseAmount=0 } = calculateProductGst(products);
  let gst = gstAmount + (elm?.productGst?elm?.productGst:prodGstAmount);
  let productSubTotal= elm?.productSubTotal? elm?.productSubTotal:prodBaseAmount;
  
  // let total = (parseInt(finalAmount)||0 + parseInt(products)||0);
  let subTotal =(parseInt(finalAmount)||0)+(parseInt(products)||0);
  let netAmount= formatValue(baseAmount+productSubTotal)

        return {
          Date: formatDateToFull(elm?.createdAt),
          InvoiceNo: elm?.invoiceId,
          'Service/Product': (elm?.services?.length > 0 && elm?.products?.length > 0) ?
            "Service/Product"
            : elm?.services?.length > 0 ? "Service"
              : elm?.products?.length > 0 ? "Product" : "",
          Price: subTotal,
          MembershipRedemption: elm?.membershipCreditUsed,
          Cash: Cash,
          Upi: Upi,
          Online: Online,
          Card: Card,
          Net: netAmount,
          Gst: gst,
          Invoice: elm?.invoiceUrl

        }
      })
      exportToExcel(data, 'InvoiceWise', 'invoice_wise.xlsx')
    }

  }
  // console.log("filtered data",filteredData)
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300 w-full`}>
          <div className="flex items-center justify-between w-full flex-wrap gap-3">
            <div className="flex items-center  gap-3 md:gap-6 flex-wrap">
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
              onClick={handleExport}
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


           <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">Weekly Report</h2>
        <div className="table-responsive">
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
                  {headings.map((heading, idx) => {
                    let {id}=heading
                    let  value =row[id];
                    let apppintmentDate=row["createdAt"];
                    let products = row?.products?.length>0?row.products.reduce((acc,curr)=>acc+(curr.price*curr.quantity),0):0;
                    let {baseAmount=0, gstAmount=0,finalAmount=0}=calculateGst(row.subTotal - (row?.discount || 0),apppintmentDate);
                    let { prodGstAmount=0, prodBaseAmount=0 ,prodFinalAmount=0} = calculateProductGst(products);
                    let subTotal =formatValue((parseInt(finalAmount)||0)+(parseInt(products)||0));
                    let gst = formatValue(parseInt(gstAmount) + (row?.productGst?row?.productGst:prodGstAmount));
                    let productSubTotal= row?.productSubTotal ?row?.productSubTotal: prodBaseAmount;

                    let netAmount= formatValue(baseAmount+productSubTotal)

                    {/*  */}
  
                    return (
                      <td key={idx}>
                        {id === "services" ? (
                          (row?.services?.length > 0 && row?.products?.length > 0) ?
                            "Service/Product"
                            : row?.services?.length > 0 ? "Service"
                              : row?.products?.length > 0 ? "Product" : ""
                        ) : id === "netAmount" ? (
                          (netAmount||0)
                        ) : id === "gstAmount" ? (
                           gst
                        ) : id === "invoiceUrl" ? (
                          <FaFilePdf
                            className="text-2xl text-black font-bold cursor-pointer"
                            onClick={() => handleUrl(row[id])}
                          />
                        ) : id === "Cash" ||
                          id === "Upi" ||
                          id === "Card" ||
                          id === "Online" ? (
                          formatValue(row.paymentMethod.find(
                            (method) => method.name === id
                          )?.amount) || 0
                        ) : id === "createdAt" ?
                          formatDateToFull(row[id], false)
                          : id === "price" ? formatValue(subTotal) : (
                            formatValue(value)
                          )}
                      </td>
                    )
                  }

                  )}
                </tr>
              ))}
          </tbody>
        </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mt-4 items-center gap-2">
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
