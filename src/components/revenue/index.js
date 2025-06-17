import { useEffect, useState } from "react";
import { formatDate, formatValue, postApiData } from "../../utils/services";
import exportToExcel from "../../utils/exportToExcel";
import { FaAngleDown, FaCalendarAlt } from "react-icons/fa";
import CustomDatePicker from "../customInput/CustomDatePicker";
import { useSearchParams } from "react-router-dom";
import GridRows from "../pagination/gridRows";
import Pagination from "../pagination";


const Revenue = () => {
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const [showDate, setShowDate] = useState(false)
  const start = params.get("start");
  const end = params.get("end");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  //date
  const defaultStartDate = formatDate(new Date());
  const [startDate, setStartDate] = useState(
    start ? start : defaultStartDate
  );
  const [endDate, setEndDate] = useState(
    end ? end : defaultStartDate
  );
  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === "startDate") {
      setStartDate(value)
    } else {
      setEndDate(value)
    }

  }
  const [revenue, setRevenue] = useState([]);
  useEffect(() => {
    const data = {
      startDate: startDate,
      endDate: endDate,
    };
    setLoading(true);
    postApiData(
      "reports/getRevenueReportDayWise",
      data,
      (resp) => {
        setLoading(false);

        setRevenue(resp);
      },
      (error) => {
        setLoading(false);
      }
    );
  }, []);
  const searchClick = () => {
    const data = {
      startDate: startDate,
      endDate: endDate,
    };
    setLoading(true);

    postApiData(
      "reports/getRevenueReportDayWise",
      data,
      (resp) => {
        setLoading(false);

        setRevenue(resp);
      },
      (error) => {
        setLoading(false);
      }
    );
  };
  const handleExport = () => {
    if (revenue) exportToExcel(revenue, "Revenue", "revenue.xlsx");
  };

  const headings = [
    "Date",
    "Appointments",
    "Revenue",
    "Gst Amount",
    "Total Revenue",
    "Services",
    "Products",
    "Membership Revenue",
    "ABV (Average Bill Value)",
  ];

  const paginatedData = revenue?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300 w-full`}>
          <div className="flex w-full items-center justify-between">
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
            <button
              className="w-[150px] bg-ternary font-normal h-[36px] flex items-center justify-center active:bg-ternary/90 transition-colors ease-in duration-100 rounded-[16px] text-white text-sm leading-[24px]"
              onClick={handleExport}
            >
              Export All
            </button>
          </div>

          {showDate && <div className=" flex items-center my-4  gap-3">
            <CustomDatePicker
              startDate={startDate}
              endDate={endDate}
              loading={loading}
              className="bg-white gap-2 rounded-[5px] py-[10px] px-[15px] "
              onSubmit={searchClick}
              onChange={handleDateChange}


            />
          </div>}

        </div>

      </div>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <h2 className="text-black text-start  font-normal text-[22px] leading-[28px] mb-5">Revenue</h2>
        <table className="styled-table ">
          <thead className="sticky  top-0 z-2">
            <tr>
              {headings?.map((item, index) => (
                <th key={index}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData
              ?.map((row, index) => (
                <tr key={index}>
                  <td >{row._id}</td>
                  <td>{formatValue(row?.appointment)}</td>
                  <td>{formatValue(row?.total/1.18)}</td>
                  <td>{formatValue((row?.total * 0.18) / 1.18)}</td>
                  <td>{formatValue((row?.total))}</td>
                  <td>{formatValue(row?.services)}</td>
                  <td>{formatValue(row?.products)}</td>
                  <td>{formatValue(row?.membershipPoints)}</td>
                  <td>{formatValue((row?.total / row?.appointment))}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4 items-center">
          <GridRows
            totalItems={revenue?.length}
            itemsPerPage={rowsPerPage}
            handleRowschange={handleChangeRowsPerPage}
          />
          <Pagination
            totalItems={revenue?.length}
            itemsPerPage={rowsPerPage}
            currentPage={page}
            onPageChange={handleChangePage}
          />
        </div>
      </div>


      {/* <TableContainer
        sx={{ maxWidth: "95%", overflowX: "auto", margin: "40px auto" }}
        component={Paper}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {headings.map((item, index) => (
                <StyledTableCell>{item}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {revenue.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell scope="row">{row._id}</StyledTableCell>
                <StyledTableCell>{formatValue(row?.appointment)}</StyledTableCell>
                <StyledTableCell>{formatValue(row?.total)}</StyledTableCell>
                <StyledTableCell>{formatValue(row?.services)}</StyledTableCell>
                <StyledTableCell>{formatValue(row?.products)}</StyledTableCell>
                <StyledTableCell>{formatValue(row?.membershipPoints)}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </>
  );
};

export default Revenue;
