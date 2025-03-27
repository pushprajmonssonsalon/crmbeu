import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router';
import { formatDateToFull, getApiCall } from '../../utils/services';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import salonLogo from "../../images/logo2.png";


const AdvanceInvoice = () => {
    const location = useLocation();
    const membershipData = location.state;
    
    const contentToPrint = useRef(null);
    // parlor details
    const [parlorDetails, setParlorDetails] = useState([]);
    const currentDate = new Date();
  const formattedDate = currentDate.toDateString();
  const paymentMethodsValue = membershipData?.paymentMethod;

  

  //values 

  const customerName = membershipData?.customerName||"";
  const customerPhoneNumber = membershipData?.customerPhoneNumber||""; 
  const Total = membershipData?.amount;

  

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
    
      const handlePrint = useReactToPrint({
        documentTitle: "Membership Bill",
       
        // handleChange : () =>handleChange(),
        removeAfterPrint: true,
      });

   


  return (
    <>
 
    <div className='px-5 py-4 flex flex-col w-[90%] mx-auto' ref={contentToPrint}>
    <div className=" bg-white mb-5  flex h-full justify-center items-center">
            <img
              src={salonLogo}
              alt=""
              className="h-[100px] w-[150px]    text-white"
            />
          </div>
        <div className='border-b-2 border-dotted border-black'>
            <h1 className='text-center text-2xl font-bold text-black mb-4'>{parlorDetails.name}</h1>
            <h2 className='text-lg font-semibold text-black'>{parlorDetails.address}</h2>
            <h2 className='text-lg font-semibold text-black'>{parlorDetails.address2}</h2>
            <h2 className='text-lg font-semibold text-black'>{parlorDetails.stateName}</h2>
            <h2 className='text-lg font-semibold text-black mb-2'>Contact No. - {parlorDetails.contactNumber}</h2>
        </div>
        <div className='my-2 mx-4'>
        <h1 className='text-center text-2xl font-bold text-black mb-4'>ADVANCE SLIP</h1>
        <div className='grid grid-cols-2 gap-3'>
           
            <div className='text-black font-medium'>Date:</div>
            <div className='text-black font-medium text-right'>{formatDateToFull(membershipData?.createdAt)}</div>
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
            <h1 className='text-center text-2xl font-bold bg-black text-white mb-4 p-2'>ADVANCE</h1>
            <div className='grid grid-cols-2 gap-3'>

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
      }} 
      className="w-full bg-green-600 text-white my-4"
      >
        PRINT
      </button>
    </>
  )
}

export default AdvanceInvoice