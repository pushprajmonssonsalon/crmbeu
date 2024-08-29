const NormalInput = ({ name,placeholder, type, label, value, onChange, disabled }) => {
  return (
    <>
      <label htmlFor={name}>
        <span className="font-bold text-md">{label}</span>
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        className="rounded-lg border-none bg-gray-300 placeholder:font-semibold"
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </>
  );
};

export default NormalInput;
