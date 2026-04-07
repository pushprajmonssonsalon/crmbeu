import { useState, useRef, useEffect } from "react";

const CustomSelect = ({
  name,
  value,
  options = [],
  onChange,
  inputStyles = {},
  disabled = false,
  lableStyles = {},
  label = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [localOptions, setLocalOptions] = useState(options);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Only sync new options added from parent, don't wipe user-created ones
  useEffect(() => {
    setLocalOptions((prev) => {
      const prevValues = new Set(prev.map((o) => o.value));
      const newOnes = options.filter((o) => !prevValues.has(o.value));
      return newOnes.length > 0 ? [...prev, ...newOnes] : prev;
    });
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchText("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = localOptions.find((o) => o.value === value);
  const displayValue = selectedOption ? selectedOption.name : "";

  // Show all options when search is empty, filter when user types
  const filteredOptions = searchText.trim()
    ? localOptions.filter((o) =>
        o.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : localOptions;

  const showCreateOption =
    searchText.trim() !== "" &&
    !localOptions.some(
      (o) => o.name.toLowerCase() === searchText.trim().toLowerCase()
    );

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
    setSearchText("");
  };

  const handleCreate = () => {
    const newOption = { name: searchText.trim(), value: searchText.trim() };
    setLocalOptions((prev) => [...prev, newOption]);
    onChange({ target: { name, value: newOption.value } });
    setIsOpen(false);
    setSearchText("");
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setIsOpen(true);
  };

  const handleFocus = () => {
    if (!disabled) setIsOpen(true);
  };

  return (
    <>
      {label !== "" && (
        <label className="w-fit" htmlFor={name}>
          <span style={{ ...lableStyles }} className="text-black text-md">
            {label}
          </span>
        </label>
      )}

      <div ref={containerRef} className="relative min-w-sm">
        {/* Input — always visible, same styles as NormalSelect */}
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="text"
          disabled={disabled}
          placeholder="Choose Option"
          value={isOpen ? searchText : displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          autoComplete="off"
          style={{ ...inputStyles }}
          className="bg-gray-50 z-[2] min-w-sm border border-primaryGray text-black text-sm rounded-lg px-[27px] py-[12px] w-full outline-none cursor-pointer"
        />

        {/* Chevron */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-50 border border-primaryGray rounded-lg shadow-lg z-[100] overflow-hidden">
            <ul className="max-h-48 overflow-y-auto">
              {filteredOptions.map((elm, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(elm.value)}
                  className={`px-[27px] py-[10px] text-sm text-black cursor-pointer hover:bg-gray-100 ${
                    elm.value === value ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {elm.name}
                </li>
              ))}

              {/* Create new option */}
              {showCreateOption && (
                <li
                  onClick={handleCreate}
                  className="px-[27px] py-[10px] text-sm text-black cursor-pointer hover:bg-gray-100 flex items-center gap-2 border-t border-primaryGray"
                >
                  <span className="text-primaryGray">+</span>
                  <span>Create <strong>"{searchText.trim()}"</strong></span>
                </li>
              )}

              {filteredOptions.length === 0 && !showCreateOption && (
                <li className="px-[27px] py-[10px] text-sm text-gray-400">
                  No options found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomSelect;