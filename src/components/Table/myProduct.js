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
            <table className="styled-table w-[95%] mx-auto overflow-x-auto" style={{ height: "40px" }}>
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>QUANTITY</th>
                      <th>TOTAL SIZE</th>
                      <th>PRICE</th>
                      <th>BRAND</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} >
                      <td>{item.products.name}</td>
                        <td>{item.products.stockQuantity}</td>
                        <td>{item.products.totalSize} {" "} {item.products.unit}</td>
                        <td>{item.products.price}</td>
                        <td>{item.products.brand}</td>
                        <td>
                          <div className='flex justify-between items-center'>
                          <GiCancel className="text-red-600 text-xl cursor-pointer" onClick={()=>handleDelete(item.products._id)}/>
                          <BiSolidAddToQueue className="text-xl font-bold text-black cursor-pointer hover:text-red-600" onClick={()=>handleOpen(item.products._id)}/>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
        </>
      )
}

export default MyProductTable