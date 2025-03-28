import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { formatValue, postApiData } from '../../utils/services';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MonthPicker from '../../components/Pickers/MonthPicker';
import YearPicker from '../../components/Pickers/YearPicker';
 
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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
const WeeklyReport = () => {
    const defaultStartDate = new Date();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [weeklyReport,setWeeklyReport] = useState([])
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [month, setMonth] = useState(months[currentMonth]);
  const [year, setYear] = useState(currentYear.toString());
  const updatingDate = new Date(Date.UTC(year, months.indexOf(month)));
  useEffect(()=>{
    const data = {
      currentDate: updatingDate,  
    }
    postApiData("reports/salonWeeklyReport",
    data,
    (resp)=>{
        
        setWeeklyReport(resp)          
    },
    (error)=>{
        
    }
)
  },[month,year])
  const searchClick=()=>{
    const data = {
      currentDate: "2026-04-01T00:00:00.000Z",
    }
    postApiData("reports/salonWeeklyReport",
    data,
    (resp)=>{
        
        setWeeklyReport(resp)
    },
    (error)=>{
        
    }
)
  }
  // 

  const headings = ["Week","Tickets","No. Of Services","No. Of Products","Revenue","AvgServicePerBill","AvgTicketSize"]
  return (
    <>
        <div className='mt-32'>
        {/* <CustomInputFeild startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} submitClick={searchClick}/> */}
        <div className='flex justify-center items-center gap-x-5 my-9'>
        <MonthPicker months={months} month={month} setMonth={setMonth}/>
          <YearPicker years={years} year={year} setYear={setYear}/>
          </div>
        </div>
        

        <TableContainer sx={{ maxWidth:"95%",overflowX:"auto",margin:"0 auto"}} component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
                <TableRow >
        {
            headings.map((item,index)=>(
                    <StyledTableCell>{item}</StyledTableCell>
            ))
        }
                </TableRow>
        </TableHead>
        <TableBody>
          {weeklyReport.map((row,index) => (
            <StyledTableRow key={index}>
              <StyledTableCell scope="row">
                {index+1}
              </StyledTableCell>
              <StyledTableCell >{formatValue(row?.tickets)}</StyledTableCell>
              <StyledTableCell >{formatValue(row?.noOfServices)}</StyledTableCell>
              <StyledTableCell >{formatValue(row?.noOfProducts)}</StyledTableCell>
              <StyledTableCell >{formatValue(row?.revenue)}</StyledTableCell>
              <StyledTableCell >{formatValue(row?.avgServicePerBill)}</StyledTableCell>
              <StyledTableCell >{formatValue(row?.avgTicketSize)}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
}

export default WeeklyReport