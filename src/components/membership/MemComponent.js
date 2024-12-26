import { useEffect, useState } from "react";
import AddCustomerModal from "../modals/AddCustomerModal";
import toast from "react-hot-toast";
import { getApiCall, postApiData } from "../../utils/services";
import OrderPaymentPopup from "../popup/OrderPayment";
import MultiSelectInput from "../customInput/MultiSelectInput";

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
  });

  const handleStaffSelection = (tag, id) => (e) => {
    const { value, checked } = e.target;
    const splited = value?.split("-");
    const satffName = splited[1];

    const employeeId = splited[0];

    if (checked) {
      const arr = [...selectedStaff, { name: satffName, employeeId }]

      const updatedStaffs = arr.map((prev) => ({ ...prev, share: parseInt(100 / arr.length) }))
      setSelectedStaff(updatedStaffs
      )
    } else {
      const arr = selectedStaff?.filter((elm) => elm.employeeId !== employeeId)
      const updatedStaffs = arr.map((prev) => ({ ...prev, share: parseInt(100 / arr.length) }))

      setSelectedStaff(updatedStaffs)

    }
  }








  const handleShareChange = (tag, id) => (e) => {
    const newShare = +e.target.value; // Get the updated share value from input


    setSelectedStaff((prev) => {
      const currentTotal = prev.staffs.reduce(
        (sum, staff) => (staff.employeeId === id ? sum : sum + staff.share),
        0
      );
      const adjustedShare = Math.min(newShare, 100 - currentTotal);

      return prev.staffs.map((staff) =>
        staff.employeeId === id
          ? { ...staff, share: adjustedShare }
          : staff
      )

    })
  }

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

  const handleMobileChange = (event) => {
    const enteredMobileNumber = event.target.value;
    setPhoneNumber(enteredMobileNumber);
    setVisible(true);
    // Check if the entered mobile number has 10 digits
    setIsMobileValid(enteredMobileNumber.length === 10);
    const data = {
      phoneNumber: enteredMobileNumber,
    };
    postApiData(
      "user/searchUser",
      data,
      (resp) => {

        setUserData(resp);
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
  };
  const handleSubmit = () => {
    const apiData = {
      name: customerDetails.name,
      phoneNumber: customerDetails.phoneNumber,
      email: customerDetails.email,
      gender: customerDetails.gender,
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
        toast.success("User has been created! Please select the user");
      },
      (error) => {

      }
    );
  };
  const handleBuy = () => {

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
  const staffOptions = staffData?.filter(elm => elm?.isActive)?.map((elm) => ({
    name: elm?.name,
    value: `${elm?._id}-${elm?.name}`,
  }))
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
      <div className="mt-52 md:mt-32 w-[90%] mx-auto ">
        <div className="my-6 flex items-center justify-center">
          <span className="font-bold my-9 text-[30px] text-green-600 ">
            {heading}
          </span>
        </div>
        <div className="my-6 flex items-center justify-start">
          {actions.map((action, index) => {
            const handleClick = action.button.onClick;
            return (
              <div key={index} className="flex  justify-start items-center">
                <h4 className="text-lg font-semibold text-black">
                  {action.heading}{" "}
                </h4>
                <button
                  // className={`mx-4 ${isMobileValid ? 'bg-black text-white font-semibold px-3 py-2 cursor-pointer' : 'bg-gray-500 text-white font-semibold px-3 py-2 cursor-not-allowed'}`}
                  className={`mx-4 bg-black text-white font-semibold px-3 py-2 cursor-pointer`}
                  onClick={index === 0 ? openModal : handleClick}
                >
                  {action.button.icon}
                </button>
              </div>
            );
          })}
        </div>
        {/* tab */}
        <div className="flex   flex-wrap justify-between gap-3 items-center shadow-lg px-4 py-4 rounded-lg bg-[#fffffe] mt-4">
          <div className="relative ">
            <input
                    className=" relative flex items-center justify-between mx-2 py-3 w-[240px] capitalize border border-gray-400 text-gray-900 text-sm rounded-lg p-2.5"

              type="text"
              placeholder="Search by Mobile"
              onChange={handleMobileChange}
              value={phoneNumber}

            />

            {visible && phoneNumber.length > 0 && (
              <div className="absolute top-[70px] h-[104px] w-[283px] overflow-auto bg-white shadow-xl rounded-lg z-3">
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

            <AddCustomerModal
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              addCustomerFields={addCustomerFields}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              heading={"Add Customer"}
            />
          </div>

          <select
                    className=" relative flex items-center justify-between mx-2 py-3 w-[240px] capitalize border border-gray-400 text-gray-900 text-sm rounded-lg p-2.5"
                    onChange={memChange}

            // value={memberShipdata[0]?.name}
            value={memValue}
          >
            <option value="">{memLabel}</option>
            {memOptions?.map((item) => {
              return <option value={item?.name}> {item?.name}</option>;
            })}
          </select>


          <MultiSelectInput
            val={selectedStaff}
            handleStaffSelection={handleStaffSelection}
            handleShareChange={handleShareChange}
            tag="membership"
            options={staffOptions}
          />


          <button
            className="text-xl font-semibold text-white bg-green-600 px-6 py-1 rounded-lg hover:bg-green-800 hover:scale-105"
            onClick={() => setIsVisible(true)}
          >
            PAY
          </button>

          <div
            className="h-[40px] bg-black flex items-center justify-center border border-grey-200  px-[35px] ronded-[11px] cursor-pointer"
            onClick={handleBuy}
          >
            <span
              className="text-white font-medium text-[15px]"
            // onClick={onClickBuyNow}
            >
              Buy Now
            </span>
          </div>
        </div>
        {/*           banners */}
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
      </div>

      {isVisible && (
        <OrderPaymentPopup
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          membership={membership}
          onUpdatePayment={handleUpdatePayment}
        />
      )}
    </>
  );
};

export default MemComponent;
