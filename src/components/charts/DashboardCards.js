import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardCard = ({ title, value, percentage, color, data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    tooltip: {
      enabled: true,
    },
  };

  return (
    <div
      style={{
        background: "#f9f9f9",
        padding: "16px",
        borderRadius: "8px",
        width: "200px",
        textAlign: "center",
      }}
    >
      <h4 style={{ margin: "0", fontSize: "16px", color: "#555" }}>{title}</h4>
      <h2 style={{ margin: "8px 0", fontSize: "24px", color }}>{value}</h2>
      <p style={{ margin: "0", color: percentage > 0 ? "green" : "red" }}>
        {percentage > 0 ? `+${percentage}%` : `${percentage}%`}
      </p>
      <Bar options={options} data={data} />
    </div>
  );
};

const Cards = () => {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [50, 70, 100, 80, 90, 120],
        backgroundColor: "#4CAF50",
      },
    ],
  };

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <DashboardCard
        title="Avg. Impressions"
        value="3,846"
        percentage={28.36}
        color="#3b82f6"
        data={chartData}
      />
      <DashboardCard
        title="Avg. Engagement Rate"
        value="86.5%"
        percentage={-13.3}
        color="#ef4444"
        data={chartData}
      />
      <DashboardCard
        title="Avg. Reach"
        value="12,874"
        percentage={13.3}
        color="#22c55e"
        data={chartData}
      />
      <DashboardCard
        title="Site Visitors"
        value="7,354"
        percentage={10.38}
        color="#8b5cf6"
        data={chartData}
      />
      <DashboardCard
        title="Page Views"
        value="24,354"
        percentage={2.38}
        color="#f59e0b"
        data={chartData}
      />
    </div>
  );
};

export default Cards;
