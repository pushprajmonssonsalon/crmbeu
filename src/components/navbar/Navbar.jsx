import React, { useEffect } from "react";
import "./Navbar.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaPhoneFlip } from "react-icons/fa6";
import { useState } from "react";
import { getApiCall } from "../../utils/services";
import { parlordetail } from "../../redux/actions";
import { useNavigate } from "react-router";
import salonLogo from '../../images/smartsalonlogowhiteborder.png'
import {toast} from "react-hot-toast";
const Navbar = () => {
  const [admin, setAdmin] = useState(false);
  const [parlorDetails,setParlorDetails]=useState({})
  const navigate=useNavigate()
  const adminPress = () => {
    setAdmin(!admin);
  };
  useEffect(() => {
    getApiCall(
      "parlor/getParlorDetail",
      (resp) => {
        console.log("getparlour", resp);
        setParlorDetails(resp);
        parlordetail(resp)
        
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, []);
  const   signoutPress=()=>{
    localStorage.removeItem("token");
    toast.success("Logout Successful")
    navigate("/login")
  }

  return (
    <nav className='flex flex-row justify-between items-center nav px-6 flex-wrap bg-[#191919] fixed w-full z-10 '>
            <div className='flex flex-row items-center justify-center'>
            <img src={salonLogo} alt="" className='w-[152px] h-[80px] my-2 text-white'/>
            </div>
            <div>
                <ul className='flex flex-row justify-between items-center'>
                    <li className ='mx-6 font-medium inter text-lg text-slate-100 cursor-pointer hover:border-b-2 border-gray-300'>{parlorDetails?.phoneNumber}</li>
                </ul>
            </div>

            <div>
            <ul className='flex flex-row justify-between items-center'>
                    <li className ='mx-6 font-medium inter text-lg text-slate-100 cursor-pointer hover:border-b-2 border-gray-300'>{parlorDetails?.name}</li>
                    <li className ='mx-6 font-medium inter text-lg text-slate-100 cursor-pointer hover:border-b-2 border-gray-300'>{parlorDetails?.address}</li>
                    <li className ='mx-6 font-medium inter text-lg text-slate-100 cursor-pointer'>
                    <button className=' bg-[#5865F2] py-2 px-4 rounded-lg text-white flex justify-center items-center'>
               
                <h3 className='font-semibold text-lg poppins' onClick={adminPress}>Admin</h3>
                </button></li>
                </ul>
            </div>
            {admin && (
         <div style={{display:'flex',paddingRight:'10px',position:'absolute',flexDirection:'row-reverse',right:'0px', top:'80px'}}>

         <div className="signOut cursor-pointer">
           <span className="manageProfile">Manage Profile</span>
           <span className="manageProfile cursor-pointer" style={{ marginTop: "10px" }}
           onClick={signoutPress}>
             Sign Out
             </span>
         
         </div>
         </div>
       )}
            </nav>
  );
};

export default Navbar;




{/* <div>
      <div className="navbardiv fixed z-10 ">
        {/* <RxHamburgerMenu /> */}
      //   <img
      //     src={"https://smartsalon.in/static/media/applogo.d153d799341a8fb862fd.jpg"}
      //     style={{marginLeft:'20px',marginTop:'8px',width:'132px',height:'80px',marginBottom:'10px' }}
      //   />
      //   <div
      //     style={{ marginLeft: "20px", display: "flex", alignItems: "center" }}
      //   >
      //     <FaPhoneFlip color="white" />
    

      //     <p style={{ marginLeft: "10px",color:'white' }}>{parlorDetails.phoneNumber}</p>
      //   </div>
      //   <div style={{ display: "flex", alignItems: "center",paddingRight:'40px' }}>
      //     <p style={{color:'white' }}>{parlorDetails?.name}</p>
      //     <p style={{marginLeft:'10px',color:'white'}}>{parlorDetails?.address}</p>
      //     <span onClick={adminPress} style={{marginLeft:'10px',color:'white'}} className="cursor-pointer">Admin</span>
      //   </div>
      // </div>
      // {admin && (
      //   <div style={{display:'flex',paddingRight:'10px',position:'absolute',flexDirection:'row-reverse',right:'0px'}}>

      //   <div className="signOut cursor-pointer">
      //     <span className="manageProfile">Manage Profile</span>
      //     <span className="manageProfile cursor-pointer" style={{ marginTop: "10px" }}
      //     onClick={signoutPress}>
      //       Sign Out
      //       </span>
          {/* <span lassName="manageProfile"
           onClick={signoutPress}>
            Sign Out
          </span> */}
        // </div>
        // </div>
    //   )}
    // </div> */}
