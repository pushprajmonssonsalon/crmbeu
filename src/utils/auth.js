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

// ---- Salon roles ----
// The salon JWT carries the role of whoever logged in: the salon owner, or a
// manager the owner created in Staff Contacts. Tokens issued before the role
// was added to them have none, and only owners could log in back then, so
// those count as owner. This only decides what the CRM shows; the backend
// re-checks the role from the database on owner-only routes.
export const OWNER = "owner";
export const MANAGER = "manager";

export const getSalonRole = () => {
  const token = localStorage.getItem("token");
  if (!token || isDistributer()) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload))?.role || OWNER;
  } catch {
    return null;
  }
};

export const isSalonOwner = () => getSalonRole() === OWNER;
export const isSalonManager = () => getSalonRole() === MANAGER;
