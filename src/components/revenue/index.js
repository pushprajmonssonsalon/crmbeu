import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
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
const Revenue = () => {
    const defaultStartDate = new Date();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultStartDate);
  const [revenue,setRevenue] = useState([])
  useEffect(()=>{
    const data = {
        startDate: startDate,
        endDate: endDate
    }
    postApiData("reports/getRevenueReportDayWise",
    data,
    (resp)=>{
        
        setRevenue(resp)
    },
    (error)=>{
        
    }
)
  },[])
  const searchClick=()=>{
    const data = {
        startDate: startDate,
        endDate: endDate
    }
    postApiData("reports/getRevenueReportDayWise",
    data,
    (resp)=>{
        
        setRevenue(resp)
    },
    (error)=>{
        
    }
)
  }
  

  const headings = ["Date","Appointments","Total Revenue","Services","Products","Membership Revenue"]
  return (
    <Layout>
        <div className='mt-32'>
        <CustomInputFeild startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} submitClick={searchClick}/>
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
          {revenue.map((row,index) => (
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Layout>
  )
}

export default Revenue