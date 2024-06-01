import React, { useEffect, useState,useRef } from 'react'
import { useLocation } from 'react-router';
import { getApiCall, postApiData } from '../../utils/services';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';


const MembershipBill = () => {
    const location = useLocation();
    const membershipData = location.state;
    console.log({membershipData})
    const contentToPrint = useRef(null);
    // parlor details
    const [parlorDetails, setParlorDetails] = useState([]);
    const currentDate = new Date();
  const formattedDate = currentDate.toDateString();
  const paymentMethodsValue = membershipData?.paymentMethod;

  

  //values 

  const customerName = membershipData.customerName;
  const customerPhoneNumber = membershipData.customerPhoneNumber
  const employees = membershipData.employees.name
  const membershiptype = membershipData.name
  const price = membershipData.price
  const GST = price-Math.ceil(price/1.18);
  const Total = Math.ceil(price/1.18)+GST;
  const credits = membershipData.credits

  const data = [customerName,customerPhoneNumber,employees,membershiptype,price,GST,Total]
  console.log("dataaaaaaa------------",data)

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
    function FormatDate(date) {
        const dates = new Date(date)
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(dates);
      
        return formattedDate;
      }

      const handlePrint = useReactToPrint({
        documentTitle: "Membership Bill",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        // handleChange : () =>handleChange(),
        removeAfterPrint: true,
      });

      function handleChange(current)  {
        console.log("uploaded to s3 bucket")
        const doc = new jsPDF();
        doc.html(current, {
          html2canvas: { scale: 2/13, autoPaging: true },
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
      
            s3.upload(params, (err, data) => {
              if (err) {
                console.error('Error uploading PDF to S3:', err);
              } else {
                const payload = {
                  id:membershipData._id,
                  invoiceUrl:data.Location,
                  customerName:membershipData.customerName,
                  customerPhoneNumber:membershipData.customerPhoneNumber,
                  salonName:parlorDetails.name
                }
                postApiData(
                  "membership/sendMembershipInvoice",
                  payload,
                  (resp)=>{
                    console.log("membership pdf has been uploaded ",resp)
                  },
                  (error)=>{
                    console.log("Something error in uploading membership pdf",error)
                  }
                )
                console.log('PDF uploaded successfully to S3:', data.Location);
              }
            });
          },
        });
      };

    const headings = ["NAME","PHONE NO.","EMPLOYEE","MEMBERSHIP NAME","PRICE","GST","TOTAL"]

  return (
    <>
 
    <div className='px-5 py-4 flex flex-col w-[90%] mx-auto' ref={contentToPrint}>
        <div className='border-b-2 border-dotted border-black'>
            <h1 className='text-center text-2xl font-bold text-black mb-4'>{parlorDetails.name}</h1>
            <h2 className='text-lg font-semibold text-black'>{parlorDetails.address}</h2>
            <h2 className='text-lg font-semibold text-black'>{parlorDetails.address2}</h2>
            <h2 className='text-lg font-semibold text-black'>{parlorDetails.stateName}</h2>
            <h2 className='text-lg font-semibold text-black mb-2'>Contact No. - {parlorDetails.contactNumber}</h2>
        </div>
        <div className='my-2 mx-4'>
        <h1 className='text-center text-2xl font-bold text-black mb-4'>TAX INVOICE</h1>
        <div className='grid grid-cols-2 gap-3'>
            <div className='text-black font-medium'>Invoice No:</div>
            <div className='text-black font-medium text-right'>{membershipData.invoiceId}</div>
            <div className='text-black font-medium'>Date:</div>
            <div className='text-black font-medium text-right'>{FormatDate(membershipData?.createdAt)}</div>
        </div>
        </div>
        {/* CUSTOMER DETAILS  */}
        <div className='mt-2'>
            <h1 className='text-center text-2xl font-bold bg-black text-white mb-4 p-2'>CUSTOMER DETAILS</h1>
            <div className='grid grid-cols-2 gap-3'>
            <div className='text-black font-medium'>Name:</div>
            <div className='text-black font-medium text-right'>{customerName}</div>
            <div className='text-black font-medium'>Contact No:</div>
            <div className='text-black font-medium text-right'>{customerPhoneNumber}</div>
        </div>
        </div>
        
     
            <div className='mt-2'>
        <div className='mt-2'>
            <h1 className='text-center text-2xl font-bold bg-black text-white mb-4 p-2'>MEMBERSHIP</h1>
            <div className='grid grid-cols-2 gap-3'>
            <div className='text-black font-medium'>Name:</div>
            <div className='text-black font-medium text-right'>{membershiptype}</div>
            <div className='text-black font-medium'>Coins:</div>
            <div className='text-black font-medium text-right'>{credits}</div>
            <div className='text-black font-medium'>Price:</div>
            <div className='text-black font-medium text-right'>{Math.ceil(price/1.18)}</div>
            <div className='text-black font-medium'>GST:</div>
            <div className='text-black font-medium text-right'>{GST}</div>
            <div className='text-black font-medium'>Total:</div>
            <div className='text-black font-medium text-right'>Rs {Total}</div>
        </div>
        </div>
        </div>
        
        {/* PAYMENT DETIALS  */}
        <div className='my-2 '>
            <h1 className='text-center text-2xl font-bold bg-black text-white mb-4 p-2'>PAYMENT DETAILS</h1>
            <div className='grid grid-cols-2 gap-3'>
            <div className='text-black font-medium'>Net Payable Amount:</div>
            <div className='text-black font-medium text-right'>Rs {Total}</div>
        </div>
       
        </div>
        <div className='mt-2 border-t-2 border-black border-dotted'>
        <h1 className='text-center text-lg font-bold  text-black mb-4'>*** THANK YOU ***</h1>
        <h1 className='text-center text-lg font-bold  text-black mb-4'>We Look Forward to Your Next Visit</h1>
        <h1 className='text-center text-lg font-bold  text-black mb-4'>Now Shop Your Favorite Home Care</h1>
        <h1 className='text-center text-lg font-bold  text-black mb-4'>Products at https://prosaloncart.com/</h1>
        </div>
    </div>
    <button onClick={() => {
        handlePrint(null, () => contentToPrint.current);
        handleChange(contentToPrint.current);
      }} className='w-full my-4'>
        PRINT
      </button>
    </>
  )
}

export default MembershipBill