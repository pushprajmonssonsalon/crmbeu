import { Doughnut } from "react-chartjs-2";

import "./Chart.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend); // Register plugins

const DonutChart = ({heading,data}) => {
  // Data for the Donut Chart

  // Options for the Donut Chart
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows custom height & width
    aspectRatio: 1, // Adjusts width to height ratio (1 = square)
    plugins: {
      legend: {
        position: "top", // Moves the legend to the right
        align: "center", // Aligns it properly
        labels: {
          boxWidth: 15, // Smaller colored boxes
          padding: 10, // Space between items
          usePointStyle: true, // Makes the legend dots circular
        },      },
    
      tooltip: {
        backgroundColor: "#ffffff",
        boxShadow: "0px 1px 4px 0px #00000040",
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw}`;
          },
        },
        titleColor: "#555555",
        bodyColor: "#555555",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 14,
          weight: "bold",
        },
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        displayColors: false,
        mode: "index",
        intersect: false,
        position: "nearest",
        yAlign: "bottom",
        xAlign: "center",
      },
    },
   
    elements: {
      arc: {
        spacing: 1,
        borderWidth: 5, // Space between slices
        radius: 100, // Adjusts pie chart size
      },
    },
    cutout: "0%", // Adjusts the inner radius (0 = full pie, 50% = donut)
  };
  

  return (
    <div  className="">
        <h2 className="text-black  text-start text-xl 2xl:text-2xl leading-[28px] font-normal mb-2">{heading}</h2>
        <div  className="donut">

      <Doughnut data={data} options={options} />

    </div>
    </div>
  );
};

export default DonutChart;
