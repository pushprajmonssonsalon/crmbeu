import "./App.css";
import Login from "./pages/login/Login";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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
import Royalities from "./pages/royalities";
import RoyaltiesCheck from "./pages/royaltiesCheck";
import { useEffect, useRef, useState } from "react";
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
import Plans from "./pages/Plans/Plans";
import Layout from "./components/Layout";
import Salon from "./pages/salonDetails/Salon";
import Sop from "./pages/sop/sop";
import SopDetail from "./pages/sop/sopDetail";
import ReminderModal from "./components/GlobalAlert";

const ReminderTriggers = () => {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const { royaltyDue, royaltyOverdue } = useSelector((state) => state.royaltyReducer || {});

  useEffect(() => {
    const shouldOpenReminder = royaltyDue && !royaltyOverdue;

    // On any navigation, cancel any pending reminder so it doesn't appear on unrelated pages
    if (previousPathRef.current !== location.pathname) {
      window.dispatchEvent(new CustomEvent("cancel-reminder-modal"));
    }

    if (previousPathRef.current !== location.pathname && shouldOpenReminder && location.pathname !== "/royalties-check") {
      window.dispatchEvent(new CustomEvent("open-reminder-modal"));
    }

    previousPathRef.current = location.pathname;
  }, [location.pathname]);

  return null;
};

function App() {
  const [showReminder, setShowReminder] = useState(false);
  const reminderTimerRef = useRef(null);
  const { royaltyDue, royaltyOverdue } = useSelector((state) => state.royaltyReducer || {});

  useEffect(() => {
    const openReminderModal = () => {
      if (!royaltyDue || royaltyOverdue) return;
      if (reminderTimerRef.current) {
        clearTimeout(reminderTimerRef.current);
      }

      // start a delayed show; when the timer fires, ensure user is still on an allowed page
      reminderTimerRef.current = setTimeout(() => {
        if (window.location.pathname !== "/royalties-check") {
          setShowReminder(true);
        }
      }, 2000);
    };

    const cancelReminder = () => {
      if (reminderTimerRef.current) {
        clearTimeout(reminderTimerRef.current);
        reminderTimerRef.current = null;
      }
      setShowReminder(false);
    };

    window.addEventListener("open-reminder-modal", openReminderModal);
    window.addEventListener("cancel-reminder-modal", cancelReminder);

    return () => {
      window.removeEventListener("open-reminder-modal", openReminderModal);
      window.removeEventListener("cancel-reminder-modal", cancelReminder);
      if (reminderTimerRef.current) {
        clearTimeout(reminderTimerRef.current);
      }
    };
  }, [royaltyDue, royaltyOverdue]);

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
      <ReminderTriggers />
      <ReminderModal open={showReminder} onClose={() => {setShowReminder(false)}} />
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
          element={<PrivateRoute Component={Salon} />}
        />
        <Route
          path="/royalities"
          element={<PrivateRoute Component={Royalities} />}
        />
        <Route
          path="/royalties-check"
          element={<PrivateRoute Component={RoyaltiesCheck} />}
        />
        <Route
          path="/notifications"
          element={<PrivateRoute Component={Notification} />}
        />
        <Route
          path="/sop/:id"
          element={<PrivateRoute Component={SopDetail} />}
        />
        <Route
          path="/sop"
          element={<PrivateRoute Component={Sop} />}
        />
        <Route
          path="/plans"
          element={<Layout><Plans/></Layout>}
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
