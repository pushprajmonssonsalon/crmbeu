const NormalInput = ({
  name,
  placeholder="",
  type="text",
  label = "",
  value,
  onChange,
  disabled=false,
  lableStyles = {},
  inputStyles = {},
}) => {
  return (
    <>
      {label !== "" && (
        <label className="w-fit" htmlFor={name}>
          <span style={{ ...lableStyles }} className="font-bold text-md">
            {label}
          </span>
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        style={{ ...inputStyles }}
        placeholder={placeholder}
        className="bg-gray-50 min-w-sm capitalize border border-primaryGray text-black text-sm rounded-lg   grow py-[12px] px-[27px]  "
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </>
  );
};

export default NormalInput;
