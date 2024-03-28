import React, { useEffect, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md';
import { getApiCall } from '../../utils/services';

const OrderPaymentPopup = ({isVisible,onClose,membership,onUpdatePayment,onPayed}) => {
    console.log("membership ki maa ki chut", membership)
    const [cash, setCash] = useState(0);
  const [card, setCard] = useState(0);
  const [upi, setUpi] = useState(0);
  const totalCardUpiCash=parseInt(cash) + parseInt(card) + parseInt(upi);
  const payTotal = membership
//   const payTotal=payableAmount-membershipPoints
  console.log("payTotal",totalCardUpiCash)

  if(!isVisible) return null;
  
  const hnadleUpdate = () => {
    // onUpdatePayment(cash, card);
    console.log("update payment",totalCardUpiCash,payTotal);

    
  if(totalCardUpiCash===payTotal){
    onUpdatePayment(cash, card, upi);
    onClose();
    onPayed()
  }
 // Close the modal after updating
  };
  

    // const closeModal = () => {
    //     setModal(false);
    //   };
      
      
    //   const hnadleUpdate = () => {
    //     // onUpdatePayment(cash, card);
    //     console.log("update payment",totalCardUpiCash,payTotal);
    
        
    //   if(totalCardUpiCash===payTotal){
    //     onUpdatePayment(cash, card, upi);
    //     onClose();
    //   }
    //  // Close the modal after updating
    //   };
    //   console.log("membershipPoints",membershipPoints)
  return (
    <div className='fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div className='absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-scroll'>

            <div className='bg-white p-4 rounded-xl '>
                <div className='flex justify-around font-bold items-center'>
                <h1 className={`text-blue-500 text-lg font-bold `}>PAY : {membership}</h1>
                <button className='text-3xl font-bold  text-red-600 hover:text-red-900 bg-transparent ' onClick={()=>onClose()}><MdOutlineClose /></button>
                </div>

                <table className="styled-table">
  <thead>
    <tr>
      <th >Payment Method</th>
      <th >Distribution</th>
    </tr>
  </thead>
  <tbody>
  <tr>
                  <td className="font-bold text-lg">Card</td>
                  <td><input type="number" className="w-[250px] outline-none "
                  value={card}
                  onChange={(e)=>setCard(e.target.value)}/></td>
                </tr>
                <tr>
                  <td className="font-bold text-lg">Cash</td>
                  <td><input type="number" className="w-[250px] outline-none "
                   value={cash}
                   onChange={(e)=>setCash(e.target.value)}/></td>
                </tr>
                <tr>
                  <td className="font-bold text-lg">Upi</td>
                  <td><input type="number" className="w-[250px] outline-none "
                  value={upi}
                  onChange={(e)=>setUpi(e.target.value)}/></td>
                </tr>
  </tbody>
</table>
                <button className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `} onClick={hnadleUpdate}>Update</button>
        </div>
            </div>
    </div>
  )
}

export default OrderPaymentPopup