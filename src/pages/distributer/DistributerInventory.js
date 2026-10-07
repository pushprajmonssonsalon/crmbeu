import { useState } from "react";
import Tabs from "../../components/tabs/Tabs";
import DistributerProducts from "./DistributerProducts";
import DistributerOrders from "./DistributerOrders";

// Same shape as components/inventory/Inventory.js. There is no distributer
// equivalent of the salon Inventory Report endpoint, so that tab is omitted.
const DistributerInventory = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (id) => setActiveTab(id);

  const tabs = [
    {
      name: "All Products",
      component: <DistributerProducts tab={activeTab} />,
    },
    {
      name: "My Products",
      component: <DistributerProducts tab={activeTab} />,
    },
    {
      name: "Purchase Orders",
      component: <DistributerOrders />,
    },
  ];

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} handleTabChange={handleTabChange} />
    </div>
  );
};

export default DistributerInventory;
