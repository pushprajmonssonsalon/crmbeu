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

// ---- Session expiry ----
// The backend (saloncartappbackend utils/tokens.js) gives every token 7 days,
// then answers 401 on every call. Nothing here used to notice: the route
// guards only check that a token exists, so an expired session stayed "logged
// in" with every page failing to load. Two things now log it out:
//   1. the token's own expiry, checked by the route guards and a timer
//      (SessionWatcher in App.js), and
//   2. the auth middleware's 401 on an API call made with the current token
//      (handleAuthFailure), which also covers logout-everywhere / deactivated
//      accounts.

// Mirrors TOKEN_TTL_SECONDS in the backend. Tokens issued before the backend
// added `exp` expire this long after `iat`.
const TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

// Milliseconds since epoch when the stored token expires, or null if unknown.
export const getTokenExpiryMs = (token = localStorage.getItem("token")) => {
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded) return null;
  if (decoded.exp) return decoded.exp * 1000;
  if (decoded.iat) return (decoded.iat + TOKEN_TTL_SECONDS) * 1000;
  return null;
};

export const isSessionExpired = () => {
  const expiry = getTokenExpiryMs();
  return expiry !== null && Date.now() >= expiry;
};

// Clears the session and does a full reload onto /login, so no page state or
// in-flight request of the dead session survives.
export const expireSession = () => {
  clearSession();
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

const authHeaderOf = (config) => {
  const headers = config?.headers;
  if (!headers) return undefined;
  return (typeof headers.get === "function" && headers.get("Authorization")) || headers.Authorization;
};

// The backend also uses 401 for ordinary errors ("otp is not correct",
// "something went wrong", ... ~275 places), so the status alone means nothing.
// Only middlewares/auth.js answers with this message, when the session itself
// is dead (expired, logged out, revoked, account gone).
const SESSION_DEAD_MESSAGE = "User is not authorized";

// axios response error handler. Only logs out when the 401 was for the token
// currently stored, so a stale request finishing after a fresh login, or a
// failed login attempt, does not end the new session.
export const handleAuthFailure = (error) => {
  const token = localStorage.getItem("token");
  if (
    error?.response?.status === 401 &&
    error.response.data?.message === SESSION_DEAD_MESSAGE &&
    token &&
    authHeaderOf(error.config) === `Bearer ${token}`
  ) {
    expireSession();
  }
  return Promise.reject(error);
};

// axios.create() instances don't inherit interceptors from the default axios,
// so every instance has to be wrapped with this.
export const withSessionCheck = (instance) => {
  instance.interceptors.response.use((res) => res, handleAuthFailure);
  return instance;
};
