
import { postApiData } from "../../utils/services"
import { END_POINTS } from "../../utils/endpoints"

export const loginUser=(useDetails)=>{
        return(dispatch,getState)=>{
            postApiData(END_POINTS.LOG_IN,useDetails,(resp)=>{
                
                dispatch({type:'USER_DETAILS',payload:resp})

            },(error)=>{
                
            })
        }
}

export const serviceAdded=(data)=>{
    
    return(dispatch,getState)=>{
        dispatch({type:'SERVICE_DATA_ADDED',payload:data})
        
    }
}
export const UpdateServiceAdded=(data)=>{
    return(dispatch)=>{
        dispatch({type:'UPDATE_SERVICE',payload:data})
    }
}

export const deletItems=(id)=>{
    return(dispatch,getState)=>{
        dispatch({type:'DELETE_ITEM',payload:id})
    }
}
export const deletEditItems=(id)=>{
    return(dispatch,getState)=>{
        dispatch({type:'DELETE_EDIT_ITEM',payload:id})
    }
}
export const productAdded=(item)=>{
    // 
    return(dispatch,getState)=>{
        dispatch({type:'PRODUCT_DATA_ADDED',payload:item})
    }

}
export const EditproductAdded=(item)=>{
    
    return(dispatch,getState)=>{
        dispatch({type:'EDIT_PRODUCT_DATA_ADDED',payload:item})
    }

}
export const deleteProducts=(id)=>{
    
    return(dispatch,getState)=>{
        dispatch({type:'DELETE_ITEM _PRODUCT',payload:id})
    }
}
export const parlordetail=(prolorDetails)=>{
    
    return(dispatch,getState)=>{
        dispatch({type:'PARLOR_DETAILS',payload:prolorDetails})
    }
}
 
 export const userDetails = (userDetailsData) => {
    
    return (dispatch) => {
      dispatch({ type: "SET_USERDETAILS", payload: userDetailsData });
    };
  };
  export const removeAppointmentProductsData=()=>{
    return(dispatch)=>{
        dispatch({type:'REMOVE_PRODUT_APPOINT',payload:{}})
    }
  }
export const newUpdateService=(newservice)=>{
    
    return(dispatch)=>{
        dispatch({type:'Update_ServicesAmount',payload:newservice})
    }
}