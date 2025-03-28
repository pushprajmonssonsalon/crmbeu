import React, { useEffect, useState } from "react";
import "./employeedetails.css";
import Modal from "react-modal";
import { getApiCall, postApiData } from "../../utils/services";
import Layout from "../../components/Layout";
import EmployeeTable from "../../components/Table/EmployeeTable";
import Pagination from "../../components/pagination";

const titles = [
  " Admin",
  " Art Director",
  "Artist",
  "    Assistant",
  " Assistant Manager",
  "  Barber",
  "   Beautician",
  "    Beauty Expert",
  "   Beauty Therapist",

  "Hair Artist",
  "  Hair Dresser",
  " Hair Expert",
  "    Hair Stylist",
];
const Employeedetails = () => {
  const [ismodalOpen, setismodalOpen] = useState(false);

  const [submittedData, setsubmittedData] = useState([]);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [title, setTitle] = useState("");
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [getstaffData, setStaffData] = useState([]);
  const [staffState,setStateStafff]=useState(false)
  const [staffstatus,setStaffStaus]=useState(false)
  // const [checked, setChecked] = useState(isActive === "active");
  const [isBool,setIsBool] = useState(false)


  // pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // const [name,setName]=useState(' ')
  // const [gender, setGender] = useState('');
  useEffect(() => {
    getApiCall(
      "owner/getStaff",
      (res) => {
        setStaffData(res);
        setStateStafff(true)
      },
      (error) => {
        
      }
    );
  }, [staffstatus,isBool]);

  const openModal = () => {
    setismodalOpen(true);
  };
  const closeModal = () => {
    setismodalOpen(false);
  };

  const handleSubmit = () => {
    const staffData = {
      name: name,
      phoneNumber: mobileNumber,
      email: email,
      employeeCode: employeeCode,
      gender: gender,
      dob: dob,
      startDate: startDate,
      endDate: endDate,
      staff: title,
      emergencyNumber: emergencyNumber,
    };

    postApiData(
      "/owner/addStaff",
      staffData,
      (resp) => {
        
        if(resp){
          setStaffStaus(true)

        }
      },
      (error) => {
        // 
      }
    );
    // 

    // setsubmittedData((prevData) => [...prevData, formData]);

    // Reset the state variables to clear the form fields
    setName("");
    setMobileNumber("");
    setEmail("");
    setEmployeeCode("");
    setGender("");
    setDob("");
    setStartDate("");
    setEndDate("");
    setCurrentAddress("");
    setPermanentAddress("");
    setTitle("");
    setEmergencyNumber("");
    closeModal();
  };
  // const handleGenderChange = (e) => {
  //     setGender(e.target.value);
  // };
  const modalStyle = {
    content: {
      width: "51vw",
      marginLeft: "380px",
      overflow: "auto",
      
    },
  };

  return (
  
    <>
  
      <div className="flex justify-center items-end h-[40px] mt-40 w-[90%] mx-auto"
        
      >
        {/* <h1>Staff</h1> */}

        <button className="add-staff-button" onClick={openModal}>
          Add New Staff
        </button>
      </div>
      {  
        getstaffData.length >0 ?
        // staffState ==='true'?
        <>
        <div>
          <span className="teamMember text-green-600">Current Team Members</span>
        </div>
        {/* <div className="table-container">
          {
            <table className="styled-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>MOBILE NO.</th>
                  <th>CATEGORY</th>
                  <th>POISTION</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {getstaffData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{item.role}</td>
                      <td>{"Active"}</td>
                    </tr>
                  );
                })}
  
                {/* <td>{item.services[0].category}</td> */}
                {/* Add more columns based on your data structure */}
              {/* </tbody>
            </table>
          {/* } */} 
        {/* </div> */}
        <div className="max-w-[95%] mx-auto overflow-y-auto ">
        <EmployeeTable data={getstaffData} startIndex={startIndex} endIndex={endIndex} isBool={isBool} setIsBool={setIsBool}/>
        </div>
        <Pagination 
              totalItems={getstaffData.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange} />
        </> 
        :<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
          <img  style={{height:'500px',}}
          src="https://res.cloudinary.com/dkvmvyvnx/image/upload/v1706943691/employees_blank.aa1a0e0d_ol8mir.png"/>

        </div>
      }
    
      {/* <table className="table-container1">
        <thead>
          <tr>
            <div style={{ display: "flex", gap: "18px" }}>
              <th className="table-header">Name</th>
              <th className="table-header">Mobile Number</th>
              <th className="table-header">Active/Inactive</th>
            </div>
          </tr>
        </thead>

        <tbody>
          {submittedData.map((data, index) => (
            <tr key={index}>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <td className="table-cell">{data.name}</td>
                <td className="table-cell">{data.mobileNumber}</td>
                <td className="table-cell">
                  <input type="checkbox" />
                </td>
                <td
                  className="table-cell"
                  style={{ display: "flex", gap: "20px" }}
                >
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Delete</button>
                </td>
              </div>
            </tr>
          ))}
        </tbody>
      </table> */}

      <Modal
        isOpen={ismodalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Staff Modal"
        style={modalStyle}
      >
        <h1 className="text-xl font-bold mt-12 text-center mb-5">Add Staff</h1>

        <div className="text-input-container">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              style={{ width: "19vw", height: "35px" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="mobileNumber">Mobile Number:</label>
            <input
              type="text"
              id="mobileNumber"
              style={{ width: "19vw", height: "35px" }}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
            />
          </div>
        </div>

        <div className="text-input-container">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="name">Email:</label>
            <input
              type="text"
              id="email"
              style={{ width: "19vw", height: "35px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="mobileNumber">Employee Code:</label>
            <input
              type="text"
              id="mobileNumber"
              style={{ width: "19vw", height: "35px" }}
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              placeholder="Enter your mobile number"
            />
          </div>
        </div>

        <div className="text-input-container">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              style={{ width: "19vw", height: "35px" }}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="mobileNumber">DOB:</label>
            <input
              type="date"
              id="mobileNumber"
              style={{ width: "19vw", height: "35px" }}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="Enter your mobile number"
            />
          </div>
        </div>

        <div className="text-input-container">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="name">Start Date:</label>
            <input
              type="date"
              id="startdate"
              style={{ width: "19vw", height: "35px" }}
              //value={mobileNumber}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Enter start date"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="mobileNumber">End Date:</label>
            <input
              type="date"
              id="enddate"
              style={{ width: "19vw", height: "35px" }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Enter end date"
            />
          </div>
        </div>

        {/* <div className='text-input-container'>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="name">Current Address:</label>
                        <input
                            type="text"
                            id="currentaddress"
                            style={{ width: "19vw", height: "35px" }}
                            value={currentAddress}
                            onChange={(e) => setCurrentAddress(e.target.value)}
                            placeholder="Enter current address"
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="mobileNumber">Parmanent Address:</label>
                        <input
                            type="text"
                            id="parmanentaddress"
                            style={{ width: "19vw", height: "35px" }}
                            value={permanentAddress}
                            onChange={(e) => setPermanentAddress(e.target.value)}

                            placeholder="Enter parmanent address"
                        />
                    </div>
                </div> */}

        <div className="text-input-container">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="name">Title:</label>
            <select
              id="title"
              style={{
                width: "19vw",
                height: "35px",
                maxHeight: "150px",
                overflow: "auto",
              }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            >
              <option value="" disabled>
                Select title
              </option>
              {titles.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="mobileNumber">Emergency Number:</label>
            <input
              type="text"
              id="emergencynumber"
              style={{ width: "19vw", height: "35px" }}
              value={emergencyNumber}
              onChange={(e) => setEmergencyNumber(e.target.value)}
              placeholder="Enter your emergency number"
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            style={{ width: "100px", height: "50px", marginTop: "20px" ,background:'#000000'}}
            onClick={closeModal}
          >
            Close
          </button>
          <button
            style={{ width: "100px", height: "50px", marginTop: "20px" ,background:'#000000'}}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </Modal>

    </>
  );
};

export default Employeedetails;
