import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

const OrderPaymentPopup = ({
  isVisible,
  onClose,
  membership,
  onUpdatePayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState([
    {
      name: "Cash",
      amount: 0,
    },
    {
      name: "Upi",
      amount: 0,
    },
    {
      name: "Card",
      amount: 0,
    },
    {
      name: "Online",
      amount: 0,
    },
  ]);

  const payTotal = membership;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentMethod((prev) => {
      // Calculate the current sum of all payment methods except the one being updated
      const currentTotal = prev.reduce((acc, elm) => {
        if (elm.name !== name) {
          return acc + elm.amount;
        }
        return acc;
      }, 0);

      

      // Calculate the maximum allowable value for the current payment method
      const maxAllowableValue = payTotal - currentTotal;

      return prev.map((elm) => {
        if (elm.name === name) {
          return {
            ...elm,
            amount: Math.min(value, maxAllowableValue), // Ensure the amount doesn't exceed the max allowable value
          };
        } else {
          return elm;
        }
      });
    });
  };

  //   const payTotal=payableAmount-membershipPoints

  if (!isVisible) return null;

  const hnadleUpdate = () => {
    // onUpdatePayment(cash, card);
    const totalCardUpiCash = paymentMethod.reduce((acc, elm) => {
      return acc + elm.amount;
    }, 0);

    if (totalCardUpiCash === payTotal) {
      onUpdatePayment(paymentMethod);
      onClose();
    }
    // Close the modal after updating
  };

  // const closeModal = () => {
  //     setModal(false);
  //   };

  //   const hnadleUpdate = () => {
  //     // onUpdatePayment(cash, card);
  //     

  //   if(totalCardUpiCash===payTotal){
  //     onUpdatePayment(cash, card, upi);
  //     onClose();
  //   }
  //  // Close the modal after updating
  //   };
  //   
  return (
    <div className="fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-auto">
        <div className="bg-white p-4 rounded-xl ">
          <div className="flex justify-between  items-center">
            <h1 className={`text-gray2 text-lg  `}>
              PAY : ₹{membership}
            </h1>
            <button
              className="text-3xl font-bold  text-red-600 hover:text-red-900 bg-transparent "
              onClick={() => onClose()}
            >
              <MdOutlineClose />
            </button>
          </div>

          <table className="styled-table">
            <thead>
              <tr>
                <th>Payment Method</th>
                <th>Distribution</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethod?.map((item, index) => (
                <tr key={index}>
                  <td className="font-bold capitalize text-lg">{item?.name}</td>
                  <td>
                    <input
                      name={item.name}
                      type="number"
                      min={0}
                      max={payTotal}
                      className="w-[250px] outline-none "
                      value={item?.amount}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className='bg-black text-white rounded-[16px] w-[100px] text-sm font-normal '
            onClick={hnadleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentPopup;
