import axios from "axios";
// import { store } from "../Redux/store/store";
import { store } from "../redux/store";
// const BASE_URL = "https://crm.smartsalon.in/";
const BASE_URL = "http://localhost:8000/";
// const BASE_URL = "http://192.168.2.18:4002";

const token = localStorage.getItem("token");
const authToken = store.getState();
// const authToken = token;
// const token = authToken.authReducer.userData

// const instance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 30000,
//   headers: {
//     "X-Custom-Header": "foobar", // Custom headers if needed
//     "Content-Type": "application/json", // Sample content type header
//     Authorization: `Bearer ${token}`,
//   },
// });

const setAuthorizationToken = (auth_token) =>{
  console.log("token",auth_token)
  if(auth_token){
    // instance.defaults.headers.common['Authorization'] =  `Bearer ${auth_token}`;
  }
}
const postApiData = (endpoint, apidata, success, failur) => {
  const token = localStorage.getItem("token");
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      "X-Custom-Header": "foobar", // Custom headers if needed
      "Content-Type": "application/json", // Sample content type header
      Authorization: `Bearer ${token}`,
    },
  });
  // console.log("endpointdata",apidata)
  instance
    .post(endpoint, apidata)
    .then((res) => {
      console.log('otpresponse',res)
      success(res?.data?.data);
    })
    .catch((error) => {
      console.log("databaase", error);
      failur(error)
    });
};
const getApiCall = (endpoint, success, failur) => {
  const token = localStorage.getItem("token");
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      "X-Custom-Header": "foobar", // Custom headers if needed
      "Content-Type": "application/json", // Sample content type header
      Authorization: `Bearer ${token}`,
    },
  });
  
  instance
  .get(endpoint)
  .then((res) => {
      success(res?.data?.data);
    })
    .catch((error) => {
      failur("error",error)
    });
};

export { postApiData, getApiCall ,setAuthorizationToken};

