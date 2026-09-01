import { IoPrintSharp } from 'react-icons/io5';
import { formatDateToFull } from '../../utils/services';







export default function CustomizedTables({ headings, data, handlePrint }) {

  return (

    <>
      <div className="table-responsive">
      <table className="w-full mx-auto" style={{ height: "40px" }}>
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
      </div>

     
    </>
  );
}