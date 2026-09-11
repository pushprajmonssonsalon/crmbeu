import { useLocation } from 'react-router';
import Navbar from '../navbar/Navbar';
import VerticalSidebar from '../newSidebar';
import { Link } from 'react-router-dom';
import useCollapseSidebarOnModal from './useCollapseSidebarOnModal';
const routesObject = {
  dashboard: "Dashboard",
  customerservices: "Services",
  inventory: "Inventory",
  ownerservice: "Owner Service",
  viewAppointment: "View Appointment",
  reports: "Reports",
  invoicewise: "Invoice Wise",
  categorywise: "Category Wise",
  contacts: "Contacts",
  complitedAppointment: "Completed Appointments",
  membership: "Membership",
  advance: "Advance",
  activeMembers: "Active Members",
  subscription: "Subscription",
  invoicegenerator: "Invoice Generator",
  membershipinvoice: "Membership Invoice",
  advanceinvoice: "Advance Invoice",
  orderinvoice: "Order Invoice",
  "viewappoinment": "Edit Appointment Details",
  orders: "Orders",
  details: "Details",
  test: "Test Page",
  revenue: "Revenue",
  weeklyreport: "Weekly Report",
  inventoryreport: "Inventory Report",
  "salon-details": "Salon Details",
  royalities: "Royalties",
  "royalties-check": "Royalties Check",
  sop: "SOP",
  notifications: "Notifications",
  plans:"Plans",
  distributer: "Inventory",
  "notifications/:id": "Notification Details"
};
const Layout = ({ children }) => {
  const {pathname} = useLocation();
  const path = pathname.split("/").filter(x=>x)[0];
  // Every page renders inside Layout, so this is the one place that sees all
  // of them: collapse the sidebar whenever a modal opens.
  useCollapseSidebarOnModal();
  
  return (
    <div className="w-full max-w-full min-h-dvh roboto-regular bg-ternaryPurple flex">
      {/* <Toaster /> */}
        {/* <Sidebar /> */}
        <VerticalSidebar />
        {/* min-w-0 lets this column shrink below its content width so wide
            tables scroll inside their own container instead of stretching
            the page. */}
        <div className='flex flex-1 flex-col min-w-0 max-w-full'>

          <Navbar />
          <div className='px-3 py-5 md:px-6 md:py-9 min-w-0 max-w-full'>
            <Breadcrumbs/>

          <main className='w-full min-w-0 max-w-full'>{children}</main>
          </div>
      </div>
    </div>
  );
};



const Breadcrumbs = () => {
  const {pathname} = useLocation();
  const path = pathname.split("/").filter(x=>x)[0]
 
 
  
  

  return (
    <nav className="flex mb-5" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-sm  text-gray-700 hover:text-blue-600">
           
            Home
          </Link>
        </li>
        <li className="inline-flex items-center">
          
           
        {routesObject[path] ? <div className="flex items-center">
            <svg
              className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
              aria-hidden="true"
              xmlns="XXXXXXXXXXXXXXXXXXXXXXXXXX"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="ms-1 text-sm  text-gray-500 md:ms-2 ">{routesObject[path]}</span>
          </div> : null}
       
        </li>
      
      </ol>
    </nav>
  );
};

export default Layout;
