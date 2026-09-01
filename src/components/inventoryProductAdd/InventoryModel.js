import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";
import { postApiData } from "../../utils/services";
import NormalInput from "../customInput/NormalInput";

const InventoryModel = ({ data, isVisible, onClose }) => {

  const [productDetails, setProductDetails] = useState({


    quantity: 0,
    price: 0,
  });


  const onclickProdut = () => {
    const payload = {
      id: data?._id,

      itemId: data?.itemId,
      quantity: productDetails.quantity,
      price: productDetails.price,
    };
    postApiData(
      "inventory/addProductToSalons",
      payload,
      (resp) => {

        // alert("product Added Succesfully")
        toast.success("Product Added Successfully!!");
      },
      (error) => {
        // 
        toast.error(error.response.data.message);
      }
    );
    onClose();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const inputFields = [
    {
      name: "name",
      label: "Name :",
      disabled: true,
    },
    {
      name: "brand",
      label: "Brand :",
      disabled: true,
    },
    {
      name: "quantity",
      label: "Quantity :",
      type: "number",
      placeholder: "Quantity",
      disabled: false,
    },
    {
      name: "price",
      label: "Price :",
      type: "number",
      placeholder: "Price",
      disabled: false,
    },
  ];
  useEffect(() => {
    setProductDetails({
      price: data?.price,
      quantity: 1
    })
  }, [data])


  if (!isVisible) return null;

  return (
    <div className='fixed z-40 inset-0 bg-black/20 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain'>
      <div className=' w-full sm:w-[350px] md:w-[450px] bg-white p-4 rounded-xl relative mx-auto my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden'>

        <div className=" ">
          <div className='flex justify-between items-center mb-6'>
            <h1 className={`text-2xl text-black `}>Add Your Product</h1>
            <button className='text-black text-xl' onClick={() => onClose()}><MdOutlineClose /></button>

          </div>

          <div className="grid grid-cols-1 gap-y-3 mb-4">
            {inputFields.map((input, index) => {
              const { name, placeholder, label, type, disabled } = input;
              const value = disabled ? data[name] : productDetails[name];

              return (
                <div key={index} className="grid grid-cols-2 ">
                  <NormalInput
                    name={name}
                    value={value}
                    type={type}
                    disabled={disabled}
                    label={label}
                    placeholder={placeholder}
                    inputStyles={{
                      'borderRadius': '10px',
                      padding: "10px 15px",

                    }}
                    lableStyles={{
                      'fontWeight': '400',
                      "fontSize": "14px",
                      'color': '#000000'
                    }}
                    onChange={handleChange}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-4 mt-6">
            <button
              className="rounded-[5px] w-[120px] text-sm  border border-ternary text-ternary py-[5px] px-[24px]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
              onClick={onclickProdut}
            >
              ADD
            </button>
          </div>
       
        </div>
      </div>
    </div>
  );
};

export default InventoryModel;
