import { BiSolidAddToQueue } from 'react-icons/bi'

const MyServiceTable = ({data,startIndex,endIndex,handleEditService}) => {
  console.log("serviceData data", data)
  return (
    <>
        <table className="styled-table" style={{ height: "40px" }}>
                  <thead>
                    <tr>
                        <th>NAME</th>
                        <th>CATEGORY</th>
                        <th>SUB CATEGORY</th>
                        <th>GENDER</th>
                        <th>PRICE</th>
                        <th>MRP</th>
                        <th>APP PRICE</th>
                        <th>APP MRP</th>
                        <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    data.map((item, index) =>{
                      console.log("itemservice",item)
                      return(
                        <tr key={index}>
                        <td>{item.services.name}</td>
                        <td>{item.services.category}</td>
                        <td>{item.services.subCategory}</td>
                        <td>{item.services.gender}</td>
                        <td>{item.services.price}</td>
                        <td>{item.services.mrp}</td>
                        <td>{item.services.appPrice||0}</td>
                        <td>{item.services.appMrp||0}</td>
                        <td>
                        {/* <button onClick={()=>handleEditService(item.serviceId)}  className='bg-[#5865F2] py-2 px-4 rounded-lg text-white flex justify-center items-center'>
                            <h3 className='font-semibold text-lg poppins'>Edit</h3>
                        </button> */}
                        
                        <button
                    className="flex justify-center items-center bg-transparent mx-3 hover:bg-transparent hover:text-red-600" 
                    onClick={()=>handleEditService(item.services.serviceId)}
                  >
                    
                      <BiSolidAddToQueue className="text-xl font-bold text-black cursor-pointer hover:text-red-600" />
                   
                  </button>
                        </td>
                      </tr>
                      )

                    })
                  }
                    
                  </tbody>
                </table>
    </>   
  )
}

export default MyServiceTable