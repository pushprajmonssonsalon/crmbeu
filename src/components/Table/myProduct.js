import React from 'react'
import { BiSolidAddToQueue } from 'react-icons/bi'

const MyProductTable = ({data,startIndex,endIndex,getSalonProductsPress}) => {
    return (
        <>
            <table className="styled-table" style={{ height: "40px" }}>
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>QUANTITY</th>
                      <th>PRICE</th>
                      <th>BRAND</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(startIndex, endIndex).map((item, index) => (
                      <tr key={index}  onClick={() => getSalonProductsPress(item)}>
                      <td>{item.products.name}</td>
                        <td>{item.products.stockQuantity}</td>
                        <td>{item.products.price}</td>
                        <td>{item.products.brand}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
        </>
      )
}

export default MyProductTable