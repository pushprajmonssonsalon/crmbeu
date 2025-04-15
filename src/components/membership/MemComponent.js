import { useEffect, useState } from "react";
import AddCustomerModal from "../modals/AddCustomerModal";
import toast from "react-hot-toast";
import { formatDateWOYear, getApiCall, postApiData } from "../../utils/services";
import OrderPaymentPopup from "../popup/OrderPayment";
import NormalInput from "../customInput/NormalInput";
import useDebouncer from "../../utils/hooks/useDebouncer";
import NormalSelect from "../customInput/NormalSelect";
import MutiSelect from "../customInput/MutiSelect";

const MemComponent = ({
  fields,
  setUserId,
  memOptions,
  membership,
  memValue,
  memChange,
  memLabel,
  onPayed,
  onClickBuyNow,
}) => {

  const [isVisible, setIsVisible] = useState(false);

  const { heading, actions, banners } = fields;
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const { debouncedFunction } = useDebouncer();
  const [isModalOpen, setModalOpen] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [userData, setUserData] = useState([]);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [visible, setVisible] = useState(false);
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

  const nameOnclick = (item) => {
    setPhoneNumber(item.phoneNumber);
    setVisible(false);
    setUserId(item._id);
  };
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const fetchCustomer = (data) => {
    postApiData(
      "user/searchUser",
      data,
      (resp) => {

        setUserData(resp);
      },
      (error) => {

      }
    );
  }
  const handleMobileChange = (event) => {
    const enteredMobileNumber = event.target.value;
    setPhoneNumber(enteredMobileNumber);
    setVisible(true);
    // Check if the entered mobile number has 10 digits
    setIsMobileValid(enteredMobileNumber.length === 10);
    const data = {
      phoneNumber: enteredMobileNumber,
    };
    debouncedFunction(fetchCustomer, 500, data)
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpdatePayment = (paymentMethod) => {
    setPaymentMethods(paymentMethod);
    onPayed();

    const data = {
      selectedStaff,
      paymentMethods:paymentMethod,
      phoneNumber
    }
    const res = onClickBuyNow(data)

    if (res) {
      setSelectedStaff([]);
      setExpanded(false);
      setPhoneNumber("")
    }
  };
  const handleSubmit = () => {
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

        closeModal();
        setCustomerDetails({
          name: "",
          phoneNumber: "",
          email: "",
          gender: "",
        });
        toast.success("User has been created!");
      },
      (error) => {

      }
    );
  };
  const handleCheckboxChange = (event) => {
    const checkedId = event.target.value;
    const staffName = staffData.find((item) => item._id === checkedId)?.name;
    if (event.target.checked) {

      // Check if the employeeId is already in selectedStaff
      if (!selectedStaff.some((staff) => staff.employeeId === checkedId)) {
        setSelectedStaff([...selectedStaff, { employeeId: checkedId, name: staffName }]);
      }
    } else {
      setSelectedStaff(selectedStaff.filter((staff) => staff.employeeId !== checkedId));
    }
  }
  const isStaffSelected = (itemId) => {
    return selectedStaff.some((staff) => staff.employeeId === itemId)
  }

  
  const handleBuy = () => {

    if(selectedStaff?.length===0)return toast.error("Select Staff")
    if(!phoneNumber)return toast.error("Enter PhoneNumber")
    const data = {
      selectedStaff,
      paymentMethods,
      phoneNumber
    }
    const res = onClickBuyNow(data)

    if (res) {
      setSelectedStaff([]);
      setExpanded(false);
      setPhoneNumber("")
    }

  };

  useEffect(() => {
    getApiCall(
      "owner/getStaff",
      (res) => {
        setStaffData(res);
      },
      (error) => {

      }
    );
  }, []);
  return (
    <>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">

        <div className="flex items-center mb-6 justify-between">

          <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Buy Membership</h2>
          <div className="flex items-center gap-2">
            {actions.map((action, index) => {
              const handleClick = action.button.onClick;
              return (
                <button key={index} onClick={index === 0 ? openModal : handleClick}
                  className="rounded-[16px] text-sm text-white bg-ternary py-1 px-5">
                  {action.heading}{" "}

                </button>
              );
            })}
          </div>

        </div>
        {/* tab */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-12 xl:gap-x-20 gap-y-3 xl:gap-y-6">
          <div className="flex relative flex-col gap-1">
            <NormalInput
              placeholder="Search by Mobile"
              onChange={handleMobileChange}
              value={phoneNumber}
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
            {visible && phoneNumber.length > 0 && (
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
            <NormalSelect
              onChange={memChange}
              label="Membership type"

              value={memValue}
              options={memOptions}
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
          <div className="flex flex-col gap-1 relative">
            <MutiSelect
              label="Select Staff"
              setShow={setExpanded}
              show={expanded}
              selected={isStaffSelected}
              onChange={handleCheckboxChange}
              options={staffData}
              value={selectedStaff?.length > 0 ? `${selectedStaff?.length} Staff Selected` : ''}
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
          {/* <button
            className="text-xl font-semibold text-white bg-green-600 px-6 py-1 rounded-lg hover:bg-green-800 hover:scale-105"
            onClick={() => setIsVisible(true)}
          >
            PAY
          </button> */}

          {/* <div
            className="h-[40px] bg-black flex items-center justify-center border border-grey-200  px-[35px] ronded-[11px] cursor-pointer"
            onClick={handleBuy}
          >
            <span
              className="text-white font-medium text-[15px]"
            // onClick={onClickBuyNow}
            >
              Buy Now
            </span>
          </div> */}
          {/* <CheckBox
            staffData={staffData}
            selectedStaff={selectedStaff}
            setSelectedStaff={setSelectedStaff}
            expanded={expanded}
            setExpanded={setExpanded}
          /> */}
          <div className="relative ">
            <AddCustomerModal
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              addCustomerFields={addCustomerFields}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              heading={"Add Customer"}
            />
          </div>






        </div>
        <div className="flex justify-end mt-12">

          <button 
          onClick={() => setIsVisible(true)}

            className="bg-black text-white rounded-[16px] w-[190px] text-sm font-normal ">Pay Now</button>
        </div>
        {/*           banners */}

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
                <span className="text-customPurple text-[20px] font-bold">{index === 1 &&
                  <span className="text-[16px]">₹</span>}
                  {elm.value || 0}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {isVisible && (
        <OrderPaymentPopup
          isVisible={isVisible}
          onClose={()=>setIsVisible(false)}
          membership={membership}
          onUpdatePayment={handleUpdatePayment}
        />
      )}
    </>
  );
};

export default MemComponent;
