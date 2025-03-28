import React, { useEffect, useState } from "react";
import { MdDashboard, MdEditSquare, MdRememberMe } from "react-icons/md";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { MdCardMembership } from "react-icons/md";
import { FaBookOpen, FaWallet } from "react-icons/fa";
import { LuView } from "react-icons/lu";
import { FaTableList } from "react-icons/fa6";
import { RiShoppingCartFill } from "react-icons/ri";
import { GiRoyalLove } from "react-icons/gi";
import { BiMessageAltDetail } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { IoPeopleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import logo3 from "../../images/logo3.png";
import { IoIosArrowBack } from "react-icons/io";
const VerticalSidebar = () => {
  const location = useLocation();
  const navigate =useNavigate();
  const { pathname } = location;
  const menus = [
    { name: "Dashboard", link: `/`, icon: MdDashboard, num: 1 },
    { name: "Appointments", link: `/appointments`, icon: FaBookOpen, num: 2 },
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
    { name: "Subscription", link: `/Subscription`, icon: MdCardMembership, num: 7 },
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
  const [activeTab, setActiveTab] = useState("/")

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

  const isReportLinkActive = () => {
    const reportObj = menus.find((item => item.name === "Reports"))
    const Index = reportObj.submenus.findIndex((item) => item.link === pathname)
    if (Index !== -1) {
      return true
    }
    return false



  }
  useEffect(() => {

    setActiveTab(pathname)
  }, [pathname])
  return (
    <section className={`bg-white border-r shadow-navbar pt-[32px] sticky top-0  flex gap-6 h-screen  `}>
      <div
        // onMouseEnter={handleOpen}  onMouseLeave={()=>{
        //   if(open){
        //     handleOpen()
        //   }
        // }} 
        className={`${open ? "w-56 px-4 " : "w-16 px-[11px]"} transition-all ease-in    overflow-hidden`}>

        <div  className="flex mb-[32px] h-[63px] justify-between">


       
       {open&& <div className="">
     
          <img src={logo3} alt="/" className={`w-[108.11px] h-[63px]} `} />
        </div>}
        <button onClick={handleOpen} className="bg-[#ECECEC] w-[38px] h-[40px] rounded-[10px] ">
        <IoIosArrowBack className={`text-[16px]  text-black ${open?"":"rotate-180"}`} />

        </button>
        </div>
        <div
          className={` flex flex-col gap-4 h-[calc(100vh-127px)] overflow-auto   hide-scrollbar }`}
        >
          {menus?.map((menu, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <button onClick={()=>navigate(menu.link)} className={`flex whitespace-nowrap items-center gap-6 text-[#636060] ${open?"w-[190px]":"w-[42px] overflow-hidden"} ${activeTab===menu.link?"bg-[#DEFDFE] shadow rounded-[10px]":""} `}>
                  <div className="h-[24px] w-[21.33px]">
                    {React.createElement(menu.icon, { size: "20" })}
                  </div>
                  <div className="text-[14px] font-[400] leading-[28px] ">{menu.name}</div>
                </button>

              </div>

            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VerticalSidebar;
