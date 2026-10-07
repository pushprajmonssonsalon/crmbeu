import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import toast from "react-hot-toast";
import ConfirmationModal from "../modals/ConfirmationModal";
import { postApiData } from "../../utils/services";

// Mirrors popup/ProductOrderPopup.js — same receive-quantity UX, distributer
// endpoint. Posting this moves the PO to status 2 (Received) and pushes the
// received stock into the distributer's own products.
const DistributerReceivePopup = ({
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
      (data || []).map((elm) => ({
        ...elm,
        receivedQuantity: elm?.orderedQuantity,
      }))
    );
  }, [data]);

  if (!isVisible) return null;

  const handleQuantityChange = (index, event) => {
    const updated = [...orderData];
    updated[index].receivedQuantity = parseInt(event.target.value);
    setOrderData(updated);
  };

  const onSubmit = () => {
    const invalid = orderData?.some(
      (order) =>
        order.receivedQuantity === "" ||
        isNaN(order.receivedQuantity) ||
        order.receivedQuantity < 0
    );
    if (invalid) return toast.error("Enter valid Received Quantity");
    setShowConfirmModal(true);
  };

  const updateOrder = () => {
    setShowConfirmModal(false);
    postApiData(
      "distributerPo/editPurchaseOrder",
      { products: orderData, id: orderId },
      () => {
        toast.success("Order received successfully!");
        setBool(!bool);
        onClose();
      },
      (error) => {
        toast.error(error?.response?.data?.message || "Something went wrong!!");
      }
    );
  };

  return (
    <>
      <div className="fixed z-40 inset-0 bg-black/20 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain">
        <div className="w-full sm:w-[350px] md:w-[450px] bg-white p-4 rounded-xl relative mx-auto my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden">
          <div className="">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl text-black">Receive your order</h1>
              <button className="text-black text-xl" onClick={onClose}>
                <MdOutlineClose />
              </button>
            </div>

            {orderData?.length > 0 && (
              <div className="table-responsive">
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
                            onChange={(event) => handleQuantityChange(index, event)}
                            className="border border-gray-300 rounded-md p-1 w-16 text-center"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-end gap-4 mt-6 flex-wrap">
              <button
                className="rounded-[5px] w-[120px] text-sm border border-ternary text-ternary py-[5px] px-[24px]"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
                onClick={onSubmit}
              >
                Submit
              </button>
            </div>
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

export default DistributerReceivePopup;
