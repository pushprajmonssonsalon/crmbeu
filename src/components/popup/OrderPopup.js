import { useCallback, useEffect, useMemo, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate } from "react-router";
import { CiCircleRemove } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import ConfirmationModal from "../modals/ConfirmationModal";
import { postApiData } from "../../utils/services";
import toast from "react-hot-toast";

const OrderPopup = ({ isVisible, onClose, data, removeItem }) => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [cartData, setCartData] = useState([]);
  const brands = useMemo(() => {
    return [...new Set(data?.map((elm) => elm.brand))];
  }, [data]);
  const [activeBrand, setActiveBrand] = useState(brands?.length > 0 ? brands[0] : "");

  useEffect(() => {
    setCartData(data?.map((elm) => ({
      ...elm, orderedQuantity: 1, receivedQuantity: 0,
    })));
  }, [data]);
  const getCountOfBrand = useCallback((brand) => {
    const count = data?.reduce((acc, curr) => {
      // Check if the current item's brand matches the specified brand
      if (curr.brand === brand) {
        return acc + 1; // Increment the count
      }
      return acc; // Return the accumulator unchanged for non-matching items
    }, 0); // Initial accumulator value is 0

    return count; // Return the total count
  }, [data]);
  const cart = useMemo(() => {
    let obj = {}
    cartData?.forEach((elm) => {
      let val = obj[elm.brand]
      if (val) {
        obj[elm.brand] = [...val, elm]
      }
      else {
        obj[elm.brand] = [elm]
      }

    })
    return obj
  }, [cartData])

  useEffect(() => {
    if (brands.length > 0) if (!brands.includes(activeBrand)) setActiveBrand(brands[0])
  }, [brands])
  const [bool, setBool] = useState(false);
  const handleQuantityChange = (idx, value) => {
    const updatedCart = cartData.map((elm) => {
      if (elm.itemId === idx) {
        return {
          ...elm,
          orderedQuantity: value,

        }
      }
      return elm
    });

    // Update the specific item's quantity

    setCartData(updatedCart)

  };
  if (!isVisible) return null;





  const handleSubmitOrder = () => {

    setShowConfirmModal(true)

  };
  const placeOrder = () => {
    const payload = {
      products: cartData,
    };
    postApiData(
      "purchaseorder/createPurchaseOrder",
      payload,
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
    setShowConfirmModal(false);
    setBool(!bool);
    onClose();
    navigate("/orders");
  }
  const handleBrandChange = (brand) => {
    if (brands.length > 0) {
      setActiveBrand(brand)

    }
  }




  return (
    <>
      <div className='fixed z-30 inset-0 bg-black/20 top-0 left-0 '>
        <div className='w-[80%] md:w-[60%] bg-white p-4 rounded-xl relative top-[10%] bottom-[10%]   mx-auto max-h-[calc(100%-150px)] overflow-y-auto overflow-x-hidden'>

          <div className=" ">
            <div className='flex justify-between items-center mb-6'>
              <h1 className={`text-2xl text-black `}>Place Your Order</h1>
              <button className='text-black text-xl' onClick={() => onClose()}><MdOutlineClose /></button>

            </div>

            {cartData?.length > 0 && <div className="my-3 ">
              <span className="text-xs text-black font-medium leading-6">Filter Brands</span>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 bg-gray-50 p-2 border rounded-sm">
                {brands?.length > 0 &&
                  brands?.map((brand, idx) => (
                    <div
                      onClick={() => handleBrandChange(brand)}
                      className={`active:scale-105 flex gap-1 items-center justify-center active:outline active:outline-neutral-50  ${activeBrand === brand ? "bg-ternary text-white" : " border text-black"} transition-all w-auto lg:min-w-[150px] ease-in duration-100  p-2 text-center  rounded-md  text-black cursor-pointer`}
                      key={idx}
                    >
                      <span>{brand}</span>
                      <span>({getCountOfBrand(brand)})</span>
                    </div>
                  ))}
              </div>
            </div>
            }
            {cartData?.length > 0 ? (
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
                    {cartData?.filter(elm => elm.brand === activeBrand)?.map((item, index) => (
                      <tr key={index}>
                        <td>{item?.name}</td>
                        <td>{item?.size}</td>
                        <td>
                          <input
                            type="number"
                            className="w-full h-full"
                            value={item?.orderedQuantity}
                            min={0}

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
                            <CiCircleRemove className="text-3xl  mx-auto  font-bold" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-start gap-4 mt-6">
                    <button
                      className="rounded-[5px] w-[120px] text-sm  border border-ternary text-ternary py-[5px] px-[24px]"
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
                
                  <div
                    className="flex gap-1"
                  >
                    <span className="font-semibold text-sm">Total Products :</span>
                    <span className="font-semibold text-black text-sm">{data?.length || 0}</span>

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

export default OrderPopup;
