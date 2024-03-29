import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { postApiData } from '../../utils/services'

import CustomizedCustomerTables from '../../components/MaterialTable/customerDetailTable';



const CustomerDetails = () => {
    const [phoneNumber,setPhoneNumber] = useState("");
    const [clientsAppointment,setClientsAppointment] = useState([])
    const headings = ["Name","Phone Number","Date","Services","Products","Total Price","Status"]
    const handleSearchCustomerdetails = ()=>{
        const data = {
            phoneNumber: phoneNumber
        };

        postApiData('user/getCustomerDetails',
        data,
        (res)=>{
            console.log("customer ka resp", res)
            setClientsAppointment(res)
        },
        (err)=>{
            console.log("customer ki error", err)
        }
        )
    }
    console.log("client ki details", clientsAppointment)
    function FormatDate(date) {
        const dates = new Date(date)
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(dates);
      
        return formattedDate;
      }
  return (
    <Layout>
    <div className='mt-32 w-[90%] mx-auto mb-10'>
        <h1 className='text-2xl font-bold text-center text-green-600'>Search Customer Details</h1>    


        <div className=' w-1/2 mx-auto flex justify-between items-center mt-14 '>
        <input type='text' placeholder="Enter Phone Number" className='outline-none w-2/3 border-black placeholder:text-black' onChange={(e)=>setPhoneNumber(e.target.value)}/>
    
        <button className='bg-black text-white font-semibold px-4 py-2 rounded-xl hover:bg-gray-700' onClick={handleSearchCustomerdetails}>Search</button>
        </div>

    <CustomizedCustomerTables headings={headings} data={clientsAppointment} />


       
        {/* <div className="table-container w-[90%] overflow-x-scroll">

       
<table className="styled-table">
  <thead>
    <tr >
      <th>Name</th>
      <th>Phone Number</th>
      <th>Date</th>
      <th>Services</th>
      <th>Products</th>
      <th>Total Price</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
   {
    clientsAppointment?.map((item,index)=>(
        <tr key={index}>
            <td>{item?.customer.name}</td>
            <td>{item?.customer.phoneNumber}</td>
            <td>{FormatDate(item?.createdAt)}</td>
            <td>
            {
                item.services.map((data,dataIndex)=>(
                    <div key={dataIndex}>
                   {data.miniSubcategory}
                    </div>
                ))
            }
            </td>
            <td>
            {
                item.products.map((data,dataIndex)=>(
                    <div key={dataIndex}>
                   {data.name}
                    </div>
                ))
            }
            </td>
            <td>{item.total}</td>
            <td className={`font-semibold text-sm ${item.status === 1 ? 'text-blue-500' : item.status === 2 ? 'text-red-500' : 'text-green-600'}`}>{item.status ==1 ? "pending" : item.status == 2? "cancelled" : "completed"}</td>
        </tr>
    ))
   }
  </tbody>
</table>

</div> */}
  

    </div>
    </Layout>
  )
}

export default CustomerDetails