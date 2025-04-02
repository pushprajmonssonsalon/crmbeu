import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getApiCall } from "../../utils/services";
import { FaEdit } from "react-icons/fa";
import ProductOrderPopup from "../../components/popup/ProductOrderPopup";
import { IoPrintSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdDriveFolderUpload } from "react-icons/md";
import InvoiceUpload from "../../components/popup/InvoiceUpload";
import { LuFileImage } from "react-icons/lu";

const Orders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [orderProductList, setOrderProductLsit] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [bool, setBool] = useState(false);

  const navigate = useNavigate();
  const onClose = () => {
    setIsVisible(false);
  };
  const onUploadClose = () => {
    setIsUpload(false);
  };
  useEffect(() => {
    getApiCall(
      "purchaseorder/getPurchaseOrders",
      (res) => {
        
        setOrdersList(res);
      },
      (error) => {
        
      }
    );
  }, [bool]);
  

  function FormatDate(date) {
    const dates = new Date(date);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDate = formatter.format(dates);

    return formattedDate;
  }

  const handleProductsPopup = (item) => {
    setOrderProductLsit(item?.products);
    setOrderId(item._id);
    setIsVisible(true);
  };
  const handleInvoice = (item) => {
    navigate("/orderinvoice", { state: item });
  };
  const handleUpload = (item) => {
    setOrderId(item._id);
    setIsUpload(true);
  };
  return (
    <>
      <div>
        <h1 className="text-center text-green-600 font-bold text-5xl ">
          Your Orders
        </h1>

        {/* Table of Recent Orders */}
        <table
          className="styled-table"
        >
          <thead>
            <tr>
            <th>Po id</th>
              <th>Order Date</th>
              <th>Receive Date</th>
              <th>Category</th>
              <th>Total Ordered Items</th>
              <th>Action</th>
              <th>Status</th>
              <th>Upload Invoice</th>
              <th>Pod Download</th>
            </tr>
          </thead>
          <tbody>
            {ordersList.map((item, index) => (
              <tr key={index}>
                     <td>{item?.poId}</td>
                <td>{FormatDate(item.createdAt)}</td>
                <td>{FormatDate(item?.updatedAt)}</td>
                <td>
                  {item.brand}- {item.type}
                </td>
                <td>{item.products.length}</td>
           
                <td>
                  <div className="flex gap-4">
                    {item.status === 1 ? (
                      <FaEdit
                        className={`text-black text-xl ${
                          item.status === 1
                            ? "cursor-pointer"
                            : "cursor-not-allowed"
                        } hover:text-gray-500`}
                        onClick={() => handleProductsPopup(item)}
                      />
                    ) : (
                      <IoPrintSharp
                        className={`text-green-600 text-xl cursor-pointer hover:text-green-950`}
                        onClick={() => handleInvoice(item)}
                      />
                    )}
                  </div>
                </td>
                <td
                  className={`font-semibold text-sm ${
                    item.status === 1 ? "text-red-500" : "text-green-600"
                  } `}
                >
                  {item.status === 1 ? "Pending" : "Received"}
                </td>
                {item?.poInvoiceUrl ? (
                  <td>
                    <MdDriveFolderUpload className="text-xl text-center w-full text-green-700 cursor-not-allowed" />
                  </td>
                ) : (
                  <td>
                    <MdDriveFolderUpload
                      className="text-xl text-center w-full text-blue-500 cursor-pointer"
                      onClick={() => handleUpload(item)}
                    />
                  </td>
                )}
                {item?.trackImg && (
                  <div class="flex justify-center items-center">
                    <a href="{{item.trackImg}}" download="blank.png">
                      <a href={item.trackImg} download="blank.png">
                        <LuFileImage
                          style={{
                            height: "25px",
                            width: "120px",
                            alignSelf: "center",
                            marginTop: 5,
                          }}
                        />
                      </a>
                    </a>
                  </div>

                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProductOrderPopup
        isVisible={isVisible}
        onClose={onClose}
        data={orderProductList}
        orderId={orderId}
        bool={bool}
        setBool={setBool}
      />
      <InvoiceUpload
        isVisible={isUpload}
        onClose={onUploadClose}
        orderId={orderId}
      />
    </>
  );
};

export default Orders;
