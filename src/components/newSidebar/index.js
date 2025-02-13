import React from "react";
import { MdDashboard, MdEditSquare, MdRememberMe } from "react-icons/md";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { MdCardMembership } from "react-icons/md";
import { FaBookOpen, FaWallet } from "react-icons/fa";
import { LuView } from "react-icons/lu";
import { FaTableList } from "react-icons/fa6";
import { RiShoppingCartFill } from "react-icons/ri";
import { GiRoyalLove } from "react-icons/gi";
import { BiMessageAltDetail } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { IoPeopleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const VerticalSidebar = () => {
  const location = useLocation();
  const { pathname } = location;
  const menus = [
    { name: "Dashboard", link: `/`, icon: MdDashboard, num: 1 },
    { name: "Book Appointment", link: `/bookappointment`, icon:FaBookOpen, num: 2 },
    {
      name: "View Appointment",
      link: `/viewAppointment`,
      icon: LuView,
      num: 2,
    },
    { name: "Inventory", link: `/inventory`, icon: FaTableList, num: 3 },
    {
      name: "Reports",
      link: `/reports`,
      icon: MdEditSquare,
      num: 4,
      submenus: [
        { name: "Report", link: "/reports" },
        { name: "Invoice wise collection", link: "/invoicewise" },
        { name: "Category wise collection", link: "/categorywise" },
        { name: "Revenue", link: "/revenue" },
        { name: "Weekly Report", link: "/weeklyreport" },
        { name: "Inventory Report", link: "/inventoryreport" },
      ],
    },
    { name: "Employee", link: `/employee`, icon: RiAccountPinBoxFill, num: 5 },
    { name: "Services", link: `/customerservices`, icon: MdRememberMe, num: 6 },
    { name: "Membership", link: `/Membership`, icon: MdCardMembership, num: 7 },
    { name: "Advance", link: `/advance`, icon: FaWallet, num: 7 },

    { name: "Active Members", link: `/activemembers`, icon: MdCardMembership, num: 7 },
    { name: "Subscription", link: `/Subscription`, icon:MdCardMembership , num: 7 },
    { name: "Recent PO", link: `/orders`, icon: RiShoppingCartFill, num: 8 },
    { name: "Customer Details", link: `/details`, icon: IoPeopleSharp, num: 9 },
    {
      name: "Salon Details",
      link: `/salon-details`,
      icon: BiMessageAltDetail,
      num: 10,
    },
    { name: "Royality", link: `/royalities`, icon: GiRoyalLove, num: 10 },
  ];
  const dispatch = useDispatch();

  const { open, openAccordion } = useSelector((state) => state.SidebarReducer);
  
  //   const [open, setOpen] = useState(true);
  //   const [openAccordion, setOpenAccordion] = useState(false);
  const handleOpen = () => {
    // setOpenAccordion(false);
    dispatch({ type: "TOGGLE_ACCORDION", payload: false });

    dispatch({ type: "TOGGLE_SIDEBAR", payload: !open });
    // setOpen(!open);
  };

  const toggleAccordion = () => {
    dispatch({ type: "TOGGLE_ACCORDION", payload: !openAccordion });
  };

   const isReportLinkActive =()=>{
    const reportObj =menus.find((item=>item.name==="Reports"))
   const Index =reportObj.submenus.findIndex((item)=>item.link===pathname)
   if(Index!==-1){
    return true
   }
   return false
   
  
     
  } 
  return (
    <section className={`bg-[#191919]  flex gap-6 min-h-screen  `}>
      <div onMouseEnter={handleOpen}  onMouseLeave={()=>{
        if(open){
          handleOpen()
        }
      }} className={`${open ? "w-64" : "w-16"}  duration-500  px-4 `}>
      
        <div
          className={`py-16 flex flex-col gap-4 fixed top-40 overflow-y-auto h-[70%] hide-scrollbar ${open?"pointer-events-auto":"pointer-events-none"}`}
        >
          {menus?.map((menu, i) => (
            <React.Fragment key={i}>
              {menu.name === "Reports" ? (
                <div className="pointer-events-none">
                  <div
                    className="cursor-pointer group no-underline flex items-center -ml-1 text-xs gap-3.5 font-bold p-2 text-gray-300 rounded-md"
                    onClick={() => {
                      if (!open)
                        dispatch({ type: "TOGGLE_SIDEBAR", payload: !open });

                      toggleAccordion();
                    }}
                  >
                    <div
                      className={`pointer-events-auto ${
                       isReportLinkActive() && openAccordion
                          ? "text-white opacity-100"
                          : "text-gray-300"
                      }`}
                    >
                      {React.createElement(menu.icon, { size: "20" })}
                    </div>
                    <h2
                      className={`whitespace-pre text-sm ${
                       isReportLinkActive() && openAccordion
                          ? "text-white opacity-100"
                          : "text-gray-300"
                      } ${!open ? "opacity-0  overflow-hidden pointer-events-none" :"pointer-events-auto"}`}
                      style={{
                        transitionDelay: `${1}00ms`,
                      }}
                    >
                      {menu.name}
                    </h2>
                    <button
                      className={`text-gray-300 bg-transparent hover:bg-transparent ${
                       isReportLinkActive() && openAccordion
                          ? "text-white opacity-100"
                          : "text-gray-300"
                      } ${
                        !open ? "hidden pointer-events-none" : "pointer-events-auto"
                      }`}
                      onClick={toggleAccordion}
                    >
                      {openAccordion ? "▲" : "▼"}
                    </button>
                  </div>
                  {openAccordion && (
                    <div className="ml-8">
                      {menu.submenus?.map((submenu, j) => (
                        <Link
                          key={j}
                          to={`${submenu.link}`}
                          className={`group pointer-events-auto no-underline flex items-center -ml-1 text-xs gap-3.5 font-bold p-2  rounded-md  ${
                   ( submenu.link === pathname && open)
                          ? "text-white opacity-100 "
                          : "text-gray-300 "
                      }`}
                        >
                          <div>{submenu.name}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={menu.link}
                  className={` ${
                    menu.margin && "mt-5"
                  } group  no-underline flex items-center -ml-1 text-xs gap-3.5 font-bold p-2  text-gray-300 "hover:bg-gray-300"  rounded-md`}
                >
                  <div
                    className={` ${
                      menu.link === pathname 
                        ? "text-white opacity-100"
                        : "text-gray-300"
                    }`}
                  >
                    {React.createElement(menu.icon, { size: "20" })}
                  </div>
                  <h2
                    className={`whitespace-pre   text-sm  ${
                      !open ?"opacity-0  overflow-hidden pointer-events-none":"pointer-events-auto"
                    } ${
                      menu.link === pathname && open
                        ? "text-white opacity-100"
                        : "text-gray-300"
                    }`}
                    style={{
                      transitionDelay: `${0}00ms`,
                    }}
                  >
                    {menu.name}
                  </h2>
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VerticalSidebar;
