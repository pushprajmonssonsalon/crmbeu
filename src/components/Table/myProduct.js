import { BiSolidAddToQueue } from 'react-icons/bi'
import { GiCancel } from 'react-icons/gi'
import { postApiData } from '../../utils/services'
import toast from 'react-hot-toast'

const MyProductTable = ({data,handleOpen,setIsChanged,isChanged}) => {
  
  const handleDelete=(id)=>{
    const data = {
      id: id
    }
    postApiData(
      "inventory/deleteSalonProducts",
      data,
      (resp)=>{
        toast.success("Successfully deleted!!")
      },
      (error)=>{
        toast.error("Something Went Wrong!!")
      }
    )
    setIsChanged(!isChanged)
  }
    return (
        <>
            <div className="table-responsive">
            <table className="w-full mx-auto" style={{ height: "40px" }}>
                  <thead>
                    <tr>
                      <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>NAME</th>
                      <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>QUANTITY</th>
                      <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>TOTAL SIZE</th>
                      <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>PRICE</th>
                      <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>BRAND</th>
                      <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} >
                      <td className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>{item.products.name}</td>
                        <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.products.stockQuantity}</td>
                        <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.products.totalSize} {" "} {item.products.unit}</td>
                        <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.products.price}</td>
                        <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.products.brand}</td>
                        <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>
                          <div className='flex gap-2 items-center'>
                          <GiCancel className="text-red-600 text-xl cursor-pointer" onClick={()=>handleDelete(item.products._id)}/>
                          <BiSolidAddToQueue className="text-xl font-bold text-gray2 cursor-pointer hover:text-red-600" onClick={()=>handleOpen(item.products._id)}/>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        </>
      )
}

export default MyProductTable