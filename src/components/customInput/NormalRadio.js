const NormalRadio = ({checked,onChange,name,value,label}) => {
  return (
    <>
    
   
          <div className="flex gap-3 items-center ">
            <input
              id={label}
              type="radio"
              checked={checked}
              onChange={onChange}
              value={value}
              name={name}
              className="w-6 h-6 mr-2 text-ternary accent-ternary border-2 bg-gray-100 border-primaryGray "
            />
            <label
              htmlFor={label}
              className=" text-sm font-normal text-black my-auto  "
            >
             {label}
            </label>
          </div>
      
    </>
  );
};

export default NormalRadio;
