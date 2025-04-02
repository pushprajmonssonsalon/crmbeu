import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IoPrintSharp } from 'react-icons/io5';
import { formatDateToFull } from '../../utils/services';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: '#333333',
    borderBottom: '1px solid #D9D9D9', // Ensures only bottom border
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



export default function CustomizedTables({ headings, data, handlePrint }) {

  return (

    <>
      <table className="w-full mx-auto overflow-x-auto" style={{ height: "40px" }}>
        <thead>
          <tr>
            {
              headings.map((item, index) => (
                <th key={index} className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>{item}</th>
              ))
            }

          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} >
              <td className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>{item.customerName}</td>
              <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.customerPhoneNumber}</td>
              <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'> {
                    item?.employees?.map((elm) => (
                      <div>{elm.name}</div>
                    ))
                  }</td>
              <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.name}</td>
              <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.price}</td>
              <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.credits}</td>
              <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{formatDateToFull(item?.createdAt, false)}</td>
              <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{formatDateToFull(item?.expiryDate, false) || item?.expiry}</td>
              <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>
              <IoPrintSharp className={`text-green-600 text-xl cursor-pointer hover:text-green-950`} onClick={() => handlePrint(item)} />

              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </>
  );
}