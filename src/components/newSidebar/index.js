import React, {  useEffect, useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";

import { MdApps, MdDashboard, MdEditSquare,MdRememberMe } from "react-icons/md";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { MdCardMembership } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";
import { LuView } from "react-icons/lu";
import {FaTableList} from 'react-icons/fa6'
import { RiShoppingCartFill } from "react-icons/ri";
import { Link } from "react-router-dom";


const VerticalSidebar = () => {
    const menus =[
        { name: "Book Appointment", link: `/`, icon: FaBookOpen, num: 1 },
        { name: "View Appointment", link: `/viewAppointment`, icon: LuView, num: 2 },
        { name: "Inventory", link: `/inventory`, icon: FaTableList, num: 3 },
        { name: "Reports", link: `/reports`, icon: MdEditSquare, num: 4 },
        { name: "Employee", link: `/employee`, icon: RiAccountPinBoxFill, num: 5 },
        { name: "Services", link: `/customerservices`, icon: MdRememberMe, num: 6  },
        { name: "Membership", link: `/Membership`, icon: MdCardMembership, num: 7  },
        { name: "Recent PO", link: `/orders`, icon: RiShoppingCartFill, num: 8  },
    ] ;

    const [open, setOpen] = useState(true);

   

// const matchingIndices = menus
//   .map((item, index) => (item.link === enteredValue ? index : -1))
//   .filter(index => index !== -1);

//console.log("Matching Indices:", matchingIndices);


    
    
    

    return (
        <section className={`bg-[#191919]  flex gap-6 min-h-screen border-r "border-gray-300" `}>
            <div
                className={` min-h-screen  ${open ? "w-64" : "w-16"}  duration-500  px-4`}>
                <div className="py-3 flex justify-end">
                    <HiMenuAlt3
                        size={30}
                        className={`text-gray-500 cursor-pointer fixed top-32`}
                        onClick={() => setOpen(!open)}
                    />
                </div>
                <div className="mt-4 flex flex-col gap-4 fixed top-40">
                    {menus?.map((menu, i) => (
                     
                            <Link
                           
                                to={menu?.link}
                                key={i}
                                className={` ${menu?.margin && "mt-5"
                            } group  no-underline flex items-center -ml-1 text-xs gap-3.5 font-bold p-2  text-gray-300 "hover:bg-gray-300"  rounded-md`}
                                
                            >
                                <div >{React.createElement(menu?.icon, { size: "20" })}</div>
                                <h2
                                    className={`whitespace-pre  text-gray-300 hover:text-gray-500  text-sm ${!open && "opacity-0  overflow-hidden"
                                }`}
                                
                            style={{
                               
                                 transitionDelay: `${0}00ms`,
                            }}
                                >
                                    {menu?.name}
                                </h2>
                            </Link> 
                    ))}
                </div>
            </div>
        </section> 
    );
};

export default VerticalSidebar;




 