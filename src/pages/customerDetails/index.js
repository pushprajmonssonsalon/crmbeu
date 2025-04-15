import { useState } from 'react';
import { postApiData } from '../../utils/services';

import CustomizedCustomerTables from '../../components/MaterialTable/customerDetailTable';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import NormalInput from '../../components/customInput/NormalInput';



const CustomerDetails = () => {
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()

  const phone = searchParams.get("phone")
  const [phoneNumber, setPhoneNumber] = useState(phone ? phone : "");
  const navigate = useNavigate();
  const [clientsAppointment, setClientsAppointment] = useState([])
  const headings = ["Name", "Phone Number", "Date", "Services", "Products", "Total Price", "Status", "Credit Used", "Action"];

  const handleSearchCustomerdetails = () => {
    const data = {
      phoneNumber: phoneNumber
    };
    setLoading(true)

    navigate(`?phone=${phoneNumber}`)
    postApiData('user/getCustomerDetails',
      data,
      (res) => {
        setLoading(false)
        setClientsAppointment(res)
      },
      (err) => {
        setLoading(false)

      }
    )
  }
 

  return (
    <>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Customer Details</h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">{clientsAppointment?.length} Transaction</span>


          </div>
          <div className='flex items-center  gap-3'>
            <div className="relative flex items-center">
              <AiOutlineSearch className="absolute text-lg text-lightGray left-[10px]" />
              <NormalInput
                inputStyles={{
                  'width': "280px",
                  borderRadius: "16px",
                  padding: "5px 40px",
                  fontSize: "14px",
                  borderColor: "#D9D9D9"
                }}
                value={phoneNumber}
                placeholder="Search by Phone Number"
                onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            {loading ? <button className='rounded-[16px] w-[109px] h-[29px] flex items-center justify-center  py-1 bg-black text-white'> <span>
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
            </span></button> : <button  onClick={handleSearchCustomerdetails} className='rounded-[16px] w-[109px] h-[29px] flex items-center justify-center  py-1 bg-black text-white'>Search</button>}
          </div>
        </div>
        <CustomizedCustomerTables headings={headings} data={clientsAppointment} />
      </div>
    </>
  )
}

export default CustomerDetails