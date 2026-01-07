import { useEffect, useState } from 'react';
import NormalSelect from '../customInput/NormalSelect';
import NormalInput from '../customInput/NormalInput';
import { MdOutlineClose } from 'react-icons/md';
import { formatValue, postApiData } from '../../utils/services';
import toast from 'react-hot-toast';

const ExpensePopup = ({ isVisible, onClose,onSubmit }) => {
    const [expenseDate, setExpenseDate] = useState("");
    const [expenseType, setExpenseType] = useState("");

    /* Vendor & Invoice */
    const [vendorName, setVendorName] = useState("");


    /* Amount & GST */
    const [amount, setAmount] = useState(0);
    const [gstRate, setGstRate] = useState(18);
    const [gstAmount, setGstAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    /* Payment */
    const [paymentMode, setPaymentMode] = useState("");

    /* Notes & Extras */
    const [notes, setNotes] = useState("");


    const expenseFormFields = [
        // {
        //     name: "title",
        //     type: "text",
        //     value: title,
        //     label: "Expense Title",
        //     placeholder: "e.g. Office Rent / Internet Bill",
        //     required: true,
        //     onChange: (e) => setTitle(e.target.value),
        // },
        {
            name: "expenseDate",
            type: "date",
            value: expenseDate,
            label: "Expense Date",
            required: true,
            onChange: (e) => setExpenseDate(e.target.value),
        },
        {
            name: "expenseType",
            type: "select",
            value: expenseType,
            label: "Expense Type",
            required: true,
            onChange: (e) => setExpenseType(e.target.value),
            options: [
                { name: "Office Expense", value: "office" },
                { name: "Rent", value: "rent" },
                { name: "Travel", value: "travel" },
                { name: "Cash Transfered to bank", value: "CashToBank" },
                { name: "Food & Beverages", value: "food" },
                { name: "Utilities", value: "utilities" },
                { name: "Equipment", value: "equipment" },
                { name: "Fuel", value: "fuel" },
                { name: "Software / Subscriptions", value: "software" },
                { name: "Incentive", value: "incentive" },
                { name: "Marketing / Ads", value: "marketing" },
                { name: "Maintenance", value: "maintenance" },
                { name: "Miscellaneous", value: "misc" },
                { name: "Other", value: "other" },
            ],
        },
        {
            name: "paymentMode",
            type: "select",
            value: paymentMode,
            label: "Payment Mode",
            required: true,
            onChange: (e) => setPaymentMode(e.target.value),
            options: [
                { name: "Cash", value: "cash" },
                { name: "Petty Cash", value: "petty_cash" },
                { name: "UPI", value: "upi" },
                { name: "Credit Card", value: "credit_card" },
                { name: "Debit Card", value: "debit_card" },
                { name: "Bank Transfer", value: "bank_transfer" },
            ],
        },
        {
            name: "vendorName",
            type: "text",
            value: vendorName,
            label: "Vendor / Paid To",
            placeholder: "Vendor or Company Name",
            onChange: (e) => setVendorName(e.target.value),
        },
        {
            name: "amount",
            type: "number",
            value: amount,
            label: "Amount",
            placeholder: "Base Amount",
            required: true,
            onChange: (e) => setAmount(+e.target.value),
        },

        {
            name: "gstRate",
            type: "select",
            value: gstRate,
            label: "GST Rate",
            onChange: (e) => setGstRate(+e.target.value),
            options: [0, 5, 12, 18, 28].map((rate) => ({
                name: `${rate}%`,
                value: rate,
            })),
        },
        {
            name: "gstAmount",
            type: "number",
            value: gstAmount,
            label: "GST Amount",
            placeholder: "Auto / Manual",
            disabled: true,
        },
        {
            name: "totalAmount",
            type: "number",
            value: totalAmount,
            label: "Total Amount (Including GST)",
            disabled: true,
        },

        {
            name: "notes",
            type: "textarea",
            value: notes,
            label: "Notes",
            placeholder: "Additional details about this expense",
            onChange: (e) => setNotes(e.target.value),
        },

    ];
    useEffect(() => {
        if (amount > 0) {
            const gst = (amount * gstRate) / 100;
            setGstAmount(formatValue(gst));
            setTotalAmount(formatValue(amount + gst));
        } else {
            setGstAmount(0);
            setTotalAmount(amount);
        }
    }, [amount, gstRate]);

    const handleAddExpense = () => {
        const obj = {
            expenseDate,
            expenseType,
            vendorName,
            amount,
            gstRate,
            gstAmount,
            totalAmount,
            paymentMode,
            notes
        };
        postApiData("expense/createExpense",obj,
            (res)=>{

                if(res){
                    toast.success("expense created");
                    onSubmit()
                }
        },()=>{
            
        })
    }
    return (
        <>
            <div className='fixed z-30 inset-0 bg-black/20 top-0 left-0 '>
                <div className=' w-[85%] sm:w-[350px] md:w-[750px] bg-white p-4 rounded-xl relative top-[10%] bottom-[10%]   mx-auto max-h-[calc(100%-150px)] overflow-y-auto overflow-x-hidden'>

                    <div className=' '>
                        <div className='flex justify-between items-center mb-6'>
                            <h1 className={`text-2xl text-black `}>Add your Expense</h1>
                            <button className='text-black text-xl' onClick={() => onClose()}><MdOutlineClose /></button>

                        </div>
                        <div className=''>
                            {/* {popupService?.map((item,index)=>( */}
                            <div className="grid grid-cols-1 gap-y-3 mb-4">
                                {expenseFormFields.map((input, index) => {
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
                                    )
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
                                    onClick={handleAddExpense}
                                >
                                    ADD
                                </button>
                            </div>
                            {/* ))} */}
                        </div>



                    </div>



                </div>

            </div>
        </>
    )
}

export default ExpensePopup