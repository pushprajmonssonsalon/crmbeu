import React from 'react'
import { useState } from 'react'
import DatePicker from "react-datepicker";

export default function CustomSearchInputFeild({startDate,setStartDate,endDate,setEndDate,submitClick}) {
    
  
  return (
    <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flexDirection: "column",
            display: "flex",
          }}
        >
          <label>Start Date</label>

          <DatePicker
            selectsStart
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            startDate={startDate}
            
          />
        </div>

        <div
          style={{
            marginLeft: "10px",
            flexDirection: "column",
            display: "flex",
          }}
        >
          <label>End Date</label>
          <DatePicker
            selectsEnd
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            endDate={endDate}
            startDate={startDate}
            minDate={startDate}
    
          />
        </div>

        <button className='px-3 py-2 rounded-lg bg-black text-white font-bold mt-6 ml-4' onClick={submitClick}>Search</button>
      </div>
    // <div style={{}}>

    //     <input value={value} placeholder='Search By Name or Number' type='date' className='outline-none px-4 w-[250px]'
    //     onChange={onchange}
    //     />
    // </div>
  )
}
