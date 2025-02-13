import CustomInputFeild from "../../components/customInput";
import { useEffect } from "react";
import { postApiData } from "../../utils/services";
import { useState } from "react";
import "./ViewAppointment.css";
import InvoiceGenrator from "../../components/customInovice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { toast } from "react-hot-toast";
import StickyHeadTable from "../../components/MaterialTable/stickytable";
import StickyAppHeadTable from "../../components/MaterialTable/stickyAppTable";
import ProductQuantityPopup from "../../components/popup/ProductQuantityPopup";
import ViewPopup from "../../components/popup/ViewPopup";
import exportToExcel from "../../utils/exportToExcel";

const ViewAppointment = () => {
  const [params] = useSearchParams();
  const [loading,setLoading]=useState(false)
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
  const defaultStartDate = new Date();
  const [startDate, setStartDate] = useState(
    start ? new Date(start) : defaultStartDate
  );
  const [endDate, setEndDate] = useState(
    end ? new Date(end) : defaultStartDate
  );

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
    const {userId,advanceUsed}=activeAppointment;
    if (activeAppointment) {
      const data = {
        status: 3,
        id: item._id,
        
        ...((advanceUsed&&userId)&&{advanceUsed,userId}),
        paymentMethod: activeAppointment?.paymentMethod,
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
  };
  const cancelPress = (item) => {
    if (item.status === 3) {
      toast.error("Appointment has completed , you cannot cancel it! ");
    }
    const data = {
      status: 2,
      id: item._id,
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
    if (appointment.paymentMethod.length === 0) {
      appointment.paymentMethod = paymentMethods;
    }

    if (status === 1||status===4) {
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
        
        if (resp?.length>0) {
                    setLoading(false)
          setViewAppointmentDetails(resp);
        }
        else{
          setLoading(false)
        }
      },
      (error) => {
        setLoading(false)

      }
    );
  }, [isStatusChange, showQuantityPopup,tab]);

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
        
        if (resp?.length>0) {
                    setTab(tab);
          setLoading(false)

          setViewAppointmentDetails(resp);
        }
        else{
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
    setViewAppointmentDetails((prev) =>
      prev.map((item) => {
        if (item._id === activeAppointment._id) {
          return {...activeAppointment,...elm};
        }
        return item;
      })
    );
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
    <Layout>
      <div className="w-[90%] mx-auto mt-28 overflow-x-auto my-10">
        <div className="flex justify-end mt-12">
          <button
            className={`
               bg-black
             px-4 py-2 rounded text-white font-bold`}
            onClick={handleExport}
          >
            Export
          </button>
        </div>
        <div className="">
          <div className=" flex mb-12 justify-center items-center">
            <CustomInputFeild
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              submitClick={searchClick}
              loading={loading}
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
    </Layout>
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
