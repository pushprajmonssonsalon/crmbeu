import { useEffect, useRef, useState } from 'react';
import ExpensePopup from '../popup/ExpensePopup';
import { formatDate, formatDateToFull, getApiCall } from '../../utils/services';
import { useSearchParams } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaAngleDown } from 'react-icons/fa6';
import CustomDatePicker from '../customInput/CustomDatePicker';
import PaginationTable from '../Table/PaginationTable';
import useDebouncer from '../../utils/hooks/useDebouncer';
import exportToExcel from '../../utils/exportToExcel';

const paymentObj =
{
    "cash": "Cash",
    "petty_cash": "Petty Cash",
    "upi": "UPI",
    "credit_card": "Credit Card",
    "debit_card": "Debit Card",
    "bank_transfer": "Bank Transfer",
}
const expenseObj = {
    office: "Office Expense",
    rent: "Rent",
    travel: "Travel",
    CashToBank: "Cash Transfered to bank",
    food: "Food & Beverages",
    utilities: "Utilities",
    equipment: "Equipment",
    fuel: "Fuel",
    software: "Software / Subscriptions",
    incentive: "Incentive",
    marketing: "Marketing / Ads",
    maintenance: "Maintenance",
    misc: "Miscellaneous",
    other: "Other"
}


const Expense = () => {
    /* Basic Expense Info */
    const [showPopup, setShowPopup] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const { debouncedFunction } = useDebouncer();
    const [cash, setCash] = useState({
        pettyCash: 0,
        expense: 0
    })
    // Use URLSearchParams to parse query parameters

    const [params] = useSearchParams();
    const start = params.get("start");
    const end = params.get("end");
    const [showDate, setShowDate] = useState(false)

    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState(
        start
    );
    const [endDate, setEndDate] = useState(
        end
    );
    const [total, setTotal] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(1);
    };

    // Access a specific query parameter
    const handleAddNewExpense = () => {
        setShowPopup(true)
    }
    const banners = [
        {
            name: "Petty Cash",
            value: cash?.pettyCash,
        },
        {
            name: "Expense",
            value: cash?.expense
            ,
        },
    ]
    const columns = [
        {
            id: "expenseDate",


            name: "Expense Date",

        },
        {
            id: "expenseType",


            name: "Expense Type",

        },
        {
            id: "paymentMethod",

            name: "Payment Mode",

        },
        {
            id: "receiver",

            name: "Vendor / Paid To",

        },
        {
            id: "billAmt",
            name: "Amount",

        },

        {
            id: "gst",
            name: "GST Rate",

        },
        {
            id: "gstAmt",
            name: "GST Amount",

        },
        {
            id: "total",
            name: "Total",
        },

        {
            id: "notes",
            name: "Notes",

        },

    ]
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === "startDate") {
            setStartDate(value)
        } else {
            setEndDate(value)
        }

    }
    const handleExport = () => {
        if (expenses?.length > 0) {
            const data = expenses?.map(({ _id, createdAt, updatedAt, __v, ...res }) => res)
            exportToExcel(data, "Expense", "expense.xlsx", false);
        }

    }
    let func = () => {
        setLoading(true)
        let query = `expense/getAllExpense?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${rowsPerPage}`
        getApiCall(query, (res) => {
            setExpenses(res?.expenses?.map((elm) => ({ ...elm, expenseDate: formatDateToFull(elm?.expenseDate, false), expenseType: expenseObj[elm.expenseType], paymentMethod: paymentObj[elm.paymentMethod], })));
            setTotal(res?.pagination?.totalRecords)
            setCash(res?.cash)
            setLoading(false)
        }, () => {
            setLoading(false)
        }
        )


    }
    const searchClick = () => {
        debouncedFunction(func, 400)
    }
    const onSubmitExpense = () => {

        setShowPopup(false)

        debouncedFunction(func, 400)


    }
    let tempRef = useRef(true);
    useEffect(() => {
        if (tempRef.current && startDate && endDate)
            debouncedFunction(() => {
                func()
                tempRef.current = false;
            }, 400)

    }, [startDate, endDate,page,rowsPerPage])
    useEffect(() => {
        if(!tempRef.current)
        debouncedFunction(func, 400)
    }, [page, rowsPerPage])

    return (
        <>
            <div className="flex items-center justify-between">

                <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300 w-full`}>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center  gap-6">
                            <button onClick={() => setShowDate(!showDate)} className="flex border  shadow items-center bg-white gap-2 rounded-[5px] py-[10px] px-[15px]">
                                <FaCalendarAlt className="text-customPurple text-sm" />
                                <span className="text-secondary text-sm">Year-to-date </span>
                                <FaAngleDown className={`text-secondary text-sm ${showDate ? "rotate-180" : ""} `} />

                            </button>
                            <div className="flex gap-2 font-normal  items-center text-xs text-secondary">
                                <span>{formatDate(startDate, true)}</span>
                                <span>~</span>
                                <span>{formatDate(endDate, true)}</span>
                            </div>
                        </div>
                        <button
                            className="w-[150px] bg-ternary font-normal h-[36px] flex items-center justify-center active:bg-ternary/90 transition-colors ease-in duration-100 rounded-[16px] text-white text-sm leading-[24px]"
                            onClick={handleExport}
                        >
                            Export All
                        </button>
                    </div>
                    <div className=" flex items-center my-4  gap-3">
                        <CustomDatePicker
                            startDate={startDate}
                            endDate={endDate}
                            loading={loading}
                            className="bg-white gap-2 rounded-[5px] py-[10px] px-[15px] "
                            onSubmit={searchClick}
                            onChange={handleDateChange}
                            customDate="thismonth"


                        />
                    </div>

                </div>

            </div>
            <div className=" rounded-[16px] border border-primaryGray p-5  ">
                <div className={`mb-5  w-full`}>
                    <div className="flex items-center justify-between w-full">
                        <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">Expenses</h2>


                        <button
                            className="w-[200px] bg-ternary font-normal h-[36px] flex items-center justify-center active:bg-ternary/90 transition-colors ease-in duration-100 rounded-[16px] text-white text-sm leading-[24px]"
                            onClick={handleAddNewExpense}
                        >
                            ADD NEW EXPENSE
                        </button>


                    </div>
                    <div className="flex justify-start items-center my-6 gap-4">
                        {banners.map((elm, index) => {
                            return (
                                <div className="bg-white rounded-[10px] border shadow-card py-[15px] px-[37px]">
                                    <div
                                        key={index}
                                        className="flex  flex-col text-[20px] font-normal items-center"
                                    >
                                        <span className="text-center font-bold text-[16px] text-heading font-roboto">{elm.name}</span>
                                        <span className="text-customPurple text-[20px] font-bold">
                                            <span className="text-[16px]">₹</span>
                                            {elm.value || 0}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <PaginationTable
                        columns={columns}
                        rows={expenses}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        handleRowschange={handleChangeRowsPerPage}
                        handlePage={handleChangePage}
                        total={total}
                    />
                </div>

            </div>
            {showPopup && <ExpensePopup
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                onSubmit={onSubmitExpense}

            />}

        </>
    )
}

export default Expense