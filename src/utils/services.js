import axios from "axios";
// import { store } from "../Redux/store/store";
import { store } from "../redux/store";
const BASE_URL = "https://crm.smartsalon.in/";
// const BASE_URL = "http://192.168.3.36:4002";
// const BASE_URL = "http://192.168.2.43:4002";
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
  // 
  instance
    .post(endpoint, apidata)
    .then((res) => {
      
      success(res?.data?.data);
    })
    .catch((error) => {
      
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
function formatDateMonth(dateString) {
  if (dateString) {
    const [datePart] = dateString.split("T");
    const [year, month, day] = datePart.split("-");

    // Convert month from "08" to "Aug" or any other short form
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthShort = monthNames[parseInt(month, 10) - 1];

    // Format the time as "08:34 AM/PM"
    const formattedDate = `${parseInt(day, 10)} ${monthShort}`;

    // Format the full date as "7 Aug 2024 08:34 AM"
    return formattedDate;
  }
  return dateString;
}
const formatDateWOYear = (day, month) => {
  if (!day || !month) return null; // Handle empty values
  return new Date(`1970-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00Z`);
};
function formatValue(value){
  if(Array.isArray(value)){
  return  value.map(elm=>formatValue(elm))
  }
  else if(typeof value ==="number"){
    return value>0? parseFloat(value?.toFixed(2)):value;

  }
  else{
    return value;

  }
}

const formatDate = (dateStr, ind = false,month=false) => {
  if (!dateStr) return ""

  if (ind) {
    const date = dateStr.split("-")
    const dd = date[2]
    const mm = date[1]
    const yyyy = date[0]
    return `${dd}/${mm}/${yyyy}`
  }
   if (month){
                      // Full year
    const date = new Date(dateStr);  // Current date


    // Convert month from "08" to "Aug" or any other short form
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  }
  else {
    const date = new Date(dateStr);  // Current date
    const dd = String(date.getDate()).padStart(2, '0');       // Day with leading zero
    const mm = String(date.getMonth() + 1).padStart(2, '0');  // Month with leading zero (getMonth() returns 0-11)
    const yyyy = date.getFullYear();                          // Full year

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    return formattedDate
  }

}
const getStatusColor = (status) => {

  switch (status) {
    case 1:
      return "bg-primaryYellow text-secondaryYellow";
    case 2:
      return "bg-primaryRed text-secondaryRed";
    case 3:
      return "bg-primaryGreen text-secondaryGreen";
    case 4:
      return "bg-primaryYellow text-secondaryYellow";
    default:
      // Handle other cases if needed
      return 'bg-primaryYellow text-secondaryYellow'; // or 'N/A'
  }
}
function getDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get difference in time (milliseconds)
  const diffTime = end - start;

  // Convert time difference to days and include both start and end dates
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays;
}
export function toLocalISOString(date) {
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().slice(0, 19); // removes 'Z' and ms
}

export { postApiData, getApiCall, setAuthorizationToken ,formatDateToFull,formatValue,formatDateMonth,formatDateWOYear,formatDate,getStatusColor,getDaysBetween};
