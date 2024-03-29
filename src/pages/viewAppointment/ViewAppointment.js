import React from "react";
import CustomInputFeild from "../../components/customInput";
import { useEffect,useRef } from "react";
import { getApiCall, postApiData } from "../../utils/services";
import { useState } from "react";
import './ViewAppointment.css';
import CustomModal from "../../components/customModal";
import InvoiceGenrator from "../../components/customInovice";
import { Link, useNavigate } from 'react-router-dom';
import Layout from "../../components/Layout";
import { FaEdit } from "react-icons/fa";
import { IoPrintSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import ViewPopup from "../../components/popup/ViewPopup";
import {toast} from "react-hot-toast";
import { FaDollarSign } from "react-icons/fa6";
import { FaAmazonPay } from "react-icons/fa6";
import { LiaCcAmazonPay } from "react-icons/lia";

const ViewAppointment = () => {
  const [tab,setTab] = useState("crm");
  const [viewAppointmentDetails, setViewAppointmentDetails] = useState([]);
  const [status, setStatus] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log("selectedoptions", selectedOptions);
  const [modal, setModal] = useState(false);
  const [calculatedValues, setCalculatedValues] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  console.log("paymentMethods", paymentMethods);
  console.log("viewAppointmentDetails",viewAppointmentDetails)
  const [appointmentstatus,setAppointmentStatus]=useState(false)
  const [printStatus,setPrintStatus]=useState(false)
  const [modalAmount,setModalAmount]=useState(0)
  const [membershipPoints,setMemberShipPoints]=useState(0)
  // show popup
  const [showPopup ,setShowPopup] = useState(false);

  //true and false

  const [isStatusChange,setIsStatusChange] = useState(false)

  //date 
  const defaultStartDate = new Date();
    const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultStartDate);

  const navigate = useNavigate();

  console.log({viewAppointmentDetails})

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
  // useEffect(() => {
  //   getApiCall(
  //     "appointment/getAppointments",
  //     (resp) => {
  //       console.log("resp", resp);
  //       setViewAppointmentDetails(resp);
  //     },
  //     (error) => {
  //       console.log("error", error);
  //     }
  //   );
  // }, [status,isStatusChange,appointmentstatus]);

  // const handlePrint = () => {
  //      const printWindow = window.open('', '_blank');
  //   setPrintStatus(true)
  //   printWindow.print();
  //   printWindow.close();
  // };
  const handlePrint = (item) => {
    // setPrintStatus(true);
    // setTimeout(() => {
    //     window.print();
    //     setPrintStatus(false);
    // }, 500);
    console.log("mera h item",item)
    if(item.status ===2 || item.status === 1){
      toast.error("Appointment is not completed!")
    }
    else navigate('/invoicegenerator',{ state: item })
    
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
        if(resp){
          setAppointmentStatus(true)
          // setStatus(3)
          setIsStatusChange(!isStatusChange)
          toast.success("Appointment Completed!")
        }
      },
      (error) => {
        console.log("error", error);
      }
    );
  };
  const cancelPress = (item) => {
    if(item.status === 3){
      toast.error("Appointment has completed , you cannot cancel it! ")
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
        if(resp){
          setAppointmentStatus(false)
          // setStatus(2)
          setIsStatusChange(!isStatusChange)
          toast.error("Appointment cancelled sucessfully!")
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
  const selectClick = (amount,membershipPoints,status) => {
    console.log("amountpayable",membershipPoints)
    setModalAmount(amount)
    setMemberShipPoints(membershipPoints)
    setModal(true);
    if(status === 1){
      setShowPopup(true)
    } 
  };

  const getStatusNumber = (status) => {
    console.log("status",status)
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
  useEffect(()=>{
    const data ={
      type : "crm",
      startDate: startDate,
      endDate: endDate
    }
    postApiData("appointment/getAppointments",
    data,
    (resp)=>{
      console.log("appresp",resp)
      if(resp){
        setTab("crm");
        setViewAppointmentDetails(resp);
      }
    },
    (error)=>{
      console.log("erro",error)
    }
    )
  },[isStatusChange])

  const handleAppTab=()=>{
    const data ={
      type : "app",
      startDate: startDate,
      endDate: endDate
    }; 
    postApiData("appointment/getAppointments",
    data,
    (resp)=>{
      console.log("appresp",resp)
      if(resp){
        
        setViewAppointmentDetails(resp);
      }
    },
    (error)=>{
      console.log("error",error)
    }
    )
    setTab("app");
  }
  const handleCrmTab=()=>{
    const data ={
      type : "crm",
    }
    postApiData("appointment/getAppointments",
    data,

    (resp)=>{
      console.log("appresp",resp)
      if(resp){
        setTab("crm");
        setViewAppointmentDetails(resp);
      }
    },
    (error)=>{
      console.log("erro",error)
    }
    )
  }
  const searchClick=()=>{
    const data ={
      type : tab,
      startDate: startDate,
      endDate: endDate
    }; 
    postApiData("appointment/getAppointments",
    data,
    (resp)=>{
      console.log("tabresp",resp)
      if(resp){
        setTab(tab);
        setViewAppointmentDetails(resp);
      }
    },
    (error)=>{
      console.log("error",error)
    }
    )
  }

  console.log({viewAppointmentDetails})
  function FormatDate(date) {
    const dates = new Date(date)
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(dates);
  
    return formattedDate;
  }
  return (
    <Layout>
    <div className="w-[90%] mx-auto mt-32">
      <div className="">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomInputFeild startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} submitClick={searchClick}/>
          {/* <div
            style={{
              border: "1px solid grey",
              marginLeft: "10px",
              marginBottom: "10px",
              width: "60px",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              borderRadius: "6px ",
              height: "30px",
              cursor:"pointer",
              background:"black"
            }}
            className="hover:scale-125 transition-all duration-100"
          >
            <span className="font-bold text-white">Add</span>
          </div> */}
        </div>



        {/* Tab content */}

        <div className="flex justify-evenly items-center my-10">
        <button className={`${tab==="crm"? 'bg-green-600':'bg-black'} px-4 py-2 rounded-lg  text-white font-bold`} onClick={handleCrmTab}>CRM</button>
        <button className={`${tab==="app"? 'bg-green-600':'bg-black'} px-4 py-2 rounded-lg text-white font-bold`} onClick={handleAppTab}>APP</button>
        </div>
        
        {/* Table */}




        {
          tab==="crm" ? (
            <div className="table-containerValue w-full overflow-x-scroll" >
         { viewAppointmentDetails.length > 0?
         <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile No.</th>
                <th>Appt. Date</th>
                <th>Services</th>
                {/* <th>Last Visit</th> */}
                <th>Amount</th>
                <th>Membership<br></br>Credit Used</th>
                <th>Status</th>
                {/* <th>Status</th> */}
                <th>Payment Mode</th>
                {/* <th>Submit</th> */}
                <th>Action</th>
              
                {/* <th>Category</th> */}
                {/* Add more column headers as needed */}
              </tr>
            </thead>
            <tbody style={{ height: "80px" }}>
              {viewAppointmentDetails?.filter((type)=>type.appointmentType === "crm")?.map((item, index) => (
                // console.log("itemarray",item.services[0].category)

                <tr
                  key={index}
                  //  onClick={() => getSalonProductsPress(item)}
                >
                  <td>{item.customer.name}</td>
                  <td>{item.customer.phoneNumber}</td>
                  <td>{FormatDate(item.createdAt)}</td>
                  {/* <td>
                    {item?.services.map((itemdata) => {
                      return (
                        <>
                          <h1>
                            {itemdata.miniSubcategory}
                          </h1>
                        </>
                      );
                    })}
                  </td> */}
                  <td>
  {item?.services.slice(0, 3).map((itemdata, index) => (
    <React.Fragment key={index}>
      <h1>{itemdata.miniSubcategory}</h1>
    </React.Fragment>
  ))}
  {item?.services.length > 3 && <span>...</span>}
</td>
                  {/* <td>{item.createdAt}</td> */}
                  <td>{item.total}</td>
                  {
                  // item.membershipCreditUsed
                  //  > 0 ? (

                    // <td>{item.membershipCreditUsed}</td>
                    <td>{(item.membershipUsed) ? item.membershipCreditUsed: 0}</td>
                  // ) : (
                  //   <td>{"0"}</td>
                  // )
                  }
              <td className={`font-semibold text-sm ${item.status === 1 ? 'text-blue-500' : item.status === 2 ? 'text-red-500' : 'text-green-600'}`}>{getStatusNumber(item.status)}</td>

                 
                  <td>
                    <div className="cursor-pointer hover:text-blue-700 font-bold"
                      onClick={()=>selectClick(item.total,item.membershipCreditUsed ,item.status)}>
                        <div className="flex justify-center items-center">
                        <button className={`text-xl font-semibold text-white bg-green-600 px-6 py-1 rounded-lg hover:bg-green-800 hover:scale-105 ${item.status === 3 || item.status === 2 ? 'cursor-not-allowed': 'cursor-pointer'}`} >PAY</button>
                        </div>
                    </div>
                  </td>
                  <td>
                    
                    <div className="flex justify-between items-center">
                    {item.status === 1  && (<Link to={`/viewAppoinment/${item._id}`}><FaEdit  className="text-black text-xl cursor-pointer" /></Link>)}
                    <IoPrintSharp className={`text-green-600 text-xl cursor-pointer hover:text-green-950`} onClick={()=>handlePrint(item)}/>
                    <GiCancel className="text-red-600 text-xl cursor-pointer" onClick={() => cancelPress(item)}/>
                    <button className="cursor-pointer" onClick={() => submitPress(item)}>Submit</button>
                    </div>
                  </td>
                
                </tr>
              ))}
            </tbody>
          </table>:
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',}}>
            <img 
            style={{height:'275px'}}
             src="https://res.cloudinary.com/dkvmvyvnx/image/upload/v1706507725/appointment_blank.519e76cd_bjiip7.png" alt="img"/>
            </div>}
        </div>
          )
          : (
            <div className="table-containerValue w-full overflow-x-scroll" >
         { viewAppointmentDetails.length > 0?
         <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile No.</th>
                <th>Services</th>
                {/* <th>Last Visit</th> */}
                <th>Amount</th>
                <th>Credit<br></br>Used</th>
                <th>Status</th>
                {/* <th>Status</th> */}
                <th>Payment Mode</th>
                {/* <th>Submit</th> */}
                <th>Action</th>
              
                {/* <th>Category</th> */}
                {/* Add more column headers as needed */}
              </tr>
            </thead>
            <tbody style={{ height: "80px" }}>
              {viewAppointmentDetails?.filter((type)=>type.appointmentType === "app")?.map((item, index) => (
                // console.log("itemarray",item.services[0].category)

                <tr
                  key={index}
                  //  onClick={() => getSalonProductsPress(item)}
                >
                  <td>{item.customer.name}</td>
                  <td>{item.customer.phoneNumber}</td>
                  <td>
  {item?.services.slice(0, 3).map((itemdata, index) => (
    <React.Fragment key={index}>
      <h1>{itemdata.miniSubcategory}</h1>
    </React.Fragment>
  ))}
  {item?.services.length > 3 && <span>...</span>}
</td>
                  {/* <td>{item.createdAt}</td> */}
                  <td>{item.total}</td>
                  {
                  // item.membershipCreditUsed
                  //  > 0 ? (

                    // <td>{item.membershipCreditUsed}</td>
                    <td>{(item.membershipUsed) ? item.membershipCreditUsed: 0}</td>
                  // ) : (
                  //   <td>{"0"}</td>
                  // )
                  }
              <td className={`font-semibold text-sm ${item.status === 1 ? 'text-blue-500' : item.status === 2 ? 'text-red-500' : 'text-green-600'}`}>{getStatusNumber(item.status)}</td>

                 
                  <td style={{ background: "" }}>
                    <div
                     
                    className="cursor-pointer hover:text-blue-700 font-bold"
                      
                      onClick={()=>selectClick(item.total,item.membershipCreditUsed )}
                      // onChange={handleChangePayment}
                      // // value={serviceSelection.subCategory}
                      // // Use 'value' for controlled components
                      // multiple={true}
                    >
                      {/* <option value="" disabled>
                        paymentMethode
                      </option> */}
                     
                        <div className="flex justify-center items-center">
                        {/* <LiaCcAmazonPay className="text-5xl  text-green-700 hover:text-blue-600"/> */}
                        <button className="text-xl font-semibold text-white bg-green-600 px-6 py-1 rounded-lg hover:bg-green-800 hover:scale-105">PAY</button>

                        </div>
                        
                    
                    </div>
                  </td>
                  {/* <td>{item.services[0].category}</td> */}
                  {/* Add more columns based on your data structure */}
                  {/* <td>
                    <span
                      className="editstyle cursor-pointer"
                      onClick={() => submitPress(item)}
                    >
                      {"Submit"}
                    </span>
                  </td> */}
                  <td
                  className="flex items-center justify-between px-2 py-2 my-3 gap-x-2">
                    {/* <Link to={`/viewAppoinment/${item._id}`}><span className="editstyle cursor-pointer hover:bg-red-500 mr-2">{"Edit"}</span></Link>

                    <span className="editstyle cursor-pointer  hover:bg-green-500" onClick={()=>handlePrint(item)}>
                      {"Print"}
                    </span>
                    <span className="text-black px-2 py-1 rounded-lg mx-1 bg-red-500 cursor-pointer  hover:bg-green-500" >Cancel</span> */}
                    {item.status === 1  && (<Link to={`/viewAppoinment/${item._id}`}><FaEdit  className="text-black text-xl cursor-pointer" /></Link>)}
                    {/* <Link to={`/viewAppoinment/${item._id}`}><FaEdit  className="text-black text-xl cursor-pointer" /></Link> */}
                    <IoPrintSharp className={`text-green-600 text-xl cursor-pointer hover:text-green-950`} onClick={()=>handlePrint(item)}/>
                    <GiCancel className="text-red-600 text-xl cursor-pointer" onClick={() => cancelPress(item)}/>
                    <button className="cursor-pointer" onClick={() => submitPress(item)}>Submit</button>
                  </td>
                
                </tr>
              ))}
            </tbody>
          </table>:
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',}}>
            <img 
            style={{height:'275px'}}
             src="https://res.cloudinary.com/dkvmvyvnx/image/upload/v1706507725/appointment_blank.519e76cd_bjiip7.png" alt="img"/>
            </div>}
        </div>
          )
        }
     
      </div>
      {/* {
        // selectedOptions.length>=1 &&
        <CustomModal
          selectedOptions={selectedOptions}
          modal={modal}
          setModal={setModal}
          payableAmount={modalAmount}
          onUpdatePayment={handleUpdatePayment}
          membershipPoints={membershipPoints}
         
        />
      } */}
      <ViewPopup 
      selectedOptions={selectedOptions}
      isVisible={showPopup} onClose={()=>setShowPopup(false)}
          modal={modal}
          setModal={setModal}
          payableAmount={modalAmount}
          onUpdatePayment={handleUpdatePayment}
          membershipPoints={membershipPoints}
       />
         {/* Conditionally render the printable version */}
         {printStatus && <InvoiceGenrator />}
    </div>
    </Layout>
  );
};

export default ViewAppointment;



{/* <td style={{ background: "" }}>
<select
  style={{
    border: "1px solid grey",
    height: "30px",
    borderRadius: "8px",
  }}
  onChange={handleAppointmentChange}
  // value={serviceSelection.subCategory}
  // Use 'value' for controlled components
>
  {/* <option value="" disabled>
appointmentStatus
</option> */}
//   {appointmentStatus?.map((item) => (
//     <option
//       key={item.id}
//       value={item.value}
//       style={{ width: "300px" }}
//       // disabled={item.appointmentvalue === 'Completed'}
//     >
//       {item.appointmentvalue}
//     </option>
//   ))}
// </select>
// </td> */}