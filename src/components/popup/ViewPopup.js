import { MdOutlineClose } from "react-icons/md";

const ViewPopup = ({
  isVisible,
  isPaid,
  onClose,
  setActiveAppointment,
  activeAppointment,
  onUpdate,
  modal,
  setModal,
}) => {
  const { total, paymentMethod, membershipCreditUsed, _id } = activeAppointment;
  
  // const totalCardUpiCash = parseInt(cash) + parseInt(card) + parseInt(upi);
  const payTotal = total - membershipCreditUsed;
  if (!isVisible) return null;
  const closeModal = () => {
    setModal(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setActiveAppointment((prev) => {
      // Calculate the current sum of all payment methods except the one being updated
      const currentTotal = prev.paymentMethod.reduce((acc, elm) => {
        if (elm.name !== name) {
          return acc + elm.amount;
        }
        return acc;
      }, 0);

      // Calculate the maximum allowable value for the current payment method
      const maxAllowableValue = payTotal - currentTotal;

      return {
        ...prev,
        paymentMethod: prev.paymentMethod.map((elm) => {
          if (elm.name === name) {
            return {
              ...elm,
              amount: Math.min(value, maxAllowableValue), // Ensure the amount doesn't exceed the max allowable value
            };
          } else {
            return elm;
          }
        }),
      };
    });
  };

  const hnadleUpdate = () => {
    onUpdate();
  
  };

  console.log("paymentMethod", paymentMethod ,activeAppointment);

  return (
    <div className="fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-auto">
        <div className="bg-white p-4 rounded-xl ">
          <div className="flex justify-around font-bold items-center">
            <h1 className={`text-blue-500 text-lg font-bold `}>
              PAY : {payTotal}
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
                      disabled={isPaid}
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
          {/* {popupService?.map((item,index)=>(
                     <div className="grid w-full items-center">
                     <label htmlFor="name"><span className='font-bold text-md'>Card :</span></label>
                     <input type="text" placeholder='name' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={item?.name} disabled/>
                     <label htmlFor="name"><span className='font-bold text-md'>Category :</span></label>
                     <input type="text" placeholder='Category' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={item?.category} disabled/>
                     <label htmlFor="email"><span className='font-bold text-md'>Subcategory :</span></label>
                     <input type="email" placeholder='email' id="email" className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={item?.subCategory} disabled/>
                     <label htmlFor="number"><span className='font-bold text-md'>Mrp :</span></label>
                     <input placeholder='MRP' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' defaultValue={item?.mrp} onChange={(e)=>setMrp(e.target.value)} />
                     <label htmlFor="number"><span className='font-bold text-md'>Price :</span></label>
                     <input placeholder='Price' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' defaultValue={item?.price} onChange={(e)=>setPrice(e.target.value)}/>
                 </div>
                ))} */}
          {!isPaid && (
            <button
              className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `}
              onClick={hnadleUpdate}
            >
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPopup;
