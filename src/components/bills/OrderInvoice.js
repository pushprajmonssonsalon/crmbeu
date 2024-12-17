import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { getApiCall } from "../../utils/services";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const OrderBill = () => {
  const location = useLocation();
  const orderList = location.state;

  const contentToPrint = useRef(null);
  const [parlorDetails, setParlorDetails] = useState([]);
  const currentDate = new Date();
  const formattedDate = currentDate.toDateString();

  useEffect(() => {
    getApiCall(
      "parlor/getParlorDetail",
      (resp) => {
        setParlorDetails(resp);
      },
      (error) => {}
    );
  }, []);

  function FormatDate(date) {
    const dates = new Date(date);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDate = formatter.format(dates);

    return formattedDate;
  }
  const handlePrint = useReactToPrint({
    documentTitle: "Apointment Bill",

    removeAfterPrint: true,
  });
  function handleChange(current) {
    const doc = new jsPDF();
    doc.html(current, {
      html2canvas: { scale: 2 / 13, autoPaging: true },
      callback: (pdf) => {
        const pdfData = pdf.output("blob");
        const uniqueId = uuidv4();
        const s3 = new AWS.S3({
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
          region: process.env.REACT_APP_AWS_REGION,
        });

        const params = {
          Bucket: "tphpdfs",
          Key: `uploaded/pdf_${uniqueId}.pdf`,
          Body: pdfData,
          ContentType: "application/pdf",
          ACL: "public-read",
        };

        s3.upload(params, (err, data) => {
          if (err) {
            console.error("Error uploading PDF to S3:", err);
          } else {
          }
        });
      },
    });
  }

  return (
    <>
      <div
        className="px-5 py-4 flex flex-col w-[90%] mx-auto"
        ref={contentToPrint}
      >
        <div className="border-b-2 border-dotted border-black">
          <h1 className="text-center text-2xl font-bold text-black mb-4">
            SMART SALON
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
          <h2 className="text-lg font-semibold text-black mb-2">
            Contact No. - {parlorDetails.contactNumber}
          </h2>
        </div>
        <div className="my-2 mx-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-black font-medium">Date:</div>
            <div className="text-black font-medium text-right">
              {FormatDate(orderList.createdAt)}
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <div className="mt-2">
          <h1 className="text-center text-2xl font-bold bg-black text-white mb-4 p-2">
            ORDERS
          </h1>
          <table>
            <thead>
              <tr>
                <th class="text-bold">Name</th>
                <th class="text-bold">SIZE</th>
                <th class="text-bold">ORDERED QUANTITY</th>
                <th class="text-bold">RECIEVED QUANTITY</th>
              </tr>
            </thead>
            <tbody>
              {orderList?.products?.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.size}</td>
                  <td>{item.orderedQuantity}</td>
                  <td>{item.receivedQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAYMENT DETIALS  */}
        {/* <div className='my-2 '>
            <h1 className='text-center text-2xl font-bold bg-black text-white mb-4'>PAYMENT DETAILS</h1>
            <div className='grid grid-cols-2 gap-3'>
            <div className='text-black font-medium'>Net Payable Amount:</div>
            <div className='text-black font-medium text-right'>Rs {totalPayableAmount}</div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Payment Options</th>
                    <th>Amount</th>
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
            </tbody>
        </table>
        </div> */}
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
          handleChange(contentToPrint.current);
        }}
        className="w-full my-4"
      >
        PRINT
      </button>
    </>
  );
};

export default OrderBill;
