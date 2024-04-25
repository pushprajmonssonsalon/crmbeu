import React, { useEffect, useRef, useState } from 'react'
import Layout from '../Layout'
import { postApiData } from '../../utils/services'
import CustomInputFeild from "../../components/customInput";
import CustomizedInvoiceWiseTables from '../MaterialTable/InvoiseWiseTable';
import { downloadExcel, useDownloadExcel } from 'react-export-table-to-excel';

const InvoiceWise = () => {
    const [viewAppointmentDetails, setViewAppointmentDetails] = useState([]);
    const tableRef = useRef(null);
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
      
      const headings= ["Date","Invoice No.","Service/Product","Price","Membership Redemption","Net","Gst"];
      function FormatDate(date) {
        const dates = new Date(date)
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(dates);
      
        return formattedDate;
      }
      const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'invoisewise',
        sheet: 'invoisewise'
    })
    
  return (  
    <Layout>
        <div className='mt-32 flex flex-col'>
        <h1 className='text-center text-3xl font-bold  text-black mb-4'>Invoice wise collection</h1>
        <div className='flex justify-end items-start mr-5'>
            <button onClick={onDownload} className='w-[100px]'> Export excel </button>
        </div>
        <CustomInputFeild startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} submitClick={searchClick}/> 
        {/* <CustomizedInvoiceWiseTables headings={headings} data={viewAppointmentDetails}  ref={tableRef}/> */}

        <table ref={tableRef}>
          <thead>
              <tr>
          {
            headings?.map((item,index)=>(
                    <th>{item}</th>
            ))
        }
              </tr>
          
          </thead>
          <tbody>
          {  viewAppointmentDetails?.filter((item)=>item.status === 3)?.map((row,index) => (
            <tr key={index}>
              <td scope="row">
                {FormatDate(row.createdAt)}
              </td>
              <td >{row?.invoiceId}</td>
              <td >Service</td>
              <td >{row?.subTotal - (row?.discount|| 0)}</td>
              <td >{row?.membershipCreditUsed}</td>
              <td>{(row?.subTotal - (row?.discount|| 0) - ((row?.subTotal - (row?.discount|| 0))*0.18).toFixed(2))}</td>
              <td>{((row?.subTotal - (row?.discount|| 0))*0.18).toFixed(2)}</td>
            </tr>
          ))
            
        }
          </tbody>
        </table>
        </div>
    </Layout>
  )
}

export default InvoiceWise