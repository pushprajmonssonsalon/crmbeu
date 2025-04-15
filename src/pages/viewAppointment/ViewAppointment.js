import { useEffect } from "react";
import { formatDate, postApiData } from "../../utils/services";
import { useState } from "react";
import "./ViewAppointment.css";
import InvoiceGenrator from "../../components/customInovice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import StickyHeadTable from "../../components/MaterialTable/stickytable";
import StickyAppHeadTable from "../../components/MaterialTable/stickyAppTable";
import ProductQuantityPopup from "../../components/popup/ProductQuantityPopup";
import ViewPopup from "../../components/popup/ViewPopup";
import exportToExcel from "../../utils/exportToExcel";
import { FaAngleDown, FaCalendarAlt } from "react-icons/fa";
import CustomDatePicker from "../../components/customInput/CustomDatePicker";

const ViewAppointment = () => {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState("")
  const [showDate, setShowDate] = useState(false)
  const start = params.get("start");
  const end = params.get("end");
  const [apptId, setApptId] = useState("");
  const [loadingStates, setLoadingStates] = useState({});
  const [alreadyAddedProduct, setAlreadyAddedProduct] = useState([]);
  const [tab, setTab] = useState("crm");
  const [viewAppointmentDetails, setViewAppointmentDetails] = useState([]);
  const [activeAppointment, setActiveAppointment] = useState({});
  const [modal, setModal] = useState(false);
  const [printStatus, setPrintStatus] = useState(false);
  // show popup
  const [showPopup, setShowPopup] = useState(false);
  // show quantity popup
  const [showQuantityPopup, setShowQuantityPopup] = useState(false);
  //true and false

  const [isStatusChange, setIsStatusChange] = useState(false);

  //date
  const defaultStartDate = formatDate(new Date());
  const [startDate, setStartDate] = useState(
    start ? start : defaultStartDate
  );
  const [endDate, setEndDate] = useState(
    end ? end : defaultStartDate
  );
  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === "startDate") {
      setStartDate(value)
    } else {
      setEndDate(value)
    }

  }
  const navigate = useNavigate();




  // ...

  // Inside your component or a useEffect, calculate and store the values



  const handlePrint = (item) => {

    if (item.status === 2 || item.status === 1) {
      toast.error("Appointment is not completed!");
    } else {
      navigate("/invoicegenerator", { state: item });
    }
    //  window.open(item.invoiceUrl,'_blank');
  };

  const submitPress = (item) => {
    const activeAppointment = viewAppointmentDetails.find(
      (elm) => elm._id === item._id
    );
    const { userId, advanceUsed } = item;
    if (activeAppointment) {
      const data = {
        status: 3,
        id: item._id,
        comment,
        ...((advanceUsed && userId) && { advanceUsed, userId }),
        paymentMethod: item?.paymentMethod,
      };
      setLoadingStates((prevLoadingStates) => ({
        ...prevLoadingStates,
        [item._id]: true,
      }));

      postApiData(
        "appointment/changeAppointmentStatus",
        data,
        (resp) => {

          if (resp) {
            setLoadingStates((prevLoadingStates) => ({
              ...prevLoadingStates,
              [item._id]: false,
            }));
            // setStatus(3)
            setIsStatusChange(!isStatusChange);
            toast.success("Appointment Completed!");
          }
        },
        (error) => {
          setLoadingStates((prevLoadingStates) => ({
            ...prevLoadingStates,
            [item._id]: false,
          }));

        }
      );
    } else {
      toast.error("Appointment not found!");
    }
    setComment("");
  };
  const cancelPress = (item) => {
    if (item.status === 3) {
      toast.error("Appointment has completed , you cannot cancel it! ");
    }
    const data = {
      status: 2,
      id: item._id,
      comment,
      paymentMethod: viewAppointmentDetails?.paymentMethods,
    };

    postApiData(
      "appointment/changeAppointmentStatus",
      data,
      (resp) => {

        if (resp) {
          // setStatus(2)
          setIsStatusChange(!isStatusChange);
          toast.error("Appointment cancelled sucessfully!");
        }
      },
      (error) => {

      }
    );
  };
  const cancelAppPress = (item) => {
    if (item.status === 3) {
      toast.error("Appointment has completed , you cannot cancel it! ");
    }
    const data = {
      status: 2,
      id: item._id,
      comment,

      paymentMethod: viewAppointmentDetails?.paymentMethods,
    };

    postApiData(
      "appointment/changeAppointmentStatus",
      data,
      (resp) => {

        if (resp) {
          // setStatus(2)
          setIsStatusChange(!isStatusChange);
          toast.error("Appointment cancelled sucessfully!");
        }
      },
      (error) => {

      }
    );
  };

  // const handleChangePayment = (e) => {
  //   const selectedValue = e.target.value;
  //   setSelectedOptions([...selectedOptions, selectedValue]);
  // };
  const selectClick = ({
    total,
    membershipCreditUsed,
    status,
    isPaid,
    isCaptured,
    _id,
  }) => {


    setModal(true);
    const appointment = viewAppointmentDetails.find((elm) => elm._id === _id);
    if (appointment?.paymentMethod?.length === 0) {
      appointment.paymentMethod = paymentMethods;
    }

    if (status === 1 || status === 4) {
      setActiveAppointment(appointment);
      setShowPopup(true);

    }
  };



  useEffect(() => {
    const data = {
      type: tab,
      startDate: startDate,
      endDate: endDate,
    };
    postApiData(
      `appointment/getAppointments`,
      data,
      (resp) => {

        if (resp?.length > 0) {
          setLoading(false)
          setViewAppointmentDetails(resp);
        }
        else {
          setLoading(false)
        }
      },
      (error) => {
        setLoading(false)

      }
    );
  }, [isStatusChange, showQuantityPopup, tab]);

  const handleAppTab = () => {

    setTab("app");
  };
  const handleCrmTab = () => {

    setTab("crm")

  };
  const searchClick = () => {
    setLoading(true)
    const data = {
      type: tab,
      startDate: startDate,
      endDate: endDate,
    };

    postApiData(
      `appointment/getAppointments/?start=${start}&end=${end}`,
      data,
      (resp) => {

        if (resp?.length > 0) {
          setTab(tab);
          setLoading(false)

          setViewAppointmentDetails(resp);
        }
        else {
          toast.error("No Result Found")
          setLoading(false)

        }
      },
      (error) => {
        toast.error("No Result Found")
        setLoading(false)

      }
    );
  };


  const updatePaymentMethod = (elm) => {
    const updatedItem = { ...activeAppointment, ...elm };
    setViewAppointmentDetails((prev) =>
      prev.map((item) => {
        if (item._id === activeAppointment._id) {
          return updatedItem;
        }
        return item;
      })
    );

    submitPress(updatedItem);
    setShowPopup(false);
  };
  const handleExport = () => {
    const data = viewAppointmentDetails.map((elm) => ({
      PhoneNumber: elm?.customer?.phoneNumber,
      Name: elm?.customer?.name,
    }));

    exportToExcel(data, "Appointments", "appointment.xlsx");
  };
  return (
    <>
      <div className="">
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

        </div>

        <div className="flex justify-end ">

        </div>
        <div className=" rounded-[16px] border border-primaryGray p-5  ">

          <div className="flex border border-primaryGray rounded-[16px] w-fit mx-auto justify-center items-center ">
            <button
              className={`w-[150px] text-sm ${tab === "crm" ? "bg-ternary text-white" : "bg-transparent text-ternary"
                } px-4 py-2 rounded-[16px] transition-all ease-in duration-100`}
              onClick={handleCrmTab}
            >
              CRM
            </button>
            <button
              className={`w-[150px] text-sm ${tab === "app" ? "bg-ternary" : "bg-transparent text-ternary"
                } px-4 py-2 rounded-[16px] transition-all ease-in duration-100`}
              onClick={handleAppTab}
            >
              APP
            </button>
          </div>
          <h2 className="text-black text-start my-6  font-normal text-[22px] leading-[28px]">Appointment Booked</h2>


          {/* <div className=" flex mb-12 justify-center items-center">
            <CustomInputFeild
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              submitClick={searchClick}
              loading={loading}
            />
          </div> */}

          {/* Tab content */}



          {/* Table */}
          {tab === "crm" ? (
            <div className="w-full mt-6">
              {viewAppointmentDetails?.length > 0 ? (
                <StickyHeadTable
                  data={viewAppointmentDetails}
                  selectClick={selectClick}
                  handlePrint={handlePrint}
                  cancelPress={cancelPress}
                  submitPress={submitPress}
                  setShowQuantityPopup={setShowQuantityPopup}
                  showQuantityPopup={showQuantityPopup}
                  setApptId={setApptId}
                  apptId={apptId}
                  setAlreadyAddedProduct={setAlreadyAddedProduct}
                  loading={loadingStates}
                />
              ) : (
                <div
                  className="flex items-center justify-center h-[30vh]"
                >
                  <div >
                    No Appointment Found
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full mt-6">
              {viewAppointmentDetails?.length > 0 ? (
                <StickyAppHeadTable
                  data={viewAppointmentDetails}
                  handlePrint={handlePrint}
                  cancelPress={cancelAppPress}
                  submitPress={submitPress}
                  selectClick={selectClick}
                />
              ) : (
                <div
                  className="flex items-center justify-center h-[30vh]"
                >
                  <div >
                    No Appointment Found
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <ViewPopup
          comment={comment}
          setComment={setComment}
          isVisible={showPopup}
          onClose={() => setShowPopup(false)}
          modal={modal}
          isPaid={activeAppointment?.isPaid && activeAppointment?.isCaptured}
          setModal={setModal}
          onUpdate={updatePaymentMethod}
          setActiveAppointment={setActiveAppointment}
          activeAppointment={activeAppointment}
        />
        {/* <ViewPopup
          selectedOptions={selectedOptions}
          isVisible={showPopup}
          onClose={() => setShowPopup(false)}
          modal={modal}
          isPaid={isPaid}
          setModal={setModal}
          paymentMethods={viewAppointmentDetails?.paymentMethods}
          payableAmount={modalAmount}
          setPaymentMethods={setViewAppointmentDetails}
          membershipPoints={membershipPoints}
        /> */}
        <ProductQuantityPopup
          isVisible={showQuantityPopup}
          onClose={() => setShowQuantityPopup(false)}
          id={apptId}
          alreadyAddedProduct={alreadyAddedProduct}
        />
        {/* Conditionally render the printable version */}
        {printStatus && <InvoiceGenrator />}
      </div>
    </>
  );
};

const paymentMethods = [
  {
    name: "Cash",
    amount: 0,
  },
  {
    name: "Upi",
    amount: 0,
  },
  {
    name: "Card",
    amount: 0,
  },
  {
    name: "Online",
    amount: 0,
  },
  {
    name: "Pending",
    amount: 0,
  },
];

export default ViewAppointment;
