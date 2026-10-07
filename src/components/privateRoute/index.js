import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../Layout';
import { isDistributer, homePathFor } from '../../utils/auth';

const PrivateRoute = (props) => {
  let { Component } = props;
  const token = localStorage.getItem('token');
  const { royaltyOverdue } = useSelector((state) => state.royaltyReducer || {});
  const location = useLocation();

  if (!token) {
    return <Navigate to={"/login"} />;
  }
  // Distributers only ever see their own section.
  if (isDistributer()) {
    return <Navigate to={homePathFor()} />;
  }
  // If royalty is overdue, block access to all pages except the royalties check page
  if (royaltyOverdue && location.pathname !== "/royalties-check") {
    return <Navigate to={"/royalties-check"} />;
  }

  return (
    <Layout>
      <Component />
    </Layout>
  );
};

export default PrivateRoute;

// import { Navigate } from "react-router-dom";


// const PrivateRoute = ({ children }) => {

//     // const token = useSelector((state) => state.authReducer.token);
//     const token = localStorage.getItem('token')

//     return !token ? <Navigate to={"/login"} /> : children;
// };

// export default PrivateRoute