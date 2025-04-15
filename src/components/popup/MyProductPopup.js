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
  const [productDetails, setProductDetails] = useState({
    price: 0,
    mrp: 0
  })


  const handleEditServiceApi = () => {
    const { price, mrp } = productDetails;
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
      disabled: true,
    },
    {
      name: "brand",
      label: "Brand :",
      disabled: true,
    },

    {
      name: "mrp",
      label: "Mrp :",
      placeholder: "Mrp",
      disabled: false,
    },
    {
      name: "price",
      label: "Price :",
      placeholder: "Price",
      disabled: false,
    },
  ];

  useEffect(() => {
    setProductDetails({
      price: data?.price,
      mrp: data?.mrp
    })

  }, [data])
  if (!isVisible) return null
  return (
    <div className='fixed z-30 inset-0 bg-black/20 top-0 left-0 '>
      <div className=' w-[85%] sm:w-[350px] md:w-[450px] bg-white p-4 rounded-xl relative top-[10%] bottom-[10%]   mx-auto max-h-[calc(100%-150px)] overflow-y-auto overflow-x-hidden'>

        <div className="">
          <div className='flex justify-between items-center mb-6'>
            <h1 className={`text-2xl text-black `}>Edit Inventory</h1>
            <button className='text-black text-xl' onClick={onClose}><MdOutlineClose /></button>

          </div>

          {/* {popupService?.map((item,index)=>( */}
          {/* <div className="grid grid-cols-1 gap-y-3 mb-4">
            {formFields.map((input, index) => {
              const { name, placeholder, label, type, value, options, onChange } = input;
              return (
                <div key={index} className="grid grid-cols-2 "> */}
          <div className="grid grid-cols-1 gap-y-3 mb-4">
            {
              inputFields.map((input, index) => {
                const { name, placeholder, label, disabled } = input;
                const value = disabled ? data?.[name] : productDetails[name];

                return (
                  <div key={index} className="grid grid-cols-2 ">
                    <NormalInput
                      name={name}
                      value={value}
                      disabled={disabled}
                      label={label}
                      inputStyles={{
                        'borderRadius': '10px',
                        padding: "10px 15px",

                      }}
                      lableStyles={{
                        'fontWeight': '400',
                        "fontSize": "14px",
                        'color': '#000000'
                      }} placeholder={placeholder}
                      onChange={handleChange}
                    />

                  </div>
                );
              })}

          </div>
          {/* ))} */}
          <div className="flex items-center justify-end gap-4 mt-6">
            <button
              className="rounded-[5px] w-[120px] text-sm  border border-ternary text-ternary py-[5px] px-[24px]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
              onClick={handleEditServiceApi}
            >
              Submit
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyProductPopup;
