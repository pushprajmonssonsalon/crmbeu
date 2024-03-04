// import React, { useState } from 'react'
// import { Navigate, Route, Routes } from 'react-router-dom'
// import BookAppointment from '../../pages/bookAppointment/BookAppointment'
// import ViewAppointment from '../../pages/viewAppointment/ViewAppointment'
// import Inventorydetails from '../../pages/Inventorydetails/Inventorydetails'
// import Employeedetails from '../../pages/employeeDetails/Employeedetails'
// import Report from '../../pages/reports/Report'
// import Login from '../../pages/login/Login'

// const Router = () => {
  

//   return (
//     <>
//       <Routes>
      
//         <Route path="/bookAppoinment" element={<BookAppointment/>}/>
//         <Route path="/viewAppointment" element={<ViewAppointment/>}/>
//         <Route path="/inventory" element={<Inventorydetails/>}/>
//         <Route path="/employee" element={<Employeedetails/>}/>
//         <Route path="/reports" element={<Report/>}/>

//       </Routes>
//     </>
    
//   )
// }

// export default Router

//import React from 'react';
// import { Route, Routes, Navigate } from 'react-router-dom';
// import BookAppointment from '../../pages/bookAppointment/BookAppointment';
// import ViewAppointment from '../../pages/viewAppointment/ViewAppointment';
// import Inventorydetails from '../../pages/Inventorydetails/Inventorydetails';
// import Employeedetails from '../../pages/employeeDetails/Employeedetails';
// import Report from '../../pages/reports/Report';
// import Sidebar from '../../components/sidebar/Sidebar';
// import Login from '../../pages/login/Login';

// const Router = ({ isLoggedIn }) => {
//   if (!isLoggedIn) {
   
//     return <Navigate to="/login" />;
//   }

//   return (
//     // <Routes>
      
//     //   <Route path="sidebar" element={<Sidebar />}>
//     //     <Route path="bookAppointment" element={<BookAppointment />} />
//     //     <Route path="viewAppointment" element={<ViewAppointment />} />
//     //     <Route path="inventory" element={<Inventorydetails />} />
//     //     <Route path="employee" element={<Employeedetails />} />
//     //     <Route path="reports" element={<Report />} />
//     //   </Route>
//     // </Routes>
//   );
// };

// export default Router;

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import BookAppointment from '../../pages/bookAppointment/BookAppointment'
import ViewAppointment from '../../pages/viewAppointment/ViewAppointment'
import Inventorydetails from '../../pages/Inventorydetails/Inventorydetails'
import Employeedetails from '../../pages/employeeDetails/Employeedetails'
import Report from '../../pages/reports/Report'
import Login from '../../pages/login/Login'

const Router = () => {
  return (
    <>
      <Routes>
      <Route path="/login" element={<Login/>}/>
        <Route path="/bookAppoinment" element={<BookAppointment/>}/>
        <Route path="/viewAppointment" element={<ViewAppointment/>}/>
        <Route path="/inventory" element={<Inventorydetails/>}/>
        <Route path="/employee" element={<Employeedetails/>}/>
        <Route path="/reports" element={<Report/>}/>
      </Routes>
    </>
    // <div>Router</div>
  )
}
export default Router;


