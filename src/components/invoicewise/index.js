import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { postApiData } from '../../utils/services'
import CustomInputFeild from "../../components/customInput";
import CustomizedInvoiceWiseTables from '../MaterialTable/InvoiseWiseTable';

const InvoiceWise = () => {
    const [viewAppointmentDetails, setViewAppointmentDetails] = useState([]);
    //date 
    const defaultStartDate = new Date();
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultStartDate);
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
            setViewAppointmentDetails(resp);
          }
        },
        (error)=>{
          console.log("erro",error)
        }
        )
      },[])
      const searchClick=()=>{
        const data ={
          type : "crm",
          startDate: startDate,
          endDate: endDate
        }; 
        postApiData("appointment/getAppointments",
        data,
        (resp)=>{
          console.log("tabresp",resp)
          if(resp){
            setViewAppointmentDetails(resp);
          }
        },
        (error)=>{
          console.log("error",error)
        }
        )
      }
      console.log("invoise wise collections",viewAppointmentDetails)
      
      const headings= ["Date","Invoice No.","Service/Product","Price","Membership Redemption","Net","Gst"]
  return (  
    <Layout>
        <div className='mt-32 flex flex-col'>
        <h1 className='text-center text-3xl font-bold bg-black text-white mb-4'>Invoice wise collection</h1>
        <CustomInputFeild startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} submitClick={searchClick}/> 
        <CustomizedInvoiceWiseTables headings={headings} data={viewAppointmentDetails}/>
        </div>
    </Layout>
  )
}

export default InvoiceWise