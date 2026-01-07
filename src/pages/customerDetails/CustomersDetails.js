import { useEffect, useState } from 'react';
import { formatDateWOYear, postApiData } from '../../utils/services';

import CustomizedCustomersTables from '../../components/MaterialTable/CustomersDetailTable';
import AddCustomerModal from '../../components/modals/AddCustomerModal';
import toast from 'react-hot-toast';



const CustomersDetails = () => {
   const [isEdit,setIsEdit]= useState(false);
    const [clientsAppointment, setClientsAppointment] = useState([])
    const headings = ["S.No","Name", "Phone Number","Edit"];
   const [user,setUser]=useState({
   })
    
    const handleSearchCustomerdetails = () => {


        postApiData('user/getCustomersDetails',
            {},
            (res) => {
                if(res?.length>0)
                setClientsAppointment(res)
            },
            (err) => {
  
            }
        )
    }
    const handleClose=()=>{
        setIsEdit(false)
    }
     const formFields = [
   {
      name: "name",
      label: "Enter Name",
      placeholder: "Enter Name",
      value: user?.name,
    },
    {
      name: "phoneNumber",
      label: "Mobile Number",
      placeholder: "Enter Mobile Number",
      disabled:true,
      value: user?.phoneNumber,
    },
   
   
    {
      name: "dob",
      label: "Birthday",
      value1: user["dob-date"],
      value2: user["dob-month"],
      placeholder: "Enter Aniversary",
    },
    {
      name: "aniversary",
      label: "Aniversary",
      value1: user["aniversary-date"],
      value2: user["aniversary-month"],
      placeholder: "Enter Aniversary",
    },
    
  ];
  const handleChange=(e)=>{
    const {name,value}= e.target;
    setUser((elm)=>({
        ...elm,
        [name]:value
    }))
  }
  const handleEdit=(item)=>{

   setUser(item)
   setIsEdit(true)
  }
     const handleSubmit = () => {
        const payload = {
          ...user,
          dob: formatDateWOYear(user["dob-date"], user["dob-month"]),
          aniversary: formatDateWOYear(user["aniversary-date"], user["aniversary-month"]),
          
        }
       
        if (!payload?.name) {
          
          return toast.error("Enter Valid Customer Name")
        }
        postApiData(
          "parlor/editUserDetailsBySalon",
          payload,
          (resp) => {
            toast.success("Customer Added Sucessfully");
            setIsEdit(false)
            setUser({})
            setClientsAppointment((prev)=>prev.map((elm)=>elm._id==payload?._id?payload:elm))
          },
          (error) => { }
        );
      };
    useEffect(() => {
        handleSearchCustomerdetails()
    }, [])
    return (
        <>
            <div className=" rounded-[16px] border border-primaryGray p-5  ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Customer Details</h2>
                        <span className="rounded-[16px] text-xs px-6 border border-gray2">{clientsAppointment?.length} Customers</span>


                    </div>

                </div>
                   
                       
                            
                   
                   
                           
                            
                <CustomizedCustomersTables headings={headings} data={clientsAppointment} handleUpdate={handleEdit} />
            </div>
             <AddCustomerModal
                       isModalOpen={isEdit}
          closeModal={handleClose}
          addCustomerFields={formFields}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          heading={"Edit Customer"}
                        />
        </>
    )
}

export default CustomersDetails