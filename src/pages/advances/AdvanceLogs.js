import { useEffect, useState } from 'react';
import { formatDateToFull, postApiData } from '../../utils/services';

import { useSearchParams } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import NormalInput from '../../components/customInput/NormalInput';
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6';
import PaginationTable from '../../components/Table/PaginationTable';

import { FaRupeeSign } from "react-icons/fa";
import exportToExcel from '../../utils/exportToExcel';


const AdvanceLogs = () => {
  const [loading, setLoading] = useState(false)
  const [searchParams,setSearchParams] = useSearchParams()
  const phone = searchParams.get("phone")
  const [phoneNumber, setPhoneNumber] = useState(phone ? phone : "");
  const [logs, setLogs] = useState([])

   const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [avalilableBalance, setAvailableBalance] = useState(0);


  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleRowschange = (e) => {
    const { value } = e.target;
    setRowsPerPage(+value);
     // find the first item index of the current page
  const firstItemIndex = (page - 1) * rowsPerPage;

  // calculate the new page based on item index
  const newPage = Math.floor(firstItemIndex / value) + 1;

  setRowsPerPage(value);
  setPage(newPage);
  };
  const fetchLogs =(data)=>{
    postApiData(`advance/getAdvanceLogs?page=${page}&limit=${rowsPerPage}`,
      data,
      (res) => {
        
        setLoading(false)
        setLogs(res?.logs)
        setPage(res?.page)
        setRowsPerPage(res?.limit)
        setTotal(res?.total)
      
        setAvailableBalance(res?.balance)
      },
      (err) => {
        setLoading(false)

      }
    )
  }
  const handleSearchCustomerdetails = () => {
    const data = {
      phoneNumber: phoneNumber
    };
    setLoading(true)
    const updatedParams = new URLSearchParams(searchParams);
        updatedParams.set('phone', phoneNumber);
        setSearchParams(updatedParams);
    // navigate(`?phone=${phoneNumber}`)
    fetchLogs(data)
  }
  
  const cols=[{
   name:"Name",
   id:"name"
  },{
    name:"Phone Number",
    id:"phoneNumber"
  },{
    name:"Amount",
    id:"amount"
  },
  {
    name:"Type",
    id:"type"
  },
  {
    name:"Balance",
    id:"balance"
  }
  
  ,{
    name:"Date",
    id:"createdAt"
  }]
  const rows = logs?.length > 0 ? logs.map((elm) => ({
    ...elm, createdAt: formatDateToFull(elm?.createdAt), amount: `₹ ${elm.amount}`, type: <div className='flex items-center gap-2'>
      <span>{elm.type}</span>
      {elm?.type === "credit" ? <FaArrowUpLong className='text-green-600' /> : <FaArrowDownLong className='text-red-600' />}

    </div>,
    balance:`₹ ${elm?.balance||0}`
  })) : [];

   const handleExport = () => {
        if (rows?.length > 0)
            exportToExcel(rows, "AdvancesLogs", "Advances.xlsx");
    };
  useEffect(()=>{
  let data ={
    phoneNumber
  }
  
  fetchLogs(data)
  return ()=>{}
 

  },[page,rowsPerPage])

  return (
    <>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-5 flex-wrap">
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Customer Details</h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">{total} Transaction</span>
        

          </div>

          <div className='flex items-center  gap-3 flex-wrap'>
            <div className="relative flex items-center w-full sm:w-auto">
              <AiOutlineSearch className="absolute text-lg text-lightGray left-[10px]" />
              <NormalInput
                inputStyles={{
                  'width': "280px",
                  maxWidth: "100%",
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
            </span></button> : <button onClick={handleSearchCustomerdetails} className='rounded-[16px] w-[109px] h-[29px] flex items-center justify-center  py-1 bg-black text-white'>Search</button>}
          </div>
       <button disabled={rows?.length==0} onClick={handleExport} className='bg-ternary text-white rounded-[16px] w-full max-w-[110px] text-sm font-normal '>Export All</button>

        </div>
    

         
          <div className='flex items-center justify-start mt-5'>
           <div className='bg-white p-4 shadow-xl border rounded-lg w-[200px] sm:w-[300px]'>
           <div className='text-black text-xl font-medium mb-4'>Available Balance</div>
           <div className='flex items-center'>
           <FaRupeeSign className='text-green-600 text-2xl'/>
           <span className='text-gray-500 text-3xl'>{avalilableBalance||0}</span>
           </div>


           </div>

          </div>
            
          <PaginationTable  columns={cols} rows={rows} rowsPerPage={rowsPerPage} page={page} handleRowschange={handleRowschange} handlePage={handlePageChange} total={total}/>
 
          
          
      </div>
    </>
  )
}

export default AdvanceLogs