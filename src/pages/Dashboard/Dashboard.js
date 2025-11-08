import { useEffect, useMemo, useState } from "react";
import BarChart from "../../components/charts/BarChart";
import DonutChart from "../../components/charts/DonutChart";
import { formatDate, formatValue, getApiCall, postApiData } from "../../utils/services";
import DashboardCard from "../../components/charts/DashboardCards";
import { MdCurrencyRupee } from "react-icons/md";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";

import EventModal from "../../components/modals/EventModal";
import CustomDatePicker from "../../components/customInput/CustomDatePicker";
import { useSearchParams } from "react-router-dom";
import NormalSelect from "../../components/customInput/NormalSelect";
import useDebouncer from "../../utils/hooks/useDebouncer";
import CustomTable from "../../components/Table/CustomTable";
const backgroundColors = [
  "rgba(255, 99, 132, 0.8)",  // Red
  "rgba(54, 162, 235, 0.8)",  // Blue
  "rgba(255, 206, 86, 0.8)",  // Yellow
  "rgba(75, 192, 192, 0.8)",  // Teal
  "rgba(153, 102, 255, 0.8)",  // Purple
  "rgba(255, 159, 64, 0.8)",   // Orange
  

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
  {
    name: 'Membership Expiring This Week',
    id: "membershipThisWeekTotal",
    val: "7",
    type: "membership",

  },
  {
    name: 'Membership Expiring This Month',
    id: "membershipThisMonthTotal",
    val: "30",
    type: "membership",

  },
]
const salesOrder = ["Cash", "Card", "Online", "Upi", "Pending"];

const Dashboard = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const stDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01T00:00:00.000Z`;
  const [loading, setLoading] = useState(false);
  const customDate = formatDate(new Date());
  const { debouncedFunction } = useDebouncer();
  const [searchParams] = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end")
  const [startDate, setStartDate] = useState(start ? start : formatDate(stDate));
  const [endDate, setEndDate] = useState(end ? end : customDate);
  const [showDate, setShowDate] = useState(false)
  const [days, setDays] = useState(30);
  const [events, setEvents] = useState([]);
  const [expiredMembership,setExpiredMembership]=useState({})
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
  const [inActiveUser, setInActiveUser] = useState([]);
  const [salonDetails, setSalonDetails] = useState({
    sales: [0, 0, 0, 0],
    appointments: [0, 0],
    serviceLabels: ["0", "Beauty", "Hand & Feet"],
    services: [0, 0, 0, 0],
    productLabels: ["Keratin", "Loreal"],
    products: [0, 0],
    employeeLabels: ["A", "B"],
    employeeNames: ["A", "B"],
    oldNewUserData:{
      newUsers: 1,
       oldUsers: 3
          
    },
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
  // const [peekProdTime, setPeekProdTime] = useState([]);
  const [peekTime, setPeekTime] = useState([]);

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
        borderRadius: 100, // Top corners rounded only
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
     let obj={
        type,
        key: label,
        value: type==="membership"?expiredMembership[key]:events[key]||[]
      }
      setSelectedEvent(obj)
      if(obj?.value?.length>0)
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
  };
  // let fetchProdTime = (startDate, endDate) => {
  //   getApiCall(`reports/getMostSalesTiming?startDate=${startDate}&endDate=${endDate}&showProdSales=${true}`,
  //     (res) => {
  //       if (res) setPeekProdTime(res)
  //     }, () => { })
  // }
  let fetchServiceTime = (startDate, endDate) => {
    getApiCall(`reports/getMostSalesTiming?startDate=${startDate}&endDate=${endDate}`,
      (res) => {
        if (res) setPeekTime(res)
      }, () => { })
  }
    const fetchExpMembers = () => {
    getApiCall(`reports/getMembershipExpiringFromDays`,
      (res) => {
       
          let newObj={};
          Object.keys(res).forEach((key)=>{
              newObj[key]=res[key]?.length>0?res[key]?.map((elm)=>({...elm, validTo: formatDate(elm?.validTo)})):[];
          })
          setExpiredMembership(newObj);
    // Update only the dataset's data array
  setWishes((prev) => {
    if (!prev.datasets || prev.datasets.length === 0) return prev;

    const updatedDataset = { ...prev.datasets[0] };

    // Keep first 4 items from the old data
    const updatedData = updatedDataset.data.slice(0, 4);

    // Push counts from API data
    updatedData.push(newObj["7"]?.length || 0);
    updatedData.push(newObj["30"]?.length || 0);

    updatedDataset.data = updatedData;

    return {
      ...prev,
      datasets: [updatedDataset],
    };
  });
      }, () => { })

  }
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
          membershipSale,
          oldNewUsersData,
        } = res;
        const payments = paymentMethodReport;
        const udpdatedUserData={
       newUsers: oldNewUsersData?.length>0?oldNewUsersData[0]?.newUsers||0:0,
       oldUsers:  oldNewUsersData?.length>0?oldNewUsersData[0]?.oldUsers||0:0
        }
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
          oldNewUserData:udpdatedUserData,
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


            },
         
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
     
    // fetchProdTime(data.startDate, data.endDate)
        fetchExpMembers()

    fetchServiceTime(data.startDate, data.endDate)
    
  }

  useEffect(() => {
    fetchData()

  }, []);
  const fetchInActiveUser = (days) => {
    getApiCall(`reports/getDataOfUsersNotVisitedFromDays?count=${days}`,
      (res) => {
        if (res?.length > 0) setInActiveUser(res)
        else setInActiveUser([])
      }, () => { })

  }
  useEffect(() => {
    debouncedFunction(fetchInActiveUser, 500, days)
  }, [days]);
  const compAppointment = salonDetails?.appointments[0];
  const dashboardData = [
    {
      heading: "Old Users",
      value: salonDetails?.oldNewUserData?.oldUsers,
      className:'bg-tile1',
      icon: <FaUser className="text-white text-md 2xl:text-lg" />,
    },
    {
      heading: "New Users",
      value: salonDetails?.oldNewUserData?.newUsers,
      className:'bg-tile1',
      icon: <FaUser className="text-white text-md 2xl:text-lg" />,
    },
    {
      heading: "Total Revenue",
      value: totalRevenue,
      className:'bg-tile1',
      icon: <MdCurrencyRupee className="text-white text-md 2xl:text-lg" />,
    },
    {
      heading: "Appointments",
      value: compAppointment,
      className:'bg-tile2',
    },
    {
      heading: "Services Revenue",
      value: serviceRevenue,
      className:'bg-tile3',
      icon: <MdCurrencyRupee className="text-white text-md 2xl:text-lg" />,
    },
    {
      heading: "Products Revenue",
      value: productRevenue,
      className:'bg-tile4',
      icon: <MdCurrencyRupee className="text-white text-md 2xl:text-lg" />,
    },
    {
      heading: "Membership Revenue",
      value: salonDetails?.membership,
      className:'bg-tile5',
      icon: <MdCurrencyRupee className="text-white text-md 2xl:text-lg" />,
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
  const daysOptions = [
    { name: "30 Days", value: 30 },
    { name: "60 Days", value: 60 },
    { name: "90 Days", value: 90 },
    { name: "180 Days", value: 180 },
    { name: "365 Days", value: 365 },

  ]

  const InActiveCols = [{
    name: "Customer Name",
    id: "name",
  }, {
    name: "Contact Number",
    id: 'phoneNumber',
  }, {
    name: "Last Visited",
    id: 'visited'
  }]
  const InActiveRows = inActiveUser?.map((item, index) => ({
    name: item.name,
    phoneNumber: item.phoneNumber,
    visited: formatDate(item?.visited),
  }))

  const timings = [
    "Morning",
    "Afternoon",
    "Evening",
    "Night",
  ]

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
              <DashboardCard key={index} heading={item.heading} value={item.value} icon={item.icon} className={item.className} />
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
            <BarChart data={serviceData} heading={"Service Distribution"} />
          </div>
          <div className="col-span-1 lg:col-span-1 h-full  border shadow-graph bg-white rounded-[16px] p-5">
            <BarChart data={prodData} heading={"Product Distribution"} />
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
              heading={"Birthdays , Anniversarys & Membership Expiry Report"}
            />
          </div>
          <div className="col-span-full h-full  border shadow-graph bg-white rounded-[16px] p-5">
            <div>
              <h2 className="text-black  text-start text-xl 2xl:text-2xl leading-[28px] font-normal mb-5">Inactive Customers Report</h2>
              <div className="flex flex-col gap-1 ">
                <NormalSelect
                  label="Select Days"
                  options={daysOptions}
                  placeholder="Select Days"
                  value={days}
                  lableStyles={{
                    'fontWeight': '400',
                    "fontSize": "16px",
                    'color': '#000000'
                  }}
                  inputStyles={{
                    width: "250px"
                  }}
                  onChange={(e) => setDays(e.target.value)}
                />
              </div>
              {inActiveUser?.length > 0 ? <CustomTable
                columns={InActiveCols}
                rows={InActiveRows}
              /> : <div className="h-[20vh] flex items-center justify-center">
                <h2 className="text-gray2  text-md  mb-5">No InActive Customers Found</h2>
              </div>}
            </div>


          </div>
          <div className="col-span-full h-full  border shadow-graph bg-white rounded-[16px] p-5">
            <div>
              <h2 className="text-black  text-start text-xl 2xl:text-2xl leading-[28px] font-normal mb-5">Peek Booking Hours</h2>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-12 mt-6">
                <div className="">
                  <h2 className="text-gray2  text-start text-lg  font-normal mb-5">Services & Product</h2>

                  <div className='w-full  '>
                    {timings?.map((item, index) => {
                      const total = peekTime?.totalRevenue?.[0]?.totalAppointments || 1;
                      const selectedtime = peekTime?.timings?.find((elm) => elm._id === item)// Avoid division by zero
                      const percentage = selectedtime ? ((selectedtime?.appointmentCount / total) * 100).toFixed(1) : '0'// 1 decimal point
                      const percentageValue = parseFloat(percentage);
                      return (
                        <div key={index} className="flex items-center w-full  gap-3 mb-6 last:mb-0">
                          <div className="w-[100px] tex-lg text-black">{item}</div>
                          <div className="w-[500px]  bg-gray-200 rounded-xl h-[30px] ">
                            <div className="bg-indigo-600 h-[30px] rounded-xl" style={{ width: `${percentageValue}%` }}
                            />
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="text-secondary text-sm">{selectedtime?.appointmentCount || 0}</span>
                            <span className="text-secondary text-sm">(₹{selectedtime?.totalSales || 0})</span>
                          </div>

                        </div>
                      )
                    })}
                  </div>
                </div>
                {/* <div className="">
                  <h2 className="text-gray2  text-start text-lg  font-normal mb-5">Product</h2>

                  <div className='w-full  '>
                    {timings?.map((item, index) => {
                      const total = peekProdTime?.totalRevenue?.[0]?.totalAppointments || 1;
                      const selectedtime = peekTime?.timings?.find((elm) => elm._id === item)// Avoid division by zero
                      const percentage = selectedtime ? ((selectedtime?.appointmentCount / total) * 100).toFixed(1) : '0'// 1 decimal point
                      const percentageValue = parseFloat(percentage);
                      return (
                        <div key={index} className="flex items-center w-full  gap-3 mb-6 last:mb-0">
                          <div className="w-[100px] tex-lg text-black">{item}</div>
                          <div className="w-[500px]  bg-gray-200 rounded-xl h-[30px] ">
                            <div className="bg-indigo-600 h-[30px] rounded-xl" style={{ width: `${percentageValue}%` }}
                            />
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="text-secondary text-sm">{selectedtime?.appointmentCount || 0}</span>
                            <span className="text-secondary text-sm">(₹{selectedtime?.totalSales || 0})</span>
                          </div>

                        </div>
                      )
                    })}
                  </div>
                </div> */}
              </div>



            </div>
    


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
