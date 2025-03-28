import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import MonthPicker from "../../components/Pickers/MonthPicker";
import YearPicker from "../../components/Pickers/YearPicker";
import { formatDateToFull, postApiData } from "../../utils/services";
import BasicTable from "../../components/Table/BasicTable";
import { FaFileUpload } from "react-icons/fa";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = [
  "2000",
  "2001",
  "2002",
  "2003",
  "2004",
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "2031",
  "2032",
  "2033",
  "2034",
  "2035",
  "2036",
  "2037",
  "2038",
  "2039",
  "2040",
  "2041",
  "2042",
  "2043",
  "2044",
  "2045",
  "2046",
  "2047",
  "2048",
  "2049",
  "2050",
];

const Royalities = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [month, setMonth] = useState(months[currentMonth]);
  const [year, setYear] = useState(currentYear.toString());
  const [invoices, setInvoices] = useState([]);
  const updatingDate = new Date(Date.UTC(year, months.indexOf(month)));
  // const selectedDate = updatingDate;
  useEffect(() => {
    const data = {
      selectedDate: updatingDate,
    };
    postApiData(
      "parlor/showSalonRoyaltyInvoice",
      data,
      (resp) => {
        
        setInvoices(resp);
      },
      (error) => {
        setInvoices([]);

        console.error("error");
      }
    );
  }, [month, year]);

  const headings = ["File Name", "Uploaded PDF", "Uploaded Date"];
  const handlePdfUrl = (url) => {
    window.open(url, "_blank");
  };
  function createData(name, url, date) {
    return { name, url, date };
  }
  const rows = useMemo(() => {
    return invoices?.map((item) =>
      createData(
        item.fileName,
        <FaFileUpload
          className="text-xl font-bold text-right cursor-pointer"
          onClick={() => handlePdfUrl(item.invoiceUrl)}
        />,
        formatDateToFull(item.createdAt, false)
      )
    );
  }, [invoices]);
  
  return (
    <>
      <div className="mt-32 flex flex-col w-[90%] mx-auto">
        <div className="flex items-center gap-x-3 mb-10">
          <MonthPicker months={months} month={month} setMonth={setMonth} />
          <YearPicker years={years} year={year} setYear={setYear} />
        </div>
        <div className="pb-32">
          <BasicTable headings={headings} rows={rows} />
        </div>
      </div>
    </>
  );
};

export default Royalities;
