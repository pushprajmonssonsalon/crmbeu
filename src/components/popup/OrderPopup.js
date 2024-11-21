import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { postApiData } from "../../utils/services";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { CiCircleRemove } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";

const OrderPopup = ({ isVisible, onClose, data, removeItem }) => {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState([]);

  useEffect(() => {
    setQuantities(data.map(() => 1));
  }, [data]);

  const [bool, setBool] = useState(false);
  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };
  if (!isVisible) return null;

  

  const orderpayload = data.map((obj, index) => ({
    ...obj,
    orderedQuantity: +quantities[index],
    receivedQuantity: 0,
  }));

  
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
          <div className="flex mb-3 justify-between font-bold items-center">
            <h1 className={`text-blue-500 text-lg font-bold  `}>
              Place your order
            </h1>
            <div
              className="text-3xl font-bold  text-red-600 hover:text-red-900 bg-transparent"
              onClick={() => onClose()}
            >
              <MdOutlineClose />
            </div>
          </div>

          {data?.length > 0 ? (
            <>
              <table className="styled-table" style={{ height: "40px" }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Action</th>
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
                      <td>
                        <div
                          onClick={() => removeItem(item._id)}
                          className="cursor-pointer text-black hover:text-rose-500 "
                        >
                          <CiCircleRemove className="text-3xl  mx-auto  font-bold" />
                        </div>
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
            </>
          
          ) : (
            <div className="h-[20vh] flex items-center justify-center bg-gray-100 rounded-[25px]">
            <div>

         
            <FiShoppingCart className="h-[10vh] text-gray-300 w-[10vw]" />
            <h2 className="text-gray-300 text-xl">Your Cart is Empty</h2>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPopup;
