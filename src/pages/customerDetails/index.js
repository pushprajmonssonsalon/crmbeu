import { useState } from 'react';
import Layout from '../../components/Layout';
import { postApiData } from '../../utils/services';

import CustomizedCustomerTables from '../../components/MaterialTable/customerDetailTable';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';



const CustomerDetails = () => {
    const[loading,setLoading]=useState(false)
    const [searchParams] =useSearchParams()
    const phone= searchParams.get("phone")
    const [phoneNumber,setPhoneNumber] = useState(phone?phone:"");
    const navigate=useNavigate();
    const [clientsAppointment,setClientsAppointment] = useState([])
    const headings = ["Name","Phone Number","Date","Services","Products","Total Price","Status","Credit Used","Action"];

    const handleSearchCustomerdetails = ()=>{
        const data = {
            phoneNumber: phoneNumber
        };
        setLoading(true)

         navigate(`?phone=${phoneNumber}`)
        postApiData('user/getCustomerDetails',
        data,
        (res)=>{
            setLoading(false)
            setClientsAppointment(res)
        },
        (err)=>{
            setLoading(false)

        }
        )
    }
   
  return (
    <Layout>
    <div className='mt-32 w-[90%] mx-auto mb-10'>
        <h1 className='text-2xl font-bold text-center text-green-600'>Search Customer Details</h1>    


        <div className=' w-1/2 mb-5 mx-auto flex justify-between items-center mt-14 '>
        <input type='text' value={phoneNumber} placeholder="Enter Phone Number" className='outline-none w-2/3 border-black placeholder:text-black' onChange={(e)=>setPhoneNumber(e.target.value)}/>
    
{loading?
    <button className='bg-black min-w-[75px] flex items-center justify-center text-white font-semibold px-4 py-2 rounded-xl ' > <span>
              <svg
                className="animate-spin"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  opacity="0.5"
                  cx="10"
                  cy="10"
                  r="9"
                  stroke="white"
                  stroke-width="2"
                />
                <mask id="path-2-inside-1_2527_20936" fill="white">
                  <path d="M18.4713 13.0345C18.9921 13.221 19.5707 12.9508 19.7043 12.414C20.0052 11.2042 20.078 9.94582 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 3.01467 16.1303 1.94151 14.7319 1.19042C13.6285 0.597723 12.4262 0.219019 11.1884 0.0708647C10.6392 0.00512742 10.1811 0.450137 10.1706 1.00319C10.1601 1.55625 10.6018 2.00666 11.1492 2.08616C12.0689 2.21971 12.9609 2.51295 13.7841 2.95511C14.9023 3.55575 15.8615 4.41394 16.5823 5.45872C17.3031 6.50351 17.7649 7.70487 17.9294 8.96348C18.0505 9.89002 18.008 10.828 17.8063 11.7352C17.6863 12.2751 17.9506 12.848 18.4713 13.0345Z" />
                </mask>
                <path
                  d="M18.4713 13.0345C18.9921 13.221 19.5707 12.9508 19.7043 12.414C20.0052 11.2042 20.078 9.94582 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 3.01467 16.1303 1.94151 14.7319 1.19042C13.6285 0.597723 12.4262 0.219019 11.1884 0.0708647C10.6392 0.00512742 10.1811 0.450137 10.1706 1.00319C10.1601 1.55625 10.6018 2.00666 11.1492 2.08616C12.0689 2.21971 12.9609 2.51295 13.7841 2.95511C14.9023 3.55575 15.8615 4.41394 16.5823 5.45872C17.3031 6.50351 17.7649 7.70487 17.9294 8.96348C18.0505 9.89002 18.008 10.828 17.8063 11.7352C17.6863 12.2751 17.9506 12.848 18.4713 13.0345Z"
                  stroke="white"
                  stroke-width="4"
                  mask="url(#path-2-inside-1_2527_20936)"
                />
              </svg>
            </span></button>

:
        <button className='bg-black text-white font-semibold px-4 py-2 rounded-xl 
        hover:bg-gray-700' onClick={handleSearchCustomerdetails}>Search</button>
}        </div>

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