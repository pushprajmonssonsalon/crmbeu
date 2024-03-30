import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import { getApiCall } from '../../utils/services';

const OrderBill = () => {
    const location = useLocation();
    const orderList = location.state;
    console.log("order invoice list", orderList)
    const [parlorDetails,setParlorDetails] = useState([])
    const currentDate = new Date();
  const formattedDate = currentDate.toDateString();

    useEffect(() => {
        getApiCall(
          "parlor/getParlorDetail",
          (resp) => {
            console.log("getparlour", resp);
            setParlorDetails(resp);
          },
          (error) => {
            console.log("error", error);
          }
        );
      }, []);
      console.log("parlor detail list",parlorDetails)
  return (
    <div className='px-5 py-4 flex flex-col w-1/2 mx-auto'>
        <div className='border-b-2 border-dotted border-black'>
            <h1 className='text-center text-2xl font-bold text-black mb-4'>SMART SALON</h1>
            <h2 className='text-lg font-semibold text-black'>{parlorDetails.address}</h2>
            <h2 className='text-lg font-semibold text-black'>{parlorDetails.address2}</h2>
            <h2 className='text-lg font-semibold text-black'>{parlorDetails.stateName}</h2>
            <h2 className='text-lg font-semibold text-black mb-2'>Phone No. - {parlorDetails.contactNumber}</h2>
        </div>
        <div className='my-2 mx-4'>
    
        <div className='grid grid-cols-2 gap-3'>
            
            <div className='text-black font-medium'>Date:</div>
            <div className='text-black font-medium text-right'>{formattedDate}</div>
        </div>
        </div>
        
        {/* SERVICES */}
        <div className='mt-2'>
            <h1 className='text-center text-2xl font-bold bg-black text-white mb-4'>ORDERS</h1>
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
                {
    orderList?.products?.map((item)=>(
        <tr key={item._id}>
        <td>{item.name}</td>
        <td>{item.size}</td>
        <td>{item.orderedQuantity}</td>
        <td>{item.receivedQuantity}</td>
        </tr>
    ))
   }
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
                    console.log("item", item);
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
        <div className='mt-2 border-t-2 border-black border-dotted'>
        <h1 className='text-center text-lg font-bold  text-black mb-4'>*** THANK YOU ***</h1>
        <h1 className='text-center text-lg font-bold  text-black mb-4'>We Look Forward to Your Next Visit</h1>
        <h1 className='text-center text-lg font-bold  text-black mb-4'>Now Shop Your Favorite Home Care</h1>
        <h1 className='text-center text-lg font-bold  text-black mb-4'>Products at https://prosaloncart.com/</h1>
        </div>
    </div>
  )
}

export default OrderBill