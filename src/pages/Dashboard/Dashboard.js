import { useEffect, useMemo, useState } from "react";
import BarChart from "../../components/charts/BarChart";
import DonutChart from "../../components/charts/DonutChart";
import Layout from "../../components/Layout";
import { formatDate, formatValue, getApiCall, postApiData } from "../../utils/services";
import DashboardCard from "../../components/charts/DashboardCards";
import { MdCurrencyRupee } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";

import EventModal from "../../components/modals/EventModal";
import CustomDatePicker from "../../components/customInput/CustomDatePicker";
import { useSearchParams } from "react-router-dom";
const backgroundColors = [
  "rgba(255, 99, 132, 0.8)",  // Red
  "rgba(54, 162, 235, 0.8)",  // Blue
  "rgba(255, 206, 86, 0.8)",  // Yellow
  "rgba(75, 192, 192, 0.8)",  // Teal

];


const wishesLabels = [
  {
    name: "Birthday This Week",
    id: "birthdayThisWeekTotal",
    val: "birthdayThisWeek",
    type: "dob"

  },
  {
    name: "Birthday This Month",
    id: "birthdayThisMonthTotal",
    val: "birthdayThisMonth",
    type: "dob"

  },
  {
    name: 'Anniversary This Week',
    id: "aniversaryThisWeekTotal",
    val: "aniversaryThisWeek",
    type: "aniversary",


  },
  {
    name: 'Anniversary This Month',
    id: "aniversaryThisMonthTotal",
    val: "aniversaryThisMonth",
    type: "aniversary",

  },
]
const salesOrder = ["Cash", "Card", "Online", "Upi", "Pending"];

const Dashboard = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const stDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01T00:00:00.000Z`;
  const [loading,setLoading]=useState(false);
  const customDate = formatDate(new Date());
  const [searchParams] = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end")
  const [startDate, setStartDate] = useState(start ? start : formatDate(stDate));
  const [endDate, setEndDate] = useState(end ? end : customDate);
  const [showDate, setShowDate] = useState(false)
  const [events, setEvents] = useState([]);
  const [wishes, setWishes] = useState({

    labels: wishesLabels?.map((item) => item.name),
    datasets: [
      {
        label: 'Count of Events',
        data: [11, 12, 3, 2],
        backgroundColor: 'rgba(75,192,192,0.4)', // Light color for the bars
        borderColor: 'rgba(75,192,192,1)',       // Darker color for the borders
        borderWidth: 1
      }
    ]

  })
  const [selectedEvent, setSelectedEvent] = useState(null);
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
          data: [0, 0, 0, 0],
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

    membership: 0
  });

  const salesData = {
    labels: salesOrder,
    datasets: [
      {
        label: "Sales",
        data: salonDetails?.sales.map(value => formatValue(value || 0)),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",  // Red
          "rgba(54, 162, 235, 0.8)",  // Blue
          "rgba(255, 206, 86, 0.8)",  // Yellow
          "rgba(75, 192, 192, 0.8)",  // Teal
          "rgba(153, 102, 255, 0.8)", // Purple
          "rgba(255, 140, 0, 1)",     // Darker orange
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(34, 139, 34, 0.8)",   // Darker green
          "rgba(153, 102, 255, 1)",
        ],
        barThickness: 20,
        borderWidth: 2,
        borderRadius: { topLeft: 100, topRight: 100, bottomLeft: 0, bottomRight: 0 }, // Top corners rounded only
        borderSkipped: false,
      },
    ],
  };
  const appointments = {
    labels: [
      `Completed`,
      `Cancelled`,
      `Half Completed`,
    ],
    datasets: [
      {
        label: "Total",
        data: salonDetails?.appointments,
        backgroundColor: [
          "rgba(34, 139, 34, 0.8)", // Darker green
          "rgba(255, 140, 0, 0.8)", // Darker orange
          'rgba(54, 162, 235, 0.8)', // Blue
        ],
        borderColor: [
          "rgba(34, 139, 34, 1)", // Darker green
          "rgba(255, 140, 0, 1)", // Darker orange
          'rgba(75, 192, 192, 1)',
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
        data: formatValue(salonDetails?.services), // Impression data for services
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",  // Red
          "rgba(54, 162, 235, 0.8)",  // Blue
          "rgba(255, 206, 86, 0.8)",  // Yellow
          "rgba(75, 192, 192, 0.8)",  // Teal
          "rgba(153, 102, 255, 0.8)", // Purple
          "rgba(255, 140, 0, 1)",     // Darker orange
          "rgba(34, 139, 34, 0.8)", // Darker green
          'rgba(54, 162, 235, 0.8)', // Blue
        ], // Blue bars
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(34, 139, 34, 0.8)",   // Darker green
          "rgba(153, 102, 255, 1)",
          "rgba(34, 139, 34, 1)", // Darker green
          'rgba(75, 192, 192, 1)',
        ],
        barThickness: 30,
        borderWidth: 2,
        borderRadius: { topLeft: 0, topRight: 2, bottomLeft: 0, bottomRight: 2 }, // Top corners rounded only
        borderSkipped: false,
      },

    ],

  };
  const prodData = {
    labels: salonDetails?.productLabels, // salonDetails on the x-axis
    datasets: [
      {
        label: "sales in Rs",
        data: formatValue(salonDetails?.products), // Impression data for services
        // backgroundColor: "rgba(0, 128, 128, 1)", // Blue bars
        borderRadius: 4,
        barThickness: 30,
        borderWidth: 2,
        borderRadius: { topLeft: 0, topRight: 100, bottomLeft: 0, bottomRight: 100 }, // Top corners rounded only
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

  const totalRevenue = useMemo(() => {

    return formatValue(salonDetails?.sales.slice(0, -1).reduce((curr, acc) => curr + acc, 0))
  }, [salonDetails.sales])

  const serviceRevenue = useMemo(() => {

    return formatValue(salonDetails?.services.reduce((curr, acc) => curr + acc, 0))
  }, [salonDetails.services])
  const productRevenue = useMemo(() => {

    return formatValue(salonDetails?.products.reduce((curr, acc) => curr + acc, 0))
  }, [salonDetails.products])

  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const key = wishesLabels[index].val;
      const label = wishesLabels[index].name;
      const type = wishesLabels[index].type;

      setSelectedEvent({
        type,
        key: label,
        value: events[key]
      })
      setShowEventModal(true);
    }
  }
  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === "startDate") {
      setStartDate(value)
    } else {
      setEndDate(value)
    }

  }
  const options = {

    onClick: (event, elements) => handleBarClick(event, elements), // Attach click event
    indexAxis: 'y'
  };
  const fetchData = (start, end) => {

    const data = {
      startDate: start ? start : startDate, // First day of the current month at 00:00:00
      endDate: end ? end : endDate, // Current date and time
    };
   setLoading(true)
    postApiData(
      "reports/salonDailyReport",
      data,
      (res) => {
        const {
          paymentMethodReport,
          membershipCreditUsed,
          appointmentStatus,
          serviceCategoryWiseRevenue,
          productRevenueDistribution,
          staffCategoryWiseRevenue,
          membershipSale
        } = res;
        const payments = paymentMethodReport;

        const appoOrder = [3, 1, 4];
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
            return categoryData ? formatValue(categoryData.sumTotal) : 0;
          });
          // Add styling for the dataset
          let color = getColorForCategory(category);
          return {
            label: category,
            data: data,
            backgroundColor: color,
            borderColor: color, // Assign unique colors dynamically
            borderRadius: 4,
            borderSkipped: true,
            barThickness: 20,
            borderWidth: 2,
          };
        });
        // Step 4: Combine into empData
        const employees = {
          labels: employeeNames,
          datasets: datasets,
        };
        const membershipRev = membershipSale?.length > 0 ? membershipSale[0]?.membershipRevenue : 0;


        setSalonDetails({
          sales: [...orderedTotals, subsTotal],
          appointments: [...appoData],
          serviceLabels: [...serviceOrder],
          services: [...services],
          productLabels: [...productLabels],
          products: [...products],
          employees,
          membership: membershipRev
        });
        setLoading(false)
      },
      
      () => { 
        setLoading(false)

      }
    );
    getApiCall("reports/getBirthdaysAndAniversaries",
      (res) => {

        const data = wishesLabels.map((item) => res[item.id] ?? 0);
        setEvents(res);

        setWishes({
          labels: wishesLabels?.map((item) => item.name),
          datasets: [
            {
              label: 'Count of Events',
              data: data,
              backgroundColor: backgroundColors,  // Assigning different colors
              borderColor: backgroundColors,
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false,
              barThickness: 40,


            }
          ],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements) => handleBarClick(event, elements), // Attach click event
            scales: {
              x: {
                barPercentage: 0.5,
                categoryPercentage: 0.5,
              },
              y: {
                beginAtZero: true
              }
            }
          }
        })






      }, () => { })
  }
  useEffect(() => {
    fetchData()
  }, []);
  const compAppointment = salonDetails?.appointments[0];
  const dashboardData = [
    {
      heading: "Total Revenue",
      value: totalRevenue,
      icon: <MdCurrencyRupee className="text-customPurple text-md 2xl:text-lg" />,
    },
    {
      heading: "Appointments",
      value: compAppointment,
    },
    {
      heading: "Services Revenue",
      value: serviceRevenue,
      icon: <MdCurrencyRupee className="text-customPurple text-md 2xl:text-lg" />,
    },
    {
      heading: "Products Revenue",
      value: productRevenue,
      icon: <MdCurrencyRupee className="text-customPurple text-md 2xl:text-lg" />,
    },
    {
      heading: "Membership Revenue",
      value: salonDetails?.membership,
      icon: <MdCurrencyRupee className="text-customPurple text-md 2xl:text-lg" />,
    },
  ];
  const empOptions = {
    scales: {
      x: {
        stacked: false,

      },
      y: {
        stacked: false,

        beginAtZero: true,
      },
    },
  }
 
  return (
    <>
        <div className="">
          <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300`}>
            <div className="flex items-center  gap-6">
              <button onClick={() => setShowDate(!showDate)} className="flex border  shadow items-center bg-white gap-2 rounded-[5px] py-[10px] px-[15px]">
                <FaCalendarAlt className="text-customPurple text-sm" />
                <span className="text-secondary text-sm">Year-to-date </span>
                <FaAngleDown className={`text-secondary text-sm ${showDate ? "rotate-180" : ""} `} />

              </button>
              <div className="flex gap-2 font-normal  items-center text-xs text-secondary">
                <span>{formatDate(startDate, true)}</span>
                <span>~</span>
                <span>{formatDate(endDate, true)}</span>
              </div>
            </div>
            {showDate && <div className=" flex items-center my-4  gap-3">
              <CustomDatePicker
                startDate={startDate}
                endDate={endDate}
                loading={loading}
                className="bg-white gap-2 rounded-[5px] py-[10px] px-[15px] "
                onSubmit={fetchData}
                onChange={handleDateChange}


              />
            </div>}

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 2xl:grid-cols-5 gap-5 mb-6">

            {dashboardData.map((item, index) => (
              <div key={index} className="w-full">
                <DashboardCard heading={item.heading} value={item.value} icon={item.icon} />
              </div>
            ))}

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-5 lg:gap-9 mb-9 ">
            <div className=" h-full  border shadow-graph bg-white rounded-[16px] p-5">
              <BarChart data={salesData} heading={"Total Sales"} />

            </div>
            <div className=" h-full  border shadow-graph bg-white rounded-[16px] p-5">
              <DonutChart heading={"Appointments"} data={appointments} />
            </div>
            <div className="col-span-1 lg:col-span-1 h-full  border shadow-graph bg-white rounded-[16px] p-5">
              <BarChart data={serviceData} heading={"Service Distribution"} options={{ indexAxis: 'y' }} />
            </div>
            <div className="col-span-1 lg:col-span-1 h-full  border shadow-graph bg-white rounded-[16px] p-5">
              <BarChart data={prodData} heading={"Product Distribution"} options={{ indexAxis: 'y' }} />
            </div>

            <div className="col-span-full h-full  border shadow-graph bg-white rounded-[16px] p-5">
              <BarChart
                data={salonDetails?.employees}
                options={empOptions}
                heading={"Employee Distribution"}
              />
            </div>
            <div className="col-span-full h-full  border shadow-graph bg-white rounded-[16px] p-5">
              <BarChart
                options={options}
                data={wishes}
                heading={"Birthdays & Anniversarys"}
              />
            </div>

          </div>

        </div>

        <EventModal
          show={showEventModal}
          setShow={setShowEventModal}
          data={selectedEvent}


        />

     
    </>
  );
};

export default Dashboard;
