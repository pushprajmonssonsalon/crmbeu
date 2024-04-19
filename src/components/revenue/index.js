import React, { useState } from 'react'
import Layout from '../Layout'
import CustomInputFeild from "../../components/customInput";
const Revenue = () => {
    const defaultStartDate = new Date();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultStartDate);
  const searchClick=()=>{

  }
  return (
    <Layout>
        <div className='mt-32'>
        <CustomInputFeild startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} submitClick={searchClick}/>
        </div>
        <div className='my-10'>

        </div>
    </Layout>
  )
}

export default Revenue