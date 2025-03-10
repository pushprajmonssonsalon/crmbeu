import { useEffect } from "react";
import "./Navbar.css";
import { useState } from "react";
import { getApiCall } from "../../utils/services";
import { parlordetail } from "../../redux/actions";
import { useNavigate } from "react-router";
import salonLogo from "../../images/logo1.png";
import { toast } from "react-hot-toast";
import { IoIosNotifications } from "react-icons/io";
import ChangePassword from "../modals/ChangePassword";
const Navbar = () => {
  const [admin, setAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [unReadMsg, setUnReadMsg] = useState(false);
  const [parlorDetails, setParlorDetails] = useState({});
  const navigate = useNavigate();
  const adminPress = () => {
    setAdmin(!admin);
  };
  useEffect(() => {
    getApiCall(
      "parlor/getParlorDetail",
      (resp) => {
        
        setParlorDetails(resp);
        parlordetail(resp);
      },
      (error) => {
        
      }
    );
    getApiCall(
      "/notification/totalUnreadNotification",
      (resp) => {
        
        setUnReadMsg(resp);
      },
      (error) => {
        
      }
    );
  }, []);
  const signoutPress = () => {
    localStorage.removeItem("token");
    toast.success("Logout Successful");
    navigate("/login");
  };

  return (
    <>
      <nav className="flex  flex-row  justify-between items-center nav px-6  bg-[#191919] fixed  top-0 z-10 w-full ">
      <div className="py-2">
        <div className="  p-1 overflow-hidden  ">
          <img
            src={salonLogo}
            alt=""
            className="w-[100px] h-[80px]"
          />
        </div>
        </div>
        <div>
          <ul className="flex flex-row justify-between items-center">
            <li className="mx-6 font-medium inter text-xs xl:text-lg text-slate-100 cursor-pointer hover:border-b-2 border-gray-300">
              {parlorDetails?.phoneNumber}
            </li>
          </ul>
        </div>

        <div>
          <ul className="flex flex-row justify-between items-center">
            <li className="mx-6 font-medium inter text-xs xl:text-lg text-slate-100 cursor-pointer hover:border-b-2 border-gray-300">
              {parlorDetails?.name}
            </li>
            <li className="mx-6 max-w-[180px] lg:max-w-[350px] overflow-hidden text-ellipsis whitespace-nowrap font-medium inter text-xs xl:text-lg text-slate-100 cursor-pointer hover:border-b-2 border-gray-300">
              {parlorDetails?.address}
            </li>
            <li
              onClick={() => navigate("/notifications")}
              className="mx-6 relative h-fit text-slate-100 cursor-pointer "
            >
              <IoIosNotifications className="relative" size={40} />
            {unReadMsg>0&&  <div className="top-0 absolute -right-[1px]">
                <p className="flex h-6 w-6 p-2 items-center justify-center rounded-full bg-red-500  text-sm text-white">
                  {unReadMsg > 9 ? "9+" : unReadMsg || 0}
                </p>
              </div>}
            </li>
            <li className="mx-6 font-medium inter text-xs xl:text-lg text-slate-100 cursor-pointer">
              <button className=" bg-white py-2 px-4 rounded-lg text-black flex justify-center items-center">
                <h3
                  className="font-semibold text-xs xl:text-lg poppins"
                  onClick={adminPress}
                >
                  Admin
                </h3>
              </button>
            </li>
          </ul>
        </div>
        {admin && (
          <div
            style={{
              display: "flex",
              paddingRight: "10px",
              position: "absolute",
              flexDirection: "row-reverse",
              right: "0px",
              top: "80px",
            }}
          >
            <div className="signOut cursor-pointer p-3 text-center">
              <span className="cursor-pointer manageProfile hover:bg-gray-200 rounded-lg px-2 py-1 w-full font-medium ">
                Manage Profile
              </span>
              <span
                onClick={() => setShowModal(true)}
                className="cursor-pointer manageProfile hover:bg-gray-200 rounded-lg px-2 py-1 w-full font-medium "
              >
                Change Password
              </span>
              <span
                className=" cursor-pointer manageProfile hover:bg-gray-200 rounded-lg px-2 py-1 w-full font-medium"
                onClick={signoutPress}
              >
                Sign Out
              </span>
            </div>
          </div>
        )}
      </nav>
      <ChangePassword
        show={showModal}
        setShow={setShowModal}
        onSubmit={() => setShowModal(false)}
      />
    </>
  );
};

export default Navbar;

{
  /* <div>
      <div className="navbardiv fixed z-10 ">
        {/* <RxHamburgerMenu /> */
}
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
{
  /* <span lassName="manageProfile"
 onClick={signoutPress}>
  Sign Out
</span> */
}
// </div>
// </div>
//   )}
// </div> */}
