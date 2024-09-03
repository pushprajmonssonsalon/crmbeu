const NormalRadio = ({checked,onChange,name,value,label}) => {
  return (
    <>
    
   
          <div className="flex items-center ">
            <input
              id={label}
              type="radio"
              checked={checked}
              onChange={onChange}
              value={value}
              name={name}
              className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 "
            />
            <label
              htmlFor={label}
              className=" text-xl my-auto font-bold text-gray-900 "
            >
             {label}
            </label>
          </div>
      
    </>
  );
};

export default NormalRadio;
