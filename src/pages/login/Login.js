// pages/login/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import logo from "../../images/logo1.png";
import Typewriter from "../../components/TypewriterText/Typewriter";
import { MdPhone } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postApiData } from "../../utils/services";
import { setRoyaltyStatus } from "../../redux/reducers";

const Login = () => {
  const messages = [
    'lead in Salon Franchises!',
    'Sell Premium Salon Products!',
    'Serve Salon Owners and Consumers!',
  ];
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  //   const setAuthToken = token => {
  //     if (token) {
  //         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //     }
  //     else
  //         delete axios.defaults.headers.common["Authorization"];
  //  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = (e) => {
    e.preventDefault()
    const data = {
      userName: mobileNumber,
      password: password,
    };
    postApiData("parlor/login", data, (resp) => {
      localStorage.setItem("token", resp?.token);
      localStorage.setItem("gstApplied", resp?.gstApplied);
      dispatch(
        setRoyaltyStatus({
          royaltyDue: Boolean(resp?.royaltyDue),
          royaltyOverdue: Boolean(resp?.royaltyOverdue),
        })
      );

      if (resp?.royaltyDue && !resp?.royaltyOverdue) {
        window.dispatchEvent(new CustomEvent("open-reminder-modal"));
      }

      if (resp?.royaltyOverdue) {
        navigate("/royalties-check");
        return; 
      }
      // dispatch(userDetails(resp.data.data));
      toast.success("You have logined sucessfully")

      // setAuthorizationToken(resp.data.data)

      navigate("/");
    }, () => {
        toast.error("please provide valid details")

    })
    // axios
    //   .post("https://crm.smartsalon.in/parlor/login", data)
    //   .then((resp) => {
    //     if (resp) {
    //       localStorage.setItem("token", resp?.data?.data);

    //       // dispatch(userDetails(resp.data.data));
    //       toast.success("You have logined sucessfully")

    //       // setAuthorizationToken(resp.data.data)

    //       navigate("/");
    //     }

    //   })
    //   .catch((error) => {
    //     toast.error("please provide valid details")

    //     // alert("please provide valid details")
    //   });
  };

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen h-auto md:h-screen"
    >
      <div className="w-full h-[40vh] md:w-[45%] md:h-auto bg-black flex items-center ">
        <div
          className="w-full h-full flex flex-col items-center justify-center px-6"
        >
          <img
            src={logo}
            className="h-[100px] md:h-[150px] w-[130px] md:w-[190px]"
          />
          <span
            className="mt-5 text-white font-bold text-[1.4rem] md:text-[2rem] text-center"
          >
            Hi, Welcome Back
          </span>
          <Typewriter texts={messages} />

          <div

          >

          </div>
        </div>

      </div>
      <div className="w-full md:w-[55%] flex items-center justify-center flex-1">
        <div className="h-auto md:h-[80%] w-full max-w-[400px] px-6 py-8 md:py-0 md:w-[60%] flex items-center justify-center flex-col">
          <h2 className="text-[1.8rem] font-bold mb-5">Login</h2>
          <form className="w-full" onSubmit={handleLogin}>
            <div className="relative w-full  flex items-center justify-center">
              <MdPhone className="absolute left-3 text-xl text-gray-400" />
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                className="border w-full rounded-[25px] focus:ring-1 ring-blue-400 outline-none px-9 h-[50px]"

              />
            </div>

            <div className="relative mt-5 w-full  flex items-center justify-center">
              <RiLockPasswordFill className="absolute left-3 text-xl text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border rounded-[25px] focus:ring-1 ring-blue-400  outline-none px-9 h-[50px] w-full "

              />
              {showPassword ? <FaEye onClick={togglePasswordVisibility} className="absolute right-4 text-xl text-gray-400" /> :
                <FaEyeSlash onClick={togglePasswordVisibility} className="absolute right-4 text-xl text-gray-400" />

              }

            </div>

            <button
              type="submit"
              // onClick={handleLogin}
              className="border rounded-[25px] mt-5 flex items-center justify-center text-white font-medium h-[50px] w-full bg-black"

            >

              Login


            </button>
          </form>




        </div>
      </div>
    </div>
  );
};

export default Login;
