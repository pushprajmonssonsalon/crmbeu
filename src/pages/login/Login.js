// pages/login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { postApiData, setAuthorizationToken } from "../../utils/services";
import axios from "axios";
import { loginUser } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { userDetails } from "../../redux/actions";
import { toast } from "react-hot-toast";
const Login = ({ onLogin }) => {
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
    axios
      .post("https://crm.smartsalon.in/parlor/login", data)
      .then((resp) => {
        if (resp) {
         localStorage.setItem("token", resp?.data?.data);
        console.log("response", resp.data.data);
        // dispatch(userDetails(resp.data.data));
        toast.success("You have logined sucessfully")
          
          // setAuthorizationToken(resp.data.data)

          navigate("/");
        }
      })
      .catch((error) => {
        toast.error("please provide valid details")
        console.log("error", error);
        // alert("please provide valid details")
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "800px",
      }}
    >
      <div className="login-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
           <img
          src={"https://smartsalon.in/static/media/applogo.d153d799341a8fb862fd.jpg"}
          style={{marginLeft:'20px',marginTop:'8px',width:'132px',height:'80px',marginBottom:'10px' }}
        />
        </div>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "700",
            fontSize: "26px",
            color: "rgb(63, 81, 181)",
            marginTop: "20px",
          }}
        >
          Hi, Welcome Back
        </span>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "400",
            fontSize: "16px",
            marginTop: "10px",
            color: "rgb(158, 158, 158)",
          }}
        >
          {"Enter your credentials to continue"}
        </span>
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            marginTop: "25px",
          }}
        >
          <form onSubmit={handleLogin}>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              style={{
                height: "50px",
                border: "1px solid grey",
                width: "350px",
                borderRadius: "11px",
                paddingLeft: "10px", // Add padding for better visual appearance
              }}
            />
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  height: "50px",
                  border: "1px solid grey",
                  width: "350px",
                  borderRadius: "11px",
                  paddingRight: "30px", // Add space for the eye icon
                }}
              />
              <span
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "40%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <button
              type="submit"
              // onClick={handleLogin}
              style={{
                height: "50px",
                border: "1px solid grey",
                width: "350px",
                borderRadius: "11px",
                fontSize: "16px",
                backgroundColor: "rgb(63, 81, 181)",
              }}
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
