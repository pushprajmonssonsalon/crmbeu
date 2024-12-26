const CustomInput = ({value,name="",readOnly=false,onChange=()=>{},id=""}) => {
  return (
    <div className="relative flex items-center flex-row-reverse">
    <input
      type="number"
      name={name}
      value={value ? value : 0}
      readOnly={readOnly}
      onChange={(e) => onChange(e, id)}
      min={0}
      max={100}
      className={`cursor-pointer ${readOnly?"outline-none":""} h-[30px] w-[60px]`}
    />
    <span className="absolute -translate-x-1/2 my-auto">%</span>
  </div>
  )
}

export default CustomInput