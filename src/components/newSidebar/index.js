import React, { useEffect, useState } from "react";
import { MdOutlineContacts, MdOutlineFireHydrantAlt, MdOutlineInventory2 } from "react-icons/md";
import { FaAngleDown, FaRegStar } from "react-icons/fa6";
import { LiaChartBarSolid } from "react-icons/lia";

import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo3 from "../../images/logo3.png";
import { GoHome } from "react-icons/go";
import { IoFileTrayFullOutline, IoSettingsOutline } from "react-icons/io5";

import { IoIosArrowBack } from "react-icons/io";
import { FiLayers } from "react-icons/fi";
const VerticalSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null); // Track which submenu is open

  const toggleSubMenu = (menuNum) => {
    setOpenMenu(openMenu === menuNum ? null : menuNum);
  };
  const { pathname } = location;
  const menus = [
    { name: "Appointment", link: `/`, icon: GoHome, num: 1 },
    { name: "Dashboard", link: `/dashboard`, icon: MdOutlineFireHydrantAlt, num: 2 },

    { name: "Inventory", link: `/inventory`, icon: MdOutlineInventory2, num: 3 },
    {
      name: "Reports",
      link: `/reports`,
      icon: IoFileTrayFullOutline,
      num: 4,
      
    },
    { name: "Contacts", link: `/contacts`, icon: MdOutlineContacts, num: 5 },
    { name: "Services", link: `/customerservices`, icon: FiLayers, num: 6 },
    { name: "Membership", link: `/membership`, icon: LiaChartBarSolid, num: 7 },
    {
      name: "Salon Details",
      link: `/salon-details`,
      icon: IoSettingsOutline,
      num: 10,
    },
    { name: "Royality", link: `/royalities`, icon: FaRegStar, num: 10 },
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
    setOpenMenu(null)
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

        <div className="flex mb-[32px] h-[63px] justify-between">



          {open && <div className="">

            <img src={logo3} alt="/" className={`w-[108.11px] h-[63px]} `} />
          </div>}
          <button onClick={handleOpen} className="bg-[#ECECEC] w-[38px] h-[40px] rounded-[10px] ">
            <IoIosArrowBack className={`text-[16px]  text-black ${open ? "" : "rotate-180"}`} />

          </button>
        </div>
        <div className="flex flex-col gap-4 h-[calc(100%-127px)] overflow-auto hide-scrollbar">
      {menus.map((menu, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col">
            <button
              onClick={() =>
                menu.submenus ? open? toggleSubMenu(menu.num):(()=>{
                  handleOpen()
                  toggleSubMenu(menu.num)
                })() : navigate(menu.link)
              }
              className={`flex whitespace-nowrap items-center gap-6 text-[#636060] ${
                open ? "w-[190px]" : "w-[42px] overflow-hidden"
              } ${
                activeTab === menu.link ? "bg-[#DEFDFE] shadow rounded-[10px]" : ""
              } $`}
            >
              <div className="h-[24px] w-[21.33px]">
                {React.createElement(menu.icon, { size: "20" })}
              </div>
              <div className="text-[14px] font-[400] leading-[28px]">
                {menu.name}
              </div>
              {menu.submenus&&<div className={`text-[14px] font-[400]  ${openMenu?"rotate-180":""}`}>
              <FaAngleDown />

              </div>}
            </button>

            {/* Submenus */}
            {menu.submenus && openMenu === menu.num && (
              <div className="flex my-3 flex-col gap-2">
                {menu.submenus.map((submenu, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(submenu.link)}
                    className={`text-[#636060] text-[14px] py-1 px-2 rounded ${
                      activeTab === submenu.link ? " text-black" : ""
                    }`}
                  >
                    {submenu.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
      </div>
    </section>
  );
};

export default VerticalSidebar;
