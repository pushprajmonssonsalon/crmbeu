import { useEffect, useMemo, useState } from "react";

import "./report.css";
import "react-datepicker/dist/react-datepicker.css";
import { postApiData, formatValue, formatDate, getApiCall, getDaysBetween } from "../../utils/services";
import { usePDF } from 'react-to-pdf';
import ReportTable from "../../components/Table/ReportTable";
import { FaAngleDown, FaCalendarAlt } from "react-icons/fa";
import CustomDatePicker from "../../components/customInput/CustomDatePicker";
import { useSearchParams } from "react-router-dom";
const Report = () => {
  const [params] = useSearchParams();
  const [showDate, setShowDate] = useState(false);
  const [staffs, setStaffs] = useState([]);
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

  const [reports, setReports] = useState([]);
  const [membershipSale, setMemberShipSale] = useState([]);
  const [paymentMethodReport, setPaymentMethodReport] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  const [serviceDistribution, setServiceDistribution] = useState([]);
  const [staffDistribution, setStaffDistribution] = useState([]);
  const [categoryWiseDistrubution, setCategoryWiseDistrubution] = useState([])
  const [productDistribution, setProductDistribution] = useState([]);
  const [membershipCredit, setMembershipCredit] = useState([]);
  const [wholeCustomerRevenue, setWholeCustomerRevenue] = useState("")
  const [newCustomerRevenue, setNewCustomerRevenue] = useState("")

  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
  const tableHeaders = [
    "EMPLLOYEE NAME",
    "HAIR",
    "SPA",
    "BEAUTY",
    "NAIL",
    "HAND & FEET",
    "MAKEUP",
  ];
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
      startDate: startDate,
      endDate: startDate,
    };
    setLoading(true)
    postApiData(
      "reports/salonDailyReport",
      data,
      (resp) => {
        setLoading(false)
        setAppointmentStatus(resp?.appointmentStatus);
        setServiceDistribution(resp?.serviceCategoryWiseRevenue);
        setStaffDistribution(resp?.staffRevenueDistribution);
        setCategoryWiseDistrubution(resp?.staffCategoryWiseRevenue)
        setMemberShipSale(resp?.membershipSale);
        setProductDistribution(resp?.productRevenueDistribution)
        setMembershipCredit(resp?.membershipCreditUsed)
        const paymentMethods = ["Cash", "Card", "Online", "Upi", "Pending"];

        let paymentReport = paymentMethods?.map(method => ({
          _id: method,
          total: findTotalById(resp?.paymentMethodReport, method)
        }));
        setPaymentMethodReport(paymentReport)

      },
      (error) => {
        setLoading(false)

      }
    );

  }, [])


  const findTotalById = (reportArray, id) => {
    const report = reportArray.find(item => item._id === id);
    return report ? report.total : 0;
  }
  const serviceDistributionTotal = useMemo(() => {
    if (serviceDistribution?.length>0) {
      const total = serviceDistribution?.reduce((acc, curr) => acc + curr?.totalRevenue, 0)
      return formatValue(total);
    }
    return 0;
  }, [serviceDistribution])

  const productDistributionTotal = useMemo(() => {
    if (productDistribution?.length>0) {
      const total = productDistribution?.reduce((acc, curr) => acc + curr?.totalRevenue, 0)
      return formatValue(total);
    }
    return 0;
  }, [productDistribution])

  const totalDistribution =useMemo(()=>{
     return formatValue(productDistributionTotal +serviceDistributionTotal)||0
  },[productDistributionTotal,serviceDistributionTotal])

  const gst =useMemo(()=>{
      const gstAmount =(totalDistribution/1.18)||0;
      return formatValue(totalDistribution-gstAmount)||0

   

  },[totalDistribution])
  const netSales =useMemo(()=>{
    return formatValue(totalDistribution-gst)||0
    
  },[totalDistribution,gst])

  const submitClick = () => {
    const data = {
      startDate: startDate,
      endDate: endDate,
    };
    setLoading(true)

    postApiData(
      "reports/salonDailyReport",
      data,
      (resp) => {
        setLoading(false)
        setAppointmentStatus(resp?.appointmentStatus);
        setServiceDistribution(resp?.serviceCategoryWiseRevenue);
        setStaffDistribution(resp?.staffRevenueDistribution);
        setCategoryWiseDistrubution(resp?.staffCategoryWiseRevenue)
        setMemberShipSale(resp?.membershipSale);
        setProductDistribution(resp?.productRevenueDistribution)
        setMembershipCredit(resp?.membershipCreditUsed)
        const paymentMethods = ["Card", "Upi", "Cash"];

        let paymentReport = paymentMethods?.map(method => ({
          _id: method,
          total: findTotalById(resp?.paymentMethodReport, method)
        }));
        setPaymentMethodReport(paymentReport)
      },
      (error) => {
        setLoading(false)

      }
    );
  };

  const credits = membershipCredit?.length > 0 && membershipCredit[0]?.membershipCreditUsed;

  const calculateAvg=(value)=>{
    if(value){
    let days= getDaysBetween(startDate,endDate);
    return formatValue(value/days)||0 

    }
    else return 0

  }
  const totalPayment = paymentMethodReport?.reduce((acc, payment) => acc + payment.total, 0);
  const membershipRevenue =membershipSale?.length>0?membershipSale[0]?.membershipRevenue:0
  useEffect(() => {
    getApiCall(
      "owner/getStaff",
      (res) => {
        setStaffs(res);
      },
      (error) => {

      }
    );
  }, []);
  const salesColumns = [
    {
      name: "Service Sale",
      value: serviceDistributionTotal,
      avg:calculateAvg(serviceDistributionTotal)


    }, {
      name: "Product Sale",
      value: productDistributionTotal,
      avg:calculateAvg(productDistributionTotal)
    }, {
      name: "Total Sale",
      value: totalDistribution,
      avg:calculateAvg(totalDistribution)

    }, {
      name: "Gst",
      value: gst,
      avg:calculateAvg(gst)
    }, {
      name: "Net Sales",
      value: netSales,
      avg:calculateAvg(netSales)
    },
     {
      name: "Membership Redemption",
      value: formatValue(credits||0),
      avg:calculateAvg(credits)
    },
     {
      name: "Membership Sold",
      value: formatValue(membershipRevenue||0),
      avg:calculateAvg(membershipRevenue)
    }
  ]

  const getEmployeeSalary = (id) => {
    const employee = staffs.find((staff) => staff._id === id);
    return employee ? employee.salary : 0;

  }

 console.log(membershipSale,"mem")

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
            onClick={toPDF}
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



        <div className="p-5 grid  sm:grid-cols-1 gap-5 md:grid-cols-2" ref={targetRef} >
          <div className=" rounded-[16px]  border border-primaryGray p-5  "

          >
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">Sales</h2>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>MODE</th>
                  <th>AVERAGE</th>
                  <th>AMOUNT</th>

                  {/* <th>Category</th> */}
                  {/* Add more column headers as needed */}
                </tr>
              </thead>
              <tbody style={{ height: "80px" }}>

                {salesColumns.map((elm, index) => {
                  return (
                    <tr key={index}>
                      <td>{elm.name}</td>
                      <td>{elm.avg||0}</td>
                      <td>{elm.value||0}</td>
                    </tr>
                  )
                })}


             
              
              </tbody>

              {/* <div className="grid grid-cols-2 gap-3 w-full border-2 border-black">
            <div className="text-black font-medium">Total :</div>
            
        <div className="text-black font-medium text-right">
             {totalPayment}
            </div>
        </div> */}
            </table>

          </div>
          <div className=" rounded-[16px] border border-primaryGray p-5  "

          >
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">COLLECTION</h2>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>MODE</th>
                  <th>AMOUNT</th>

                  {/* <th>Category</th> */}
                  {/* Add more column headers as needed */}
                </tr>
              </thead>
              <tbody style={{ height: "80px" }}>
                {paymentMethodReport?.map((item, index) => {
                  return (
                    <>
                      <tr>
                        <td>{item._id}</td>
                        <td>{formatValue(item.total)}</td>
                      </tr>

                    </>
                  );
                })}
                <tr>
                  <td className=" text-black">Membership Credit Used</td>
                  <td className=" text-black">{formatValue(credits)}</td>
                </tr>
                <tr>
                  <td className="text-bold text-black">Total</td>
                  <td className=" text-black">{formatValue(totalPayment)}</td>
                </tr>
              </tbody>

              {/* <div className="grid grid-cols-2 gap-3 w-full border-2 border-black">
            <div className="text-black font-medium">Total :</div>
            
        <div className="text-black font-medium text-right">
             {totalPayment}
            </div>
        </div> */}
            </table>

          </div>

          <div className=" rounded-[16px] border border-primaryGray p-5  "

          >
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5"> APPOINTMENT STATUS</h2>


            <table className="styled-table">
              <thead>
                <tr>
                  <th>STATUS</th>
                  <th>VALUE</th>
                </tr>
              </thead>
              <tbody style={{ height: "80px" }}>
                {appointmentStatus?.map((item, index) => {
                  return (

                    <tr>
                      {item._id === 3 && <td>{"Completed"}</td>}
                      {item._id === 2 && <td>{"Cancelled"}</td>}
                      {item._id === 4 && <td>{"Half Completed"}</td>}
                      {item._id === 3 && <td>{formatValue(item?.total) || 0}</td>}
                      {item._id === 2 && <td>{formatValue(item?.total) || 0}</td>}
                      {item._id === 4 && <td>{formatValue(item?.total) || 0}</td>}
                    </tr>

                  );
                })}
              </tbody>
            </table>
          </div>
          <div className=" rounded-[16px] border border-primaryGray p-5  "

          >
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">  MEMBERSHIP STATUS</h2>

            <table className="styled-table">
              <thead>
                <tr>
                  <th>MEMBERSHIP REVENUE</th>
                  <th>MEMBERSHIP COUNT</th>
                </tr>
              </thead>
              <tbody style={{ height: "80px" }}>
                {membershipSale?.map((item, index) => {
                  return (
                    <>
                      <tr>
                        <td>{formatValue(item.membershipRevenue)}</td>
                        <td>{formatValue(item.membershipCount)}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>



          {/* SERVICE REVENUE */}
          <div className=" rounded-[16px] border border-primaryGray p-5  "

          >
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">    SERVICE DISTRIBUTION</h2>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>SERVICE</th>
                  <th>TOTAL REVENUE</th>
                </tr>
              </thead>
              <tbody style={{ height: "80px" }}>
                {serviceDistribution?.map((item, index) => {
                  return (
                    <>
                      <tr>
                        <td>{item._id}</td>
                        <td>{formatValue(item.totalRevenue)}</td>
                      </tr>
                    </>
                  );
                })}
                <tr>
                  <td className="text-black ">Total</td>
                  <td className="text-black ">{formatValue(serviceDistributionTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* PRODUCT REVENUE */}
          <div className=" rounded-[16px]   border border-primaryGray p-5  "

          >
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">    PRODUCT DISTRIBUTION</h2>


            <table className="styled-table">
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>TOTAL REVENUE</th>
                </tr>
              </thead>
              <tbody style={{ height: "80px" }}>
                {productDistribution?.map((item, index) => {
                  return (
                    <>
                      <tr>
                        <td>{item?.name}</td>
                        <td>{formatValue(item?.totalRevenue)}</td>
                      </tr>
                    </>

                  );
                })}
                <tr>
                  <td className="text-black ">Total</td>
                  <td className="text-black ">{formatValue(productDistributionTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className=" rounded-[16px] col-span-full  border border-primaryGray p-5  "

          >
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">EMPLOYEE PERFORMANCE</h2>


            <table className="styled-table performance-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th className="">TOTAL SALES</th>
                  <th className="">NET SALES</th>
                  <th className="">TARGET</th>
                  <th className="">PERFORMANCE</th>
                </tr>
              </thead>
              <tbody style={{ height: "80px" }}>
                {categoryWiseDistrubution?.map(({ _id: { id, name }, categories }, index) => {
                  const salary = getEmployeeSalary(id);

                  let totalSum = (categories.reduce((acc, curr) => acc + curr.sumTotal, 0) || 0);
                  let netTotal = (totalSum / 1.18) || 0;
                  let target = ((salary * 3) || 0);

                  let performance = target > 0 ? ((netTotal / target) * 100) : 0;

                  return (
                    <>
                      <tr>
                        <td>{name}</td>
                        <td>{formatValue(totalSum)}</td>
                        <td>{formatValue(netTotal)}</td>
                        <td>{formatValue(target)}</td>
                        <td>{formatValue(performance)}%</td>
                      </tr>
                    </>

                  );
                })}

              </tbody>
            </table>
          </div>
          <div className=" rounded-[16px] col-span-full border border-primaryGray p-5  "

          >
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">   EMPLOYEE SERVICE DISTRIBUTION</h2>

            <ReportTable data={categoryWiseDistrubution} />

          </div>

        </div>
      </div>
    </>
  );
};

export default Report;
