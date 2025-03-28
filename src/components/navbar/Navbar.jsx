import { useEffect } from "react";
import "./Navbar.css";
import { useState } from "react";
import { getApiCall } from "../../utils/services";
import { parlordetail } from "../../redux/actions";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import ChangePassword from "../modals/ChangePassword";
import { FaAngleDown } from "react-icons/fa";
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
      <nav className="flex z-[10] flex-row shadow-navbar  sticky top-0  justify-between items-center nav px-6 py-[20px]  bg-white  w-full ">



        <div className="flex items-center w-full justify-end">
          <ul className="flex flex-row items-center">
            {/* <li className="mx-6 font-medium inter text-xs xl:text-lg text-slate-100 cursor-pointer hover:border-b-2 border-gray-300">
              {parlorDetails?.name}
            </li>
            <li className="mx-6 max-w-[180px] lg:max-w-[350px] overflow-hidden text-ellipsis whitespace-nowrap font-medium inter text-xs xl:text-lg text-slate-100 cursor-pointer hover:border-b-2 border-gray-300">
              {parlorDetails?.address}
            </li> */}
            <li
              onClick={() => navigate("/notifications")}
              className="mx-6 relative h-fit text-slate-100 cursor-pointer "
            >
              <svg
                width="22"
                height="28"
                viewBox="0 0 22 28"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#636060]"
              >
                <path d="M0.333496 23.3333V20.6667H3.00016V11.3333C3.00016 9.48889 3.55572 7.85 4.66683 6.41667C5.77794 4.98333 7.22239 4.04445 9.00016 3.6V2.66667C9.00016 2.11111 9.19461 1.63889 9.5835 1.25C9.97239 0.861112 10.4446 0.666668 11.0002 0.666668C11.5557 0.666668 12.0279 0.861112 12.4168 1.25C12.8057 1.63889 13.0002 2.11111 13.0002 2.66667V3.6C14.7779 4.04445 16.2224 4.98333 17.3335 6.41667C18.4446 7.85 19.0002 9.48889 19.0002 11.3333V20.6667H21.6668V23.3333H0.333496ZM11.0002 27.3333C10.2668 27.3333 9.63905 27.0722 9.11683 26.55C8.59461 26.0278 8.3335 25.4 8.3335 24.6667H13.6668C13.6668 25.4 13.4057 26.0278 12.8835 26.55C12.3613 27.0722 11.7335 27.3333 11.0002 27.3333ZM5.66683 20.6667H16.3335V11.3333C16.3335 9.86667 15.8113 8.61111 14.7668 7.56667C13.7224 6.52222 12.4668 6 11.0002 6C9.5335 6 8.27794 6.52222 7.2335 7.56667C6.18905 8.61111 5.66683 9.86667 5.66683 11.3333V20.6667Z" />
              </svg>
              {unReadMsg > 0 && <div className="top-0 absolute -right-[1px]">
                <p className="flex h-6 w-6 p-2 items-center justify-center rounded-full bg-red-500  text-sm text-white">
                  {unReadMsg > 9 ? "9+" : unReadMsg || 0}
                </p>
              </div>}
            </li>
            <li className="mx-6 font-medium inter text-xs xl:text-lg text-slate-100 cursor-pointer">
              <button onClick={adminPress}
                className=" bg-white  py-2 px-4 rounded-lg text-black flex justify-center gap-4 items-center">
                <div className="flex items-center justify-center gap-2 ">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28 16C28 18.4759 27.2501 20.7767 25.9652 22.6876C23.8107 25.8919 20.1515 28 16 28C11.8485 28 8.18936 25.8919 6.03479 22.6876C4.74983 20.7767 4 18.4759 4 16C4 9.37259 9.37259 4 16 4C22.6275 4 28 9.37259 28 16Z" stroke="#636060" stroke-width="2.5" />
                  <path d="M16.9998 12C16.9998 12.5523 16.5521 13 15.9998 13V16.3333C18.393 16.3333 20.3332 14.3932 20.3332 12H16.9998ZM15.9998 13C15.4476 13 14.9998 12.5523 14.9998 12H11.6665C11.6665 14.3932 13.6066 16.3333 15.9998 16.3333V13ZM14.9998 12C14.9998 11.4477 15.4476 11 15.9998 11V7.66667C13.6066 7.66667 11.6665 9.60676 11.6665 12H14.9998ZM15.9998 11C16.5521 11 16.9998 11.4477 16.9998 12H20.3332C20.3332 9.60676 18.393 7.66667 15.9998 7.66667V11Z" fill="#636060" />
                  <path d="M6.88797 23.8085L5.29064 23.3328L5.03125 24.2039L5.62292 24.8936L6.88797 23.8085ZM25.1123 23.8085L26.3774 24.8936L26.9691 24.2039L26.7097 23.3328L25.1123 23.8085ZM12.0002 21.6667H20.0002V18.3333H12.0002V21.6667ZM12.0002 18.3333C8.82713 18.3333 6.15124 20.4432 5.29064 23.3328L8.4853 24.2843C8.93664 22.7688 10.3419 21.6667 12.0002 21.6667V18.3333ZM16.0002 26.3333C12.8614 26.3333 10.0507 24.9359 8.15304 22.7235L5.62292 24.8936C8.12686 27.8129 11.8479 29.6667 16.0002 29.6667V26.3333ZM20.0002 21.6667C21.6585 21.6667 23.0637 22.7688 23.515 24.2843L26.7097 23.3328C25.8491 20.4432 23.1731 18.3333 20.0002 18.3333V21.6667ZM23.8473 22.7235C21.9497 24.9359 19.139 26.3333 16.0002 26.3333V29.6667C20.1525 29.6667 23.8735 27.8129 26.3774 24.8936L23.8473 22.7235Z" fill="#636060" />
                </svg>

                Admin
                </div>
                <div>
                <FaAngleDown />

                </div>


               
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
