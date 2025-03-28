import { Navigate } from 'react-router';
import Layout from '../Layout';

const PrivateRoute = (props) => {
    let {Component} = props;
    const token = localStorage.getItem('token');

    return !token ?  <Navigate to={"/login"} /> : <Layout><Component/></Layout>;
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