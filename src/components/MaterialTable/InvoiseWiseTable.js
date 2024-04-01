import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IoPrintSharp } from 'react-icons/io5';


function FormatDate(date) {
    const dates = new Date(date)
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(dates);
  
    return formattedDate;
  }

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




export default function CustomizedInvoiceWiseTables({headings,data,ref}) {

  return (
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 700 }} aria-label="customized table" ref={ref}>
        <TableHead>
                <TableRow >
        {
            headings?.map((item,index)=>(
                    <StyledTableCell>{item}</StyledTableCell>
            ))
        }
                </TableRow>
        </TableHead>
        <TableBody>
        
              {  data?.filter((item)=>item.status === 3)?.map((row,index) => (
            <StyledTableRow key={index}>
              <StyledTableCell scope="row">
                {FormatDate(row.createdAt)}
              </StyledTableCell>
              <StyledTableCell >{row?.invoiceId}</StyledTableCell>
              <StyledTableCell >Service</StyledTableCell>
              <StyledTableCell >{row?.subTotal - (row?.discount|| 0)}</StyledTableCell>
              <StyledTableCell >{row?.membershipCreditUsed}</StyledTableCell>
              <StyledTableCell>{row?.subTotal - (row?.discount|| 0)}</StyledTableCell>
              <StyledTableCell>{((row?.subTotal - (row?.discount|| 0))*0.18).toFixed(2)}</StyledTableCell>
            </StyledTableRow>
          ))
            
        }
          
        </TableBody>
      </Table>
    </TableContainer>
  );
}