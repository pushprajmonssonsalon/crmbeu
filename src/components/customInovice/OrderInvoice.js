import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getApiCall } from '../../utils/services';
import { usePDF } from "react-to-pdf";
const OrderInvoice = () => {
    const location = useLocation();
    const orderList = location.state;
    
    const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
    const [parlorDetails,setParlorDetails] = useState([])
    const currentDate = new Date();
  const formattedDate = currentDate.toDateString();

    useEffect(() => {
        getApiCall(
          "parlor/getParlorDetail",
          (resp) => {
            
            setParlorDetails(resp);
          },
          (error) => {
            
          }
        );
      }, []);
      
  return(
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
      <th>SIZE</th>
      <th>QUANTITY</th>
    </tr>
  </thead>
  <tbody>
  
   {
    orderList?.products?.map((item)=>(
        <tr key={item._id}>
        <td>{item.name}</td>
        <td>{item.size}</td>
        <td>{item.quantity}</td>
        </tr>
    ))
   }

  </tbody>
</table>
<div class="invoice-foot text-center">
            <p>
              <span class="text-bold text-center"></span>Thankyou for availing
              services at Be U-Turning Heads. We hope you had a pleasant
              experience.
            </p>
          </div>
          <button  className="w-full text-center" onClick={() => toPDF()}>Download PDF</button>

</div>

     
      </div>
    </div>
  )
}

export default OrderInvoice