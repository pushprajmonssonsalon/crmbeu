import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import { getApiCall, postApiData } from "../../utils/services";
import BillTables from "../MaterialTable/billTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ConstructionOutlined } from "@mui/icons-material";


const AppointmentBills = () => {
  const location = useLocation();
  const contentToPrint = useRef(null);

  const [parlorDetails, setParlorDetails] = useState([]);
  const [staffData, setStaffData] = useState([]);
  useEffect(() => {
    getApiCall(
      "owner/getStaff",
      (res) => {
        setStaffData(res);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, []);
  
  console.log({ staffData });
  const data = location.state;
  console.log("dede bhaii data", data);
  console.log("dataitem", data.services);
  console.log("productdataitem", data.products);
  function FormatDate(date) {
    const dates = new Date(date);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDate = formatter.format(dates);

    return formattedDate;
  }
  const memberShipDataused = data?.membershipCreditUsed;
  const paymentMethodsValue = data?.paymentMethod;
  const currentDate = new Date();
  const formattedDate = currentDate.toDateString();

  const serviceTotal = data.services.reduce((accumulator, { price }) => {
    return accumulator + price;
  }, 0);
  console.log("serviceTotal", serviceTotal);

  const serviceDiscount = data.discount;
  const serviceTaxable = serviceTotal - serviceDiscount;
  const serviceFinalTax = Math.ceil(serviceTaxable / 1.18);
  const CGST = ((serviceFinalTax * 9) / 100).toFixed(2);
  const SGST = ((serviceFinalTax * 9) / 100).toFixed(2);
  const servicePayableAmount = Math.floor(Number(serviceFinalTax) + Number(CGST) + Number(SGST))
  
  // const productSubtotalAmount=data.products;
  const productTotalPrice = data.products.reduce(
    (accumulator, { price, quantity }) => {
      return accumulator + quantity * price;
    },
    0
  );
  console.log("productTotalPrice", productTotalPrice);
  const productTotalTaxtable = Math.ceil(productTotalPrice / 1.18);
  const CGSTProduct = (productTotalTaxtable * 9) / 100;
  const SGSTProduct = (productTotalTaxtable * 9) / 100;
  // const paytax = Math.ceil(data.total / 1.18);
  const productFinalPayable = Math.ceil(productTotalTaxtable + CGSTProduct + SGSTProduct)

  // const taxableTotalamountPay = Math.ceil((paytax + CGST + SGST).toFixed());
  useEffect(() => {
    getApiCall(
      "parlor/getParlorDetail",
      (resp) => {
        console.log("getparlour", resp);
        setParlorDetails(resp);
        // parlorDetails(resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, []);
  console.log("parlorDetails",parlorDetails.name);
  const paytax = Math.ceil(data.total / 1.18);
  // const CGST = (paytax * 9) / 100;
  // const SGST = (paytax * 9) / 100;
  const taxableTotalamountPay = Math.ceil((paytax + CGST + SGST)).toFixed(2);

  const totalPayableAmount =
    Math.ceil(serviceTaxable / 1.18) +
    Math.ceil(productTotalPrice / 1.18) +
    (productTotalPrice - Math.ceil(productTotalPrice / 1.18)) +
    (serviceTaxable - Math.ceil(serviceTaxable / 1.18));
  const serviceHeadings = [
    "Service Name",
    "Category",
    "Rate",
    "QTY",
    "Employee Name",
  ];

  const handlePrint = useReactToPrint({
    documentTitle: "Apointment Bill",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });
  function handleChange(current)  {
    console.log("uploaded to s3 bucket")
    const doc = new jsPDF();
    doc.html(current, {
      html2canvas: { scale: 1/8, autoPaging: true },
      callback: (pdf) => {
        const pdfData = pdf.output('blob');
        const uniqueId = uuidv4();
        const s3 = new AWS.S3({
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY ,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY ,
          region: process.env.REACT_APP_AWS_REGION ,
        });
  
        const params = {
          Bucket: 'tphpdfs',
          Key: `uploaded/pdf_${uniqueId}.pdf`,
          Body: pdfData,
          ContentType: 'application/pdf',
          ACL: 'public-read',
        };
  
        s3.upload(params, (err, data1) => {
          if (err) {
            console.error('Error uploading PDF to S3:', err);
          } else {
            const datas = {
              appointmentId:data?._id,
              invoiceUrl:data1.Location,
              salonName: parlorDetails.name
            }
            console.log('PDF uploaded successfully to S3:', data1.Location);
            postApiData("appointment/printAndSendInvoiceOfAppointment",
            datas,
            (resp)=>{
              console.log("Pdf has been send through message",resp)
            },
            (err)=>{
              console.log("Error in sending message",err)
            }
          )
          }
        });
      },
    });
  };

  return (
    <>
      <div
        className="px-5 py-4 flex flex-col w-full mx-auto"
        ref={contentToPrint}
      >
        <div className="border-b-2 border-dotted border-black">
          <h1 className="text-center text-2xl font-bold text-black mb-4">
            {parlorDetails.name}
          </h1>
          <h2 className="text-lg font-semibold text-black">
            {parlorDetails.address}
          </h2>
          <h2 className="text-lg font-semibold text-black">
            {parlorDetails.address2}
          </h2>
          <h2 className="text-lg font-semibold text-black">
            {parlorDetails.stateName}
          </h2>
          <h2 className="text-lg font-bold text-black mb-2">
           Contact No. - {parlorDetails.contactNumber}
          </h2>
          <h2 className="text-lg font-bold text-black mb-2">
          GST No - {parlorDetails?.gstNumber}
          </h2>
        </div>
        <div className="my-2 mx-4">
          <h1 className="text-center text-2xl font-bold text-black mb-4">
            TAX INVOICE
          </h1>
       
         
          <div className="grid grid-cols-2 gap-3">
            <div className="text-black font-medium">Invoice No:</div>
            <div className="text-black font-medium text-right">
              {data.invoiceId}
            </div>
            <div className="text-black font-medium">Date:</div>
            <div className="text-black font-medium text-right">
              {FormatDate(data.appointmentDate)}
            </div>
          </div>
        </div>
        {/* CUSTOMER DETAILS  */}
        <div className="mt-2">
          <h1 className="text-center text-2xl font-bold bg-black text-white mb-4 p-2">
            CUSTOMER DETAILS
          </h1>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-black font-medium">Name:</div>
            <div className="text-black font-medium text-right">
              {data?.customer?.name}
            </div>
            <div className="text-black font-medium">Contact No:</div>
            <div className="text-black font-medium text-right">
              {data.customer.phoneNumber}
            </div>
          </div>
        </div>
        {/* Membership  */}
        {
          data?.membershipCreditUsed > 0 && (
        <div className="mt-2">
          <h1 className="text-center text-2xl font-bold bg-black text-white mb-4 p-2">
            MEMBERSHIP DETAILS
          </h1>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-black font-medium">Name:</div>
            <div className="text-black font-medium text-right">
              {data?.userMembership?.name}
            </div>
            <div className="text-black font-medium">Amount:</div>
            <div className="text-black font-medium text-right">
              {data?.userMembership?.amount}
            </div>
            <div className="text-black font-medium">Coins Left:</div>
            <div className="text-black font-medium text-right">
              {data?.userMembership?.creditsLeft}
            </div>
          </div>
        </div>
          )
        }
        {/* SERVICES */}
        <div className="mt-2">
          <h1 className="text-center text-2xl font-bold bg-black text-white mb-4 p-2">
            SERVICES
          </h1>
          <table>
            <thead>
              <tr>
                <th class="text-bold text-black">ServiceName</th>
                <th class="text-bold text-black">Category</th>
                <th class="text-bold text-black">Rate</th>
                <th class="text-bold text-black">Employee Name</th>
              </tr>
            </thead>
            <tbody className="text-black font-medium">
              {data.services.map((item, index) => (
                <tr key={index}>
                  <td>{item.miniSubcategory}</td>
                  <td>{item.category}</td>
                  <td>Rs.{item.price}</td>
                  <td class="">
                    {staffData
                      ?.filter((staff) => staff._id === item.staffId)
                      ?.map((data) => (
                        <span>{data.name}</span>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="text-black font-medium ">Serive Total:</div>
            <div className="text-black font-medium text-right">
              Rs.{serviceTotal}
            </div>
          </div>
          {/* SERVICE DISCOUNT */}
          <div className="mt-2">
            <h1 className="text-center text-2xl font-bold bg-black text-white mb-4 p-2 ">
              SERVICE DISCOUNT
            </h1>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-black font-medium">Discount:</div>
              <div className="text-black font-medium text-right">
                Rs {data.discount}
              </div>
              <div className="text-black font-medium">Taxable Service:</div>
              <div className="text-black font-medium text-right">
                Rs {serviceFinalTax}
              </div>
              <div className="text-black font-medium">CGST @ 9:</div>
              <div className="text-black font-medium text-right">
                {CGST}
              </div>
              <div className="text-black font-medium">SGST @ 9:</div>
              <div className="text-black font-medium text-right">
                {SGST}
              </div>
              <div className="text-black font-medium">Total:</div>
              <div className="text-black font-medium text-right">
                Rs {servicePayableAmount}
              </div>
            </div>
          </div>
        </div>
        {/* PRODUCTS */}
        {data?.products.length > 0 && (
          <div className="mt-2">
            <h1 className="text-center text-2xl font-bold bg-black text-white mb-4 p-2">
              PRODUCTS
            </h1>
            <table>
              <thead>
                <tr>
                  <th class="text-bold">productName</th>
                  <th class="text-bold">Brand</th>
                  <th class="text-bold">Rate</th>
                  <th class="text-bold">QTY</th>
                  <th class="text-bold">StaffName</th>
                  <th class="text-bold">subTotal</th>
                </tr>
              </thead>
              <tbody>
                {data?.products.map((item, index) => {
                  // console.log("itemdata",item)
                  const totalPrice = item.quantity * item.price;
                  return (
                    <tr>
                      <td>{item.name}</td>
                      <td>{item.brand}</td>
                      <td>Rs.{item.price}</td>
                      <td>{item.quantity}</td>
                      <td class="">
                        {staffData
                          ?.filter((staff) => staff._id === item.staffId)
                          ?.map((data) => (
                            <span>{data.name}</span>
                          ))}
                      </td>
                      <td class="text-end">{totalPrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* PRODUCT DISCOUNT  */}
            <div className="mt-2">
              <h1 className="text-center text-2xl font-bold bg-black text-white mb-4 p-2">
                PRODUCT DISCOUNT
              </h1>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-black font-medium">Taxable Service:</div>
                <div className="text-black font-medium text-right">
                  Rs {productTotalTaxtable}
                </div>
                <div className="text-black font-medium">CGST @ 9:</div>
                <div className="text-black font-medium text-right">
                  {CGSTProduct.toFixed()}
                </div>
                <div className="text-black font-medium">SGST @ 9:</div>
                <div className="text-black font-medium text-right">
                  {SGSTProduct.toFixed()}
                </div>
                <div className="text-black font-medium">Total:</div>
                <div className="text-black font-medium text-right">
                  Rs {productFinalPayable}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT DETIALS  */}
        <div className="my-2 ">
          <h1 className="text-center text-2xl font-bold bg-black text-white mb-4 p-2">
            PAYMENT DETAILS
          </h1>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-black font-medium">Net Payable Amount:</div>
            <div className="text-black font-medium text-right">
              Rs {totalPayableAmount}
            </div>
          </div>
          <table>
            <thead>
              <tr className="text-black">
                <th>Payment Options</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethodsValue.map((item, index) => {
                console.log("item", item);
                return (
                  <tr className="text-black font-medium">
                    <td>{item.name}</td>
                    <td>{item.amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-2 border-t-2 border-black border-dotted">
          <h1 className="text-center text-lg font-bold  text-black mb-4">
            *** THANK YOU ***
          </h1>
          <h1 className="text-center text-lg font-bold  text-black mb-4">
            We Look Forward to Your Next Visit
          </h1>
          <h1 className="text-center text-lg font-bold  text-black mb-4">
            Now Shop Your Favorite Home Care
          </h1>
          <h1 className="text-center text-lg font-bold  text-black mb-4">
            Products at https://prosaloncart.com/
          </h1>
        </div>
      </div>
      <button
        onClick={() => {
          handlePrint(null, () => contentToPrint.current);
          // handleChange(contentToPrint.current);
        }}
        className="w-full my-4"
      >
        PRINT
      </button>
    </>
  );
};

export default AppointmentBills;
