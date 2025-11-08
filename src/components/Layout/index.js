import { useLocation } from 'react-router';
import Navbar from '../navbar/Navbar';
import VerticalSidebar from '../newSidebar';
import { Link } from 'react-router-dom';
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
  notifications: "Notifications",
  plans:"Plans",
  "notifications/:id": "Notification Details"
};
const Layout = ({ children }) => {
  const {pathname} = useLocation();
  const path = pathname.split("/").filter(x=>x)[0];
  
  return (
    <div className="min-w-full   roboto-regular bg-ternaryPurple flex bg">
      {/* <Toaster /> */}
        {/* <Sidebar /> */}
        <VerticalSidebar />
        <div className='flex w-full flex-col'>

          <Navbar />
          <div className='px-6 py-9'>
            <Breadcrumbs/>

          <main style={{ maxWidth: '100%' }} className='w-full '>{children}</main>
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
