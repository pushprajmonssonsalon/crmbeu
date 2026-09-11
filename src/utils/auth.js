// Both salon and distributer sessions keep their JWT under the same "token" key
// so utils/services.js (postApiData / getApiCall) works unchanged for both.
// "userType" is the only thing that tells them apart.

export const USER_TYPE_KEY = "userType";
export const DISTRIBUTER = "distributer";
export const SALON = "salon";

export const getUserType = () => {
  return localStorage.getItem(USER_TYPE_KEY) || SALON;
};

export const isDistributer = () => getUserType() === DISTRIBUTER;

// Salon keys that must not leak into a distributer session and vice versa.
const SESSION_KEYS = [
  "token",
  USER_TYPE_KEY,
  "gstApplied",
  "salon_address",
  "distributer_name",
  "distributer_role",
];

export const clearSession = () => {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const setSalonSession = (token, gstApplied) => {
  clearSession();
  localStorage.setItem("token", token);
  localStorage.setItem(USER_TYPE_KEY, SALON);
  if (gstApplied !== undefined && gstApplied !== null) {
    localStorage.setItem("gstApplied", gstApplied);
  }
};

export const setDistributerSession = (token, role) => {
  clearSession();
  localStorage.setItem("token", token);
  localStorage.setItem(USER_TYPE_KEY, DISTRIBUTER);
  if (role) localStorage.setItem("distributer_role", role);
};

// Landing page for whichever kind of user is logged in.
export const homePathFor = (userType = getUserType()) =>
  userType === DISTRIBUTER ? "/distributer/inventory" : "/";
