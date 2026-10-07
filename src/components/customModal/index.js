import React, { useState } from "react";
import Modal from "react-modal";
import { RxCross2 } from "react-icons/rx";

export default function CustomModal({
  modal,
  setModal,
  payableAmount,
  onUpdatePayment,
  membershipPoints,
  
}) {
  const [cash, setCash] = useState(0);
  const [card, setCard] = useState(0);
  const [upi, setUpi] = useState(0);
  const totalCardUpiCash=parseInt(cash) + parseInt(card) + parseInt(upi);
  const payTotal=payableAmount-membershipPoints
  

  // const []
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      border:'2px solid gray',
      borderRadius: "20px",
      opacity: "1"
     
    },
  };
  const closeModal = () => {
    setModal(false);
  };
  
  
  const hnadleUpdate = () => {
    // onUpdatePayment(cash, card);
    

    
  if(totalCardUpiCash===payTotal){
    onUpdatePayment(cash, card, upi);
    closeModal();
  }
 // Close the modal after updating
  };
  
  return (
    // {
    // modal &&
    // selectedOptions.length>=2 &&
    <div  className="">
      <Modal
        isOpen={modal}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{  backgroundColor: "" }} className="px-4 w-full shadow-inner p-4 rounded-xl">
          <div
            style={{ display: "flex", border: 1, justifyContent: "flex-end" }}
            // onClick={setModal(false)}
          >
            <RxCross2/>
          </div>

          <p
            className="text-2xl text-center font-bold mb-3"
          >
            Payment Distribution of Rs {payTotal}
          </p>
          <div className="table-responsive">

       
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
                  <td><input type="number" className="w-full max-w-[250px] outline-none "
                  value={card}
                  onChange={(e)=>setCard(e.target.value)}/></td>
                </tr>
                <tr>
                  <td className="font-bold text-lg">Cash</td>
                  <td><input type="number" className="w-full max-w-[250px] outline-none "
                   value={cash}
                   onChange={(e)=>setCash(e.target.value)}/></td>
                </tr>
                <tr>
                  <td className="font-bold text-lg">Upi</td>
                  <td><input type="number" className="w-full max-w-[250px] outline-none "
                  value={upi}
                  onChange={(e)=>setUpi(e.target.value)}/></td>
                </tr>
  </tbody>
</table>

</div>
        
          <button
            style={{
              height: "40px",
              borderRadius: "20px solid grey",
              width: "150px",
              backgroundColor: "black",
              marginTop:'10px'
            }}
            onClick={hnadleUpdate}
          >
            <label
              style={{ color: "white", fontSize: "14px", fontWeight: "500" }}
            >
              Update
            </label>
          </button>
        </div>
      </Modal>
    </div>

    //   }
  );
}
