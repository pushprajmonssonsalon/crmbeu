import React, { useEffect, useState } from "react";

import "./report.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postApiData } from "../../utils/services";
import { CSVLink } from "react-csv";
import { usePDF } from 'react-to-pdf';
import InvoiceGenrator from "../../components/customInovice";
import Layout from "../../components/Layout";
import { productAdded } from "../../redux/actions";
import ReportTable from "../../components/Table/ReportTable";

const Report = () => {
  const defaultStartDate = new Date();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState();
  const [reports, setReports] = useState([]);
  const [membershipSale, setMemberShipSale] = useState([]);
  const [paymentMethodReport, setpaymentMethodeReport] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  const [serviceDistribution, setServiceDistribution] = useState([]);
  const [staffDistribution, setStaffDistribution] = useState([]);
  const [dataResponse,setDataResponse]=useState([]);
  const [categoryWiseDistrubution,setCategoryWiseDistrubution] = useState([])
  console.log("dataResponse",dataResponse)
  const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
  const tableHeaders = [
    "EMPLLOYEE NAME",
    "HAIR",
    "SPA",
    "BEAUTY",
    "NAIL",
    "HAND & FEET",
    "MAKEUP",
  ];
  useEffect(()=>{
    const data = {
      startDate: startDate,
      endDate: startDate,
    };
    postApiData(
      "reports/salonDailyReport",
      data,
      (resp) => {
        console.log("Checkrra hu console", resp)
        console.log("reports", resp.appointmentPaymentMethodReport);
        setpaymentMethodeReport(resp.appointmentPaymentMethodReport);
        setAppointmentStatus(resp.appointmentStatus);
        setServiceDistribution(resp.serviceCategoryWiseRevenue);
        setStaffDistribution(resp.staffRevenueDistribution);
        setCategoryWiseDistrubution(resp.staffCategoryWiseRevenue)
        setMemberShipSale(resp.membershipSale);
        setDataResponse(resp)
      },
      (error) => {
        console.log("error", error);
      }
    );

  },[])
  console.log("category wise", categoryWiseDistrubution)

  const submitClick = () => {
    const data = {
      startDate: startDate,
      endDate: endDate,
    };
    postApiData(
      "reports/salonDailyReport",
      data,
      (resp) => {
        console.log("reports", resp.appointmentPaymentMethodReport);
        setpaymentMethodeReport(resp.appointmentPaymentMethodReport);
        setAppointmentStatus(resp.appointmentStatus);
        setServiceDistribution(resp.serviceCategoryWiseRevenue);
        setStaffDistribution(resp.staffRevenueDistribution);

        setMemberShipSale(resp.membershipSale);
        setDataResponse(resp)
      },
      (error) => {
        console.log("error", error);
      }
    );
  };
  console.log({staffDistribution})

  return (
    <Layout>
    <div ref={targetRef} className="mt-32 w-[90%] mx-auto mb-20">
        <div>
    <button onClick={() => toPDF()}>Download PDF</button>
 
 </div>
      <div className="reportContainer">
        <span className="text-3xl font-bold ">REPORTS</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className="selectDate">Select Date</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginLeft: "10px",
            flexDirection: "column",
            display: "flex",
          }}
        >
          <label>Start Date</label>

          <DatePicker
            selectsStart
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            startDate={startDate}
          />
        </div>

        <div
          style={{
            marginLeft: "10px",
            flexDirection: "column",
            display: "flex",
          }}
        >
          <label>End Date</label>
          <DatePicker
            selectsEnd
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            endDate={endDate}
            startDate={startDate}
            minDate={startDate}
          />
        </div>

        <button
          style={{
            height: "35px",
            borderRadius: "20px solid grey",
            width: "150px",
            backgroundColor: "black",
            marginLeft: "20px",
            marginTop: "23px",
          }}
          onClick={submitClick}
        >
          <label
            style={{ color: "white", fontSize: "14px", fontWeight: "500" }}
          >
            Submit
          </label>
        </button>
      </div>
      <div className="mt-10"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className="text-3xl font-bold text-black" >
          COLLECTION
        </span>
      </div>
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
          {paymentMethodReport.map((item, index) => {
            return (
              <>
                <tr>
                  <td>{item._id}</td>
                  <td>{item.total}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
          marginBottom: "14px"
        }}
      >
        <span className="text-3xl font-bold text-black">
          APPOINTMENT STATUS
        </span>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>STATUS</th>
            <th>VALUE</th>
          </tr>
        </thead>
        <tbody style={{ height: "80px" }}>
          {appointmentStatus.map((item, index) => {
            return (
           
                <tr>
                  {item._id == 3 && <td>{"Completed"}</td>}
                  {item._id == 2 && <td>{"Cancelled"}</td>}
                  {item._id == 3 && <td>{item.total}</td>}
                  {item._id == 2 && <td>{item.total}</td>}
                </tr>
       
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
          marginBottom: "14px"
        }}
      >
        <span className="text-3xl font-bold text-black">
          MEMBERSHIP STATUS 
        </span>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>MEMBERSHIP REVENUE</th>
            <th>MEMBERSHIP COUNT</th>
          </tr>
        </thead>
        <tbody style={{ height: "80px" }}>
          {membershipSale.map((item, index) => {
            return (
              <>
                <tr>
                  <td>{item.membershipRevenue}</td>
                  <td>{item.membershipCount}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>

      {/* SERVICE REVENUE */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
          marginBottom: "14px"
        }}
      >
        <span className="text-3xl font-bold text-black">
          SERVICE DISTRIBUTION
        </span>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>SERVICE</th>
            <th>TOTAL REVENUE</th>
          </tr>
        </thead>
        <tbody style={{ height: "80px" }}>
          {serviceDistribution.map((item, index) => {
            return (
              <>
                <tr>
                  <td>{item._id}</td>
                  <td>{item.totalRevenue}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>

      {/* PRODUCT REVENUE */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "40px",
          marginBottom: "20px"
        }}
      >
        <span  className="text-3xl font-bold text-black">
          PRODUCT DISTRIBUTION
        </span>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>TOTAL REVENUE</th>
          </tr>
        </thead>
        <tbody style={{ height: "80px" }}>
          {staffDistribution.map((item, index) => {
            return (
              <>
                <tr>
                  <td>{item.name}</td>
                  <td>{item.totalRevenue}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "14px",
          marginTop: "40px"
        }}
      >
        <span className="text-3xl font-bold text-black">
          EMPLOYEE SERVICE DISTRIBUTION
        </span>
      </div>
      {/* <table>
        <thead>
          <tr>
            <th>EMPLLOYEE NAME</th>
            <th>HAIR</th>
            <th>SPA</th>
            <th>BEAUTY</th>
            <th>NAIL</th>
            <th>HAND & FEET</th>
            <th>MAKEUP</th>
          </tr>
        </thead>
        <tbody style={{ height: "80px" }}>
          {categoryWiseDistrubution?.map((item, index) => {
            return (
              <>
                <tr>
                  <td>{item.name}</td>
                  <td>{item?.categories?.sumTotal || 0}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table> */}
      <ReportTable data={categoryWiseDistrubution} />
    </div>
    </Layout>
  );
};

export default Report;
