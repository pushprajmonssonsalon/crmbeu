import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import "./App.css";
import Login from "./pages/login/Login";
import { BrowserRouter, Routes, Link, Route} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import BookAppointment from "./pages/bookAppointment/BookAppointment";
import Home from "./pages/home/Home";
import CustomerServices from "./pages/customerServices/customerServices";
import Inventorydetails from "./pages/Inventorydetails/Inventorydetails";
import Employeedetails from "./pages/employeeDetails/Employeedetails";
import OwnerService from "./pages/ownerServices";
import ViewAppointment from "./pages/viewAppointment/ViewAppointment";
import Report from "./pages/reports/Report";
import CompltedAppointMent from "./pages/completedAppointment";
import Membership from "./pages/memberShip";
import InvoiceGenrator from "./components/customInovice";
import Auth from "./components/auth";
import Sidebar from "./components/sidebar/Sidebar";
import EditAppointment from "./pages/EditAppointmentSalon";
import PrivateRoute from "./components/privateRoute";
import MembershipInvoiceGenrator from "./components/customInovice/MembershipInvoice";
import Edit from "./pages/EditAppointmentSalon/Edit";
import Orders from "./pages/orders";
import OrderInvoice from "./components/customInovice/OrderInvoice";
import CustomerDetails from "./pages/customerDetails";
import AppointmentBills from "./components/bills";
import MembershipBill from "./components/bills/MembershipBill";
import OrderBill from "./components/bills/OrderInvoice";
import InvoiceWise from "./components/invoicewise";
import TestExcel from "./components/invoicewise/TestExcel";
import {Toaster} from 'react-hot-toast';
import Revenue from "./components/revenue";

function App() {
 

  return (
    <BrowserRouter>
     <Toaster />
            <Routes>
              <Route path="/login" element={<Login/>} />
       
              <Route path="/" element={<PrivateRoute Component={BookAppointment} />} />
              <Route path="/customerservices" element={<PrivateRoute Component={CustomerServices} />} />
              <Route path="/inventory" element={<PrivateRoute Component={Inventorydetails} />} />
              <Route path="/employee" element={<PrivateRoute Component={Employeedetails} />} />
              <Route path="/ownerservice" element={<PrivateRoute Component={OwnerService} />} />
              <Route path="/viewAppointment" element={<PrivateRoute Component={ViewAppointment} />} />
              <Route path="/reports" element={<PrivateRoute Component={Report} />} />
              <Route path="/invoicewise" element={<PrivateRoute Component={InvoiceWise} />} />
              <Route path="/complitedAppointment" element={<PrivateRoute Component={CompltedAppointMent} />} />
              <Route path="/membership" element={<PrivateRoute Component={Membership} />} />
              <Route path="/invoicegenerator" element={<PrivateRoute Component={AppointmentBills} />} />
              {/* <Route path="/invoicegenerator" element={<PrivateRoute Component={InvoiceGenrator} />} /> */}
              <Route path="/membershipinvoicegenerator" element={<PrivateRoute Component={MembershipBill} />} />
              {/* <Route path="/membershipinvoicegenerator" element={<PrivateRoute Component={MembershipInvoiceGenrator} />} /> */}
              <Route path="/orderinvoice" element={<PrivateRoute Component={OrderBill} />} />
              {/* <Route path="/orderinvoice" element={<PrivateRoute Component={OrderInvoice} />} /> */}
              <Route path="/viewAppoinment/:id" element={<PrivateRoute Component={Edit} />} />
              <Route path="/orders" element={<PrivateRoute Component={Orders} />} />
              <Route path="/details" element={<PrivateRoute Component={CustomerDetails} />} />
              <Route path="/test" element={<PrivateRoute Component={TestExcel} />} />
              <Route path="/revenue" element={<PrivateRoute Component={Revenue} />} />
              {/* <Route path="/login" element={<Login/>} />
       
       <Route path="/" element={<PrivateRoute ><BookAppointment/></PrivateRoute>}/>
       <Route path="/customerservices" element={<PrivateRoute ><CustomerServices/></PrivateRoute>}/>
       <Route path="/inventory" element={<PrivateRoute ><Inventorydetails/></PrivateRoute>}/>
       <Route path="/employee" element={<PrivateRoute ><Employeedetails/></PrivateRoute>}/>
       <Route path="/ownerservice" element={<PrivateRoute ><OwnerService/></PrivateRoute>}/>
       <Route path="/viewAppointment" element={<PrivateRoute ><ViewAppointment/></PrivateRoute>}/>
       <Route path="/reports" element={<PrivateRoute ><Report/></PrivateRoute>}/>
       <Route path="/complitedAppointment" element={<PrivateRoute ><CompltedAppointMent/></PrivateRoute>}/>
       <Route path="/membership" element={<PrivateRoute ><Membership/></PrivateRoute>}/>
       <Route path="/invoicegenerator" element={<PrivateRoute ><InvoiceGenrator/></PrivateRoute>}/>
       <Route path="/membershipinvoicegenerator" element={<PrivateRoute ><MembershipInvoiceGenrator/></PrivateRoute>}/>
       <Route path="/viewAppoinment/:id" element={<PrivateRoute ><EditAppointment/></PrivateRoute>}/> */}
            </Routes>
    </BrowserRouter>
  );
}

export default App;


{/* <Routes>
<Route path="/bookAppointment" element={<BookAppointment />} />
{/* <Route path="/Home" element={<Home />} /> */}
{/* <Route
  path="/customerservices"
  element={<CustomerServices />}
/>
<Route path="/inventory" element={<Inventorydetails />} />
<Route path="/employee" element={<Employeedetails />} />
<Route path="/OwnerService" element={<OwnerService />} />
<Route path="/viewAppoinment" element={<ViewAppointment />} />
<Route path="/reports" element={<Report />} />
<Route
  path="/CompltedAppointMent"
  element={<CompltedAppointMent />}
/>
<Route path="/Membership" element={<Membership />} />
<Route path="/invoiceGenrator" element={<InvoiceGenrator />} />
<Route path="/viewAppoinment/:id" element={<EditAppointment />} />
</Routes> */} 