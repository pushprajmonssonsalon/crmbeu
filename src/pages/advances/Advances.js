import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import useDebouncer from '../../utils/hooks/useDebouncer';
import { formatDateToFull, formatDateWOYear, postApiData } from '../../utils/services';
import OrderPaymentPopup from '../../components/popup/OrderPayment';
import toast from 'react-hot-toast';
import { IoMdPersonAdd, IoMdPrint } from 'react-icons/io';
import AddCustomerModal from '../../components/modals/AddCustomerModal';
import CustomSearchInputFeild from '../../components/customInput';
import { FaFileExcel } from 'react-icons/fa';
import exportToExcel from '../../utils/exportToExcel';
import CustomTable from '../../components/Table/CustomTable';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

const Advances = () => {
    const [advances, setAdvances] = useState([]);
    const [userData, setUserData] = useState([]);
    const { debouncedFunction } = useDebouncer();
    const [params] = useSearchParams();
    const sd = params.get('start')
    const ed = params.get('end')
    const defaultStartDate = new Date();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(sd ? new Date(sd) : defaultStartDate);
    const [endDate, setEndDate] = useState(ed ? new Date(ed) : defaultStartDate);
    const [visible, setVisible] = useState(false);
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
                toast.success("User has been created! Please select the user");
            },
            (error) => {

            }
        );

    };
    const handleAdd = () => {
        const data = {
            userId: advanceData.userId,
            amount: advanceData.balance,
            paymentMethods: advanceData.paymentMethods,
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
                console.log(resp);
            },
            (error) => {
                toast.error("Advance not Added ");
            })
    }
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
                            paymentMethod:elm?.paymentMethod?.filter(el=>el.amount>0).map((item) => item.name).join(" , ")||"",
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
    };


    useEffect(() => {
        searchClick();
    }, [])

    return (
        <Layout>
            <div className="mt-52 md:mt-32 w-[90%] mx-auto ">
                <div className="my-6 flex items-center justify-center">
                    <span className="font-bold my-9 text-[30px] text-green-600 ">
                        Advance Payment
                    </span>
                </div>
                <div>
                    <div className="my-6 flex items-center justify-start">

                        <div className="flex  justify-start items-center">
                            <h4 className="text-lg font-semibold text-black">
                                Add new Customer
                            </h4>
                            <button
                                // className={`mx-4 ${isMobileValid ? 'bg-black text-white font-semibold px-3 py-2 cursor-pointer' : 'bg-gray-500 text-white font-semibold px-3 py-2 cursor-not-allowed'}`}
                                className={`mx-4 bg-black text-white font-semibold px-3 py-2 cursor-pointer`}
                                onClick={() => setModalOpen(true)}
                            >
                                <IoMdPersonAdd />
                            </button>
                        </div>

                    </div>
                </div>
                <div className="flex flex-wrap justify-between  gap-5 items-center shadow-lg px-4 py-4 rounded-lg bg-[#fffffe] mt-4">
                    <div className="relative ">
                        <input
                            className=" py-3 w-[240px] rouded-[10px] outline-none border-2 border-gray-400"
                            type="text"
                            name='phoneNumber'
                            placeholder="Search by Mobile"
                            onChange={onChange('phoneNumber')}
                            value={advanceData?.phoneNumber}

                        />

                        {visible && advanceData?.phoneNumber?.length > 0 && (
                            <div className="absolute top-[70px] h-[104px] w-[283px] overflow-auto bg-white p-3 shadow-xl rounded-lg z-[3]">
                                {userData?.length > 0 &&
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

                    <input
                        className=" py-3 w-[240px] rouded-[10px] outline-none border-2 border-gray-400"
                        name='balance'
                        type="Number"
                        placeholder="Enter Amount"
                        onChange={onChange('balance')}
                        value={advanceData?.balance}

                    />


                    <button
                        disabled={advanceData?.balance === 0}
                        className="text-xl font-semibold text-white bg-green-600 px-6 py-1 rounded-lg hover:bg-green-800 hover:scale-105"
                        onClick={() => setIsVisible(true)}
                    >
                        PAY
                    </button>
                    {/* <button
                        className="text-xl font-semibold text-white bg-green-600 px-6 py-1 rounded-lg hover:bg-green-800 hover:scale-105"
                        onClick={() => setIsVisible(true)}
                    >
                        PAY
                    </button> */}

                    <button
                        className="h-[40px] w-[100px] bg-black flex items-center justify-center border border-grey-200  px-[35px] ronded-[11px] cursor-pointer"
                        onClick={handleAdd}
                    >
                        <span
                            className="text-white font-medium text-[15px]"
                        // onClick={onClickBuyNow}
                        >
                            ADD
                        </span>
                    </button>
                </div>
                <div className="flex justify-start items-center gap-4">
                    {banners.map((elm, index) => {
                        return (
                            <div className="gradient-container">
                                <div
                                    key={index}
                                    className="flex  flex-col text-[20px] font-normal items-center"
                                >
                                    <span className="totalContainer">{elm.name}</span>
                                    <span className="text-orange-600 font-semibold">
                                        {elm.value}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex gap-9 my-6 items-start justify-center">
                    <CustomSearchInputFeild
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        submitClick={searchClick}
                    />
                    <button
                        onClick={handleExport}
                        className="bg-green-600 text-sm mt-auto mb-1 flex items-center justify-center gap-1 font-semibold hover:bg-green-500 text-white rounded-md w-[80px] active:scale-105 transition-all ease-in duration-100"
                    >
                        <span>Export</span>
                        <FaFileExcel />
                    </button>{" "}
                </div>
                {advances?.length > 0 && <div className="my-10 w-[95%] mx-auto ">

                    <CustomTable
                        rows={advances}
                        columns={headings}
                        handlePrint={handlePrint}
                    />

                </div>}
            </div>


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

        </Layout>

    )
}

export default Advances