import React from 'react'
import { BiSolidAddToQueue } from 'react-icons/bi'

const ServiceTable = ({data,startIndex,endIndex,addclick}) => {
  console.log("service-----data",data)
  return (
    <>
        <table className="styled-table" style={{ height: "40px" }}>
                  <thead>
                    <tr>
                        <th>NAME</th>
                        <th>CATEGORY</th>
                        <th>SUB CATEGORY</th>
                        <th>GENDER</th>
                        <th>ADD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(startIndex, endIndex).map((item, index) => (
                      <tr key={index}>
                      <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.subCategory}</td>
                  <td>{item.gender}</td>
                  <button
                    className="flex justify-center items-center bg-transparent mx-3 hover:bg-transparent hover:text-red-600 " 
                    onClick={() => addclick(item)}
                  >
                    
                      <BiSolidAddToQueue className="text-xl font-bold text-black cursor-pointer hover:text-red-600 " />
                   
                  </button>
                      </tr>
                    ))}
                  </tbody>
                </table>
    </>   
  )
}

export default ServiceTable