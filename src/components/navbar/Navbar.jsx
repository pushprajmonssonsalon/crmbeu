import { useEffect, useRef } from "react";
import "./Navbar.css";
import { useState } from "react";
import { getApiCall, postApiData } from "../../utils/services";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import ChangePassword from "../modals/ChangePassword";
import { FaAngleDown } from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import profile from "../../images/profile.svg";
import { isDistributer, clearSession } from "../../utils/auth";
const Navbar = () => {
  const [admin, setAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [unReadMsg, setUnReadMsg] = useState(false);
  const [parlorDetails, setParlorDetails] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const distributer = isDistributer();
  const { open } = useSelector((state) => state.SidebarReducer);
  const modalRef = useRef(null);
  const adminPress = () => {
    setAdmin(!admin);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setAdmin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (distributer) {
      const cached = localStorage.getItem("distributer_name");
      if (cached && cached !== "undefined" && cached !== "null") {
        setParlorDetails(cached);
        return;
      }
      postApiData(
        "distributer/getDistrubterDetails",
        {},
        (resp) => {
          const label = resp?.trade || resp?.name || "";
          setParlorDetails(label);
          localStorage.setItem("distributer_name", label);
        },
        () => {}
      );
      return;
    }
    let name = localStorage.getItem("salon_address");

    getApiCall(
      "/notification/totalUnreadNotification",
      (resp) => {

        setUnReadMsg(resp);
      },
      (error) => {

      }
    );
    if (!name|| name === "undefined"|| name === "null") {
      getApiCall(
        "parlor/getParlorDetail",
        (resp) => {

          setParlorDetails(resp?.address2||resp?.address)
          localStorage.setItem("salon_address",resp?.address2||resp?.address);
        },
        (error) => {

        }
      );
    }
    else {
      setParlorDetails(name);
    }
  }, []);
 
  const signoutPress = () => {
    clearSession();
    toast.success("Logout Successful");
    navigate("/login");
  };

  return (
    <>
     <nav className="flex z-[10] flex-row sticky top-0 justify-between items-center nav pl-3 md:pl-4 bg-transparent w-full max-w-full ">



        <button
          onClick={() => dispatch({ type: "TOGGLE_SIDEBAR", payload: !open })}
          className="md:hidden mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-navbar border border-lightGray"
          aria-label="Toggle menu"
        >
          <HiMenuAlt3 size={22} className="text-ternary" />
        </button>

        <div className="flex items-center w-full justify-end ">
          <ul className="flex flex-row items-center justify-end sm:justify-between w-full border bg-white border-lightGray shadow-navbar rounded-b-[25px] px-[12px] md:px-[32px] py-[10px]">
            
            <li className=" hidden sm:inline-block max-w-[120px] md:max-w-[180px] lg:max-w-[350px] overflow-hidden text-ellipsis whitespace-nowrap  text-lightGray2 inter text-xs xl:text-sm  border-b-2 border-gray-300">
              {parlorDetails}
            </li>
            <li className="flex items-center gap-3 md:gap-0 ">

            
            {!distributer && <li
              onClick={() => navigate("/notifications")}
              className="mx-2 md:mx-6 relative h-fit text-slate-100 cursor-pointer "
            >
              <svg
                width="22"
                height="28"
                viewBox="0 0 22 28"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="text-ternary"
              >
                <path d="M0.333496 23.3333V20.6667H3.00016V11.3333C3.00016 9.48889 3.55572 7.85 4.66683 6.41667C5.77794 4.98333 7.22239 4.04445 9.00016 3.6V2.66667C9.00016 2.11111 9.19461 1.63889 9.5835 1.25C9.97239 0.861112 10.4446 0.666668 11.0002 0.666668C11.5557 0.666668 12.0279 0.861112 12.4168 1.25C12.8057 1.63889 13.0002 2.11111 13.0002 2.66667V3.6C14.7779 4.04445 16.2224 4.98333 17.3335 6.41667C18.4446 7.85 19.0002 9.48889 19.0002 11.3333V20.6667H21.6668V23.3333H0.333496ZM11.0002 27.3333C10.2668 27.3333 9.63905 27.0722 9.11683 26.55C8.59461 26.0278 8.3335 25.4 8.3335 24.6667H13.6668C13.6668 25.4 13.4057 26.0278 12.8835 26.55C12.3613 27.0722 11.7335 27.3333 11.0002 27.3333ZM5.66683 20.6667H16.3335V11.3333C16.3335 9.86667 15.8113 8.61111 14.7668 7.56667C13.7224 6.52222 12.4668 6 11.0002 6C9.5335 6 8.27794 6.52222 7.2335 7.56667C6.18905 8.61111 5.66683 9.86667 5.66683 11.3333V20.6667Z" />
              </svg>
              {unReadMsg > 0 && <div className="-top-[5px] absolute -right-[10px]">
                <p className="flex h-6 w-6  items-center justify-center rounded-full bg-red-500  text-[12px] text-white">
                  {unReadMsg > 9 ? "9+" : unReadMsg || 0}
                </p>
              </div>}
            </li>}
            <li className="mx-2 md:mx-6 font-medium inter text-xs xl:text-lg text-slate-100 cursor-pointer">
              <button onClick={adminPress}
                className=" bg-white hover:bg-secondaryGray py-1 px-2 md:py-2 md:px-4 rounded-[16px] text-ternary flex justify-center gap-2 md:gap-4 items-center">
                <div className="flex items-center justify-center gap-2 ">
                <img src={profile} alt="" className="h-[32px] w-[32px] shrink-0" />

                  <span className="hidden sm:inline">{distributer ? "Distributer" : "Admin"}</span>
                </div>
                <div>
                  <FaAngleDown />

                </div>



              </button>
            </li>
            </li>
          </ul>
        </div>
        {admin && (
          <div
            className="absolute right-3 md:right-[40px] top-full mt-1 z-[60] flex"
            ref={modalRef}
          >
            <div       // Prevent closing when clicking inside
              className="bg-white text-start rounded-[16px] border shadow flex flex-col cursor-pointer p-3 ">
              {!distributer && <span className="cursor-pointer hover:bg-gray-50 p-2 text-black font-medium" onClick={() => {
                setAdmin(false)
                navigate("/salon-details")
              }}>
                Manage Profile
              </span>}
              {!distributer && <span
                onClick={() => {
                  setShowModal(true)
                  setAdmin(false)
                }}
                className="cursor-pointer hover:bg-gray-50 border-b  p-2 text-black font-medium"
              >
                Change Password
              </span>}
              <span
                className=" cursor-pointer hover:bg-gray-50  p-2"
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
