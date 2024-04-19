import React, { useEffect, useState } from "react";
import "./membership.css";
import CustomInputFeild from "../../components/customInput";
import { getApiCall, postApiData } from "../../utils/services";
import Modal from "react-modal";
import Layout from "../../components/Layout";
import CustomAlert from "../../components/customAlert";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router";
import { IoPrintSharp } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";
// import { FaAmazonPay } from "react-icons/fa6";
import { FaCcAmazonPay } from "react-icons/fa6";
import { MdCardMembership } from "react-icons/md";
import OrderPaymentPopup from "../../components/popup/OrderPayment";
import NewMembershipModal from "../../components/popup/NewMembershipPopup";
import CustomizedTables from "../../components/MaterialTable";
import CheckBox from "../../components/checkbox";
export default function Membership() {
  const [expanded, setExpanded] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [isNewMembershipModal,setIsNewMembershipModal] = useState(false)
  const [isVisible,setIsVisible] = useState(false)
  const [add,setAdd] = useState(true)
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [visible,setVisible] = useState(false)
  const [membershiptype, setMembershipType] = useState([]);
  const [payment, setPayment] = useState("");
  const [membership, setmembershipPress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [staffData, setStaffData] = useState([]);
  const [selectStaff, setSelectStaff] = useState("");
  const [userData, setUserData] = useState([]);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [userId, setUserId] = useState("");
  const [filteredStaffData, setfilteredStaffData] = useState([]);
  const [memberShipdata, setMemberShipData] = useState([]);
  const [memeberShipDetails, setmemeberShipDetails] = useState([]);
  const [buyNowclick, setBuyClickNow] = useState(false);
  const [todayMembership,setTodayMembership] = useState([])
  //date 
  const defaultStartDate = new Date();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultStartDate);
  const [paymentMethods, setPaymentMethods] = useState([]);
  console.log("memeberShipDetails", memeberShipDetails[0]?.total);
  const [membershipName,setMembershipName] = useState("")
  const [modalName,setModalName] = useState("");
  const [modalPhoneNumber,setModalPhoneNumber] = useState("")
  const [isPayed , setIsPayed]= useState(false)
  const [iddd,setIddd] = useState("")
  const navigate = useNavigate();
  const paymentOption = [
    {
      payment: "Cash",
    },
    {
      payment: "Card",
    },
    {
      payment: "Upi",
    },
  ];
  useEffect(() => {
    getApiCall(
      "membership/membershipReport",
      (resp) => {
        setmemeberShipDetails(resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [buyNowclick]);
  console.log("membership report",memeberShipDetails)
  // today' membership buy api
  useEffect(() => {
    const data ={
      startDate: startDate,
      endDate: endDate
    };
    postApiData(
      "membership/membershipSaleList",
      data,
      (resp) => {
        setTodayMembership(resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [add]);
  console.log("todayMembership",todayMembership)
  const handleSubmit = () => {
    const apiData = {
      name:modalName,
      phoneNumber:modalPhoneNumber,
      email,
      gender,
    };

    postApiData(
      "parlor/registerUserForCrm",
      apiData,
      (resp) => {
        console.log("respns", resp);
        closeModal();
        setModalName("")
        setModalPhoneNumber("")
        toast.success("User has been created! Please select the user")
      },
      (error) => {
        console.log("error", error);
      }
    );
   
  };

  useEffect(() => {
    
    getApiCall(
      "membership/getMembership",
      (resp) => {
        setMembershipType(resp.membershipList);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [phoneNumber,isNewMembershipModal]);
  console.log({membershiptype})
  const membershipPress = (e) => {
    const selectedMembership = e.target.value;
    console.log({selectedMembership})
    const filteredStaffData = membershiptype.filter(
      (item) => item.name === selectedMembership
    );
    
    console.log({filteredStaffData})
    setMemberShipData(filteredStaffData);
    setMembershipName(filteredStaffData[0]?.name)
    setmembershipPress(filteredStaffData[0]?.price);
  };
  console.log({memberShipdata})
  console.log({membership})
  const paymentPress = (e) => {
    setPayment(e.target.value);
  };
  useEffect(() => {
    getApiCall(
      "owner/getStaff",
      (res) => {
        setStaffData(res);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [memberShipdata]);
  const handlestaffChange = (e) => {
    // setIddd(e.target.value)
    const selectedId= e.target.value;

    // Filter staffData based on the selected name
    const filteredStaffData = staffData.filter(
      (item) => item._id === selectedId
    );

    setfilteredStaffData(filteredStaffData);
    setSelectStaff(e.target.value);
  };
  console.log("checkbox selected staff", selectedStaff)
  console.log('idddddddd',iddd)
  console.log("filter staff name",filteredStaffData)
  const handleMobileChange = (event) => {
    const enteredMobileNumber = event.target.value;
    setPhoneNumber(enteredMobileNumber);
    setVisible(true)
    // Check if the entered mobile number has 10 digits
    setIsMobileValid(enteredMobileNumber.length === 10);
    const data = {
      phoneNumber: enteredMobileNumber,
    };
    postApiData(
      "user/searchUser",
      data,
      (resp) => {
        console.log("respons", resp);
        setUserData(resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
  };
  
  const onClickBuyNow = () => {
    // paymentMethod, userId, employees, name, credits, creditsLeft, expiryDate, active, price
    const data = {
      // paymentMethod: [
      //   {
      //     name: "Cash",
      //     amount: +membership,
      //   },
      // ],
      paymentMethod: paymentMethods,
      userId: userId,
      employees: selectedStaff,
      // employees: {
      //   name: filteredStaffData[0]?.name,
      //   id: filteredStaffData[0]?._id,
      // },
      membershipId: memberShipdata[0]?._id,
    };
    if(phoneNumber!=="" && selectedStaff.length>0  && memberShipdata !== null && isPayed===true && membershipName!==""){
      postApiData(
        "membership/buyMembership",
        data,
        
        (resp) => {
            if (resp) {
              // alert("MemberShip Purchased SucessFully");
              toast.success("MemberShip Purchased SucessFully");
              setBuyClickNow(true);
              setSelectedStaff([])
              setExpanded(false)
              setAdd(!add)
              
            }
        },
        (error) => {
          console.log("error", error);
          toast.error("Something went wrong, Please try again!!");
        }
      );
    }else{
      toast.error("Please provide the sutaible details!!")
    }
    
    setSelectStaff("")
    setMembershipType(null)
    setPhoneNumber("")
    setMembershipName("")
    setIsPayed(false)
    // setMemberShipData(null)
    
  };
  console.log("Payed",isPayed)
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const onClose=()=>{
    setIsVisible(false)
  }
  const onNewClose=()=>{
    setIsNewMembershipModal(false)
  }
  const onPayed =()=>{
    setIsPayed(true)
  }
  const nameOnclick = (item) => {
    setPhoneNumber(item.phoneNumber);
    setUserId(item._id);
    setVisible(false)
  };
  const handleAlertClose = () => {
    setAlertVisible(false);
  };
  const handlePrint = (item)=>{
    console.log("membership li h bsdk",item)
    navigate('/membershipinvoicegenerator',{ state: item })
  }
  const searchClick=()=>{
    const data ={
      startDate: startDate,
      endDate: endDate
    };
    postApiData(
      "membership/membershipSaleList",
      data,
      (resp) => {
        setTodayMembership(resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }
  console.log("membeship", todayMembership)
  const handleUpdatePayment = (cash, card, upi) => {
    const updatedPaymentMethods = [
      { name: "Cash", amount: parseFloat(cash) || 0 },
      { name: "Card", amount: parseFloat(card) || 0 },
      { name: "Upi", amount: parseFloat(upi) || 0 },
    ];
    setPaymentMethods(updatedPaymentMethods);
  };
  const openNewMembershipModal=()=>{
    setIsNewMembershipModal(true)
  }
  console.log({paymentMethods})
  console.log("slected staff",selectStaff)

  

  const headings = ["NAME","PHONE NO.","EMPLOYEE","MEMBERSHIP NAME","PRICE","CREDITS","ACTION"];

  return (
    <Layout>
    <div className="mt-32 w-[90%] mx-auto ">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // padding:'20px',
        }}
        className="my-6 "
      >
        <span style={{ fontSize: "30px", fontWeight: "500", color: "green",fontWeight: "bold" }} >
          BUY MEMBERSHIP 
        </span>
      </div>
      <div className="flex justify-start items-center">
      <h4 className="text-lg font-semibold text-black">Add new customer </h4>
      <button
              // className={`mx-4 ${isMobileValid ? 'bg-black text-white font-semibold px-3 py-2 cursor-pointer' : 'bg-gray-500 text-white font-semibold px-3 py-2 cursor-not-allowed'}`}
              className={`mx-4 bg-black text-white font-semibold px-3 py-2 cursor-pointer`}

              onClick={ openModal }
         
            >
              <IoMdPersonAdd />
            </button>
            <h4 className="text-lg font-semibold text-black ml-20">Add new membership</h4>
      <button
              // className={`mx-4 ${isMobileValid ? 'bg-black text-white font-semibold px-3 py-2 cursor-pointer' : 'bg-gray-500 text-white font-semibold px-3 py-2 cursor-not-allowed'}`}
              className={`mx-4 bg-black text-white font-semibold px-3 py-2 cursor-pointer`}

              onClick={ openNewMembershipModal }
         
            >
              <MdCardMembership/>
            </button>
      </div>
      <div
       className="flex justify-between items-center shadow-lg px-4 py-2 rounded-lg bg-[#fffffe] mt-4"
      >
        <div style={{}} className="relative mt-[10px]">
          <input
          className="mx-2 outline-none border-2 border-gray-400"
            type="text"
            placeholder="Search by Name/Mobile/Email"
            onChange={handleMobileChange}
            value={phoneNumber}
            style={{
              
              // border: "1px solid grey",
              width: "240px",
              borderRadius: "11px",
              
            
              outline:"none"
            }}
          />
          {/* {isMobileValid && (
            <button className="bg-black text-white font-semibold" onClick={openModal}>
              Add Customer
            </button>
          )} */}
          {
           visible && phoneNumber.length>0 && (
              <div style={{}} className="absolute top-[70px] h-[104px] w-[283px] overflow-auto bg-white shadow-xl rounded-lg z-3">
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
            )
          }
         
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            style={{
              content: {
                width: "50%",
                height: "70%",
                margin: "auto",
                marginTop: "70px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                padding: "20px",
              },
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.3)", // Set the overlay background color
              },
            }}
          >
            <div className="formgroup-section">
              <h1 className="text-center text-xl font-semibold text-black">Add Customer Appointment</h1>
              <div className="first-row">
                <div className="input-container">
                  <div>First Name</div>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className="input-field"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                  />
                </div>

                <div className="input-container">
                  <div>Mobile Number</div>
                  <input
                    type="text"
                    placeholder="Enter mobile number"
                    className="input-field"
                    value={modalPhoneNumber}
                    onChange={(e) => setModalPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="first-row">
                <div
                  className="input-container"
                  style={{ marginLeft: "-31px" }}
                >
                  <div>Email Address</div>
                  <input
                    type="text"
                    placeholder="Enter email address"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-container">
                  <div>Gender</div>
                  <select
                    id="gender"
                    name="gender"
                    style={{ width: "10vw", padding: "10px 10px" }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  </select>
                </div>
              </div>

              <div className="first-row"></div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <button className="btn-crm" onClick={handleSubmit}>
                Add
              </button>
              <button onClick={closeModal} className="btn-crm">
                Cancel
              </button>
            </div>
          </Modal>
        </div>
        {/* {isMobileValid && (
            <button className="bg-black text-white font-semibold" onClick={openModal}>
              Add Customer
            </button>
          )} */}
          

        <select
        className="mx-2 outline-none border-2 border-gray-400"
          style={{
            height: "40px",
            width: "220px",
            borderRadius: "11px",
            
          }}
          onChange={membershipPress}
          // value={memberShipdata[0]?.name}
          value={membershipName}
        >
          <option value="" >Select MemberShip Type</option>
          {membershiptype?.map((item) => {
            return <option value={item?.name}> {item?.name}</option>;
          })}
        </select>
        {/* <select className="mx-2 outline-none border-2 border-gray-400"
          style={{
            height: "40px",
            width: "210px",
            borderRadius: "11px"
          }}
          onChange={paymentPress}
          value={payment}
        >
          <option  value={''}> Select paymentOptions</option>
          {paymentOption.map((item) => {
            return <option
            value={item.value}>{item.payment}</option>;
          })}
        </select> */}
        {/* Pay button */}
        {/* <FaCcAmazonPay className="text-5xl  text-green-700 hover:text-green-900 hover:scale-105  cursor-pointer" onClick={()=>setIsVisible(true)}/> */}
        {/* <select
        className="mx-2 outline-none border-2 border-gray-400"
          style={{
            height: "40px",
            width: "200px",
            borderRadius: "11px"
          }}
          onChange={handlestaffChange}
          value={selectStaff}
        >
          <option value="">
            Select Staff
          </option>
          {staffData?.map((item) => (
            <option key={item?.id} value={item?._id} style={{ width: "300px" }}>
              {item?.name}
            </option>
          ))}
        </select> */}
        <CheckBox staffData={staffData} selectedStaff={selectedStaff} setSelectedStaff={setSelectedStaff} expanded={expanded} setExpanded={setExpanded}/>

        <button className="text-xl font-semibold text-white bg-green-600 px-6 py-1 rounded-lg hover:bg-green-800 hover:scale-105" onClick={()=>setIsVisible(true)}>PAY</button>
        
        <div
          style={{
            height: "32px",
            background: "black",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            height: "40px",
            border: "1px solid grey",
            padding: "10px 35px",
            borderRadius: "11px",
            cursor:"pointer",
          }}
          onClick={onClickBuyNow}
        >
          <span
            style={{ color: "white", fontWeight: "500", fontSize: "15px" }}
            // onClick={onClickBuyNow}
          >
            Buy Now
          </span>
        </div>
      </div>

      <div  className="flex justify-start items-center">
        <div className="gradient-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "20px",
              fontWeight: "400",
              alignItems: "center",
              
            }}
          >
            <span className="totalContainer">Total Members</span>
            <span className="text-orange-600 font-semibold">{memeberShipDetails[0]?.total}</span>
          </div>
        </div>
        <div className="gradient-container" style={{ marginLeft: "20px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "20px",
              fontWeight: "400",
              alignItems: "center",
            }}
          >
            <span className="totalContainer ">Total Revenue</span>
            <span className="text-orange-600 font-semibold">{memeberShipDetails[0]?.totalrevenue}</span>
          </div>
        </div>
      </div>
    </div>

    <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomInputFeild startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} submitClick={searchClick}/>
          
        </div>

    {/* MEMBERSHIP TABLE */}
    <div className="mb-10">

    {todayMembership.length >0  && (
      <CustomizedTables headings={headings} data={todayMembership} handlePrint={handlePrint}/>
        
       )}
    </div>
    {alertVisible && (
        <CustomAlert message={alertMessage} onClose={handleAlertClose} />
      )}

      {
        isVisible && (
          <OrderPaymentPopup isVisible={isVisible} onClose={onClose} membership={membership} onUpdatePayment={handleUpdatePayment} onPayed={onPayed}/>
        )
      }

      <NewMembershipModal isVisible={isNewMembershipModal} onClose={onNewClose}/>
    </Layout>
  );
}



{/* <div className="table-container w-full overflow-x-scroll">

       
<table className="styled-table">
  <thead>
    <tr >
      <th>NAME</th>
      <th>PHONE NO.</th>
      <th>EMPLOYEE</th>
      <th>MEMBERSHIP NAME</th>
      <th>PRICE</th>
      {/* <th>GST</th>
      <th>TOTAL</th> */}
//       <th>Action</th>
//     </tr>
//   </thead>
//   <tbody>
//     {todayMembership?.map((item, index) => (
   
  
//       <tr key={index} className="bg-white">
//         <td>{item?.customerName}</td>
//         <td>{item?.customerPhoneNumber}</td>
//         <td>{item?.employees?.name}</td>
//         <td>{item?.name}</td>
//         <td>{item?.price}</td>
//         {/* <td><MdDeleteOutline onClick={() => deleteService(index)} className="text-xl text-red-600 font-bold cursor-pointer"/></td> */}
//         <td><IoPrintSharp className={`text-green-600 text-xl cursor-pointer hover:text-green-950`} onClick={()=>handlePrint(item)}/></td>
//       </tr>
//     ))}
//   </tbody>
// </table>

// </div> */}
