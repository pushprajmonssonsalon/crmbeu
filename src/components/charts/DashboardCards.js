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

const DashboardCard = ({ heading ,value ,icon,className}) => {
  
  return (
    <>
     
      <div  className={`border ${className} font-roboto bg-cover aspect-182/84  shadow-card bg-white rounded-[5px] px-[15px] py-[15px] flex flex-col gap-1`}>
      <h3 className="text-[18px]  text-start font-roboto font-bold 2xl:text-md text-white">{heading}</h3>
      <div className="flex items-center ">
        {/* Revenue Value */}
      {icon&&  <span>{React.cloneElement(icon)}</span>}
        <span className="text-xl  font-bold text-white "> {value} </span>
        {/* Percentage Increase with Icon */}
      

      </div>
    </div>
    </>
  );
};

export default DashboardCard;
