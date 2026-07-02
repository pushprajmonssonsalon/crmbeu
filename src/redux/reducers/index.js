import { getApiCall } from "../../utils/services";

const serviceInitialState = {
  serviceData: [],
};

// src/redux/actions/parlorActions.js

// Action types
export const FETCH_PARLOR_REQUEST = "FETCH_PARLOR_REQUEST";
export const FETCH_PARLOR_SUCCESS = "FETCH_PARLOR_SUCCESS";
export const FETCH_PARLOR_FAILURE = "FETCH_PARLOR_FAILURE";

// Thunk Action
const parlorInititalState={
  parlorLoading: false,
  parlorError: null,
  parlorData:[]
}
export const fetchParlors = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_PARLOR_REQUEST });

    getApiCall(
      "/parlor/getParlorDetail",
      (resp) => {
        dispatch({
          type: FETCH_PARLOR_SUCCESS,
          payload: resp,
        });
      },
      (error) => {
        dispatch({
          type: FETCH_PARLOR_FAILURE,
          payload: error,
        });
      }
    );
  };
};


export const parlorReducer = (state = parlorInititalState, action) => {
  switch (action.type) {
    case FETCH_PARLOR_REQUEST:
      return { ...state, parlorLoading: true, parlorError: null };

    case FETCH_PARLOR_SUCCESS:
      return { ...state, parlorLoading: false, parlorData: action.payload };

    case FETCH_PARLOR_FAILURE:
      return { ...state, parlorLoading: false, parlorError: action.payload };

    default:
      return state;
  }
};

export const serviceAddReducer = (state = serviceInitialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SERVICE_DATA_ADDED":
      return {
        ...state,
        serviceData: [...state.serviceData, payload],
      };
    case "Update_ServicesAmount":
      return{
        ...state,serviceData:payload,
      }
    case "DELETE_ITEM":
      const updatedItems = state.serviceData.filter(
        (item, index) => index !== action.payload
      );
        return {
        ...state,
        serviceData: updatedItems,
      };
      case "REMOVE_PRODUT_APPOINT":
      return {
        ...state,
        serviceData: [],
        ProductData: [],
        
      };
    default:
      return state;
  }
};


const productDataIntialState = {
  ProductData: [],
};

export const ProductAddReducer = (state = productDataIntialState, action) => {
  const { type, payload } = action;

  switch (type) {

      case 'PRODUCT_DATA_ADDED':
        const index = state.ProductData.findIndex((item) => item.itemId === payload.itemId);

        if(index!==-1){
          
          const updatedprod= state.ProductData.map((item)=>(item.itemId===payload.itemId?payload:item))
          return {
            ...state,
            ProductData: updatedprod,
          };
        }
        else {
          return {
            ...state,
            ProductData: [...state.ProductData, payload],
          };
        }
      case 'UPDATE_PRODUCT':
      
          return {
            ...state,
            ProductData: payload,
          };
        
       
       
        case "DELETE_ITEM _PRODUCT":
          const updatedItems = state.ProductData.filter(
            (item, index) => index !== action.payload
          );
          return {
            ...state,
            ProductData: updatedItems,
          };
          case "REMOVE_PRODUT_APPOINT":
            return {
              ...state,
              // serviceData: [],
              ProductData: [],
              
            };

    default:
      return state;
  }
};

export const SET_ROYALTY_STATUS = "SET_ROYALTY_STATUS";
export const CLEAR_ROYALTY_STATUS = "CLEAR_ROYALTY_STATUS";

const royaltyInitialState = {
  royaltyDue: false,
  royaltyOverdue: false,
};

export const setRoyaltyStatus = (payload) => ({
  type: SET_ROYALTY_STATUS,
  payload,
});

export const clearRoyaltyStatus = () => ({
  type: CLEAR_ROYALTY_STATUS,
});

export const royaltyReducer = (state = royaltyInitialState, action) => {
  switch (action.type) {
    case SET_ROYALTY_STATUS:
      return {
        ...state,
        royaltyDue: Boolean(action.payload?.royaltyDue),
        royaltyOverdue: Boolean(action.payload?.royaltyOverdue),
      };
    case CLEAR_ROYALTY_STATUS:
      return royaltyInitialState;
    default:
      return state;
  }
};

const userDataIntialState = {
  userData:'',
};
export const authReducer = (state = userDataIntialState, action) => {
  const { type, payload } = action
  
  switch (type) {
      case 'SET_USERDETAILS':
          return {
               userData: payload
          }
          case 'logoutDetails':
              return{
                  userData:''
                  // state
              }
      default: return state;
  }
}



const updateServiceIntialState = {
  EditService:[],
};
export const UpdateServices = (state = updateServiceIntialState, action) => {
  const { type, payload } = action

  switch (type) {
    case "UPDATE_SERVICE":
      
      return {
        ...state,
        EditService: [...state.EditService, payload],
      };
      case "DELETE_EDIT_ITEM":
        const updatedItems = state.EditService.filter(
          (item, index) => index !== action.payload
        );
          return {
          ...state,
          EditService: updatedItems,
        };
     
 
    default:
      return state;
  }
 
}

const UpdateproductDataIntialState = {
  EditProductData: [],
};

export const UpadateProductReducer = (state = UpdateproductDataIntialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'EDIT_PRODUCT_DATA_ADDED':
      // Check if payload is correctly structured
      
      
      return {
        ...state,
        // Append the new data to the existing array
        EditProductData: [...state.EditProductData, payload],
      };

    // Add other cases if needed

    default:
      return state;
  }
};

const SiderbarReducerIntialState = {
  open:false,
  openAccordion:false
};
export const SidebarReducer =(state=SiderbarReducerIntialState,action)=>{
  const { type, payload } = action;

  switch(type){
    case "TOGGLE_SIDEBAR":
      return{
        ...state,open:payload,
      }
      case "TOGGLE_ACCORDION":
        return{
          ...state,openAccordion:payload
        }
    default:
      return state;
  }

}


