import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { postApiData } from "../../utils/services";
import toast from "react-hot-toast";
import NormalInput from "../customInput/NormalInput";

const MyProductPopup = ({
  data,
  isVisible,
  onClose,
 
  setIsChanged,
  isChanged,
}) => {
  const [productDetails,setProductDetails]=useState({
    price:0,
    mrp:0
  })
  

  const handleEditServiceApi = () => {
    const {price,mrp}=productDetails;
    const item = {
      id: data?._id,
      price: +price == 0 ? data?.price : +price,
      mrp: +mrp == 0 ? data?.mrp : +mrp,
    };
    postApiData(
      "inventory/editSalonProducts",
      item,
      (resp) => {
        if (resp) {
        } else {
          // alert("Chnages Applied Succesfully");
          toast.success("Chenges Applied SuccessFully");
        }
      },
      (error) => {
        console.log("error", error);
        //   alert("service already Added");
        toast.error("Something Went Wrong!!");
      }
    );
    setIsChanged(!isChanged);
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
      name: "mrp",
      label: "Mrp :",
      placeholder: "Mrp",
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
      mrp:data?.mrp
    })

  },[data])
  if(!isVisible)return null
  return (
    <div className="fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-auto">
        <div className="bg-white p-4 rounded-xl ">
          <div className="flex justify-between font-bold items-center">
            <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>
              Edit your response
            </h1>
            <button
              className="text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent"
              onClick={onClose}
            >
              <MdOutlineClose />
            </button>
          </div>

          {/* {popupService?.map((item,index)=>( */}
          <div className="grid gap-1 w-full items-center">
          {inputFields.map((input, index) => {
              const { name, placeholder, label,disabled } = input;
              const value = disabled?data?.[name]:productDetails[name];

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
          {/* ))} */}
          <button
            className={`bg-blue-400 text-white mt-2 font-bold p-3 hover:text-gray-500 rounded-xl `}
            onClick={handleEditServiceApi}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProductPopup;
