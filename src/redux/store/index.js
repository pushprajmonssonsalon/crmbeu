import rootReducer from "../combineReducers";
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { thunk as thunkMiddleware } from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { createLogger } from "redux-logger";

const persistConfig = {
  key: "root",
  storage,
};
const loggerMiddleware = createLogger();
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(
  persistedReducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);
const persistor = persistStore(store);
export { store, persistor };
