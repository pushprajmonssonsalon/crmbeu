import React from 'react'
import Layout from '../../components/Layout'
import { postApiData } from '../../utils/services'

const CustomerDetails = () => {
    const handleSearchCustomerdetails = ()=>{
        const data = {
            phoneNumber: "7905804993"
        };

        postApiData('user/getCustomerDetails',
        data,
        (res)=>{
            console.log("customer ka resp", res)
        },
        (err)=>{
            console.log("customer ki error", err)
        }
        )
    }
  return (
    <Layout>
    <div className='mt-32 w-[90%] mx-auto'>
        <h1 className='text-2xl font-bold text-center text-green-600'>Search Customer Details</h1>    


        <div className=' w-1/2 mx-auto flex justify-between items-center mt-14 '>
        <input type='text' placeholder="Enter Name or Phone Number" className='outline-none w-2/3 border-black' />
    
        <button className='bg-black text-white font-semibold px-4 py-2 rounded-xl hover:bg-gray-700' onClick={handleSearchCustomerdetails}>Search</button>
        </div>

       
        <div className="table-container w-[90%] overflow-x-scroll">

       
<table className="styled-table">
  <thead>
    <tr >
      <th>Name</th>
      <th>Category</th>
      <th> Sub Category</th>
      <th>Staff</th>
      <th>Price</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
   
  </tbody>
</table>

</div>
  

    </div>
    </Layout>
  )
}

export default CustomerDetails