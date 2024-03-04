import React from 'react'
import { BiSolidAddToQueue } from 'react-icons/bi'
import { MdOutlineAddShoppingCart } from "react-icons/md";


const Table = ({header,data,startIndex,endIndex,addClick,orderClick,getSalonProductsPress}) => {


  return (
    <>
        <table className="styled-table" style={{ height: "40px" }}>
              <thead>
                <tr>
                  <th>{header.name}</th>
                  <th>{header.mrp}</th>
                  <th>{header.sp}</th>
                  <th>{header.type}</th>
                  <th>{header.brand}</th>
                  <th>{header.add}</th>
                  <th>{header.order}</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(startIndex, endIndex).map((item, index) => (
                  <tr key={index}  onClick={() => getSalonProductsPress(item)}>
                    <td>{item.name}</td>
                    <td>{item.mrp}</td>
                    <td>{item.price}</td>
                    <td>{item.type}</td>
                    <td>{item.brand}</td>
                    <td>
                      <div
                        style={{
                          background: "transparent",
                          borderRadius: "10px",
                          height: "35px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor:"pointer"
                        }}
                         onClick={() => addClick(item)}
                      >
                        <p
                          style={{
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                         <BiSolidAddToQueue className="text-xl font-bold text-black"/>
                        </p>
                      </div>
                    </td>
                    <td>
                    <div
                        style={{
                          background: "transparent",
                          borderRadius: "10px",
                          height: "35px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor:"pointer"
                        }}
                         onClick={() => orderClick(item._id)}
                      >
                        <p
                          style={{
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                         <MdOutlineAddShoppingCart className="text-xl font-bold text-black"/>
                        </p>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
    </>
  )
}

export default Table