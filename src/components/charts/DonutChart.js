import { Doughnut } from "react-chartjs-2";
import "./Chart.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({heading,data}) => {
  // Data for the Donut Chart

  // Options for the Donut Chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div  className="">
        <h2 className="text-gray-800 text-start text-2xl font-semibold mb-2">{heading}</h2>
        <div  className="donut">

      <Doughnut data={data} options={options} />

    </div>
    </div>
  );
};

export default DonutChart;
