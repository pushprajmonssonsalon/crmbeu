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
     
      <div className="border shadow-card bg-white rounded-[10px] px-[37px] py-[15px] flex flex-col gap-4">
      <h3 className="text-sm text-center font-roboto font-bold 2xl:text-md text-heading">{heading}</h3>
      <div className="flex items-center justify-center">
        {/* Revenue Value */}
      {icon&&  <span>{React.cloneElement(icon)}</span>}
        <span className="text-xl font-bold text-customPurple "> {value} </span>
        {/* Percentage Increase with Icon */}
        <div className="flex items-center justify-center ">

        </div>

      </div>
    </div>
    </>
  );
};

export default DashboardCard;
