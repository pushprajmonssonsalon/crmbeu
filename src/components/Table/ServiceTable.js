import { BiSolidAddToQueue } from 'react-icons/bi'

const ServiceTable = ({data,startIndex,endIndex,addclick}) => {
  
  return (
    <>

        <table  className="w-full" >
                  <thead>
                    <tr>
                        <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>NAME</th>
                        <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>CATEGORY</th>
                        <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>SUB CATEGORY</th>
                        <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>GENDER</th>
                        <th className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>ADD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                      <td className='border-0 border-b bg-white border-lightGray font-normal text-gray2 text-sm'>{item.name}</td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.category}</td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.subCategory}</td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>{item.gender}</td>
                  <td className='border-0 border-b bg-white border-lightGray font-normal text-ternaryGray text-sm'>
                  <button
                    className="flex justify-center items-center bg-transparent p-3 hover:bg-transparent hover:text-red-600 " 
                    onClick={() => addclick(item)}
                  >
                    
                      <BiSolidAddToQueue className="text-xl font-bold text-black cursor-pointer hover:text-red-600 " />
                   
                  </button>
                  </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
    </>   
  )
}

export default ServiceTable