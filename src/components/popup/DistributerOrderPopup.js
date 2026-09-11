import { useCallback, useEffect, useMemo, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate } from "react-router";
import { CiCircleRemove } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import ConfirmationModal from "../modals/ConfirmationModal";
import { postApiData } from "../../utils/services";
import toast from "react-hot-toast";

// Mirrors popup/OrderPopup.js — same cart UX, distributer endpoint.
const DistributerOrderPopup = ({
  isVisible,
  onClose,
  data,
  removeItem,
  clearCart,
}) => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cartData, setCartData] = useState([]);

  const brands = useMemo(() => {
    return [...new Set(data?.map((elm) => elm.brand))];
  }, [data]);
  const [activeBrand, setActiveBrand] = useState(
    brands?.length > 0 ? brands[0] : ""
  );

  useEffect(() => {
    setCartData(
      data?.map((elm) => ({ ...elm, orderedQuantity: 1, receivedQuantity: 0 }))
    );
  }, [data]);

  const getCountOfBrand = useCallback(
    (brand) => data?.reduce((acc, curr) => (curr.brand === brand ? acc + 1 : acc), 0),
    [data]
  );

  const cart = useMemo(() => {
    let obj = {};
    cartData?.forEach((elm) => {
      obj[elm.brand] = obj[elm.brand] ? [...obj[elm.brand], elm] : [elm];
    });
    return obj;
  }, [cartData]);

  useEffect(() => {
    if (brands.length > 0 && !brands.includes(activeBrand)) setActiveBrand(brands[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brands]);

  const handleQuantityChange = (idx, value) => {
    setCartData(
      cartData.map((elm) =>
        elm.itemId === idx ? { ...elm, orderedQuantity: value } : elm
      )
    );
  };

  if (!isVisible) return null;

  const handleSubmitOrder = () => {
    const invalid = cartData?.some(
      (elm) => !elm.orderedQuantity || isNaN(+elm.orderedQuantity) || +elm.orderedQuantity <= 0
    );
    if (invalid) return toast.error("Enter a valid quantity for every product");
    setShowConfirmModal(true);
  };

  const placeOrder = () => {
    const payload = {
      products: cartData.map((elm) => ({
        ...elm,
        orderedQuantity: +elm.orderedQuantity,
      })),
    };
    postApiData(
      "distributerPo/createPurchaseOrder",
      payload,
      () => {
        toast.success("Purchase order placed successfully");
        if (clearCart) clearCart();
        setShowConfirmModal(false);
        onClose();
        navigate("/distributer/inventory?tab=2");
      },
      (error) => {
        toast.error(
          error?.response?.data?.message || "Something went wrong!"
        );
        setShowConfirmModal(false);
      }
    );
  };

  const handleBrandChange = (brand) => {
    if (brands.length > 0) setActiveBrand(brand);
  };

  return (
    <>
      <div className="fixed z-40 inset-0 bg-black/20 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain">
        <div className="w-full md:w-[80%] xl:w-[60%] bg-white p-4 rounded-xl relative mx-auto my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden">
          <div className=" ">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl text-black">Place Your Order</h1>
              <button className="text-black text-xl" onClick={() => onClose()}>
                <MdOutlineClose />
              </button>
            </div>

            {cartData?.length > 0 && (
              <div className="my-3 ">
                <span className="text-xs text-black font-medium leading-6">
                  Filter Brands
                </span>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 bg-gray-50 p-2 border rounded-sm">
                  {brands?.map((brand, idx) => (
                    <div
                      onClick={() => handleBrandChange(brand)}
                      className={`active:scale-105 flex gap-1 items-center justify-center active:outline active:outline-neutral-50 ${
                        activeBrand === brand
                          ? "bg-ternary text-white"
                          : " border text-black"
                      } transition-all w-auto lg:min-w-[150px] ease-in duration-100 p-2 text-center rounded-md text-black cursor-pointer`}
                      key={idx}
                    >
                      <span>{brand}</span>
                      <span>({getCountOfBrand(brand)})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cartData?.length > 0 ? (
              <>
                <div className="table-responsive">
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
                      {cartData
                        ?.filter((elm) => elm.brand === activeBrand)
                        ?.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.name}</td>
                            <td>{item?.size}</td>
                            <td>
                              <input
                                type="number"
                                className="w-full h-full"
                                value={item?.orderedQuantity}
                                min={1}
                                onChange={(e) =>
                                  handleQuantityChange(item?.itemId, e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <div
                                onClick={() => removeItem(item.itemId)}
                                className="cursor-pointer text-black hover:text-rose-500 "
                              >
                                <CiCircleRemove className="text-3xl mx-auto font-bold" />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center justify-start gap-4 mt-6">
                    <button
                      className="rounded-[5px] w-[120px] text-sm border border-ternary text-ternary py-[5px] px-[24px]"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
                      onClick={handleSubmitOrder}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-semibold text-sm">Total Products :</span>
                    <span className="font-semibold text-black text-sm">
                      {data?.length || 0}
                    </span>
                  </div>
                </div>
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
      <ConfirmationModal
        show={showConfirmModal}
        text="Please review your order before placing it:"
        data={cart}
        setShow={setShowConfirmModal}
        onConfirm={placeOrder}
      />
    </>
  );
};

export default DistributerOrderPopup;
