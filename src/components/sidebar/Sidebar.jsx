import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className='sidebardiv w-[18%] '>
      {/* <h2 className='text-lg font-semibold text-black '>Menu</h2> */}
     
     <Link to="/" style={{ textDecoration: 'none' }}><div className='menudiv'>Book Appointment</div></Link>
      <Link to="/viewAppointment" style={{ textDecoration: 'none' }}><div className='menudiv'>View Appointment</div></Link>
      {/* <Link to="/CompltedAppointMent" style={{ textDecoration: 'none' }}><div className='menudiv'>CompletedAppointments</div></Link> */}
      <Link to="/inventory" style={{ textDecoration: 'none' }}><div className='menudiv'>Inventory</div></Link>
      <Link to="/reports" style={{ textDecoration: 'none' }}><div className='menudiv'>Reports</div></Link>
      <Link to="/employee" style={{ textDecoration: 'none' }}><div className='menudiv'>Employee</div></Link>
      <Link to="/customerservices" style={{ textDecoration: 'none' }}><div className='menudiv'>Services</div></Link>
      {/* <Link to="/OwnerService" style={{ textDecoration: 'none' }}><div className='menudiv'>Owner Services</div></Link> */}
      <Link to="/Membership" style={{ textDecoration: 'none' }}><div className='menudiv'>MemberShip</div></Link>


  
      {/* <div className='menudiv'>Products</div>
      <div className='menudiv'>Customers</div>
      <div className='menudiv'></div> */}
    </div>
  )
}

export default Sidebar