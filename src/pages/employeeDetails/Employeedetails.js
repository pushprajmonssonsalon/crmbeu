import { useEffect, useState } from "react";
import "./employeedetails.css";
import Modal from "react-modal";
import { getApiCall, postApiData } from "../../utils/services";
import EmployeeTable from "../../components/Table/EmployeeTable";
import Pagination from "../../components/pagination";
import NormalInput from "../../components/customInput/NormalInput";
import NormalSelect from "../../components/customInput/NormalSelect";
import toast from "react-hot-toast";

const titles = [
  { name: ' Admin', value: 'Admin' },
  { name: ' Art Director', value: 'Art Director' },
  { name: 'Artist', value: 'Artist' },
  { name: '    Assistant', value: 'Assistant' },
  { name: ' Assistant Manager', value: ' Assistant Manager' },
  { name: '  Barber', value: 'Barber' },
  { name: '   Beautician', value: 'Beautician' },
  { name: '    Beauty Expert', value: 'Beauty Expert' },
  { name: '   Beauty Therapist', value: 'Beauty Therapist' },
  { name: 'Hair Artist', value: 'Hair Artist' },
  { name: '  Hair Dresser', value: 'Hair Dresser' },
  { name: ' Hair Expert', value: 'Hair Expert' },
  { name: '    Hair Stylist', value: 'Hair Stylist' }
]
const Employeedetails = () => {
  const [ismodalOpen, setismodalOpen] = useState(false);

  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  // const [startDate, setStartDate] = useState("");
  const [joinAt, setJoinAt] = useState("");
  // const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [getstaffData, setStaffData] = useState([]);
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
      // startDate: startDate,
      // endDate: endDate,
      joinAt: joinAt,
      // endDate: endDate,
      staff: title,
      emergencyNumber: emergencyNumber,
    };
    const isEveryEmpty = Object.values(staffData).every((value) => value === ""||!value|| value.toString().trim() === "");
     if(isEveryEmpty){
      toast.error("Please fill all the fields");
      return;
     }
     if(mobileNumber.length!==10){
      toast.error("Please enter a valid phone number");
      return;
     }
    postApiData(
      "/owner/addStaff",
      staffData,
      (resp) => {

        if (resp) {
          setStaffStaus(true)
          toast.success("Staff added successfully");

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
    setJoinAt("")
    // setStartDate("");
    // setEndDate("");
    setTitle("");
    setEmergencyNumber("");
    closeModal();
  };
  // const handleGenderChange = (e) => {
  //     setGender(e.target.value);
  // };
  

  const formFields = [
    {
      label: "Name",
      placeholder: "Enter your name",
      type: "text",
      value: name,
      onChange: (e) => setName(e.target.value),
      id: "name",
    },
    {
      label: "Mobile Number",
      placeholder: "Enter your mobile number",
      type: "Number",
      value: mobileNumber,
      onChange: (e) => setMobileNumber(e.target.value),
      id: "mobileNumber",
    },
    {
      label: "Email",
      placeholder: "Enter your email",
      type: "text",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      id: "email",
    },
    {
      label: "Employee Code",
      placeholder: "Enter your mobile number",
      type: "text",
      value: employeeCode,
      onChange: (e) => setEmployeeCode(e.target.value),
      id: "employeeCode",
    },
    {
      label: "Gender",
      type: "select",
      value: gender,
      onChange: (e) => setGender(e.target.value),
      id: "gender",
      options: [{ name: "Male", value: "male" }, { name: "Female", value: "female" }, { name: "Others", value: "others" }],
    },
    {
      label: "DOB",
      placeholder: "Enter your mobile number",
      type: "date",
      value: dob,
      onChange: (e) => setDob(e.target.value),
      id: "dob",
    },
    {
      label: "Joining Date",
      placeholder: "Enter date",
      type: "date",
      value: joinAt,
      onChange: (e) => setJoinAt(e.target.value),
      id: "joinAt",
    },
    // {
    //   label: "End Date",
    //   placeholder: "Enter end date",
    //   type: "date",
    //   value: endDate,
    //   onChange: (e) => setEndDate(e.target.value),
    //   id: "endDate",
    // },

    {
      label: "Title",
      type: "select",
      value: title,
      onChange: (e) => setTitle(e.target.value),
      id: "title",
      options: titles, // this is your dynamic list
    },
    {
      label: "Emergency Number",
      placeholder: "Enter your emergency number",
      type: "text",
      value: emergencyNumber,
      onChange: (e) => setEmergencyNumber(e.target.value),
      id: "emergencyNumber",
    },
  ];
  return (

    <>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 justify-between gap-3">
          <div className="flex items-center gap-5 flex-wrap">

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
                <EmployeeTable data={getstaffData} setData={setStaffData} startIndex={startIndex} endIndex={endIndex} isBool={isBool} setIsBool={setIsBool} />
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
              Loading...

            </div>
        }

        <Modal
          isOpen={ismodalOpen}
          onRequestClose={closeModal}
          className=" w-[80%] sm:w-[70%]  relative top-[10%] bottom-[10%]  z-30  mx-auto"

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
          <h1 className=" text-2xl  text-black mb-4  text-start ">Add New Employee</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-4 mb-4">
            {
              formFields?.map((customer, index) => {
                const { name, label, placeholder, type, value, options, onChange } = customer
                return (
                  <div key={index} className="relative">
                    <div className="flex flex-col gap-1">

                      {!options ?

                        <NormalInput
                          name={name}
                          label={label}
                          type={type}
                          onChange={onChange}
                          placeholder={placeholder}
                          value={value}
                          inputStyles={{
                            'borderRadius': '10px',
                            padding: "10px 15px",

                          }}
                          lableStyles={{
                            'fontWeight': '400',
                            "fontSize": "14px",
                            'color': '#000000'
                          }}



                        />
                        : <NormalSelect

                          name={name}
                          label={label}
                          options={options}
                          onChange={onChange}
                          value={value}
                          inputStyles={{
                            'borderRadius': '10px',
                            padding: "10px 15px",

                          }}
                          lableStyles={{
                            'fontWeight': '400',
                            "fontSize": "14px",
                            'color': '#000000'
                          }}



                        />}
                    </div>

                  </div>
                )
              })
            }
          </div>


          <div className="flex items-center justify-end gap-4 mt-4">
            <button
              className="rounded-[5px] w-[120px] text-sm  border border-ternary text-ternary py-[5px] px-[24px]"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
              onClick={handleSubmit}
            >
              ADD
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Employeedetails;
