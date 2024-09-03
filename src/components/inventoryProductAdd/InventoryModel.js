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
        console.log("productDetails", resp);
        // alert("product Added Succesfully")
        toast.success("Product Added Successfully!!");
      },
      (error) => {
        // console.log("my product error", error.response.data.message);
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
      disabled:true,
    },
    {
      name: "brand",
      label: "Brand :",
      disabled:true,
    },
    {
      name: "quantity",
      label: "Quantity :",
      placeholder: "Quantity",
      disabled:false,
    },
    {
      name: "price",
      label: "Price :",
      placeholder: "Price",
      disabled:false,
    },
  ];
  useEffect(()=>{
   setProductDetails({
    price:data?.price,
    quantity:1
   })
  },[data])

  
  if (!isVisible) return null;

  return (
    <div className="fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="absolute z-40 mx-3 w-1/2 md:w-1/3 my-10">
        <div className="bg-white p-4 rounded-xl ">
          <div className="flex justify-between font-bold items-center">
            <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>
              Add Your Products
            </h1>
            <button
              className="text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent"
              onClick={onClose}
            >
              <MdOutlineClose />
            </button>
          </div>
          <div className="grid gap-1 w-full items-center">
            {inputFields.map((input, index) => {
              const { name, placeholder, label,disabled } = input;
              const value = disabled?data[name]:productDetails[name];

              return (
                <div key={index} className="flex flex-col gap-1">
                  <NormalInput
                    name={name}
                    value={value}
                    disabled={disabled}
                    label={label}
                    inputStyles={{ background: "#d1d5db" }}
                    placeholder={placeholder}
                    onChange={handleChange}
                  />
                </div>
              );
            })}
          </div>

          <button
            className={`bg-blue-400 mt-3 text-white font-bold p-3 hover:text-gray-500 rounded-xl `}
            onClick={onclickProdut}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModel;
