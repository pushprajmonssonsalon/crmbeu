import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { getApiCall } from '../../utils/services'
import { FaEdit } from 'react-icons/fa'
import ProductOrderPopup from '../../components/popup/ProductOrderPopup'
import { IoPrintSharp } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const Orders = () => {
    const [ordersList,setOrdersList] = useState([])
    const [orderProductList,setOrderProductLsit] = useState([])
    const [isVisible,setIsVisible] = useState(false)
    const [orderId,setOrderId] = useState('');

    const navigate = useNavigate();
    const onClose =()=>{
      setIsVisible(false)
    }
    useEffect(()=>{
        getApiCall(
            "purchaseorder/getPurchaseOrders",
            (res)=>{
                console.log("orders ki list",res)
                setOrdersList(res)
            },(error)=>{
                console.log(error)
            }
        )
    },[ordersList])
    console.log({ordersList})

    function FormatDate(date) {
        const dates = new Date(date)
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(dates);
      
        return formattedDate;
      }

      const handleProductsPopup = (item) =>{
        setOrderProductLsit(item?.products);
        setOrderId(item._id)
        setIsVisible(true)
      }
      console.log("all order product list", orderProductList)

      
      console.log("order id",orderId)

      const handleInvoice=(item)=>{
        navigate('/orderinvoice',{state: item})
      }


  return (
    <Layout>
        <div>
            <h1 className='text-center text-green-600 font-bold text-5xl mt-32'>Your Orders</h1>

            {/* Table of Recent Orders */}
            <table className="styled-table" style={{ height: "40px", marginTop:"60px" }}>
              <thead>
                <tr>
                <th>Order Date</th>
                <th>Receive Date</th>
                  <th>Category</th>
                  <th>Total Ordered Items</th>
                  {/* <th>Quantity</th> */}
                  {/* <th>Type</th>
                  <th>Brand</th> */}
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.map((item, index) => (
                  <tr key={index} >
                  <td>{FormatDate(item.createdAt)}</td>
                  <td>{FormatDate(item?.updatedAt)}</td>
                    <td>{item.brand}- {item.type}</td>
                    <td>{item.products.length}</td>
                    {/* <td>{item.products}</td> */}
                    {/* <td>{item.type}</td>
                    <td>{item.brand}</td> */}
                    <td >
                        <div className='flex gap-4'>
                        {
                          item.status === 1 ? 
                        <FaEdit  className={`text-black text-xl ${item.status=== 1? 'cursor-pointer' :'cursor-not-allowed'} hover:text-gray-500`} onClick={()=>handleProductsPopup(item)}/>
                        :
                      
                        <IoPrintSharp className={`text-green-600 text-xl cursor-pointer hover:text-green-950`} onClick={()=>handleInvoice(item)} />

                        }
                        {/* <FaCircleCheck className="text-green-600 text-xl cursor-pointer hover:text-green-800"/> */}
                        </div>
                    </td>
                    <td className={`font-semibold text-sm ${item.status === 1 ?  'text-red-500' : 'text-green-600'} `}>{item.status === 1 ? "Pending" : "Received"}</td>
                    
                  
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        <ProductOrderPopup isVisible={isVisible} onClose={onClose} data={orderProductList} orderId={orderId}/>
    </Layout>
  )
}

export default Orders