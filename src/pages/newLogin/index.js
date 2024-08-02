import React, { useState } from 'react'
import { postApiData } from '../../utils/services';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from 'axios';

const NewLogin = () => {
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

    // const handleLogin=()=>{
    //     const data = {
    //         userName: mobileNumber,
    //         password: password,
    //       };
    //     postApiData(
    //         "parlor/login",
    //         data,
    //         (resp) => {
    //           if(resp){
    //             console.log("resp1",resp)
    //             localStorage.setItem("token",resp?.data?.data);
    //             navigate("/");
    //             console.log("localStorage.getItem",localStorage.getItem("token"))
    //           }
    //         //   console.log("respns", resp);
    //         },
    //         (error) => {
    //           console.log("error", error);
    //         }
    //       );
    // }  

    
  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://crm.smartsalon.in/parlor/login", {
        mobileNumber,
        password,
      });
      if (res && res.data.success) {
    
        localStorage.setItem("token", JSON.stringify(res.data));
        navigate("/");
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    
    }
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
          <form onSubmit={handleSubmit}>
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
            //   onClick={handleLogin}
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
  )
}

export default NewLogin
