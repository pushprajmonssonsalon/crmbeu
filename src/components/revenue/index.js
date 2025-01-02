import { useEffect, useState } from "react";
import Layout from "../Layout";
import { postApiData } from "../../utils/services";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CustomSearchInputFeild from "../../components/customInput";
import exportToExcel from "../../utils/exportToExcel";
import { FaFileExcel } from "react-icons/fa";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const Revenue = () => {
  const defaultStartDate = new Date();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultStartDate);
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
    "Total Revenue",
    "Services",
    "Products",
    "Membership Revenue",
  ];
  return (
    <Layout>
      <div className="mt-32 mb-9 flex items-center justify-center gap-9">
        <CustomSearchInputFeild
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          loading={loading}
          submitClick={searchClick}
        />
        <button
          onClick={handleExport}
          className="bg-green-600 h-[40px] text-sm mt-auto mb-1 flex items-center justify-center gap-1 font-semibold hover:bg-green-500 text-white rounded-md w-[80px] active:scale-105 transition-all ease-in duration-100"
        >
          <span>Export</span>
          <FaFileExcel />
        </button>{" "}
      </div>

      <TableContainer
        sx={{ maxWidth: "95%", overflowX: "auto", margin: "0 auto" }}
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
                <StyledTableCell>{row?.appointment}</StyledTableCell>
                <StyledTableCell>{row?.total}</StyledTableCell>
                <StyledTableCell>{row?.services}</StyledTableCell>
                <StyledTableCell>{row?.products}</StyledTableCell>
                <StyledTableCell>{row?.membershipPoints}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default Revenue;
