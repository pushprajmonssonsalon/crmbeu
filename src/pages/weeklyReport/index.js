import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout';
import CustomInputFeild from "../../components/customInput";
import { postApiData } from '../../utils/services';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DatePicker from "react-datepicker";
import { IoPrintSharp } from 'react-icons/io5';
 
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
  useEffect(()=>{
    const data = {
      currentDate: startDate,
    }
    postApiData("reports/salonWeeklyReport",
    data,
    (resp)=>{
        console.log("revenue detail", resp)
        setWeeklyReport(resp)
    },
    (error)=>{
        console.log("revenue error",error)
    }
)
  },[])
  const searchClick=()=>{
    const data = {
      currentDate: startDate,
    }
    postApiData("reports/salonWeeklyReport",
    data,
    (resp)=>{
        console.log("revenue detail", resp)
        setWeeklyReport(resp)
    },
    (error)=>{
        console.log("revenue error",error)
    }
)
  }
  // console.log("revenue",revenue)

  const headings = ["Date","Appointments","Total Revenue","Services","Products","Membership Revenue"]
  return (
    <Layout>
        <div className='mt-32'>
        {/* <CustomInputFeild startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} submitClick={searchClick}/> */}
        <div className='flex justify-center items-center gap-x-5'>
        <DatePicker
            selectsStart
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            startDate={startDate}
          />
          <button className='px-3 py-2 rounded-lg bg-black text-white font-bold ml-4' onClick={searchClick}>Search</button>
          </div>
        </div>
        

        <TableContainer component={Paper}>
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
          {/* {revenue.map((row,index) => (
            <StyledTableRow key={index}>
              <StyledTableCell scope="row">
                {row._id}
              </StyledTableCell>
              <StyledTableCell >{row?.appointment}</StyledTableCell>
              <StyledTableCell >{row?.total}</StyledTableCell>
              <StyledTableCell >{row?.services}</StyledTableCell>
              <StyledTableCell >{row?.products}</StyledTableCell>
              <StyledTableCell >{row?.membershipPoints}</StyledTableCell>
            </StyledTableRow>
          ))} */}
        </TableBody>
      </Table>
    </TableContainer>
    </Layout>
  )
}

export default WeeklyReport