import { combineReducers } from "redux";
import { SidebarReducer, UpdateServices, parlorReducer, serviceAddReducer } from '../reducers';
import { ProductAddReducer } from "../reducers";
import { authReducer } from "../reducers";


const rootReducer = combineReducers({
  authReducer: authReducer,
  parlorReducer:parlorReducer,
  serviceAddReducer:serviceAddReducer,
  ProductAddReducer:ProductAddReducer,
  UpdateServices:UpdateServices,
  SidebarReducer,
});

export default rootReducer;
