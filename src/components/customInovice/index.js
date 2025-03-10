import React, { useEffect, useState, } from "react";
import { usePDF } from "react-to-pdf";
import "./invoice.css";
import { useLocation } from "react-router-dom";
import { getApiCall } from "../../utils/services";
export default function  InvoiceGenrator() {
  const location = useLocation();

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  const [parlorDetails, setParlorDetails] = useState([]);
  const [staffData,setStaffData] = useState([])
  useEffect(() => {
    getApiCall(
      "owner/getStaff",
      (res) => {
        setStaffData(res);
      },
      (error) => {
        
      }
    );
  }, []);
  
  const data = location.state;
  
  
  
  const memberShipDataused = data?.membershipCreditUsed;
  const paymentMethodsValue = data?.paymentMethod;
  const currentDate = new Date();
  const formattedDate = currentDate.toDateString();

  const serviceTotal = data.services.reduce((accumulator, { price }) => {
    return accumulator + price;
  }, 0);
  

  const serviceDiscount = data.discount;
  const serviceTaxable = serviceTotal - serviceDiscount;
  const serviceFinalTax = Math.ceil(serviceTaxable / 1.18);
  const CGST = (serviceFinalTax * 9) / 100;
  const SGST = (serviceFinalTax * 9) / 100;
  const servicePayableAmount = Math.ceil(
    (serviceFinalTax + CGST + SGST).toFixed()
  );
  // const productSubtotalAmount=data.products;
  const productTotalPrice = data.products.reduce(
    (accumulator, { price, quantity }) => {
      return accumulator + quantity * price;
    },
    0
  );
  
  const productTotalTaxtable = Math.ceil(productTotalPrice / 1.18);
  const CGSTProduct = (productTotalTaxtable * 9) / 100;
  const SGSTProduct = (productTotalTaxtable * 9) / 100;
  // const paytax = Math.ceil(data.total / 1.18);
  const productFinalPayable = Math.ceil(
    (productTotalTaxtable + CGSTProduct + SGSTProduct).toFixed()
  );

  // const taxableTotalamountPay = Math.ceil((paytax + CGST + SGST).toFixed());
  useEffect(() => {
    getApiCall(
      "parlor/getParlorDetail",
      (resp) => {
        
        setParlorDetails(resp);
        parlorDetails(resp);
      },
      (error) => {
        
      }
    );
  }, []);
  const paytax = Math.ceil(data.total / 1.18);
  // const CGST = (paytax * 9) / 100;
  // const SGST = (paytax * 9) / 100;
  const taxableTotalamountPay = Math.ceil((paytax + CGST + SGST).toFixed());


  const totalPayableAmount = ((Math.ceil(serviceTaxable/1.18)) + (Math.ceil(productTotalPrice/1.18)) + (productTotalPrice-Math.ceil(productTotalPrice/1.18))+(serviceTaxable-Math.ceil(serviceTaxable/1.18)))
  
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
              <div class="invoice-head-middle-right text-end">
                <p>
                  <span class="text-bold">Invoice No:</span>
                  {data.invoiceId}
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

                  <li>{data.appointmentDate}</li>
                </ul>
              </div>
              <div class="invoice-head-bottom-right">
                <ul class="text-end">
                  <li class="text-bold">Client Details:</li>
                  <li>{data?.customer?.name}</li>
                  <li>{data.customer.phoneNumber}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="overflow-view">
            <h1 className="text-lg font-bold text-black text-center my-5">SERVICES</h1>
            <div class="">
              <table>
                <thead>
                  <tr>
                    <td class="text-bold">ServiceName</td>
                    <td class="text-bold">Category</td>
                    <td class="text-bold">Rate</td>
                    <td class="text-bold">QTY</td>
                    <td class="text-bold">Employee Name</td>
                  </tr>
                </thead>
                <tbody>
                  {data?.services.map((item, index) => {
                    // 
                    return (
                      <tr>
                        <td>{item.miniSubcategory}</td>
                        <td>{item.category}</td>
                        <td>Rs.{item.price}</td>
                        <td>1</td>
                        <td class="">{
          staffData?.filter((staff)=>staff._id === item.staffId)?.map((data)=>(
            <span>{data.name}</span>
          ))
        }</td>
                      </tr>
                    );
                  })}

                  {/* <!-- <tr>
                                <td colspan="4">10</td>
                                <td>$500.00</td>
                            </tr> --> */}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <table>
              <thead>
              <tr>
                <th>Service Sub Total</th>
                <th>Discount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rs.{serviceTaxable}</td>
                  <td>Rs {data.discount}</td>
                </tr>
              </tbody>
            </table>
          </div>


          <div>
          <h2 className="text-lg font-bold text-black text-center my-5">Tax Break-up</h2>
            <table>
              <thead>
                <tr>
                  <th>Tax Break</th>
                  <th>Taxable</th>
                  <th>CGST Rate</th>
                  <th>CGST Amount</th>
                  <th>SGST Rate</th>
                  <th>SGST Amount</th>
                  <th>Total Payable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SERVICES</td>
                  <td>{serviceFinalTax}</td>
                  <td>9%</td>
                  <td>{CGST.toFixed()}</td>
                  <td>9%</td>
                  <td>{SGST.toFixed()}</td>
                  <td>{servicePayableAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <table>
              <thead>
              <tr>
                <th>(+)Total Tax:</th>
                <th>(+)Payable Amount:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{CGST.toFixed() * 2}</td>
                  <td>Rs.{servicePayableAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          
          {
            data.products.length > 0 && (

              <div>
              <div class="overflow-view">
            <h1 className="text-lg font-bold text-black text-center my-5">PRODUCTS</h1>
            <div class="">
              <table>
                <thead>
                  <tr>
                    <td class="text-bold">productName</td>
                    <td class="text-bold">Brand</td>
                    <td class="text-bold">Rate</td>
                    <td class="text-bold">QTY</td>
                    <td class="text-bold">StaffName</td>
                    <td class="text-bold">subTotal</td>
                  </tr>
                </thead>
                <tbody>
                  {data?.products.map((item, index) => {
                    // 
                    const totalPrice = item.quantity * item.price;
                    return (
                      <tr>
                        <td>{item.name}</td>
                        <td>{item.brand}</td>
                        <td>Rs.{item.price}</td>
                        <td>{item.quantity}</td>
                        <td class="">{
          staffData?.filter((staff)=>staff._id === item.staffId)?.map((data)=>(
            <span>{data.name}</span>
          ))
        }</td>
                        <td class="text-end">{totalPrice}</td>
                      </tr>
                    );
                  })}

                  {/* <!-- <tr>
                                <td colspan="4">10</td>
                                <td>$500.00</td>
                            </tr> --> */}
                </tbody>
              </table>
            </div>
          </div>
          <div class="">
            {/* <h1 className="text-lg font-bold text-black text-center my-5">BILLING:</h1> */}
            <div class="my-8">
              <table>
                {/* <thead>
                            <tr>
                                <td class = "text-bold">ServiceName</td>
                                <td class = "text-bold">Description</td>
                                <td class = "text-bold">Rate</td>
                                <td class = "text-bold">QTY</td>
                                <td class = "text-bold">Employee Name</td>
                            </tr>
                        </thead> */}
                <tbody>
                  <tr>
                    <td> Products Sub Total:</td>
                    <td>Rs.{productTotalPrice}</td>
                  </tr>

                  <tr>
                    <div className="tax-table-container">
                      <h2 className="text-lg font-bold text-black text-center my-8">Tax Break-up</h2>
                      <table>
                        <thead>
                          <tr>
                            <th>Tax Break</th>
                            <th>Taxable</th>
                            <th>CGST Rate</th>
                            <th>CGST Amount</th>
                            <th>SGST Rate</th>
                            <th>SGST Amount</th>
                            <th>Total Payable</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>PRODUCTS</td>
                            <td>{productTotalTaxtable}</td>
                            <td>9%</td>
                            <td>{CGSTProduct.toFixed()}</td>
                            <td>9%</td>
                            <td>{SGSTProduct.toFixed()}</td>
                            <td>{productTotalTaxtable}</td>
                          </tr>
                          {/* Add more rows if needed */}
                        </tbody>
                      </table>
                    </div>
                  </tr>

                  <tr>
                    <td>(+)Total Tax:</td>
                    <td>{SGSTProduct.toFixed() * 2}</td>
                  </tr>
                  <tr>
                    <td>(+)Payable Amount:</td>
                    <td>Rs.{productFinalPayable}</td>
                  </tr>

                  {/* <!-- <tr>
                                <td colspan="4">10</td>
                                <td>$500.00</td>
                            </tr> --> */}
                </tbody>
              </table>
              {/* <div class = "invoice-body-bottom">
                        <div class = "invoice-body-info-item border-bottom">
                            <div class = "info-item-td text-end text-bold">Sub Total:</div>
                            <div class = "info-item-td text-end">$2150.00</div>
                        </div>
                        <div class = "invoice-body-info-item border-bottom">
                            <div class = "info-item-td text-end text-bold">Tax:</div>
                            <div class = "info-item-td text-end">$215.00</div>
                        </div>
                        <div class = "invoice-body-info-item">
                            <div class = "info-item-td text-end text-bold">Total:</div>
                            <div class = "info-item-td text-end">$21365.00</div>
                        </div>
                    </div> */}
            </div>
          </div>
          </div>
            )
          }

          {/* Tax */}

<div class="overflow-view">
            <div class="">
              <table>
                <thead>
                  <tr>
                    <td class="text-bold">Service</td>
                    <td class="text-bold">Service Tax</td>
                    <td class="text-bold">Product</td>
                    <td class="text-bold">Product Tax</td>
                    <td class="text-bold">Total</td>
                    <td class="text-bold">Total Tax</td>
                    <td class="text-bold">Total Payable</td>
                  </tr>
                </thead>
                <tbody>
                 
                      <tr>
                        <td>{Math.ceil(serviceTaxable/1.18)}</td>
                        <td>{serviceTaxable-Math.ceil(serviceTaxable/1.18)}</td>
                        <td>{Math.ceil(productTotalPrice/1.18)}</td>
                        <td>{productTotalPrice-Math.ceil(productTotalPrice/1.18)}</td>
                        <td>{(Math.ceil(serviceTaxable/1.18)) + (Math.ceil(productTotalPrice/1.18))}</td>
                        <td>{(productTotalPrice-Math.ceil(productTotalPrice/1.18))+(serviceTaxable-Math.ceil(serviceTaxable/1.18))}</td>
                        <td>{totalPayableAmount}</td>
                      </tr>
                 
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="overflow-view">
            <h1 className="text-lg font-bold text-black text-center my-5">Payment Method:</h1>
            <div class="">
              <table>
                <thead>
                  <tr>
                    <td class="text-bold">Payment Option</td>
                    <td class="text-bold">Amount</td>
                  </tr>
                </thead>

                <tbody>
                  {paymentMethodsValue.map((item, index) => {
                    
                    return (
                      <tr>
                        <td>{item.name}</td>
                        <td>{item.amount}</td>
                      </tr>
                    );
                  })}
                  {/* <td>Card</td>
                    <td>Rs.4502</td> */}
                </tbody>
              </table>
            </div>

            <div class="">
              <table>
                <thead>
                  <tr>
                    <td class="text-bold">Payment Option</td>
                    <td class="text-bold">Amount</td>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>memberShipused</td>
                    <td>{memberShipDataused}</td>
                  </tr>

                  {/* <td>Card</td>
                    <td>Rs.4502</td> */}
                </tbody>
              </table>
            </div>
          </div>

          <div class="invoice-foot text-center">
            <p>
              <span class="text-bold text-center"></span>Thankyou for availing
              services at Be U-Turning Heads. We hope you had a pleasant
              experience.
            </p>
          </div>
          <button className="bg-green-500 text-white rounded-xl px-6 h-[50px]" onClick={() => toPDF()}>Download PDF</button>
        </div>
      </div>
    </div>
  );
}





// <div class="">
//             {/* <h1 className="text-lg font-bold text-black text-center my-5">BILLING:</h1> */}
//             <div class=" my-8">
//               <table>
//                 <tbody>
                  

//                   <tr>
//                     <div className="tax-table-container">
//                       <h2 className="text-lg font-bold text-black text-center my-5">Tax Break-up</h2>
//                       <table>
//                         <thead>
//                           <tr>
//                             <th>Tax Break</th>
//                             <th>Taxable</th>
//                             <th>CGST Rate</th>
//                             <th>CGST Amount</th>
//                             <th>SGST Rate</th>
//                             <th>SGST Amount</th>
//                             <th>Total Payable</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           <tr>
//                             <td>SERVICES</td>
//                             <td>{serviceFinalTax}</td>
//                             <td>9%</td>
//                             <td>{CGST.toFixed()}</td>
//                             <td>9%</td>
//                             <td>{SGST.toFixed()}</td>
//                             <td>{servicePayableAmount}</td>
//                           </tr>
//                           {/* Add more rows if needed */}
//                         </tbody>
//                       </table>
//                     </div>
//                   </tr>

//                   <tr>
//                     <td>(+)Total Tax:</td>
//                     <td>{CGST.toFixed() * 2}</td>
//                   </tr>
//                   <tr>
//                     <td>(+)Payable Amount:</td>
//                     <td>Rs.{servicePayableAmount}</td>
//                   </tr>

//                   {/* <!-- <tr>
//                                 <td colspan="4">10</td>
//                                 <td>$500.00</td>
//                             </tr> --> */}
//                 </tbody>
//               </table>
//               {/* <div class = "invoice-body-bottom">
//                         <div class = "invoice-body-info-item border-bottom">
//                             <div class = "info-item-td text-end text-bold">Sub Total:</div>
//                             <div class = "info-item-td text-end">$2150.00</div>
//                         </div>
//                         <div class = "invoice-body-info-item border-bottom">
//                             <div class = "info-item-td text-end text-bold">Tax:</div>
//                             <div class = "info-item-td text-end">$215.00</div>
//                         </div>
//                         <div class = "invoice-body-info-item">
//                             <div class = "info-item-td text-end text-bold">Total:</div>
//                             <div class = "info-item-td text-end">$21365.00</div>
//                         </div>
//                     </div> */}
//             </div>
//           </div>