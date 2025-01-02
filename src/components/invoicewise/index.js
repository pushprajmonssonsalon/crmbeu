import { useEffect, useRef, useState } from "react";
import Layout from "../Layout";
import { formatDateToFull, postApiData } from "../../utils/services";
import CustomInputFeild from "../../components/customInput";
import { useDownloadExcel } from "react-export-table-to-excel";
import { FaFilePdf } from "react-icons/fa6";
import { useLocation } from "react-router";
const InvoiceWise = () => {
  const [viewAppointmentDetails, setViewAppointmentDetails] = useState([]);
  const location = useLocation();
  const [loading,setLoading]=useState(false)
  // Use URLSearchParams to parse query parameters
  const queryParams = new URLSearchParams(location.search);

  // Access a specific query parameter

  const tableRef = useRef(null);
  
  //date
  const defaultStartDate = new Date();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultStartDate);
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

  useEffect(()=>{
    const stDate = queryParams.get('start');
    const edDate = queryParams.get('end');
    if(stDate && edDate){
      setStartDate(new Date(stDate))
      setEndDate(new Date(edDate))
    }

  },[location.pathname])
  return (
    <Layout>
      <div className="mt-52 w-[90%] mx-auto md:mt-32 flex flex-col">
        <h1 className="text-center text-3xl font-bold  text-black mb-4">
          Invoice wise collection
        </h1>
        <div className="flex justify-end items-start mr-5">
          <button onClick={onDownload} className="bg-green-500 text-white rounded-xl px-6 h-[50px]">
            {" "}
            Export excel{" "}
          </button>
        </div>

        <CustomInputFeild
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          submitClick={searchClick}
          loading={loading}
        />
        {/* <CustomizedInvoiceWiseTables headings={headings} data={viewAppointmentDetails}  ref={tableRef}/> */}
        <div className="max-w-[100%] max-h-[calc(100vh-200px)]   my-9 shadow-md  overflow-auto">
          <table className="relative " ref={tableRef}>
            <thead className="sticky  top-0 z-2">
              <tr>
                {headings?.map((item, index) => (
                  <th key={index}>{item.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {viewAppointmentDetails
      ?.filter((item) => item.status === 3)
      ?.map((row, index) => (
        <tr key={index}>
          {headings.map((heading, idx) => (
            <td key={idx}>
              {heading.id === "services" ? (
                (row?.services?.length>0 && row?.products?.length>0)? 
                "Service/Product"
                : row?.services?.length>0?"Service" 
                :row?.products?.length>0?"Product":""
              ) : heading.id === "netAmount" ? (
                ((row?.subTotal - (row?.discount || 0)) / 1.18).toFixed(2)
              ) : heading.id === "gstAmount" ? (
                (
                  row?.subTotal -
                  (row?.discount || 0) -
                  ((row?.subTotal - (row?.discount || 0)) / 1.18).toFixed(2)
                ).toFixed(2)
              ) : heading.id === "invoiceUrl" ? (
                <FaFilePdf
                  className="text-2xl text-black font-bold cursor-pointer"
                  onClick={() => handleUrl(row[heading.id])}
                />
              ) : heading.id === "Cash" ||
                heading.id === "Upi" ||
                heading.id === "Card" ||
                heading.id === "Online" ? (
                row.paymentMethod.find(
                  (method) => method.name === heading.id
                )?.amount || 0
              ) : heading.id==="createdAt"?
              formatDateToFull(row[heading.id],false)
              :(
                row[heading.id]
              )}
            </td>
          ))}
        </tr>
      ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceWise;
