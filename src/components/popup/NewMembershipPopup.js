import { useState } from 'react';
import { MdOutlineClose } from "react-icons/md";
import { postApiData } from '../../utils/services';
import toast from 'react-hot-toast';
import NormalInput from '../customInput/NormalInput';
import NormalSelect from '../customInput/NormalSelect';
const NewMembershipModal = ({ isVisible, onClose }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(null);
    const [coins, setCoins] = useState(null);
    const [expiry, setExpiry] = useState(3);

    if (!isVisible) return null;
    // 
    const handleExpiryChange = (e) => {
        setExpiry(+e.target.value)

    }



    const handleAddMembership = () => {
        const data = {
            name: name,
            price: +price,
            credits: +coins,
            expiry: +expiry
        }
        const isEveryEmpty = Object.values(data).some(elm => !elm || elm === "")
        if (isEveryEmpty) {
            return toast.error("Please Fill All Fields")
        }
        postApiData("parlor/createMembershipForParlor",
            data,
            (res) => {

                toast.success("Membership Added Successfully!")
                onClose()
                setName("")
                setPrice(null)
                setCoins(null)
                setExpiry(null)
            },
            (error) => {

                toast.error("Something went wrong!")
            }
        )
    }
    const formFields = [
        {
            name: "name",
            type: "text",
            value: name,
            label: "Name",
            placeholder: "Membership Name",
            onChange: (e) => setName(e.target.value),
        },
        {
            name: "price",
            type: "number",
            value: price,
            label: "Price",
            placeholder: "Price",
            onChange: (e) => setPrice(e.target.value),
        },
        {
            name: "coins",
            type: "number",
            value: coins,
            label: "Coins",
            placeholder: "Coins",
            onChange: (e) => setCoins(e.target.value),
        },
        {
            name: "expiry",
            type: "select",
            value: expiry,
            label: "Expiry",
            onChange: handleExpiryChange,
            options: [3, 6, 9, 12].map((val) => ({
                name: `${val} Months`,
                value: val,
            })),
            unitSelect: {
                name: "expiryUnit",
                defaultValue: "months",
                options: [
                    {
                        name: "Months",
                        value: "months",
                    },
                ],
            },
        },
    ];

    return (
        <div className='fixed z-30 inset-0 bg-black/20 top-0 left-0 '>
            <div className=' w-[85%] sm:w-[350px] md:w-[450px] bg-white p-4 rounded-xl relative top-[10%] bottom-[10%]   mx-auto max-h-[calc(100%-150px)] overflow-y-auto overflow-x-hidden'>

                <div className=' '>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className={`text-2xl text-black `}>Add your Memberships</h1>
                        <button className='text-black text-xl' onClick={() => onClose()}><MdOutlineClose /></button>

                    </div>
                    <div className=''>
                        {/* {popupService?.map((item,index)=>( */}
                        <div className="grid grid-cols-1 gap-y-3 mb-4">
                            {formFields.map((input, index) => {
                                const { name, placeholder, label, type, value, options, onChange } = input;
                                return (
                                    <div key={index} className="grid grid-cols-2 ">
                                        {
                                            !options ? <NormalInput
                                                placeholder={placeholder}
                                                label={label}
                                                name={name}
                                                value={value}
                                                type={type}
                                                onChange={onChange}
                                                inputStyles={{
                                                    'borderRadius': '10px',
                                                    padding: "10px 15px",

                                                }}
                                                lableStyles={{
                                                    'fontWeight': '400',
                                                    "fontSize": "14px",
                                                    'color': '#000000'
                                                }}
                                            />
                                                :
                                                <NormalSelect
                                                    label={label}
                                                    name={name}
                                                    value={value}
                                                    options={options}
                                                    onChange={onChange}
                                                    inputStyles={{
                                                        'borderRadius': '10px',
                                                        padding: "10px 15px",

                                                    }}
                                                    lableStyles={{
                                                        'fontWeight': '400',
                                                        "fontSize": "14px",
                                                        'color': '#000000'
                                                    }}
                                                />}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-end gap-4 mt-6">
                            <button
                                className="rounded-[5px] w-[120px] text-sm  border border-ternary text-ternary py-[5px] px-[24px]"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
                                onClick={handleAddMembership}
                            >
                                ADD
                            </button>
                        </div>
                        {/* ))} */}
                    </div>


                </div>



            </div>

        </div>
    )
}

export default NewMembershipModal