import { FaAngleDown } from "react-icons/fa";

const MutiSelect = ({ name,value, selected, options = [], onChange, inputStyles = {}, disabled = false, lableStyles = {}, label = "", show, setShow }) => {
    return (
        <>
            {label !== "" && (
                <label className="w-fit" htmlFor={name}>
                    <span style={{ ...lableStyles }} className="text-black text-md">
                        {label}
                    </span>
                </label>
            )}

            <button
                onClick={() => setShow(!show)}

                disabled={disabled}
                style={{ ...inputStyles }}
                className="bg-gray-50 flex justify-between items-center z-[2] min-w-sm rounded-[16px]  border border-primaryGray text-black text-sm    px-[27px] py-[12px] "
            >
                <span>{value?value:'Choose Option'}</span><span className={`translate-x-[27px] `}><FaAngleDown className="text-sm " />
                </span>
            </button>
            {show && <ul className="bg-white h-[200px]  overflow-y-auto p-3 absolute rounded-[10px] top-[75px] w-full shadow border">


                {options?.map((elm, index) => {
                    const checked =selected(elm._id)
                    return (
                        <li key={index} className="bg-gray-100 flex mb-2 last:mb-0 gap-6 p-2 text-sm ">
                            <label key={elm?._id} className="flex w-full items-center gap-3" >
                                <input
                                    type="checkbox"
                                    value={elm._id}
                                    className=""
                                    onChange={onChange}
                                    checked={checked}
                                />
                                <span>{elm.name}</span>

                            </label></li>
                    )
                }


                )}
            </ul>}

        </>
    )
}

export default MutiSelect