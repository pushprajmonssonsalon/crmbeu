import * as React from 'react';
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


function FormatDate(date) {
    const dates = new Date(date)
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(dates);
  
    return formattedDate;
  }
export default function CustomizedCustomerTables({headings,data}) {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table" style={{fontSize:"18px"}}>
        <TableHead>
                <TableRow >
        {
            headings.map((item,index)=>(
                    <StyledTableCell style={{fontWeight:600}}>{item}</StyledTableCell>
            ))
        }
                </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item,index) => (
            <StyledTableRow key={index}>
              <StyledTableCell  scope="row" >
                {item?.customer.name}
              </StyledTableCell>
              <StyledTableCell>{item?.customer.phoneNumber}</StyledTableCell>
              <StyledTableCell>{FormatDate(item?.createdAt)}</StyledTableCell>
              <StyledTableCell>{
                item.services.map((data,dataIndex)=>(
                    <div key={dataIndex}>
                   {data.miniSubcategory}
                    </div>
                ))
            }</StyledTableCell>
              <StyledTableCell >{
                item.products.map((data,dataIndex)=>(
                    <div key={dataIndex}>
                   {data.name}
                    </div>
                ))
            }</StyledTableCell>
              <StyledTableCell>{item.total}</StyledTableCell>
              <StyledTableCell style={{ color: item.status === 1 ? 'blue' : item.status === 2 ? 'red' : 'green',fontWeight:700,fontSize:"18px" }}>{item.status ==1 ? "pending" : item.status == 2? "cancelled" : "completed"}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

