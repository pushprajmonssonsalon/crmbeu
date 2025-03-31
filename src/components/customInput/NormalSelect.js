const NormalSelect = ({name,value,options=[],onChange,inputStyles={},disabled=false,lableStyles={},label=""}) => {
  return (

   <>
    {label !== "" && (
        <label className="w-fit" htmlFor={name}>
          <span style={{ ...lableStyles }} className="text-black text-md">
            {label}
          </span>
        </label>
      )}
 
  <select
    id={name}
    name={name}
    value={value}
    disabled={disabled}
    style={{...inputStyles}}
    className="bg-gray-50 z-[2] min-w-sm  border border-primaryGray text-black text-sm rounded-lg    px-[27px] py-[12px] "
    onChange={onChange}
  >
    <option className="normal-case" value="">Choose Option</option>
    {options?.map((elm,index)=>(
        <option key={index} value={elm.value}>{elm.name}</option>
    ))}

  </select>
 
</>

  );
};

export default NormalSelect;
