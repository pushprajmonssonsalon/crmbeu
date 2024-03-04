import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import { getApiCall } from '../../utils/services';
import { usePDF } from "react-to-pdf";
const MembershipInvoiceGenrator = () => {
    const location = useLocation();
    const membershipData = location.state;
    console.log({membershipData})
    const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
    // parlor details
    const [parlorDetails, setParlorDetails] = useState([]);
    const currentDate = new Date();
  const formattedDate = currentDate.toDateString();

  //values 

  const customerName = membershipData.customerName;
  const customerPhoneNumber = membershipData.customerPhoneNumber
  const employees = membershipData.employees.name
  const membershiptype = membershipData.name
  const price = membershipData.price
  const GST = price-Math.ceil(price/1.18);
  const Total = Math.ceil(price/1.18)+GST;

    useEffect(() => {
      getApiCall(
        "parlor/getParlorDetail",
        (resp) => {
          console.log("getparlour", resp);
          setParlorDetails(resp);
          parlorDetails(resp);
        },
        (error) => {
          console.log("error", error);
        }
      );
    }, []);
  return (
    <div class="invoice-wrapper" id="print-area" ref={targetRef}>
      <div class="invoice">
        <div class="invoice-container-value">
          <div class="invoice-head">
            <div class="invoice-head-top">
              <div class="invoice-head-top-left text-start">
                <img src="https://smartsalon.in/static/media/applogo.d153d799341a8fb862fd.jpg" />
              </div>
              <div class="invoice-head-top-right text-end">
                <h3>Invoice</h3>
              </div>
            </div>
            <div class="hr"></div>
            <div class="invoice-head-middle">
              <div class="invoice-head-middle-left text-start">
                <p>
                  <span class="text-bold">Date</span>: {formattedDate}
                </p>
              </div>
              
            </div>
            <div class="hr"></div>
            <div class="invoice-head-bottom">
              <div class="invoice-head-bottom-left">
                <ul>
                  <li class="text-bold">Invoiced To:</li>
                  <li>{parlorDetails.address}</li>
                  <li>{parlorDetails.address2}</li>
                  <li>{parlorDetails.stateName}</li>
                </ul>
              </div>
              
              </div>
              </div>
          </div>
          {/* TABLE */}
          
        <div className="table-container w-[90%] overflow-x-scroll">

       
<table className="styled-table">
  <thead>
    <tr >
      <th>NAME</th>
      <th>PHONE NO.</th>
      <th>EMPLOYEE</th>
      <th>MEMBERSHIP NAME</th>
      <th>Price</th>
      <th>GST</th>
      <th>TOTAL</th>
    </tr>
  </thead>
  <tbody>
  
   
  
      <tr  className="bg-white">
        <td>{customerName}</td>
        <td>{customerPhoneNumber}</td>
        <td>{employees}</td>
        <td>{membershiptype}</td>
        <td>{Math.ceil(price/1.18)}</td>
        <td>{GST}</td>
        <td>{Total}</td>
      
      </tr>

  </tbody>
</table>

</div>
     
      </div>
    </div>
  )
}

export default MembershipInvoiceGenrator