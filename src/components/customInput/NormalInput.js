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
        className="bg-gray-50 min-w-sm capitalize border border-gray-400 text-gray-900 placeholder:text-gray-900 text-sm rounded-lg   grow p-2.5 "
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </>
  );
};

export default NormalInput;
