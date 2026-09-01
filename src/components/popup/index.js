import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { postApiData } from "../../utils/services";
import NormalInput from "../customInput/NormalInput";
import toast from "react-hot-toast";

const Popup = ({ onClose, editItem, onUpdate }) => {
  const disabledInputs = [ "category", "subCategory"];
  const inputs = [
    {
      name: "name",
      label: "Name",
      placeholder: "Service Name",
    },
    {
      name: "category",
      label: "Category",
      placeholder: "Category Name",
    },
    {
      name: "subCategory",
      label: "Sub Category",
      placeholder: "Sub Category",
    },
    {
      name: "price",
      label: "Price",
      placeholder: "Price",
    },
    {
      name: "mrp",
      label: "Mrp",
      placeholder: "Mrp",
    },
    {
      name: "appPrice",
      label: "App Price",
      placeholder: "App Price",
    },
    {
      name: "appMrp",
      label: "App Mrp",
      placeholder: "App Mrp",
    },
  ];
  const [serviceDetails, setServiceDetails] = useState({

  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceDetails((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleEditServiceApi = () => {
    const { price, appMrp, appPrice, mrp, uniqueCode,name } = serviceDetails;
    const data = {
      name:name,
      uniqueCode: uniqueCode,
      price: price == 0 ? editItem.price : price,
      mrp: mrp == 0 ? editItem.mrp : mrp,
      appPrice: appPrice == 0 ? editItem.appPrice : appPrice,
      appMrp: appMrp == 0 ? editItem.appMrp : appMrp,

    };
    postApiData(
      "salonService/editServiceInParlor",
      data,
      (resp) => {
        if (resp) {
          onUpdate(serviceDetails);
          toast.success("Changes Applied Succesfully");

        }
      },
      (error) => {



        toast.error("service already Added");
      }
    );
  };
  useEffect(() => {
    setServiceDetails(editItem);
  }, [editItem]);

  return (
    <div className='fixed z-40 inset-0 bg-black/20 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain'>
      <div className=' w-full sm:w-[350px] md:w-[450px] bg-white p-4 rounded-xl relative mx-auto my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden'>

        <div className=" ">
          <div className='flex justify-between items-center mb-6'>
            <h1 className={`text-2xl text-black `}>Edit your response</h1>
            <button className='text-black text-xl' onClick={onClose}><MdOutlineClose /></button>

          </div>

          <div className="grid grid-cols-1 gap-y-3 mb-4">
            {serviceDetails && inputs?.map((key, index) => {
              const id = key?.name;
              const label = key?.label;
              const value = serviceDetails[id];
              const placeholder = key?.placeholder;

              return (
                <div key={index} className="grid grid-cols-2 ">
                  <NormalInput
                    label={label}
                    name={id}
                    type={typeof value === "number" ? "number" : "text"}
                    onChange={handleChange}
                    value={value}
                    inputStyles={{
                      'borderRadius': '10px',
                      padding: "10px 15px",

                    }}
                    lableStyles={{
                      'fontWeight': '400',
                      "fontSize": "14px",
                      'color': '#000000'
                    }}
                    placeholder={placeholder}
                    disabled={disabledInputs.includes(id)}
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

export default Popup;
