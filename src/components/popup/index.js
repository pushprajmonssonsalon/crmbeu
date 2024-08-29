import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { postApiData } from "../../utils/services";
import NormalInput from "../customInput/NormalInput";
import toast from "react-hot-toast";

const Popup = ({ onClose, editItem,onUpdate }) => {
  const disabledInputs = ["name", "category", "subCategory"];
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
    const {price,appMrp,appPrice,mrp,uniqueCode}=serviceDetails;
    const data = {
      uniqueCode:uniqueCode,
      price: price == 0 ? editItem.price : price,
      mrp: mrp == 0 ? editItem.mrp : mrp,
      appPrice: appMrp == 0 ? editItem.appMrp : appMrp,
      appMrp: appPrice == 0 ? editItem.appPrice : appPrice,
      
    };
    postApiData(
      "salonService/editServiceInParlor",
      data,
      (resp) => {
        if (resp) {
          onUpdate(serviceDetails);
          toast.success("Chnages Applied Succesfully");

        } 
      },
      (error) => {

        console.log("error", error);

        toast.error("service already Added");
      }
    );
  };
  useEffect(() => {
    setServiceDetails(editItem);
  }, [editItem]);

  return (
    <div className="fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-scroll">
        <div className="bg-white p-4 rounded-xl ">
          <div className="flex justify-between font-bold items-center">
            <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>
              Edit your response
            </h1>
            <button
              className="text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent"
              onClick={() => onClose()}
            >
              <MdOutlineClose />
            </button>
          </div>
          <div className="grid w-full items-center">
            {serviceDetails && inputs?.map((key, index) => {
              const id = key?.name;
              const label = key?.label;
              const value = serviceDetails[id];
              const placeholder = key?.placeholder;

              return (
                <NormalInput
                  label={label}
                  name={id}
                  type={typeof value === "number" ? "number" : "text"}
                  onChange={handleChange}
                  value={value}
                  placeholder={placeholder}
                  disabled={disabledInputs.includes(id)}
                />
              );
            })}
          </div>
          <button
            className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `}
            onClick={handleEditServiceApi}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
