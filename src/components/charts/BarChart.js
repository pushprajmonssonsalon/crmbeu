import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./Chart.css";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({heading,data}) => {
 

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: "rgba(200, 200, 200, 0.2)" },
        
      },
    },
  };

  return (
    <div>
        <h2 className="text-gray-800 text-start text-2xl font-semibold mb-2">{heading}</h2>

    <div className="bar" >
      <Bar data={data} options={options} />
    </div>
    </div>
  );
};

export default BarChart;
