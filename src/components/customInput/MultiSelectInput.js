import { useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import CustomInput from "./CustomInput";

const MultiSelectInput = ({ options, val, tag, data = "", handleStaffSelection, handleShareChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  const formatText=(arr)=>{

    if(arr.length>0){
      const str = arr.map((elm)=>elm.satffName).join(" , ")
      const str2 = arr.map((elm)=>elm.name).join(" , ")
      const str3 = arr.map((elm)=>elm.staffName).join(" , ")
      switch(tag){
        case 'service':

        return str;


         
        case 'edit':
          return str;
         
        case 'membership':
          return str2;


        default:
          return str3

         
      }
    }
    return "Select Staff"


  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative ">
      <label
        className={` ${tag==="membership"?"":"bg-customGray"} relative flex items-center justify-between min-w-[250px] xl:min-w-[300px] capitalize border border-gray-400 text-gray-900 text-sm rounded-lg p-2.5`}
        onClick={toggleDropdown}
      >
        <span className="max-w-[250px] overflow-hidden text-ellipsis text-nowrap">{formatText(val)}</span>
        <RiArrowDropDownLine className="text-xl" />
      </label>

      {isOpen && (
        <div className="absolute z-[3] h-full left-0 -bottom-[105%] w-full ">
          <ul className="bg-white border p-1">
            {options.map((option, i) => {
              const { name, value } = option;
              const splitted = value.split("-");
              const id = splitted[0];
              const selected = tag === "membership" ? val?.find((elm) => elm?.employeeId === id) : val?.find((elm) => elm?.staffId === id)


              const share = selected?.share

              return (
                <li key={i}>
                  <label className="flex items-center justify-between whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100">
                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        name="staff"
                        checked={tag === "membership" ? selected?.employeeId === id : selected?.staffId === id}
                        value={value}
                        onChange={handleStaffSelection(tag, id, data)}
                        className="cursor-pointer"
                      />
                      <span className="ml-1">{name}</span>
                    </div>
                    <CustomInput

                      id={id}
                      value={share}
                      onChange={handleShareChange(tag, id, data)}
                      name="staff"
                    />

                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
export default MultiSelectInput