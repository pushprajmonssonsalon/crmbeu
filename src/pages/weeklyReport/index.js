import { useEffect, useState } from 'react';
import { formatDate, formatValue, postApiData } from '../../utils/services';
import MonthPicker from '../../components/Pickers/MonthPicker';
import YearPicker from '../../components/Pickers/YearPicker';
import { FaAngleDown, FaCalendarAlt } from 'react-icons/fa';
import GridRows from '../../components/pagination/gridRows';
import Pagination from '../../components/pagination';
import exportToExcel from '../../utils/exportToExcel';
import BarChart from '../../components/charts/BarChart';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const years = [
  "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009",
  "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019",
  "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029",
  "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039",
  "2040", "2041", "2042", "2043", "2044", "2045", "2046", "2047", "2048", "2049", "2050"
];


const WeeklyReport = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  const [showDate, setShowDate] = useState(false)
  const [SalesData, setSalesData] = useState({
    labels: [
      'Week 1',
      'Week 2',
      'Week 3',
      'Week 4'
    ],
    data: [12000, 18000, 15000, 20000],

  })
  const [weeklyReport, setWeeklyReport] = useState([])
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [month, setMonth] = useState(months[currentMonth]);
  const [year, setYear] = useState(currentYear.toString());
  const updatingDate = new Date(Date.UTC(year, months.indexOf(month)));
  useEffect(() => {
    const data = {
      currentDate: updatingDate,
    }
    postApiData("reports/salonWeeklyReport",
      data,
      (resp) => {

        setWeeklyReport(resp)
        let labels = [];
        let data = [];
        resp.forEach((item, index) => {
          labels.push(`Week ${index + 1}`);
          data.push(item.revenue);

        })
        setSalesData({
          labels,
          data
        })
      },
      (error) => {

      }
    )
  }, [month, year])
  const handleExport = () => {
    if (weeklyReport?.length > 0) {
      const data = weeklyReport.map((item) => ({
        ...item,
        date: formatDate(item.date, true),
      }));
      exportToExcel(weeklyReport, "WeeklyReport", "weeklyReport.xlsx");
    }
  }

  const headings = ["Week", "Tickets", "No. Of Services", "No. Of Products", "Revenue", "AvgServicePerBill", "AvgTicketSize"]
  const paginatedData = weeklyReport?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const data = {
    labels: SalesData?.labels,
    datasets: [
      {
        label: 'Revenue (in ₹)',
        data: SalesData?.data,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        barThickness: 50, // Tailwind green-400
        borderRadius: 2,
        borderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        }
      }
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300 w-full`}>
          <div className='flex items-center w-full justify-between flex-wrap gap-3'>
            <div className="flex items-center  gap-3 md:gap-6 flex-wrap">
              <button onClick={() => setShowDate(!showDate)} className="flex border  shadow items-center bg-white gap-2 rounded-[5px] py-[10px] px-[15px]">
                <FaCalendarAlt className="text-customPurple text-sm" />
                <span className="text-secondary text-sm">Year-to-date </span>
                <FaAngleDown className={`text-secondary text-sm ${showDate ? "rotate-180" : ""} `} />

              </button>
              <div className="flex gap-1 font-normal  items-center text-xs text-secondary">
                <span>{month}</span>
                <span>{year}</span>
              </div>

            </div>
            <button
              className="w-[150px] bg-ternary font-normal h-[36px] flex items-center justify-center active:bg-ternary/90 transition-colors ease-in duration-100 rounded-[16px] text-white text-sm leading-[24px]"
              onClick={handleExport}
            >
              Export All
            </button>
          </div>
          {showDate && <div className=" flex items-center gap-3">
            <MonthPicker months={months} month={month} setMonth={setMonth} />
            <YearPicker years={years} year={year} setYear={setYear} />
          </div>}

        </div>

      </div>
      <div className="mb-9 h-full  border shadow-graph bg-white rounded-[16px] p-5">
        <BarChart data={data} options={options} heading={"Weekly Graph"} />
      </div>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Weekly Report</h2>
        <div className="table-responsive">
        <table className="styled-table">
          <thead>
            <tr>
              {headings.map((column, index) => (
                <th key={index} className="bg-black text-white px-3 py-2">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((row, index) => (
              <tr key={index} className="bg-white">
                <td >{index + 1}</td>
                <td >{formatValue(row?.tickets)}</td>
                <td >{formatValue(row?.noOfServices)}</td>
                <td >{formatValue(row?.noOfProducts)}</td>
                <td >{formatValue(row?.revenue)}</td>
                <td >{formatValue(row?.avgServicePerBill)}</td>
                <td >{formatValue(row?.avgTicketSize)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mt-4 items-center gap-2">
          <GridRows
            totalItems={weeklyReport?.length}
            itemsPerPage={rowsPerPage}
            handleRowschange={handleChangeRowsPerPage}
          />
          <Pagination
            totalItems={weeklyReport?.length}
            itemsPerPage={rowsPerPage}
            currentPage={page}
            onPageChange={handleChangePage}
          />
        </div>
      </div>
    </>
  )
}

export default WeeklyReport