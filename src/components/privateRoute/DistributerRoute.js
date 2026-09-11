import { Navigate } from "react-router-dom";
import Layout from "../Layout";
import { isDistributer } from "../../utils/auth";

// Mirrors PrivateRoute, minus the royalty gate — distributers have no royalty.
const DistributerRoute = ({ Component }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to={"/login"} />;
  // A salon token must not reach the distributer pages.
  if (!isDistributer()) return <Navigate to={"/"} />;

  return (
    <Layout>
      <Component />
    </Layout>
  );
};

export default DistributerRoute;
