
const serviceInitialState = {
  serviceData: [],
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
        const index = state.ProductData.findIndex((item) => item._id === payload._id);

        if(index!==-1){
          
          const updatedprod= state.ProductData.map((item)=>(item._id===payload._id?payload:item))
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

const userDataIntialState = {
  userData:'',
};
export const authReducer = (state = userDataIntialState, action) => {
  const { type, payload } = action
  console.log("athflow", payload)
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
      console.log("Payload:", payload);
      
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
  open:true,
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


