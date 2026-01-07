import { useEffect, useMemo, useState } from "react";

import "./report.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  postApiData,
  formatValue,
  formatDate,
  getApiCall,
  getDaysBetween,
  calculateGst,
} from "../../utils/services";
import { usePDF } from 'react-to-pdf';
import ReportTable from "../../components/Table/ReportTable";
import { FaAngleDown, FaCalendarAlt } from "react-icons/fa";
import CustomDatePicker from "../../components/customInput/CustomDatePicker";
import { useSearchParams } from "react-router-dom";
import exportToExcel from "../../utils/exportToExcel";
import { CiExport } from "react-icons/ci";

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

  const [membershipSale, setMemberShipSale] = useState([]);
  const [membershipTodaySale, setMemberShipTodaySale] = useState([]);
  const [paymentMethodReport, setPaymentMethodReport] = useState([]);
  const [advanceUsed, setAdvanceUsed] = useState(0);
  const [advanceRevenue, setAdvanceRevenue] = useState(0);
  const [advanceTodayRevenue, setAdvanceTodayRevenue] = useState(0);
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState(0)
  const [completedTodayAppointments, setCompletedTodayAppointments] = useState(0)
  const [serviceDistribution, setServiceDistribution] = useState([]);
  const [serviceTodayDistribution, setServiceTodayDistribution] = useState([]);
  const [categoryWiseDistrubution, setCategoryWiseDistrubution] = useState([])
  const [productDistribution, setProductDistribution] = useState([]);
  const [productTodayDistribution, setProductTodayDistribution] = useState([]);
  const [membershipCredit, setMembershipCredit] = useState([]);
  const [membershipTodayCredit, setMembershipTodayCredit] = useState([]);

  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === "startDate") {
      setStartDate(value)
    } else {
      setEndDate(value)
    }

  }

  const fetchSales = () => {
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
        const appointments = resp?.appointmentStatus
        const completed = appointments?.length > 0 ? appointments.find((elm) => elm._id === 3)?.total : 0

        setAppointmentStatus(appointments);
        setCompletedAppointments(completed)

        setServiceDistribution(resp?.serviceCategoryWiseRevenue);
        setCategoryWiseDistrubution(resp?.staffCategoryWiseRevenue)
        setAdvanceUsed(resp?.advanceUsed?.length > 0 ? parseFloat(resp?.advanceUsed[0]?.advanceUsed) : 0)
        setAdvanceRevenue(resp?.advanceRevenue?.length > 0 ? parseFloat(resp?.advanceRevenue[0]?.advanceRevenue) : 0)
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


  }



  const findTotalById = (reportArray, id) => {
    const report = reportArray.find(item => item._id === id);
    return report ? report?.total : 0;
  }
  const serviceDistributionTotal = useMemo(() => {
    if (serviceDistribution?.length > 0) {
      const total = serviceDistribution?.reduce((acc, curr) => acc + curr?.totalRevenue, 0)
      return formatValue(total);
    }
    return 0;
  }, [serviceDistribution])

  const serviceTodayDistributionTotal = useMemo(() => {
    if (serviceTodayDistribution?.length > 0) {
      const total = serviceTodayDistribution?.reduce((acc, curr) => acc + curr?.totalRevenue, 0)
      return formatValue(total);
    }
    return 0;
  }, [serviceTodayDistribution])

  const productDistributionTotal = useMemo(() => {
    if (productDistribution?.length > 0) {
      const total = productDistribution?.reduce((acc, curr) => acc + curr?.totalRevenue, 0)
      return formatValue(total);
    }
    return 0;
  }, [productDistribution])

  const productTodayDistributionTotal = useMemo(() => {
    if (productTodayDistribution?.length > 0) {
      const total = productTodayDistribution?.reduce((acc, curr) => acc + curr?.totalRevenue, 0)
      return formatValue(total);
    }
    return 0;
  }, [productTodayDistribution])

  const totalPayment = paymentMethodReport?.reduce((acc, payment) => acc + payment.total, 0);
  const membershipRevenue = membershipSale?.length > 0 ? membershipSale[0]?.membershipRevenue : 0
  const totalDistribution = useMemo(() => {
    const { finalAmount } = calculateGst(serviceDistributionTotal, endDate);
    return Math.round(productDistributionTotal + finalAmount) || 0
  }, [productDistributionTotal, serviceDistributionTotal, endDate])

  const totalTodayDistribution = useMemo(() => {

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const { finalAmount } = calculateGst(serviceTodayDistributionTotal, endDate);

    return Math.round(productTodayDistributionTotal + finalAmount) || 0
  }, [productTodayDistributionTotal, serviceTodayDistributionTotal])

  const gst = useMemo(() => {
    const { gstAmount } = calculateGst(serviceDistributionTotal, endDate)
    return Math.round(gstAmount)

  }, [serviceDistributionTotal, endDate])

  const gstToday = useMemo(() => {

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const { gstAmount } = calculateGst(serviceTodayDistributionTotal, endDate)
    return Math.round(gstAmount)
  }, [serviceTodayDistributionTotal, endDate])

  const netSales = useMemo(() => {
    const { baseAmount } = calculateGst(serviceDistributionTotal, endDate);
    return Math.round(baseAmount + productDistributionTotal);


  }, [serviceDistributionTotal, productDistributionTotal, endDate])
  const netServiceSales = useMemo(() => {
    const { baseAmount } = calculateGst(serviceDistributionTotal, endDate);
    return Math.round(baseAmount);


  }, [serviceDistributionTotal, endDate])
  const netTodaySales = useMemo(() => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const { baseAmount } = calculateGst(serviceTodayDistributionTotal, endDate)
    return Math.round(baseAmount + productTodayDistributionTotal);

  }, [serviceTodayDistributionTotal, productTodayDistributionTotal])

  const hsnColumns = [
    { name: "Hsn Code", id: "hsnCode" },
    { name: "Gst Rate", id: "gst" },
    { name: "Taxable Amount", id: "gst" },
    { name: "Membership Credit Used", id: "gst" },
    { name: "Advance Used", id: "gst" },
    { name: "Total Tax", id: "gst" },
    { name: "CGST", id: "gst" },
    { name: "SGST", id: "gst" },
    { name: "IGST", id: "gst" },
    { name: "Total", id: "gst" },
  ]
  const getTodaySale = () => {

    const data = {
      startDate: defaultStartDate,
      endDate: defaultStartDate,
    };
    setLoading(true)

    postApiData(
      "reports/salonDailyReport",
      data,
      (resp) => {
        setLoading(false)
        const appointments = resp?.appointmentStatus
        const completed = appointments?.length > 0 ? appointments.find((elm) => elm._id === 3)?.total : 0;
        setCompletedTodayAppointments(completed)
        setServiceTodayDistribution(resp?.serviceCategoryWiseRevenue);
        setMemberShipTodaySale(resp?.membershipSale);
        setProductTodayDistribution(resp?.productRevenueDistribution)
        setMembershipTodayCredit(resp?.membershipCreditUsed)
        setAdvanceTodayRevenue(resp?.advanceRevenue?.length > 0 ? parseFloat(resp?.advanceRevenue[0]?.advanceRevenue) : 0)

      },
      (error) => {
        setLoading(false)

      }
    );
  }
  const submitClick = () => {


    fetchSales()
  };

  const credits = membershipCredit?.length > 0 && membershipCredit[0]?.membershipCreditUsed;
  const creditsToday = membershipTodayCredit?.length > 0 && membershipTodayCredit[0]?.membershipCreditUsed;

  const calculateAvg = (value) => {
    if (value) {
      let days = getDaysBetween(startDate, endDate);
      return formatValue(Math.floor(value / days)) || 0

    }
    else return 0

  }

  const membershipTodayRevenue = membershipTodaySale?.length > 0 ? membershipTodaySale[0]?.membershipRevenue : 0
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


  useEffect(() => {

    fetchSales(true);
    getTodaySale()


  }, [])
  const salesColumns = [
    {
      name: "Total Sale",
      value: totalDistribution,
      avg: calculateAvg(totalDistribution),
      today: totalTodayDistribution

    },
    {
      name: "Gst",
      value: gst,
      avg: calculateAvg(gst),
      today: gstToday
    },
    {
      name: "Net Sales",
      value: netSales,
      avg: calculateAvg(netSales),
      today: netTodaySales
    },
    {
      name: "Bills",
      value: completedAppointments,
      avg: Math.floor(calculateAvg(completedAppointments)),
      today: completedTodayAppointments
    },
    {
      name: "Abv",
      value: formatValue(
        completedAppointments > 0 ? netSales / completedAppointments : 0
      ),
      avg: Math.floor(
        completedAppointments > 0 ? netSales / completedAppointments : 0
      ),
      today: formatValue(
        completedTodayAppointments > 0 ? netTodaySales / completedTodayAppointments : 0
      )
    },
    {
      name: "Service Sale",
      value: serviceDistributionTotal,
      avg: calculateAvg(serviceDistributionTotal),
      today: serviceTodayDistributionTotal


    }, {
      name: "Product Sale",
      value: productDistributionTotal,
      avg: calculateAvg(productDistributionTotal),
      today: productTodayDistributionTotal
    },
    {
      name: "Membership Sold",
      value: formatValue(membershipRevenue || 0),
      avg: calculateAvg(membershipRevenue),
      today: formatValue(membershipTodayRevenue)

    },
    {
      name: "Membership Redemption",
      value: formatValue(credits || 0),
      avg: calculateAvg(credits),
      today: formatValue(creditsToday)
    },
    {
      name: "Advance Revenue",
      value: formatValue(advanceRevenue || 0),
      avg: calculateAvg(advanceRevenue),
      today: formatValue(advanceTodayRevenue)
    }

  ]

  const getEmployeeSalary = (id) => {
    const employee = staffs.find((staff) => staff._id === id);
    return employee ? employee.salary : 0;

  }

  const hsnRows = {
    HsnCode: "999721",
    GstRate: "5%",
    TaxableAmount: netServiceSales||0,
    MembershipCreditUsed: formatValue(credits)||0,
    AdvanceUsed: formatValue(advanceUsed)||0,
    TaxableAmount: netServiceSales||0,
    TotalTax: gst||0,
    CGST: formatValue(gst / 2)||0,
    SGST: formatValue(gst / 2)||0,
    IGST: 0,
    Total: formatValue(netServiceSales + parseFloat(gst))||0,
  }

  const exportHsnReport =()=>{
      exportToExcel([hsnRows], "Hsn Report", "hsnreport.xlsx",false);

  }
  // console.log(appointmentStatus, "appointmentStatus")


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
            <h2 className="text-gray-700 bg-gray-300 px-3 py-0 capitalize text-start    font-normal text-lg mb-5">Daily Sale Report</h2>
            <table className="styled-table">
              <thead>
                <tr>
                  <th><span className="text-darkRedish font-medium uppercase">MODE</span></th>
                  <th><span className="text-darkRedish font-medium uppercase">TODAY</span></th>
                  <th><span className="text-darkRedish font-medium uppercase">AVERAGE</span></th>
                  <th><span className="text-darkRedish font-medium uppercase">MTD</span></th>

                  {/* <th>Category</th> */}
                  {/* Add more column headers as needed */}
                </tr>
              </thead>
              <tbody style={{ height: "80px" }}>

                {salesColumns.map((elm, index) => {
                  return (
                    <tr key={index}>
                      <td>{elm.name}</td>
                      <td>{elm.today || 0}</td>
                      <td>{elm.avg || 0}</td>
                      <td>{elm.value || 0}</td>
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
            <h2 className="text-gray-700 bg-gray-300  px-3 py-0 capitalize  text-start  font-normal text-lg mb-5">Collection</h2>
            <table className="styled-table">
              <thead>
                <tr>
                  <th><span className="text-darkOrange">MODE</span></th>
                  <th><span className="text-darkOrange">AMOUNT</span></th>

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
                  <td className="text-bold text-black">Advance Used</td>
                  <td className=" text-black">{formatValue(advanceUsed)}</td>
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
            <h2 className="text-gray-700 bg-gray-300  px-3 py-0 capitalize  text-start  font-normal text-lg mb-5"> APPOINTMENT STATUS</h2>


            <table className="styled-table">
              <thead>
                <tr>
                  <th><span className="text-primaryDarkPurple">STATUS</span></th>
                  <th><span className="text-primaryDarkPurple">VALUE</span></th>
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
            <h2 className="text-gray-700 bg-gray-300  px-3 py-0 capitalize  text-start  font-normal text-lg mb-5">  Membership Status</h2>

            <table className="styled-table">
              <thead>
                <tr>
                  <th><span className="text-primaryDarkGreen">MEMBERSHIP REVENUE</span></th>
                  <th><span className="text-primaryDarkGreen">MEMBERSHIP COUNT</span></th>
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
            <h2 className="text-gray-700 bg-gray-300  px-3 py-0 capitalize  text-start  font-normal text-lg mb-5">    Service Distribution</h2>
            <table className="styled-table">
              <thead>
                <tr>
                  <th><span className="text-secondaryDarkPurple">SERVICE</span></th>
                  <th><span className="text-secondaryDarkPurple">TOTAL REVENUE</span></th>
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
            <h2 className="text-gray-700 bg-gray-300  px-3 py-0 capitalize  text-start  font-normal text-lg mb-5">Product Distribution</h2>


            <table className="styled-table">
              <thead>
                <tr>
                  <th> <span className="text-secondaryDarkBlue">PRODUCT</span></th>
                  <th> <span className="text-secondaryDarkBlue">TOTAL REVENUE</span></th>
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
          <div className="flex gap-6">
            <h2 className="text-gray-700 bg-gray-300  px-3 py-0 capitalize  text-start w-full  font-normal text-lg mb-5">HSN REPORT</h2>
             <button
            className="w-[150px]  gap-1 bg-ternary font-normal h-[36px] flex items-center justify-center active:bg-ternary/90 transition-colors ease-in duration-100 rounded-[16px] text-white text-sm leading-[24px]"
            onClick={exportHsnReport}
          >
           Export <CiExport  size={20}/>

          </button>
          </div>

            <table className="styled-table performance-table">
              <thead>
                <tr>
                  {hsnColumns?.map((elm, index) => {
                    return (
                      <th key={index} >{elm.name}</th>
                    )
                  })
                  }
                </tr>
              </thead>
              <tbody style={{ height: "80px" }}>
                      <tr>
                {Object.values(hsnRows)?.map((item, index) => {
                  return (
                        <td key={index}>{item}</td>
                  );
                })}

                      </tr>
              </tbody>
            </table>
          </div>
          <div className=" rounded-[16px] col-span-full  border border-primaryGray p-5  "

          >
            <h2 className="text-gray-700 bg-gray-300  px-3 py-0 capitalize  text-start  font-normal text-lg mb-5">EMPLOYEE PERFORMANCE</h2>


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
                  let { baseAmount } = calculateGst(totalSum, endDate);
                  let target = ((salary * 4) || 0);

                  let performance = target > 0 ? ((baseAmount / target) * 100) : 0;

                  return (
                    <>
                      <tr>
                        <td>{name}</td>
                        <td>{formatValue(totalSum)}</td>
                        <td>{formatValue(baseAmount)}</td>
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
            <h2 className="text-gray-700 bg-gray-300  px-3 py-0 capitalize  text-start  font-normal text-lg mb-5">   EMPLOYEE SERVICE DISTRIBUTION</h2>

            <ReportTable data={categoryWiseDistrubution} endDate={endDate} />

          </div>

        </div>
      </div>
    </>
  );
};

export default Report;
