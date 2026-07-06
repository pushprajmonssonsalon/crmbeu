import axios from "axios";
// import { store } from "../Redux/store/store";
import { store } from "../redux/store";
// const BASE_URL = "https://crm.smartsalon.in/";
// const BASE_URL = "https://coat-daycare-uncombed.ngrok-free.dev/";
const BASE_URL = "http://192.168.2.23:4002";
// const BASE_URL = "http://192.168.2.202:4002";
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

const deleteApiCall = (endpoint, success, failure) => {
  const token = localStorage.getItem("token");

  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      "X-Custom-Header": "foobar",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  instance
    .delete(endpoint)
    .then((res) => {
      success(res);
    })
    .catch((error) => {
      failure("error", error);
    });
};

function formatDateToFull(dateString, full = true) {
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

    if (!full) {
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
export const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  return new Date(isoDate).toISOString().split("T")[0];
};


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
const formatDateString=(dateString="DD-MM-YYYY")=>{
    const [year, month, day] = dateString.split("-");

    // Convert month from "08" to "Aug" or any other short form
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthShort = monthNames[parseInt(month, 10) - 1];

   
   return  `${parseInt(day, 10)} ${monthShort} ${year} `;
    

}
function formatValue(value) {
  if (Array.isArray(value)) {
    return value.map(elm => formatValue(elm))
  }
  else if (typeof value === "number") {
    return value > 0 ? parseFloat(value?.toFixed(2)) : value;

  }
  else {
    return value;

  }
}

const formatDate = (dateStr, ind = false, month = false) => {
  if (!dateStr) return ""

  if (ind) {
    const date = dateStr.split("-")
    const dd = date[2]
    const mm = date[1]
    const yyyy = date[0]
    return `${dd}/${mm}/${yyyy}`
  }
  if (month) {
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

const gstToken = localStorage.getItem("gstApplied");

export const isGstExclusive=(gstToken === "true");
export function calculateGst(val, inputDate,membership=false) {
  if (!val || !inputDate) return val||0;
  
  const gstToken = localStorage.getItem("gstApplied");
  const referenceDate = new Date("2025-09-22");
  referenceDate.setHours(0, 0, 0, 0);

  const userDate = new Date(inputDate);
  userDate.setHours(0, 0, 0, 0);

  // Decide GST rate based on date
  const gstRate = userDate < referenceDate ? 0.18 : 0.05;

  const gstExclusive = membership?false:gstToken === "true";
  let baseAmount, gstAmount, finalAmount;
  
  if (gstExclusive) {
    baseAmount = val;
    gstAmount = val * gstRate;
    finalAmount = baseAmount + gstAmount;
  } else {
    baseAmount = val / (1 + gstRate);
    gstAmount = val - baseAmount;
    finalAmount = val;
  }

  // Optional: format values if formatValue exists
    baseAmount = formatValue(baseAmount);
    gstAmount = formatValue(gstAmount);
    finalAmount = formatValue(finalAmount);
  

  return { baseAmount, gstAmount, finalAmount };
}
const referenceDate = new Date("2025-09-22");
referenceDate.setHours(0, 0, 0, 0);
export function calculateProductGst(val,gstRate=1.18) {
  if (!val ) return val||0;
  
  
  
  let prodBaseAmount = formatValue(val / gstRate);
  return {prodBaseAmount,
    prodGstAmount:formatValue(val-prodBaseAmount),
    prodFinalAmount:val
  
  };
}

  
export function handleProductAndServiceGst(services,products,inputDate){
   const {gstAmount,finalAmount,baseAmount}= calculateGst(services,inputDate)
    //  console.log("services",gstAmount,finalAmount,baseAmount)

const userDate = new Date(inputDate);
  userDate.setHours(0, 0, 0, 0);
  // Decide GST rate based on date
  let gstChange= userDate < referenceDate;
  let productGstTotal=0;
  let productBaseAmountTotal=0;
  let productTotal=0;
const updatedProducts = products?.map((elm)=>{
   let gstRate = 1.18; // default 18%

  if (!gstChange && elm.gst === 5) {
    gstRate = 1.05;
  }
   const amount = parseInt(elm.price) ;
  const {prodGstAmount,prodBaseAmount} = calculateProductGst(amount, gstRate);
  productGstTotal=formatValue(productGstTotal+prodGstAmount*parseInt(elm.quantity));
  productBaseAmountTotal=formatValue(productBaseAmountTotal+prodBaseAmount*parseInt(elm.quantity));
  productTotal=formatValue(productTotal+amount*parseInt(elm.quantity));
  return{
   ...elm,
   gstAmount:prodGstAmount,
   baseAmount:prodBaseAmount    
  }
})

  

   return {
    serviceGst:gstAmount,
    serviceTotal:Math.round(finalAmount),
    serviceSubTotal:baseAmount,
    updatedProducts,
    productGstTotal,
    productBaseAmountTotal,
    productTotal:Math.round(productTotal),
   }

}
export const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
};
export function getDayOfToday(){
const today = new Date();
let day = today.getDay(); // 0 (Sun) → 6 (Sat)
return day; // Convert Sunday(0) to 7


}
export function isTodayMatch(inputDate){
  if(!inputDate)return false;
  const today = new Date();
  const date = new Date(inputDate);
  if(!date)return false;
  return (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth()
  );
};
export function getBirthDayAndAnniversary(dob,anniversary){

  return {hasBirthday:isTodayMatch(dob),hasAnniversary:isTodayMatch(anniversary)
          
  }

}

// Example:
// const birthday = "1999-12-05";   // any year
// console.log(isTodayMatch(birthday));   // true if today is 5 Dec


export { postApiData, getApiCall, deleteApiCall, setAuthorizationToken, formatDateToFull,formatDateString, formatValue, formatDateMonth, formatDateWOYear, formatDate, getStatusColor, getDaysBetween };
