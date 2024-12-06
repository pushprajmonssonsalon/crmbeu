import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import toast from "react-hot-toast";
import ConfirmationModal from "../modals/ConfirmationModal";
import { postApiData } from "../../utils/services";

const ProductOrderPopup = ({
  isVisible,
  onClose,
  data,
  orderId,
  bool,
  setBool,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    setOrderData(
      data.map((elm) => ({ ...elm, receivedQuantity: elm?.orderedQuantity }))
    );
  }, [data]);

  if (!isVisible) return null;

  const handleQuantityChange = (index, event) => {
    const updatedOrderData = [...orderData];
    updatedOrderData[index].receivedQuantity = parseInt(event.target.value);
    setOrderData(updatedOrderData);
  };

  
  const onSubmit = () => {
   
    const isRecievedQuantityValid = orderData?.some(
      (order) => order.receivedQuantity === "" || isNaN(order.receivedQuantity)
    );
    if (isRecievedQuantityValid) {
      return toast.error("Enter valid Recieved Quantity");
    }
    setShowConfirmModal(true);
  };
  const updateOrder = () => {
    setShowConfirmModal(false)
    const data = {
      products: orderData,
      id: orderId,
    };
    postApiData(
      "purchaseorder/editPurchaseOrder",
      data,
      (resp) => {
        toast.success("Order Has been Placed Successfully!");
        setBool(!bool);
        onClose();
      },
      (error) => {
        
        toast.error("Somting went wrong!!");
      }
    );
  };

  return (
    <>
      <div className="fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <div className="absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-auto">
          <div className="bg-white p-4 rounded-xl">
            <div className="flex justify-between font-bold items-center">
              <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>
                Edit your orders
              </h1>
              <button
                className="text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent"
                onClick={() => onClose()}
              >
                <MdOutlineClose />
              </button>
            </div>

            {orderData?.length > 0 && (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Ordered Quantity</th>
                    <th>Received Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData?.map((item, index) => (
                    <tr key={index} className="bg-white">
                      <td>{item?.name}</td>
                      <td>{item?.size}</td>
                      <td>{item.orderedQuantity}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          
                          max={item?.orderedQuantity}
                          value={item.receivedQuantity}
                          onChange={(event) =>
                            handleQuantityChange(index, event)
                          }
                          className="border border-gray-300 rounded-md p-1 w-16 text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `}
              onClick={onSubmit}
            >
              Received
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        text={"Please confirm that you have verified the received quantity"}
        show={showConfirmModal}
        setShow={setShowConfirmModal}
        onConfirm={updateOrder}
      />
    </>
  );
};

export default ProductOrderPopup;
