import React from 'react'
import { GrStatusGoodSmall } from "react-icons/gr";

const EmployeeTable = ({data,startIndex,endIndex}) => {
  return (
    <>
        <table className="styled-table" style={{ height: "40px" }}>
                  <thead>
                    <tr>
                    <th>NAME</th>
                    <th>MOBILE NO.</th>
                    <th>CATEGORY</th>
                    <th>POISTION</th>
                    <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(startIndex, endIndex).map((item, index) => (
                      <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{item.role}</td>
                      <td><div className='flex justify-start items-center'><GrStatusGoodSmall className='text-green-600'/>  <span>Active</span></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
    </>   
  )
}

export default EmployeeTable