import { MdOutlineClose } from "react-icons/md";
import { postApiData } from "../../utils/services";
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
  const { total, paymentMethod, membershipCreditUsed, _id, customer } = activeAppointment;
  const [advance, setAdvance] = useState({});
  const [advanceSelected, setAdvanceSelected] = useState({
    selected: false,
    advanceUsed: 0,
  });
  // const totalCardUpiCash = parseInt(cash) + parseInt(card) + parseInt(upi);
  const payTotal = (Math.max((total - membershipCreditUsed) - (advanceSelected?.advanceUsed > 0 ? advanceSelected?.advanceUsed : 0), 0));
  useEffect(() => {
    if (customer?._id) {
      const payload = {
        userId: customer?._id,
      }
      postApiData("advance/getAdvance", payload, (res) => {
        if (res) {
          setAdvance(res);

        }

      }, (err) => {

      });
    }


  }, [customer]);
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
  const handleAdvance = (e) => {
    const { checked } = e.target;
    setAdvanceSelected((prev) => ({
      ...prev,
      selected: checked ? payTotal > 0 && advance?.balance > 0 : false,
      advanceUsed: checked ? (payTotal > 0 && advance?.balance > 0) ? Math.min((total - membershipCreditUsed || 0), advance?.balance || 0) : 0 : 0,
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
    };
    onUpdate(payload);

  };




  return (
    <div
      className=" ofullverflow-y-hidden overflow-x-hidden flex items-center justify-center bg-black bg-opacity-50 fixed top-0 right-0 left-0 ma z-50  w-full md:inset-0 h-"
    >
      <div
        className=" z-40  h-[80%]  md:h-[80%] my-auto"
      >
        <div className="bg-white h-full  p-4 rounded-xl  shadow">
          <div className="flex justify-between mb-3 font-bold items-center">
            <h1 className={`text-blue-500 text-lg font-bold `}>
              PAY : {payTotal}
            </h1>
            <button
              style={{ background: "#f5f5f5", borderRadius: "100%", }}
              className="text-2xl font-bold  text-red-600 hover:text-red-900 bg-transparent "
              onClick={() => onClose()}
            >
              <MdOutlineClose />
            </button>
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
              <h1 className="font-bold whitespace-nowrap text-black text-lg">Rs {advance?.balance || 0} </h1>

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
                          onChange={(e)=>setComment(e.target.value)}
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


            {!isPaid && (
              <button
                className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `}
                onClick={hnadleUpdate}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPopup;
