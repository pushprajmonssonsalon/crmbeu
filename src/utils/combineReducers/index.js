import { combineReducers } from "redux";
import {authReducer,serviceAddReducer} from '../reducers'
import { ProductAddReducer } from "../reducers";
import { UpadateProductReducer } from "../../redux/reducers";


const rootReducer = combineReducers({
  authReducer: authReducer,
  serviceAddReducer:serviceAddReducer,
  ProductAddReducer:ProductAddReducer,
  UpadateProductReducer:UpadateProductReducer


});

export default rootReducer;
