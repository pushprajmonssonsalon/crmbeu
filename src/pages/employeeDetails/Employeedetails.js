import { useEffect, useState } from "react";
import "./employeedetails.css";
import Modal from "react-modal";
import { getApiCall, postApiData } from "../../utils/services";
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
  const [staffState, setStateStafff] = useState(false)
  const [staffstatus, setStaffStaus] = useState(false)
  // const [checked, setChecked] = useState(isActive === "active");
  const [isBool, setIsBool] = useState(false)


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
  }, [staffstatus, isBool]);

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

        if (resp) {
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
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center gap-5">

            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Staff Contacts</h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">{getstaffData?.length || 0} Contacts</span>
          </div>
          <button onClick={openModal} className="rounded-[16px] text-sm text-white bg-ternary py-1 px-5">Create New</button>

        </div>


        {
          getstaffData.length > 0 ?
            // staffState ==='true'?
            <>
              <div className="w-full">
                <EmployeeTable data={getstaffData} startIndex={startIndex} endIndex={endIndex} isBool={isBool} setIsBool={setIsBool} />
              </div>
              <div className="flex items-center justify-end">
                <Pagination
                  totalItems={getstaffData.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange} />

              </div>
            </>
            : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img style={{ height: '500px', }}
                src="https://res.cloudinary.com/dkvmvyvnx/image/upload/v1706943691/employees_blank.aa1a0e0d_ol8mir.png" />

            </div>
        }

        <Modal
          isOpen={ismodalOpen}
          onRequestClose={closeModal}
          className="w-[70%] lg:w-[50%] relative top-[10%] bottom-[10%]  z-30  mx-auto"

          contentLabel="Add Staff Modal"
          style={{
            content: {

              height: "fit-content",
              maxHeight: 'calc(100% - 200px)',
              overflowY: "auto",

              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
              padding: "20px",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.3)", // Set the overlay background color
            },
          }}        >
          <h1 className="2xl:text-xl text-sm  text-black mb-4  text-start ">Add Staff</h1>

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
              style={{ width: "100px", height: "50px", marginTop: "20px", background: '#000000' }}
              onClick={closeModal}
            >
              Close
            </button>
            <button
              style={{ width: "100px", height: "50px", marginTop: "20px", background: '#000000' }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Employeedetails;
