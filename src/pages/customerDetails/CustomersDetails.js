import { useEffect, useState } from 'react';
import { postApiData } from '../../utils/services';

import CustomizedCustomersTables from '../../components/MaterialTable/CustomersDetailTable';



const CustomersDetails = () => {
  
    const [clientsAppointment, setClientsAppointment] = useState([])
    const headings = ["S.No","Name", "Phone Number"];

    
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
                   
                       
                            
                   
                   
                           
                            
                <CustomizedCustomersTables headings={headings} data={clientsAppointment} />
            </div>
        </>
    )
}

export default CustomersDetails