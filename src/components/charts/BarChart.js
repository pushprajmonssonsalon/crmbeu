import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./Chart.css";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ heading, data, options }) => {

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        backgroundColor: "#ffffff", // Dark background
        boxShadow: '0px 1px 4px 0px #00000040', // Shadow effect
        // callbacks: {
        //   label: function (tooltipItem) {
        //     return `${tooltipItem.raw}`; // Custom label format
        //   },
        // },
        titleColor: "#555555", // White title text
        bodyColor: "#555555", // Yellow body text
        titleFont: {
          size: 14, // Smaller title text
        },
        bodyFont: {
          size: 14, // Smaller body text
          weight: "bold", // Bold body text
        },
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 6, // Rounded tooltip corners
        padding: 10, // Adds space inside the tooltip
        displayColors: false, // 
        mode: "index",
        intersect: false,
        position: "nearest", // Places the tooltip near the hovered bar
        yAlign: "bottom", // Aligns tooltip at the bottom of the bar
        xAlign: "center"

      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 0, // Optionally control label rotation
        },

        barThickness: 50, // Set the maximum bar width (in pixels)
      },
      y: {
        grid: { color: "rgba(200, 200, 200, 0.2)" },

      },
    },
    ...options,
  };

  return (
    <div>
      <h2 className="text-black  text-start text-xl 2xl:text-2xl leading-[28px] font-normal mb-2">{heading}</h2>

      <div className="bar" >
        <Bar data={data} options={barOptions} />
      </div>
    </div>
  );
};

export default BarChart;
