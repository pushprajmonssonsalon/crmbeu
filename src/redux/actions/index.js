
import { postApiData } from "../../utils/services"
import { END_POINTS } from "../../utils/endpoints"

export const loginUser=(useDetails)=>{
        return(dispatch,getState)=>{
            postApiData(END_POINTS.LOG_IN,useDetails,(resp)=>{
                console.log("responseLogin",resp)
                dispatch({type:'USER_DETAILS',payload:resp})

            },(error)=>{
                console.log("error",error)

            })

        }
}

export const serviceAdded=(data)=>{
    console.log("disptachdata",data)
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
    // console.log("itemdata",item)
    return(dispatch,getState)=>{
        dispatch({type:'PRODUCT_DATA_ADDED',payload:item})
    }

}
export const EditproductAdded=(item)=>{
    console.log("itemdata",item)
    return(dispatch,getState)=>{
        dispatch({type:'EDIT_PRODUCT_DATA_ADDED',payload:item})
    }

}
export const deleteProducts=(id)=>{
    console.log("productID",id)
    return(dispatch,getState)=>{
        dispatch({type:'DELETE_ITEM _PRODUCT',payload:id})
    }
}
export const parlordetail=(prolorDetails)=>{
    console.log("prolorDetails",prolorDetails)
    return(dispatch,getState)=>{
        dispatch({type:'PARLOR_DETAILS',payload:prolorDetails})
    }
}
 
 export const userDetails = (userDetailsData) => {
    console.log("userDetailsData",userDetailsData)
    return (dispatch) => {
      dispatch({ type: "SET_USERDETAILS", payload: userDetailsData });
    };
  };
  export const removeAppointmentProductsData=()=>{
    return(dispatch)=>{
        dispatch({type:'REMOVE_PRODUT_APPOINT',payload:{}})
    }
  }