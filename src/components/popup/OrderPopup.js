import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { postApiData } from "../../utils/services";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
const OrderPopup = ({ isVisible, onClose, id, data }) => {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState([]);

  useEffect(() => {
    setQuantities(data.map(() => 1));
  }, [data]);

  const [bool, setBool] = useState(false);
  console.log("product", id);
  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };
  if (!isVisible) return null;

  console.log("dyanmic quantities", quantities);

  const orderpayload = data.map((obj, index) => ({
    ...obj,
    orderedQuantity: +quantities[index],
    receivedQuantity: 0,
  }));

  console.log("orderPayload", orderpayload);
  const handleSubmitOrder = () => {
    const data = {
      products: orderpayload,
    };
    postApiData(
      "purchaseorder/createPurchaseOrder",
      data,
      (resp) => {
        if (resp) {
        } else {
          toast.success("Chnages Applied Succesfully");
        }
      },
      (error) => {
        console.log("error", error);
        toast.error("something went wrong!");
      }
    );
    setBool(!bool);
    onClose();
    navigate("/orders");
  };

  return (
    <div className="fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center ">
      <div className="absolute z-40 mx-3 w-1/2 my-10 h-[70%] overflow-y-auto">
        <div className="bg-white p-4 rounded-xl ">
          <div className="flex justify-between font-bold items-center">
            <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>
              Place your order
            </h1>
            <button
              className="text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent"
              onClick={() => onClose()}
            >
              <MdOutlineClose />
            </button>
          </div>

          {/* {popupService?.map((item,index)=>(
                     <div className="grid w-full items-center">
                     <label htmlFor="name"><span className='font-bold text-md'>Name :</span></label>
                     <input type="text" placeholder='name' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={item?.name} disabled/>
                     <label htmlFor="name"><span className='font-bold text-md'>Size :</span></label>
                     <input type="text" placeholder='Size' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={item?.size} disabled/>
                     <label htmlFor="number"><span className='font-bold text-md'>Quantity :</span></label>
                     <input placeholder='Quantity' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={quantity} onChange={(e)=>setQuantity(e.target.value)}/>
                 </div>
                ))}
                <button className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `} onClick={handleEditServiceApi}>Submit</button>
                 */}

          <table className="styled-table" style={{ height: "40px" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item?.name}</td>
                  <td>{item?.size}</td>
                  <td>
                    <input
                      className="w-full h-full"
                      value={quantities[index]}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl`}
            onClick={handleSubmitOrder}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPopup;
