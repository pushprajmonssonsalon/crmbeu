import { useEffect, useState } from "react";
import BarChart from "../../components/charts/BarChart";
import DonutChart from "../../components/charts/DonutChart";
import Layout from "../../components/Layout";
import { postApiData } from "../../utils/services";

const Dashboard = () => {
  const [salonDetails, setSalonDetails] = useState({
    sales: [0, 0, 0, 0],
    appointments: [0, 0],
    serviceLabels: ["Hair", "Beauty", "Hand & Feet"],
    services: [0, 0, 0, 0],
    productLabels:["Keratin", "Loreal"],
    products:[0,0],
    employeeLabels:["A","B"],
    employees:[0,0],
  });
  const data = {
    labels: ["Cash", "Card", "App", "Upi", "Membership Points"],
    datasets: [
      {
        label: "sales",
        data: [...salonDetails?.sales],
        backgroundColor: [
          "rgba(178, 39, 76, 0.8)", // Darker red
          "rgba(26, 98, 174, 0.8)", // Darker blue
          "rgba(204, 145, 43, 0.8)", // Darker yellow
          "rgba(54, 162, 235, 1)", // Darker yellow
          "rgba(35, 133, 133, 0.8)", // Darker teal
        ],
        borderColor: [
          "rgba(178, 39, 76, 1)", // Darker red
          "rgba(26, 98, 174, 1)", // Darker blue
          "rgba(204, 145, 43, 1)", // Darker yellow
          "rgba(54, 162, 235, 1)", // Darker yellow
          "rgba(35, 133, 133, 1)", // Darker teal
        ],
        borderWidth: 1,
      },
    ],
  };
  const appointments = {
    labels: [
      `Completed : ${salonDetails?.appointments[0]}`,
      `Cancelled : ${salonDetails?.appointments[1]}`,
    ],
    datasets: [
      {
        label: "Total",
        data: salonDetails?.appointments,
        backgroundColor: [
          "rgba(34, 139, 34, 0.8)", // Darker green
          "rgba(255, 140, 0, 0.8)", // Darker orange
        ],
        borderColor: [
          "rgba(34, 139, 34, 1)", // Darker green
          "rgba(255, 140, 0, 1)", // Darker orange
        ],
        borderWidth: 1,
      },
    ],
  };
  const serviceData = {
    labels: salonDetails?.serviceLabels, // Services on the x-axis
    datasets: [
      {
        label: "sales",
        data: salonDetails?.services, // Impression data for services
        backgroundColor: "rgba(54, 162, 235, 0.8)", // Blue bars
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };
  const prodData = {
    labels: salonDetails?.productLabels, // salonDetails on the x-axis
    datasets: [
      {
        label: "sales",
        data: salonDetails?.products, // Impression data for services
        backgroundColor: "rgba(0, 128, 128, 1)", // Blue bars
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };
  const empData = {
    labels: ["Hellow", "Pushpraj Singh", "Neeraj", "Tushar"],
    datasets: [
      {
        label: "Hair",
        data: [18000, 18100, 9000, 10500],
        backgroundColor: "rgba(255, 99, 132, 1)",
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Spa",
        data: [0, 0, 0, 0],
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Beauty",
        data: [200, 3999, 0, 0],
        backgroundColor: "rgba(255, 206, 86, 1)",
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Nail",
        data: [0, 0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Hand & Feet",
        data: [0, 1200, 0, 0],
        backgroundColor: "rgba(153, 102, 255, 1)",
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Makeup",
        data: [0, 0, 0, 0],
        backgroundColor: "rgba(255, 159, 64, 1)",
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  useEffect(() => {
    const data = {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of the current month at 00:00:00
      endDate: new Date(), // Current date and time
    };

    postApiData(
      "reports/salonDailyReport",
      data,
      (res) => {
        const {
          appointmentPaymentMethodReport,
          membershipCreditUsed,
          appointmentStatus,
          serviceCategoryWiseRevenue,
          productRevenueDistribution,
        } = res;
        const payments = appointmentPaymentMethodReport;

        const salesOrder = ["Cash", "Card", "Online", "Upi"];
        const appoOrder = [3, 1];
        const services = [];
        const products=[];
        const subsTotal = membershipCreditUsed
          ? membershipCreditUsed[0]?.membershipCreditUsed
          : 0;

        // Map through the desiredOrder and find totals from input
        const orderedTotals = salesOrder.map((key) => {
          const found = payments.find((item) => item._id === key);
          return found ? found.total : 0; // Default to 0 if not found
        });
        const appoData = appoOrder.map((key) => {
          const found = appointmentStatus.find((item) => item._id === key);
          return found ? found.total : 0; // Default to 0 if not found
        });
        const serviceOrder = serviceCategoryWiseRevenue?.map((item) => {
          services.push(item.totalRevenue);
          return item?._id;
        });
        const productLabels = productRevenueDistribution?.map((item) => {
          products.push(item.totalRevenue);
          return item?.name;
        });

        setSalonDetails({
          sales: [...orderedTotals, subsTotal],
          appointments: [...appoData],
          serviceLabels: serviceOrder,
          services,
          productLabels,
          products
        });
      },
      () => {}
    );
  }, []);
  console.log(salonDetails, "salon");

  return (
    <>
      <Layout>
        <div className="mt-52 md:mt-40 mb-16  w-[90%] mx-auto ">
          <div className="flex gap-9 mb-9  justify-between">
            <div className="w-1/3 h-full  border shadow-xl bg-white rounded-[25px] p-5">
              <DonutChart heading={"Total Sales"} data={data} />
            </div>
            <div className="w-1/3 h-full  border shadow-xl bg-white rounded-[25px] p-5">
              <DonutChart heading={"Appointments"} data={appointments} />
            </div>
            <div className="w-1/3 h-full  border shadow-xl bg-white rounded-[25px] p-5">
              <BarChart data={serviceData} heading={"Service Distribution"} />
            </div>
          </div>
          <div className="flex gap-9">
            <div className="w-1/2 h-full  border shadow-xl bg-white rounded-[25px] p-5">
              <BarChart data={prodData} heading={"Product Distribution"} />
            </div>
            <div className="w-1/2 h-full  border shadow-xl bg-white rounded-[25px] p-5">
              <BarChart data={empData} heading={"Employee Distribution"} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
