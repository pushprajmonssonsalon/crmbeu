import React, { useEffect, useState } from 'react'
import { MdOutlineClose } from "react-icons/md";
import { getApiCall, postApiData } from '../../utils/services';
import toast from 'react-hot-toast';

const ProductOrderPopup= ({isVisible,onClose,data,orderId}) => {

    console.log({data})
    const [orderData, setOrderData] = useState([]);
    const [allOrderDetails,setAllOrderDetails] = useState({});
    
    useEffect(() => {
        setOrderData(data);
      }, [data]);
    console.log({orderData})
    if(!isVisible) return null;

  const handleQuantityChange = (index, event) => {
    const updatedOrderData = [...orderData];
    updatedOrderData[index].quantity = event.target.value;
    setOrderData(updatedOrderData);
  };
  console.log({orderData})

  const onSubmit=()=>{
    setAllOrderDetails({
        products : orderData,
        id : orderId
    })
    const data = {
        products: orderData,
        id: orderId
    };
    postApiData("purchaseorder/editPurchaseOrder",
    data,
    (resp)=>{
        console.log("orders resp",resp)
        toast.success("Order Has been Placed Successfully!")
    },
    (error)=>{
        console.log("Something went wrong", error)
        toast.error("Somting went wrong!!")
    }
    )
    onClose()
  }
  console.log("all orders",allOrderDetails)
  return (
    <div className='fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div className='absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-scroll'>

            <div className='bg-white p-4 rounded-xl '>
                <div className='flex justify-between font-bold items-center'>
                <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>Edit your orders</h1>
                <button className='text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent' onClick={()=>onClose()}><MdOutlineClose /></button>

                </div>

                {orderData?.length>0 && (
                    <table className="styled-table">
  <thead>
    <tr >
      <th>Name</th>
      <th>Size</th>
      <th>Quantity</th>
    </tr>
  </thead>
  <tbody>
    {orderData?.map((item, index) => (
   
  
      <tr key={index} className="bg-white">
        <td>{item?.name}</td>
        <td>{item?.size}</td>
        <td>
        <input
                        type='number'
                        value={item.quantity}
                        onChange={(event) => handleQuantityChange(index, event)}
                        className='border border-gray-300 rounded-md p-1 w-16 text-center'
                      />
        </td>
      </tr>
    ))}
  </tbody>
</table>
                )}
                <button className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `} onClick={onSubmit}>Received</button>
                
                

            </div>

            

        </div>

    </div>
  )
}

export default ProductOrderPopup