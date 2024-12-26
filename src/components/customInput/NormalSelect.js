const NormalSelect = ({name,value,options=[],onChange,inputStyles={},disabled=false,lableStyles={},label=""}) => {
  return (

   <>
    {label !== "" && (
        <label className="w-fit" htmlFor={name}>
          <span style={{ ...lableStyles }} className="font-bold text-md">
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
    className="bg-gray-50 z-[2] min-w-sm capitalize border border-gray-400 text-gray-900 text-sm rounded-lg   grow p-2.5 "
    onChange={onChange}
  >
    <option value="">Choose a {name}</option>
    {options?.map((elm,index)=>(
        <option key={index} value={elm.value}>{elm.name}</option>
    ))}

  </select>
 
</>

  );
};

export default NormalSelect;
