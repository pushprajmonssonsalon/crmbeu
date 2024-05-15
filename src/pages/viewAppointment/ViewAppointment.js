import React from "react";
import CustomInputFeild from "../../components/customInput";
import { useEffect, useRef } from "react";
import { getApiCall, postApiData } from "../../utils/services";
import { useState } from "react";
import "./ViewAppointment.css";
import InvoiceGenrator from "../../components/customInovice";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import ViewPopup from "../../components/popup/ViewPopup";
import { toast } from "react-hot-toast";
import StickyHeadTable from "../../components/MaterialTable/stickytable";
import StickyAppHeadTable from "../../components/MaterialTable/stickyAppTable";
import ProductQuantityPopup from "../../components/popup/ProductQuantityPopup";

const ViewAppointment = () => {
  const [apptId, setApptId] = useState("");
  const [alreadyAddedProduct, setAlreadyAddedProduct] = useState([]);
  const [tab, setTab] = useState("crm");
  const [viewAppointmentDetails, setViewAppointmentDetails] = useState([]);
  const [status, setStatus] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log("selectedoptions", selectedOptions);
  const [modal, setModal] = useState(false);
  const [calculatedValues, setCalculatedValues] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  console.log("paymentMethods", paymentMethods);
  console.log("viewAppointmentDetails", viewAppointmentDetails);
  const [appointmentstatus, setAppointmentStatus] = useState(false);
  const [printStatus, setPrintStatus] = useState(false);
  const [modalAmount, setModalAmount] = useState(0);
  const [membershipPoints, setMemberShipPoints] = useState(0);
  // show popup
  const [showPopup, setShowPopup] = useState(false);
  // show quantity popup
  const [showQuantityPopup, setShowQuantityPopup] = useState(false);
  //true and false

  const [isStatusChange, setIsStatusChange] = useState(false);

  //date
  const defaultStartDate = new Date();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultStartDate);

  const navigate = useNavigate();

  console.log({ viewAppointmentDetails });
  console.log("alreadyAddedProduct", alreadyAddedProduct);

  // ...

  // Inside your component or a useEffect, calculate and store the values
  useEffect(() => {
    // Use map to calculate the values and create a new array
    const calculatedArray = viewAppointmentDetails.map(
      (item) => item.total - item.membershipCreditUsed
    );

    // Set the calculated array to the state variable
    setCalculatedValues(0);
  }, [viewAppointmentDetails]);

  const paymentMethode = [
    {
      methode: "Pay",
    },
  ];
  const appointmentStatus = [
    {
      appointmentvalue: "Pending",
    },
    {
      appointmentvalue: "Completed",
    },
    {
      appointmentvalue: "Canceled",
    },
  ];
  const handlePrint = (item) => {
    console.log("mera h item", item);
    if (item.status === 2 || item.status === 1) {
      toast.error("Appointment is not completed!");
    } else navigate("/invoicegenerator", { state: item });
  };
  const handleAppointmentChange = (e) => {
    setStatus(e.target.value);
    if (e.target.value === "Pending") {
      setStatus(1);
    } else if (e.target.value === "Canceled") {
      setStatus(2);
    } else {
      setStatus(3);
    }
  };
  const handleUpdatePayment = (cash, card, upi) => {
    const updatedPaymentMethods = [
      { name: "Cash", amount: parseFloat(cash) || 0 },
      { name: "Card", amount: parseFloat(card) || 0 },
      { name: "Upi", amount: parseFloat(upi) || 0 },
    ];
    setPaymentMethods(updatedPaymentMethods);
  };

  const submitPress = (item) => {
    const data = {
      status: 3,
      id: item._id,
      paymentMethod: paymentMethods,
    };

    postApiData(
      "appointment/changeAppointmentStatus",
      data,
      (resp) => {
        console.log("response", resp);
        if (resp) {
          setAppointmentStatus(true);
          // setStatus(3)
          setIsStatusChange(!isStatusChange);
          toast.success("Appointment Completed!");
        }
      },
      (error) => {
        console.log("error", error);
      }
    );
  };
  const cancelPress = (item) => {
    if (item.status === 3) {
      toast.error("Appointment has completed , you cannot cancel it! ");
    }
    const data = {
      status: 2,
      id: item._id,
      paymentMethod: paymentMethods,
    };

    postApiData(
      "appointment/changeAppointmentStatus",
      data,
      (resp) => {
        console.log("response", resp);
        if (resp) {
          setAppointmentStatus(false);
          // setStatus(2)
          setIsStatusChange(!isStatusChange);
          toast.error("Appointment cancelled sucessfully!");
        }
      },
      (error) => {
        console.log("error", error);
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
      paymentMethod: paymentMethods,
    };

    postApiData(
      "appointment/changeAppointmentStatus",
      data,
      (resp) => {
        console.log("response", resp);
        if (resp) {
          setAppointmentStatus(false);
          // setStatus(2)
          setIsStatusChange(!isStatusChange);
          toast.error("Appointment cancelled sucessfully!");
        }
      },
      (error) => {
        console.log("error", error);
      }
    );
  };

  const handleChangePayment = (e) => {
    const selectedValue = e.target.value;
    setSelectedOptions([...selectedOptions, selectedValue]);
  };
  const selectClick = (amount, membershipPoints, status) => {
    console.log("amountpayable", membershipPoints);
    setModalAmount(amount);
    setMemberShipPoints(membershipPoints);
    setModal(true);
    if (status === 1) {
      setShowPopup(true);
    }
  };

  const getStatusNumber = (status) => {
    console.log("status", status);
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Canceled";
      case 3:
        return "Completed";
      default:
        // Handle other cases if needed
        return null; // or 'N/A'
    }
  };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  useEffect(() => {
    const data = {
      type: "crm",
      startDate: startDate,
      endDate: endDate,
    };
    postApiData(
      "appointment/getAppointments",
      data,
      (resp) => {
        console.log("appresp", resp);
        if (resp) {
          setTab("crm");
          setViewAppointmentDetails(resp);
        }
      },
      (error) => {
        console.log("erro", error);
      }
    );
  }, [isStatusChange, showQuantityPopup]);

  const handleAppTab = () => {
    const data = {
      type: "app",
      startDate: startDate,
      endDate: endDate,
    };
    postApiData(
      "appointment/getAppointments",
      data,
      (resp) => {
        console.log("appresp", resp);
        if (resp) {
          setViewAppointmentDetails(resp);
        }
      },
      (error) => {
        console.log("error", error);
      }
    );
    setTab("app");
  };
  const handleCrmTab = () => {
    const data = {
      type: "crm",
    };
    postApiData(
      "appointment/getAppointments",
      data,

      (resp) => {
        console.log("appresp", resp);
        if (resp) {
          setTab("crm");
          setViewAppointmentDetails(resp);
        }
      },
      (error) => {
        console.log("erro", error);
      }
    );
  };
  const searchClick = () => {
    const data = {
      type: tab,
      startDate: startDate,
      endDate: endDate,
    };
    postApiData(
      "appointment/getAppointments",
      data,
      (resp) => {
        console.log("tabresp", resp);
        if (resp) {
          setTab(tab);
          setViewAppointmentDetails(resp);
        }
      },
      (error) => {
        console.log("error", error);
      }
    );
  };

  console.log({ viewAppointmentDetails });
  function FormatDate(date) {
    const dates = new Date(date);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDate = formatter.format(dates);

    return formattedDate;
  }
  function formatDateTime(timestamp) {
    const dateOptions = { day: "numeric", month: "long", year: "numeric" };
    const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-IN", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-IN", timeOptions);

    return `${formattedDate}  ${formattedTime}`;
  }

  console.log("appt Id ", apptId);
  return (
    <Layout>
      <div className="w-[90%] mx-auto mt-28 overflow-x-auto">
        <div className="">
          <div className=" flex justify-center items-center">
            <CustomInputFeild
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              submitClick={searchClick}
            />
          </div>

          {/* Tab content */}

          <div className="flex justify-evenly items-center my-5 ">
            <button
              className={`${
                tab === "crm" ? "bg-green-600" : "bg-black"
              } px-4 py-2 rounded-lg  text-white font-bold`}
              onClick={handleCrmTab}
            >
              CRM
            </button>
            <button
              className={`${
                tab === "app" ? "bg-green-600" : "bg-black"
              } px-4 py-2 rounded-lg text-white font-bold`}
              onClick={handleAppTab}
            >
              APP
            </button>
          </div>

          {/* Table */}

          {tab === "crm" ? (
            <div className="">
              {viewAppointmentDetails.length > 0 ? (
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
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <img
                    style={{ height: "275px" }}
                    src="https://res.cloudinary.com/dkvmvyvnx/image/upload/v1706507725/appointment_blank.519e76cd_bjiip7.png"
                    alt="img"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="table-containerValue w-full overflow-x-scroll">
              {viewAppointmentDetails.length > 0 ? (
                <StickyAppHeadTable
                  data={viewAppointmentDetails}
                  selectClick={selectClick}
                  handlePrint={handlePrint}
                  cancelPress={cancelAppPress}
                  submitPress={submitPress}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <img
                    style={{ height: "275px" }}
                    src="https://res.cloudinary.com/dkvmvyvnx/image/upload/v1706507725/appointment_blank.519e76cd_bjiip7.png"
                    alt="img"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <ViewPopup
          selectedOptions={selectedOptions}
          isVisible={showPopup}
          onClose={() => setShowPopup(false)}
          modal={modal}
          setModal={setModal}
          payableAmount={modalAmount}
          onUpdatePayment={handleUpdatePayment}
          membershipPoints={membershipPoints}
        />
        <ProductQuantityPopup
          isVisible={showQuantityPopup}
          onClose={() => setShowQuantityPopup(false)}
          id={apptId}
          alreadyAddedProduct={alreadyAddedProduct}
        />
        {/* Conditionally render the printable version */}
        {printStatus && <InvoiceGenrator />}
      </div>
    </Layout>
  );
};

export default ViewAppointment;
