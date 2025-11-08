import { MdOutlineClose } from "react-icons/md";
import { formatValue, postApiData } from "../../utils/services";
import { useEffect, useState } from "react";

const ViewPopup = ({
  isVisible,
  isPaid,
  onClose,
  setActiveAppointment,
  activeAppointment,
  onUpdate,
  modal,
  setModal,
  comment = null,
  setComment = () => { }
}) => {
    const gstToken = localStorage.getItem("gstApplied");
  const gstApplied = (gstToken === "true")
  // console.log(activeAppointment,"activeAppointment")
  const { total,subTotal, paymentMethod, membershipCreditUsed, _id, customer } = activeAppointment;
  const [advance, setAdvance] = useState({});
  const [cashback, setCashback] = useState({});
  const [advanceSelected, setAdvanceSelected] = useState({
    selected: false,
    advanceUsed: 0,
  });
  const [cashbackSelected, setCashbackSelected] = useState({
    selected: false,
    cashbackUsed: 0,
  });
  const serviceGst = gstApplied ? formatValue(subTotal * 0.05) : 0;
  const newSubTotal = Math.round(subTotal + serviceGst);
  const payableAmount=((total||0 )- (membershipCreditUsed||0))
  const currentTotal =(total||0)-(newSubTotal||0)
  
  // console.log(payableAmount,currentTotal,"total",total-membershipCreditUsed,subTotal)
  // const totalCardUpiCash = parseInt(cash) + parseInt(card) + parseInt(upi);
  const serviceTotal=(Math.max((newSubTotal - membershipCreditUsed||0) - (advanceSelected?.advanceUsed || 0)-(cashbackSelected?.cashbackUsed||0),0))
  const payTotal = (Math.max((newSubTotal - membershipCreditUsed||0) - (advanceSelected?.advanceUsed || 0)-(cashbackSelected?.cashbackUsed||0), 0)+(currentTotal||0));
  // console.log((subTotal - membershipCreditUsed||0) - (advanceSelected?.advanceUsed || 0)-(cashbackSelected?.cashbackUsed||0),currentTotal)
  useEffect(() => {
    if (customer?._id) {
      const payload = {
        userId: customer?._id,
      }
      postApiData("advance/getAdvance", payload, (res) => {
        if (res) {
          setAdvance(res?.advance);
          setCashback(res?.wallet);

        }

      }, (err) => {

      });
    }


  }, [customer]);

 
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
      const maxAllowableValue = ((payTotal||0) - (currentTotal||0));

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
  const handleAdvance = (e) => {
    const { checked } = e.target;
    setAdvanceSelected((prev) => ({
      ...prev,
      selected: checked ? serviceTotal > 0 && advance?.balance > 0 : false,
      advanceUsed: checked ? (serviceTotal > 0 && advance?.balance > 0) ? Math.min(((newSubTotal||0) - (membershipCreditUsed || 0)-(cashbackSelected?.cashbackUsed||0)), (advance?.balance || 0)) : 0 : 0,
    }));



    if (checked) setActiveAppointment((prev) => {
      return {
        ...prev,
        paymentMethod: prev.paymentMethod.map((elm) => {
          return {
            ...elm,
            amount: 0, // Ensure the amount doesn't exceed the max allowable value
          };

        }),
      };
    });
  }
  const handleCashBack = (e) => {
    const { checked } = e.target;
    setCashbackSelected((prev) => ({
      ...prev,
      selected: checked ? serviceTotal > 0 && cashback?.balance > 0 : false,
      cashbackUsed: checked ? (serviceTotal > 0 && cashback?.balance > 0) ? Math.min(((newSubTotal||0) - (membershipCreditUsed||0)-(advanceSelected?.advanceUsed|| 0)), (cashback?.balance || 0)) : 0 : 0,
    }));



    if (checked) setActiveAppointment((prev) => {
      return {
        ...prev,
        paymentMethod: prev.paymentMethod.map((elm) => {
          return {
            ...elm,
            amount: 0, // Ensure the amount doesn't exceed the max allowable value
          };

        }),
      };
    });
  }


  const hnadleUpdate = () => {

    const payload = {
      userId: customer?._id,
      advanceUsed: advanceSelected?.advanceUsed || 0,
      cashbackUsed:cashbackSelected?.cashbackUsed||0
    };
    onUpdate(payload);

  };


// useEffect(()=>{
//  console.log(cashbackSelected,advanceSelected,"advance")
// },[cashbackSelected,advanceSelected])

  if (!isVisible) return null;
  return (
    <div className='fixed z-30 inset-0 bg-black/20 top-0 left-0 '>
      <div className=' w-[85%] sm:w-[350px] md:w-[450px] bg-white p-4 rounded-xl relative top-[10%] bottom-[10%]   mx-auto max-h-[calc(100%-150px)] overflow-y-auto overflow-x-hidden'>

        <div className="">
          <div className='flex justify-between items-center mb-6'>
            <h1 className={`text-2xl text-black `}> PAY : {payTotal}</h1>
            <button className='text-black text-xl' onClick={onClose}><MdOutlineClose /></button>

          </div>
          <div className="">
           <div className="flex mb-1 items-center justify-between">
            <span className="text-gray-700 uppercase font-medium text-md ">Total</span>
            <span className="text-gray-700 uppercase font-medium text-md ">Rs {payableAmount}</span>
           </div>
           <div className="flex mb-1 items-center justify-between">
            <span className="text-gray-700 uppercase font-medium text-md ">Advance</span>
            <span className="text-green-600 font-medium text-xs">- Rs {advanceSelected?.advanceUsed||0}</span>
           </div>
           <div className="flex mb-1 items-center justify-between">
            <span className="text-gray-700 uppercase font-medium text-md ">Cashback</span>
            <span className="text-green-600 font-medium text-xs">- Rs {cashbackSelected?.cashbackUsed||0}</span>
           </div>
           <div className="flex mb-4 items-center justify-between">
            <span className="text-gray-700 uppercase font-medium text-md ">Payable Amount</span>
            <span className="text-gray-700 uppercase font-medium text-md ">Rs {payTotal}</span>
           </div>
</div>
          <div className="bg-gray-200  p-3  flex items-center justify-between gap-3 ">


            <div className="border-gray-300  focus:ring-blue-500  focus:ring-2">


              <input
                defaultChecked=""
                id="advance"
                type="checkbox"
                value={advanceSelected?.selected}
                checked={advanceSelected?.selected === true}
                onChange={(e) => handleAdvance(e)}
                name="bordered-checkbox"
                className="w-5 h-5 text-blue-600  bg-gray-100  "
              />
            </div>
            <label
              htmlFor="advance"
              className="w-full font-normal cursor-pointer text-black text-md flex items-center justify-between rounded-sm select-none"
            >
              Advance

            </label>
            <div className="flex items-center gap-4 ">
              <h1 className=" whitespace-nowrap text-black text-lg">Rs {advance?.balance || 0} </h1>

            </div>





          </div>
          <div className="bg-gray-200 mt-3  p-3  flex items-center justify-between gap-3 ">


            <div className="border-gray-300  focus:ring-blue-500  focus:ring-2">


              <input
                defaultChecked=""
                id="cashback"
                type="checkbox"
                value={cashbackSelected?.selected}
                checked={cashbackSelected?.selected === true}
                onChange={(e) => handleCashBack(e)}
                name="bordered-checkbox"
                className="w-5 h-5 text-blue-600  bg-gray-100  "
              />
            </div>
            <label
              htmlFor="cashback"
              className="w-full font-normal cursor-pointer text-black text-md flex items-center justify-between rounded-sm select-none"
            >
             Cashback
            </label>
            <div className="flex items-center gap-4 ">
              <h1 className=" whitespace-nowrap text-black text-lg">Rs {cashback?.balance || 0} </h1>

            </div>





          </div>
          <div className="max-h-[calc(100%-110px)] overflow-y-auto overflow-x-hidden">

            <table className="styled-table">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Distribution</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethod?.map((item, index) => (
                  <tr key={index} className="relative">
                    <td className="font-bold capitalize text-lg">{item?.name}</td>
                    <td className="">
                      <div className="flex flex-col gap-2">
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
                        {item.name === "Online" && <>
                          <input
                            value={comment}
                            placeholder="Enter Comment"
                            onChange={(e) => setComment(e.target.value)}
                            type="text"
                            className="py-1 px-2 rounded-[10px] "
                          />

                        </>
                        }

                      </div>


                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {!isPaid && <div className="flex items-center justify-end gap-4 mt-6">
              <button
                className="rounded-[5px] w-[120px] text-sm  border border-ternary text-ternary py-[5px] px-[24px]"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
                onClick={hnadleUpdate}
              >
                Submit
              </button>
            </div>}

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPopup;
