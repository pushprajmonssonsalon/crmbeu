import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardCard = ({ heading ,value ,icon}) => {
  
  return (
    <>
     
      <div className="border shadow-lg bg-white rounded-xl p-6 flex flex-col gap-4">
      <h3 className="text-2xl font-semibold text-gray-700">{heading}</h3>
      <div className="flex items-center justify-between">
        {/* Revenue Value */}
        <span className="text-3xl font-bold text-blue-600"> {value} </span>
        {/* Percentage Increase with Icon */}
        <div className="flex items-center justify-center ">
        {React.cloneElement(icon)}

        </div>

      </div>
    </div>
    </>
  );
};

export default DashboardCard;
