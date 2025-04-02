import { useEffect, useMemo, useState } from 'react';
import useDebouncer from '../../utils/hooks/useDebouncer';
import { formatDate, formatDateToFull, formatDateWOYear, postApiData } from '../../utils/services';
import OrderPaymentPopup from '../../components/popup/OrderPayment';
import toast from 'react-hot-toast';
import { IoMdPrint } from 'react-icons/io';
import AddCustomerModal from '../../components/modals/AddCustomerModal';
import { FaAngleDown, FaCalendarAlt } from 'react-icons/fa';
import exportToExcel from '../../utils/exportToExcel';
import CustomTable from '../../components/Table/CustomTable';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import NormalInput from '../../components/customInput/NormalInput';
import CustomDatePicker from '../../components/customInput/CustomDatePicker';

const Advances = () => {
    const [advances, setAdvances] = useState([]);
    const [userData, setUserData] = useState([]);
    const { debouncedFunction } = useDebouncer();
    const navigate = useNavigate();
    const defaultStartDate = formatDate(new Date());
    const [searchParams] = useSearchParams();
    const start = searchParams.get("start");
    const end = searchParams.get("end")
    const [showDate, setShowDate] = useState(false)
    const [startDate, setStartDate] = useState(start ? start : defaultStartDate);
    const [endDate, setEndDate] = useState(end ? end : defaultStartDate);
    const [visible, setVisible] = useState(false);
    const [loading,setLoading]=useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        gender: "",
        'dob-date': "",
        'dob-month': "",
        'aniversary-date': "",
        'aniversary-month': "",
        dob: '',
        aniversary: '',
    });
    const [advanceData, setAdvanceData] = useState({
        name: "",
        phoneNumber: "",
        userId: "",
        balance: 0,
        paymentMethods: [],
    });
    const handleDateChange = (e) => {
        const { id, value } = e.target;
        if (id === "startDate") {
          setStartDate(value)
        } else {
          setEndDate(value)
        }
    
      }

    const nameOnclick = (item) => {
        setAdvanceData((prev) => ({ ...prev, name: item.name, phoneNumber: item.phoneNumber, userId: item._id }));

        setVisible(false);
    };

    const fetchUser = (phoneNumber, setState) => {
        const data = {
            phoneNumber,
        };
        postApiData(
            "user/searchUser",
            data,
            (resp) => {
                setState(resp);
            },
            (error) => { }
        );

    };
    const onChange = (name) => (event) => {

        const value = event?.target?.value;
        if (name === 'phoneNumber') {
            setAdvanceData((prev) => ({ ...prev, [name]: value }));

            setVisible(true);
            debouncedFunction(fetchUser, 500, value, setUserData);
        }

        else {
            setAdvanceData((prev) => ({ ...prev, [name]: name === "balance" ? parseFloat(value) : value }));
        }

    };
    const handleCustomerDetails = (e) => {
        const { name, value } = e.target;
        setCustomerDetails((prev) => ({ ...prev, [name]: value }));
    };
    const handleCustomerSubmit = () => {

        const apiData = {
            name: customerDetails.name,
            phoneNumber: customerDetails.phoneNumber,
            email: customerDetails.email,
            gender: customerDetails.gender,
            dob: formatDateWOYear(customerDetails["dob-date"], customerDetails["dob-month"]),
            aniversary: formatDateWOYear(customerDetails["aniversary-date"], customerDetails["aniversary-month"]),

        };

        postApiData(
            "parlor/registerUserForCrm",
            apiData,
            (resp) => {
                setModalOpen(false);
                setCustomerDetails({
                    name: "",
                    phoneNumber: "",
                    email: "",
                    gender: "",
                    dob: new Date(),
                    aniversary: new Date()
                });
                toast.success("User has been created");
            },
            (error) => {

            }
        );

    };
  
    const addCustomerFields = [
        {
            name: "name",
            label: "First Name",
            placeholder: "Enter Name",
            value: customerDetails.name,
        },
        {
            name: "phoneNumber",
            label: "Mobile Number",
            placeholder: "Enter Mobile Number",
            value: customerDetails.phoneNumber,
        },
        {
            name: "email",
            label: "Email Address",
            value: customerDetails.email,

            placeholder: "Enter Email Address",
        },
        {
            name: "gender",
            label: "Gender",
            value: customerDetails.gender,
            options: [
                {
                    name: "Male",
                    value: "M",
                },
                {
                    name: "Female",
                    value: "F",
                },
            ],
        },
        {
            name: "dob",
            label: "Birthday",
            value1: customerDetails["dob-date"],
            value2: customerDetails["dob-month"],
            placeholder: "Enter Aniversary",
        },
        {
            name: "aniversary",
            label: "Aniversary",
            value1: customerDetails["aniversary-date"],
            value2: customerDetails["aniversary-month"],
            placeholder: "Enter Aniversary",
        },
    ];
    const headings = [
        {
            id: "customerName",
            name: "Customer Name",
        },
        {
            id: "customerPhoneNumber",
            name: "Customer Phone",

        },
        {
            id: "amount",
            name: "Amount"
        },
        {
            id: "paymentMethod",
            name: "Payment Methods"
        },

        {
            id: "createdAt",
            name: "Created At"
        },
        {
            id: "action",
            name: "Action"
        }


    ];
    const revenue = useMemo(() => {
        let total = 0;
        let count = 0;
        advances?.forEach((item) => {
            total += item?.amount;
            count++;
        })
        return { total, count };
    }, [advances])
    const banners = [
        {
            name: "Advances",
            value: revenue?.count,
        },
        {
            name: "Total Revenue",
            value: revenue?.total,
        },
    ]
    const handleExport = () => {
        if (advances?.length > 0)
            exportToExcel(advances, "Advances", "Advances.xlsx");
    };

    const handlePrint = (item) => {
        navigate("/advanceinvoice", { state: item });
    };
    const searchClick = () => {
        const data = {
            startDate: startDate,
            endDate: endDate,
        };
        postApiData(
            "advance/getAdvanceList",
            data,
            (resp) => {
                if (resp) {
                    const data = resp.map((elm) => {
                        return {
                            ...elm,
                            paymentMethod: elm?.paymentMethod?.filter(el => el.amount > 0).map((item) => item.name).join(" , ") || "",
                            createdAt: formatDateToFull(elm?.createdAt),
                            action: <div className="flex items-center">
                                <button className="bg-green-600 text-white text-xl px-3 py-1 rounded-md" onClick={() => handlePrint(elm)}><IoMdPrint />
                                </button>
                            </div>

                        }
                    })
                    setAdvances(data);

                }

            },
            (error) => { }
        );
    };

    const handleUpdatePayment = (paymentMethods) => {
        setAdvanceData((prev) => ({ ...prev, paymentMethods }));
        const isEveryEmpty = paymentMethods.every((elm) => !elm.amount)
        if (isEveryEmpty) return toast.error("Enter Valid Amount")
        if (!advanceData.userId) return toast.error("Select UserDetails")
        const data = {
            userId: advanceData.userId,
            amount: advanceData.balance,
            paymentMethods,
        };
        postApiData(
            "advance/addAdvance",
            data,
            (resp) => {
                if (resp) {
                    toast.success("Advance Added ");
                    setAdvanceData((prev) => ({
                        name: "",
                        phoneNumber: "",
                        userId: "",
                        balance: 0,
                        expiryDate: '',
                        paymentMethods: [],
                    }));
                }
            },
            (error) => {
                toast.error("Advance not Added ");
            })
    };


    useEffect(() => {
        searchClick();
    }, [])

    return (
        <>
            <div className=" rounded-[16px] border border-primaryGray p-5  ">

                <div className="flex items-center mb-6 justify-between">

                    <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Advance</h2>
                    <div className="flex items-center gap-2">

                        <button onClick={() => setModalOpen(true)}
                            className="rounded-[16px] text-sm text-white bg-ternary py-1 px-5">
                            Add new Customer
                        </button>

                    </div>

                </div>
                {/* tab */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-12 xl:gap-x-20 gap-y-3 xl:gap-y-6">
                    <div className="flex relative flex-col gap-1">
                        <NormalInput
                            placeholder="Search by Mobile"
                            onChange={onChange('phoneNumber')}
                            value={advanceData?.phoneNumber}
                            label="Phone Number"
                            inputStyles={{
                                'borderRadius': '16px'

                            }}
                            lableStyles={{
                                'fontWeight': '400',
                                "fontSize": "16px",
                                'color': '#000000'
                            }}


                        />
                        {visible && advanceData?.phoneNumber?.length > 0 && (
                            <div className="absolute top-[80px] h-[104px] w-[283px] overflow-auto bg-white shadow-xl rounded-lg z-3">
                                {userData.length > 0 &&
                                    userData?.map((item) => {
                                        return (
                                            <div
                                                className="flex items-center px-4 py-2 mb-0 transition-all duration-300 ease-in-out transform hover:bg-[#f5da42] hover:scale-95 cursor-pointer"
                                                onClick={() => nameOnclick(item)}
                                            >
                                                <p className="mr-2 font-semibold">{item.name}</p>
                                                <p className="font-semibold">{item.phoneNumber}</p>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <NormalInput
                            label="Amount"
                            placeholder="Enter Amount"
                            onChange={onChange('balance')}
                            value={advanceData?.balance}
                            inputStyles={{
                                'borderRadius': '16px'

                            }}
                            lableStyles={{
                                'fontWeight': '400',
                                "fontSize": "16px",
                                'color': '#000000'
                            }}
                        />

                    </div>

                </div>
                <div className="flex justify-end mt-12">

                    <button
                        disabled={!advanceData?.balance}
                        onClick={() => setIsVisible(true)}

                        className="bg-black text-white rounded-[16px] w-[190px] text-sm font-normal ">Pay Now</button>
                </div>
                {/*           banners */}

            </div>
            <div className=" ">


                <div className="flex justify-start items-center my-6 gap-4">
                    {banners.map((elm, index) => {
                        return (
                            <div className="bg-white rounded-[10px] border shadow-card py-[15px] px-[37px]">
                                <div
                                    key={index}
                                    className="flex  flex-col text-[20px] font-normal items-center"
                                >
                                    <span className="text-center font-bold text-[16px] text-heading font-roboto">{elm.name}</span>
                                    <span className="text-customPurple text-[20px] font-bold">{index === 1 &&
                                        <span className="text-[16px]">₹</span>}
                                        {elm.value || 0}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>


            </div>
            <div className='flex items-center justify-between'>

                <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300`}>
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
                    {showDate && <div className=" flex items-center my-4  gap-3">
                        <CustomDatePicker
                            startDate={startDate}
                            endDate={endDate}
                            loading={loading}
                            className="bg-white gap-2 rounded-[5px] py-[10px] px-[15px] "
                            onSubmit={searchClick}
                            onChange={handleDateChange}


                        />
                    </div>}

                </div>
                {advances?.length > 0 && <button onClick={handleExport} className='bg-ternary text-white rounded-[16px] w-[110px] text-sm font-normal '>Export All</button>}
            </div>
            {advances?.length > 0 && <div className="w-full">

                <CustomTable
                    rows={advances}
                    columns={headings}
                    handlePrint={handlePrint}
                />

            </div>}
            {isVisible && (
                <OrderPaymentPopup
                    isVisible={isVisible}
                    onClose={() => setIsVisible(false)}
                    membership={advanceData?.balance}
                    onUpdatePayment={handleUpdatePayment}
                />
            )}
            {isModalOpen && <AddCustomerModal
                isModalOpen={isModalOpen}
                closeModal={() => setModalOpen(false)}
                addCustomerFields={addCustomerFields}
                handleChange={handleCustomerDetails}
                handleSubmit={handleCustomerSubmit}
                heading={"Add Customer"}
            />}

        </>

    )
}

export default Advances