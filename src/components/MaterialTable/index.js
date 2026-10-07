import { IoPrintSharp } from 'react-icons/io5';
import { MdDeleteOutline, MdOutlineReceiptLong } from 'react-icons/md';
import { formatDateToFull } from '../../utils/services';

// Same sizing as the appointment table's action buttons (stickytable.js).
const iconClass = "h-[18px] w-[18px] sm:h-5 sm:w-5";
const actionBtnClass =
  "shrink-0 grid place-items-center h-9 w-9 rounded-full bg-transparent p-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95";







// onEditBill / onDeleteBill are passed only for the salon owner (Membership page).
export default function CustomizedTables({ headings, data, handlePrint, onEditBill, onDeleteBill }) {

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
              <div className="flex flex-nowrap items-center gap-1">
              {onEditBill && (
                <button type="button" className={actionBtnClass + " text-secondaryGreen hover:bg-gray-100"} onClick={() => onEditBill(item)} aria-label="Edit bill" title="Edit bill">
                  <MdOutlineReceiptLong className={iconClass} />
                </button>
              )}
              <IoPrintSharp className={`text-green-600 text-xl cursor-pointer hover:text-green-950`} onClick={() => handlePrint(item)} />
              {onDeleteBill && (
                <button type="button" className={actionBtnClass + " text-red-600 hover:bg-red-50"} onClick={() => onDeleteBill(item)} aria-label="Delete bill" title="Delete bill">
                  <MdDeleteOutline className={iconClass} />
                </button>
              )}
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

     
    </>
  );
}