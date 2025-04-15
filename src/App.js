import "./App.css";
import Login from "./pages/login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Appointment from "./pages/Appointment/Appointment";
import OwnerService from "./pages/ownerServices";
import ViewAppointment from "./pages/viewAppointment/ViewAppointment";
import CompltedAppointMent from "./pages/completedAppointment";
import PrivateRoute from "./components/privateRoute";
import Edit from "./pages/EditAppointmentSalon/Edit";
import Orders from "./pages/orders";
import AppointmentBills from "./components/bills";
import MembershipBill from "./components/bills/MembershipBill";
import OrderBill from "./components/bills/OrderInvoice";
import InvoiceWise from "./components/invoicewise";
import TestExcel from "./components/invoicewise/TestExcel";
import { Toaster } from "react-hot-toast";
import Revenue from "./components/revenue";
import WeeklyReport from "./pages/weeklyReport";
import SalonDeatils from "./pages/salonDetails";
import Royalities from "./pages/royalities";
import { useEffect } from "react";
import Notification from "./pages/notification/notification";
import SingleNotification from "./pages/notification/singleNotification";
import Categorywise from "./components/categorywise/Categorywise";
import Subscription from "./pages/subscription/Subscription";
import Advances from "./pages/advances/Advances";
import activeMembers from "./pages/activeMembers/ActiveMembers";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdvanceInvoice from "./components/customInovice/Advances";
import Inventory from "./components/inventory/Inventory";
import Services from "./pages/customerServices/Services";
import Members from "./pages/memberShip/Members";
import Contacts from "./pages/Contacts/Contacts";
import AllReport from "./pages/reports/AllReport";

function App() {
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.target.type === "number") {
        e.preventDefault(); // Prevent default scroll behavior
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={<PrivateRoute Component={Appointment} />}
        />
        <Route
          path="/dashboard"
          element={<PrivateRoute Component={Dashboard} />}
        />
        <Route
          path="/customerservices"
          element={<PrivateRoute Component={Services} />}
        />
        <Route
          path="/inventory"
          element={<PrivateRoute Component={Inventory} />}
        />
        <Route
          path="/contacts"
          element={<PrivateRoute Component={Contacts} />}
        />
      
        <Route
          path="/ownerservice"
          element={<PrivateRoute Component={OwnerService} />}
        />
        <Route
          path="/viewAppointment"
          element={<PrivateRoute Component={ViewAppointment} />}
        />
        <Route path="/reports" element={<PrivateRoute Component={AllReport} />} />
        <Route
          path="/invoicewise"
          element={<PrivateRoute Component={InvoiceWise} />}
        />
        <Route
          path="/categorywise"
          element={<PrivateRoute Component={Categorywise} />}
        />
        <Route
          path="/complitedAppointment"
          element={<PrivateRoute Component={CompltedAppointMent} />}
        />
        <Route
          path="/membership"
          element={<PrivateRoute Component={Members} />}
        />
        <Route
          path="/advance"
          element={<PrivateRoute Component={Advances} />}
        />
        <Route
          path="/activeMembers"
          element={<PrivateRoute Component={activeMembers} />}
        />
        <Route
          path="/subscription"
          element={<PrivateRoute Component={Subscription} />}
        />
        <Route
          path="/invoicegenerator"
          element={<PrivateRoute Component={AppointmentBills} />}
        />
        {/* <Route path="/invoicegenerator" element={<PrivateRoute Component={InvoiceGenrator} />} /> */}
        <Route
          path="/membershipinvoicegenerator"
          element={<PrivateRoute Component={MembershipBill} />}
        />
        <Route
          path="/advanceinvoice"
          element={<PrivateRoute Component={AdvanceInvoice} />}
        />
        {/* <Route path="/membershipinvoicegenerator" element={<PrivateRoute Component={MembershipInvoiceGenrator} />} /> */}
        <Route
          path="/orderinvoice"
          element={<PrivateRoute Component={OrderBill} />}
        />
        {/* <Route path="/orderinvoice" element={<PrivateRoute Component={OrderInvoice} />} /> */}
        <Route
          path="/viewAppoinment/:id"
          element={<PrivateRoute Component={Edit} />}
        />
        <Route path="/orders" element={<PrivateRoute Component={Orders} />} />
       
        <Route path="/test" element={<PrivateRoute Component={TestExcel} />} />
        <Route path="/revenue" element={<PrivateRoute Component={Revenue} />} />
        <Route
          path="/weeklyreport"
          element={<PrivateRoute Component={WeeklyReport} />}
        />
      
        <Route
          path="/salon-details"
          element={<PrivateRoute Component={SalonDeatils} />}
        />
        <Route
          path="/royalities"
          element={<PrivateRoute Component={Royalities} />}
        />
        <Route
          path="/notifications"
          element={<PrivateRoute Component={Notification} />}
        />
        <Route
          path="/notifications/:id"
          element={<PrivateRoute Component={SingleNotification} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
