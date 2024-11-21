import { useEffect, useMemo, useState } from "react";
import BarChart from "../../components/charts/BarChart";
import DonutChart from "../../components/charts/DonutChart";
import Layout from "../../components/Layout";
import { postApiData } from "../../utils/services";
import DashboardCard from "../../components/charts/DashboardCards";
import { MdCurrencyRupee } from "react-icons/md";
import { FaUser } from "react-icons/fa";

const Dashboard = () => {
  const [salonDetails, setSalonDetails] = useState({
    sales: [0, 0, 0, 0],
    appointments: [0, 0],
    serviceLabels: ["0", "Beauty", "Hand & Feet"],
    services: [0, 0, 0, 0],
    productLabels: ["Keratin", "Loreal"],
    products: [0, 0],
    employeeLabels: ["A", "B"],
    employeeNames: ["A", "B"],
    employees: {
      labels: ["A", "B", "C", "D"],
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
    },
  });
  const data = {
    labels: [`Cash : ₹${salonDetails?.sales[0]}`, `Card : ₹${salonDetails?.sales[1]}`, `App : ₹${salonDetails?.sales[2]}`, `Upi : ₹${salonDetails?.sales[3]}`, `Membership Points : ₹${salonDetails?.sales[4]}`],
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
        label: "sales in Rs",
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
        label: "sales in Rs",
        data: salonDetails?.products, // Impression data for services
        backgroundColor: "rgba(0, 128, 128, 1)", // Blue bars
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };
 
  // Predefined colors
  const predefinedColors = {
    Nail: "rgba(255, 99, 132, 1)",
    "Hair Care": "rgba(54, 162, 235, 1)",
    Makeup: "rgba(255, 206, 86, 1)",
    Spa: "rgba(75, 192, 192, 1)",
    Hair: "rgba(153, 102, 255, 1)",
    "Hand & Feet": "rgba(255, 159, 64, 1)",
    Package: "rgba(101, 143, 255, 1)",
    Beauty: "rgba(102, 205, 170, 1)",
  };

  // Generate a random RGBA color
  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const alpha = 1; // Fully opaque
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Get color for a category, falling back to random if not predefined
  function getColorForCategory(category) {
    return predefinedColors[category] || getRandomColor();
  }

  const totalRevenue =useMemo(()=>{

    return salonDetails?.sales.reduce((curr,acc)=>curr+acc,0)
  },[salonDetails.sales])
 
  const serviceRevenue =useMemo(()=>{

    return salonDetails?.services.reduce((curr,acc)=>curr+acc,0)
  },[salonDetails.services])
  const productRevenue =useMemo(()=>{

    return salonDetails?.products.reduce((curr,acc)=>curr+acc,0)
  },[salonDetails.products])
 
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
          staffCategoryWiseRevenue,
        } = res;
        const payments = appointmentPaymentMethodReport;

        const salesOrder = ["Cash", "Card", "Online", "Upi"];
        const appoOrder = [3, 1];
        const services = [];
        const products = [];
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
        // Step 1: Get unique categories
        const uniqueCategories = [
          ...new Set(
            staffCategoryWiseRevenue.flatMap((emp) =>
              emp.categories.map((cat) => cat.category)
            )
          ),
        ];

        // Step 2: Extract employee names
        const employeeNames = staffCategoryWiseRevenue.map((emp) => emp.name);

        // Step 3: Create datasets
        const datasets = uniqueCategories.map((category) => {
          const data = employeeNames.map((employee) => {
            const empData = staffCategoryWiseRevenue.find(
              (emp) => emp.name === employee
            );
            const categoryData = empData.categories.find(
              (cat) => cat.category === category
            );
            return categoryData ? categoryData.sumTotal : 0;
          });

          // Add styling for the dataset
          return {
            label: category,
            data: data,
            backgroundColor: getColorForCategory(category), // Assign unique colors dynamically
            borderRadius: 4,
            borderSkipped: false,
          };
        });
        // Step 4: Combine into empData
        const employees = {
          labels: employeeNames,
          datasets: datasets,
        };
        setSalonDetails({
          sales: [...orderedTotals, subsTotal],
          appointments: [...appoData],
          serviceLabels: [...serviceOrder],
          services: [...services],
          productLabels: [...productLabels],
          products: [...products],
          employees,
        });
      },
      () => {}
    );
  }, []);
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [50, 70, 100, 80, 90, 120],
        backgroundColor: "#4CAF50",
      },
    ],
  }
  const compAppointment =salonDetails?.appointments[0];

  return (
    <>
      <Layout>
        <div className="mt-32 md:mt-40 mb-16  w-[90%] mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 2xl:grid-cols-4 gap-5 mb-6">
      
        <div className="w-full">
        <DashboardCard heading="Total Revenue" value={totalRevenue} icon={<MdCurrencyRupee className="text-green-700 text-[2rem]"/>}/>

        </div>
        <div className="w-full">
        <DashboardCard heading="Appointments" value={compAppointment} icon={<FaUser className="text-blue-400 text-[2rem]"/>} />

        </div>
        <div className="w-full">
        <DashboardCard heading="Services Revenue" value={serviceRevenue} icon={<MdCurrencyRupee className="text-yellow-500 text-[2rem]"/>} />

        </div>
        <div className="w-full">
        <DashboardCard heading="Products Revenue" value={productRevenue} icon={<MdCurrencyRupee className="text-orange-600 text-[2rem]"/>} />

        </div>

        </div>
       
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 lg:gap-9 mb-9 ">
            <div className=" h-full  border shadow-xl bg-white rounded-[25px] p-5">
              <DonutChart heading={"Total Sales"} data={data} />
            </div>
            <div className=" h-full  border shadow-xl bg-white rounded-[25px] p-5">
              <DonutChart heading={"Appointments"} data={appointments} />
            </div>
            <div className="col-span-1 lg:col-span-1 h-full  border shadow-xl bg-white rounded-[25px] p-5">
              <BarChart data={serviceData} heading={"Service Distribution"} />
            </div>
            <div className="col-span-1 lg:col-span-1 h-full  border shadow-xl bg-white rounded-[25px] p-5">
              <BarChart data={prodData} heading={"Product Distribution"} />
            </div>
        
            <div className="col-span-full h-full  border shadow-xl bg-white rounded-[25px] p-5">
              <BarChart
                data={salonDetails?.employees}
                heading={"Employee Distribution"}
              />
            </div>
        
          </div>
           
          </div>
      
      </Layout>
    </>
  );
};

export default Dashboard;
