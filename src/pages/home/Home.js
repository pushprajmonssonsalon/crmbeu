import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import BookAppointment from '../bookAppointment/BookAppointment'
import "./Home.css"
import Router from '../../components/routes/Router'
import { useEffect } from 'react'
import { getApiCall,  } from '../../utils/services'
import HeaderComponent from '../headerComponent'
import Inventorydetails from '../Inventorydetails/Inventorydetails'
const Home = () => {


  return (
    <div className='homediv'>
      {/* <HeaderComponent/> */}
       <Sidebar/> 
       <BookAppointment/> 
       {/* <Inventorydetails/>   */}
    </div>
  )
}

export default Home