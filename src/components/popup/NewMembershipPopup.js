import { useState, useEffect } from 'react';
import { MdOutlineClose } from "react-icons/md";
import { postApiData } from '../../utils/services';
import toast from 'react-hot-toast';
import NormalInput from '../customInput/NormalInput';
import NormalSelect from '../customInput/NormalSelect';
import CustomDiscount from './CustomDiscount';
const NewMembershipModal = ({ isVisible, onClose, mode = "add", membershipData = null,onSubmit=()=>{} }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(null);
    const [coins, setCoins] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [bdDiscount, setBdDiscount] = useState(0);
    const [anvDiscount, setAnvDiscount] = useState(0);
    const [expiry, setExpiry] = useState(3);
      const [discountType, setDiscountType] = useState('daily');
        const [dailyDiscount, setDailyDiscount] = useState(0);
        const [dayWiseDiscounts, setDayWiseDiscounts] = useState({
            0: 0, // Sunday
            1: 0, // Monday
            2: 0, // Tuesday
            3: 0, // Wednesday
            4: 0, // Thursday
            5: 0, // Friday
            6: 0  // Saturday
        });
    
        const daysOfWeek = [
            { key: 0, label: 'Sunday' },
            { key: 1, label: 'Monday' },
            { key: 2, label: 'Tuesday' },
            { key: 3, label: 'Wednesday' },
            { key: 4, label: 'Thursday' },
            { key: 5, label: 'Friday' },
            { key: 6, label: 'Saturday' }
        ];
    
    const handleDayWiseChange = (day, value) => {
        const numValue = parseFloat(value) || 0;
        if (numValue >= 0 && numValue <= 100) {
            setDayWiseDiscounts(prev => ({
                ...prev,
                [day]: numValue
            }));
        }
    };

    const handleDailyDiscountChange = (value) => {
        const numValue = parseFloat(value) || 0;
        if (numValue >= 0 && numValue <= 100) {
            setDailyDiscount(numValue);
        }
    };
      useEffect(() => {
        if (membershipData && (mode === "edit" || mode === "view")) {
            setName(membershipData.name || "");
            setPrice(membershipData.price || "");
            setCoins(membershipData.credits || "");
            setExpiry(membershipData.expiry || 3);
            setBdDiscount(membershipData.bdDiscount || 0);
            setAnvDiscount(membershipData.anvDiscount || 0);

            if (membershipData.dailyDiscount && typeof membershipData.dailyDiscount === 'object') {
                setDiscountType("daywise");
                setDayWiseDiscounts(membershipData.dailyDiscount);
                setDiscount(0);
                setDailyDiscount(0);
            } else {
                setDiscountType("daily");
                setDiscount(membershipData.discount || 0);
                setDailyDiscount(membershipData.discount || 0);
                setDayWiseDiscounts({
                    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
                });
            }
        } else {
            setName("");
            setPrice(null);
            setCoins(null);
            setDiscount(0);
            setBdDiscount(0);
            setAnvDiscount(0);
            setExpiry(3);
            setDiscountType('daily');
            setDailyDiscount(0);
            setDayWiseDiscounts({
                0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
            });
        }
    }, [membershipData, mode]);
    if (!isVisible) return null;
    const handleExpiryChange = (e) => {
        setExpiry(+e.target.value)

    }



    const handleAddMembership = () => {
        const data = {
            name: name,
            price: +price,
            credits: +coins,
            expiry: +expiry,
            discount: discountType==="daywise"?0:Math.min(+dailyDiscount, 100),
            bdDiscount:Math.min(+bdDiscount, 100),
            anvDiscount:Math.min(+anvDiscount, 100),
           ...(discountType==="daywise"&& {dailyDiscount:dayWiseDiscounts})
        }
        if (mode === "edit" && membershipData?._id) {
            data.membershipId = membershipData._id;
        }

        const isEveryEmpty = Object.values(data).every(elm => !elm || elm === "")
        if (isEveryEmpty) {
            return toast.error("Please Fill All Fields")
        }
        
        const endpoint = mode === "edit" ? "parlor/updateMembershipForParlor" : "parlor/createMembershipForParlor";
        
        postApiData(endpoint,
            data,
            (res) => {

                toast.success(mode === "edit" ? "Membership Updated Successfully!" : "Membership Added Successfully!")
             
                setName("")
                setPrice(null)
                setCoins(null)
                setExpiry(null)
                setDiscount(0)
                   onSubmit()
            },
            (error) => {

                toast.error("Something went wrong!")
            }
        )
        onSubmit()
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
            name: "discount",
            type: "number",
            value: discount,
            label: "Discount %",
            placeholder: "Discount %",
            onChange: (e) => setDiscount(Math.max(0, Math.min(+e.target.value, 100))),
        },
        {
            name: "bdDiscount",
            type: "number",
            value:bdDiscount,
            label: "Birthday Discount %",
            placeholder: "Discount %",
            onChange: (e) => setBdDiscount(Math.max(0, Math.min(+e.target.value, 100))),
        },
        {
            name: "anvDiscount",
            type: "number",
            value: anvDiscount,
            label: "Anniversary Discount %",
            placeholder: "Discount %",
            onChange: (e) => setAnvDiscount(Math.max(0, Math.min(+e.target.value, 100))),
        },
        {
            name: "expiry",
            type: "select",
            value: expiry,
            label: "Expiry",
            onChange: handleExpiryChange,
            options: [3, 6, 9, 12, 24].map((val) => ({
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
        <div className='fixed z-40 inset-0 bg-black/20 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain'>
            <div className=' w-full sm:w-[350px] md:w-[750px] bg-white p-4 rounded-xl relative mx-auto my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden'>

                <div className=' '>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className={`text-2xl text-black `}>{mode === "view" ? "View Membership" : mode === "edit" ? "Edit Membership" : "Add your Memberships"}</h1>
                        <button className='text-black text-xl' onClick={() => onClose()}><MdOutlineClose /></button>

                    </div>
                    <div className=''>
                        {/* {popupService?.map((item,index)=>( */}
                        <div className="grid grid-cols-1 gap-y-3 mb-4">
                            {formFields.map((input, index) => {
                                const { name, placeholder, label, type, value, options, onChange } = input;
                                if (name === "discount") {
                                    return (<CustomDiscount
                                          label={label}
                                        discountType={discountType}
                                        setDiscountType={setDiscountType}
                                        dailyDiscount={dailyDiscount}
                                        dayWiseDiscounts={dayWiseDiscounts}
                                        daysOfWeek={daysOfWeek}
                                        handleDayWiseChange={handleDayWiseChange}
                                        handleDailyDiscountChange={handleDailyDiscountChange}
                                        placeholder={placeholder}
                                        disabled={mode === 'view'}
                                      
                                       

                                    />)
                                }
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
                                                disabled={mode === 'view'}
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
                                                    disabled={mode === 'view'}
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
                                )
                            })}

                        </div>
                        <div className="flex items-center justify-end gap-4 mt-6">
                            <button
                                className="rounded-[5px] w-[120px] text-sm  border border-ternary text-ternary py-[5px] px-[24px]"
                                onClick={onClose}
                            >
                                {mode === 'view' ? "Close" : "Cancel"}
                            </button>
                            {mode !== 'view' && (
                                <button
                                    className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
                                    onClick={handleAddMembership}
                                >
                                    {mode === 'edit' ? "UPDATE" : "ADD"}
                                </button>
                            )}
                        </div>
                        {/* ))} */}
                    </div>



                </div>



            </div>

        </div>
    )
}

export default NewMembershipModal