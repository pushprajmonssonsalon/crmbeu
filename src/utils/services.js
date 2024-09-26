import axios from "axios";
// import { store } from "../Redux/store/store";
import { store } from "../redux/store";
const BASE_URL = "https://crm.smartsalon.in/";
// const BASE_URL = "http://192.168.2.32:4002";
//  const BASE_URL = process.env.REACT_APP_BASE_URI;
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

const setAuthorizationToken = (auth_token) => {
  console.log("token", auth_token);
  if (auth_token) {
    // instance.defaults.headers.common['Authorization'] =  `Bearer ${auth_token}`;
  }
};
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
      console.log("otpresponse", res);
      success(res?.data?.data);
    })
    .catch((error) => {
      console.log("databaase", error);
      failur(error);
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
      failur("error", error);
    });
};
function formatDateToFull(dateString,full=true) {
  if (dateString) {
    const [datePart, timePart] = dateString.split("T");
    const [year, month, day] = datePart.split("-");
    const [hour, minute] = timePart.split(":");

    // Convert month from "08" to "Aug" or any other short form
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthShort = monthNames[parseInt(month, 10) - 1];
    
    if(!full){
      const formattedDate = `${parseInt(day, 10)} ${monthShort} ${year} `;
       return formattedDate
    }
    // Format the time as "08:34 AM/PM"
    let hourInt = parseInt(hour, 10);
    const period = hourInt >= 12 ? "PM" : "AM";
    hourInt = hourInt % 12 || 12; // Convert to 12-hour format
    const formattedTime = `${hourInt}:${minute} ${period}`;

    // Format the full date as "7 Aug 2024 08:34 AM"
    const formattedDate = `${parseInt(day, 10)} ${monthShort} ${year} ${formattedTime}`;
    return formattedDate;
  }
  return dateString;
}

export { postApiData, getApiCall, setAuthorizationToken ,formatDateToFull};
