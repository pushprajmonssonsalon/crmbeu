import { combineReducers } from "redux";
import {UpdateServices, serviceAddReducer} from '../reducers'
import { ProductAddReducer } from "../reducers";
import { authReducer } from "../reducers";


const rootReducer = combineReducers({
  authReducer: authReducer,
  serviceAddReducer:serviceAddReducer,
  ProductAddReducer:ProductAddReducer,
  UpdateServices:UpdateServices
});

export default rootReducer;
