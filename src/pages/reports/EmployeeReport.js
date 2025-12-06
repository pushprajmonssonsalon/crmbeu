import { useEffect, useState } from "react";

import "./report.css";
import "react-datepicker/dist/react-datepicker.css";
import { postApiData, formatDate, formatDateToFull } from "../../utils/services";
import { FaAngleDown, FaCalendarAlt } from "react-icons/fa";
import CustomDatePicker from "../../components/customInput/CustomDatePicker";
import { useSearchParams } from "react-router-dom";
import CustomTable from "../../components/Table/CustomTable";
import exportToExcel from "../../utils/exportToExcel";
import toast from "react-hot-toast";
const EmployeeReport = () => {
  const [params] = useSearchParams();
  const [showDate, setShowDate] = useState(false);
  const [serviceDetails,setServiceDetails]=useState([]);
  const [productDetails,setProductDetails]=useState([]);
  
  const start = params.get("start");
  const end = params.get("end");


  //date
  const defaultStartDate = formatDate(new Date());
  const [startDate, setStartDate] = useState(
    start ? start : defaultStartDate
  );
  const [endDate, setEndDate] = useState(
    end ? end : defaultStartDate
  );


  const [loading, setLoading] = useState(false)



  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === "startDate") {
      setStartDate(value)
    } else {
      setEndDate(value)
    }

  }

  const fetchSales =()=>{
     const data = {
      startDate: startDate,
      endDate:endDate,
    };
        setLoading(true)

      postApiData(
      "reports/employeeAppointmentWiseReport",
      data,
      (res) => {
        setLoading(false)
        setServiceDetails(res?.serviceReport?.length>0?res?.serviceReport?.map(({createdDate,...elm})=>({...elm,AppointDate:formatDateToFull(elm.AppointDate)})):[])
        setProductDetails(res?.productReport?.length>0?res?.productReport?.map(({createdDate,...elm})=>({...elm,AppointDate:formatDateToFull(elm.AppointDate)})):[])
        

      
      },
      (error) => {
        setLoading(false)

      }
    );
    
  }
   const handleExport = () => {
    if(serviceDetails?.length===0&&productDetails?.length===0)return toast.error("data not available")
    const sheets = [
  { name: "Service Report", values: serviceDetails },
  { name: "Product Report", values: productDetails }
  ];
  
  
  exportToExcel(sheets, "WeeklyReport", "weeklyReport.xlsx",true);
      
    }
  
  const submitClick = () => {
    fetchSales()
  };
  
  
  
    useEffect(() => {
     
      fetchSales(true);
      
  
    }, [])
    const servicesColumns=[
  { id: "StaffName", name: "Staff Name" },
  { id: "InvoiceId", name: "Invoice ID" },
  { id: "Name", name: "Customer Name" },
  { id: "PhoneNumber", name: "Phone Number" },
  { id: "ServiceName", name: "Service Name" },
  { id: "ServicePrice", name: "Service Price" },
  { id: "AppointDate", name: "Appointment Date" },
];
    const productsColumns=[
  { id: "StaffName", name: "Staff Name" },
  { id: "InvoiceId", name: "Invoice ID" },
  { id: "Name", name: "Customer Name" },
  { id: "PhoneNumber", name: "Phone Number" },
  { id: "ProuctName", name: "Product Name" },
  { id: "Price", name: "Price" },
  { id: "Quantity", name: "Quantity" },
  { id: "Total", name: "Total Amount" },
  { id: "AppointDate", name: "Appointment Date" },
];


  

  return (
    <>
      <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300`}>
        <div className="flex w-full items-center justify-between">
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
            onSubmit={submitClick}
            onChange={handleDateChange}


          />
        </div>}

      </div>


      <div className="">
       <div>
        <h2>Service Report</h2>
       </div>
        <CustomTable
          columns={servicesColumns}
          rows={serviceDetails}

        />

    
      </div>
      <div className="">
       <div>
        <h2>Product Report</h2>
       </div>
        <CustomTable
          columns={productsColumns}
          rows={productDetails}
        />

    
      </div>
    </>
  );
};

export default EmployeeReport;
