import React from 'react';
import { Navigate, useNavigate } from 'react-router';

const PrivateRoute = (props) => {
    let {Component} = props;
    let navigate = useNavigate();
    const token = localStorage.getItem('token')
    
    // useEffect(()=>{
    //     let login = localStorage.getItem('token');
    //     if(!login) navigate('/login');
    // },[])
  // return (

    return !token ?  <Navigate to={"/login"} /> : <Component/>;
  // )
}

export default PrivateRoute

// import { Navigate } from "react-router-dom";


// const PrivateRoute = ({ children }) => {

//     // const token = useSelector((state) => state.authReducer.token);
//     const token = localStorage.getItem('token')

//     return !token ? <Navigate to={"/login"} /> : children;
// };

// export default PrivateRoute