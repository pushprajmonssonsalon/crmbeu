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
import WeeklyReport from "./pages/weeklyReport";
import SalonDeatils from "./pages/salonDetails";


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
              <Route path="/weeklyreport" element={<PrivateRoute Component={WeeklyReport} />} />
              <Route path="/salon-details" element={<PrivateRoute Component={SalonDeatils} />} />
            </Routes>
    </BrowserRouter>
  );
}

export default App;

