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
import { getApiCall } from '../../utils/services';


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



export default function BillTables({headings,data}) {
    console.log("table data", data)
    const [staffData,setStaffData] = React.useState([])
  React.useEffect(() => {
    getApiCall(
      "owner/getStaff",
      (res) => {
        setStaffData(res);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, []);
  const stafflist = staffData.filter((item)=>item._id === data[0].staffId)
  const staffname = stafflist[0]?.name
  console.log("staffname",staffname)

  return (
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
          {data.map((row,index) => (
            <StyledTableRow key={index}>
              <StyledTableCell scope="row">
                {row.miniSubcategory}
              </StyledTableCell>
              <StyledTableCell >{row?.category}</StyledTableCell>
              <StyledTableCell >{row?.price}</StyledTableCell>
              <StyledTableCell >1</StyledTableCell>
              <StyledTableCell>{staffname}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}