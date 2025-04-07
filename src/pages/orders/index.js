import { useEffect, useState } from "react";
import { getApiCall } from "../../utils/services";
import { FaEdit } from "react-icons/fa";
import ProductOrderPopup from "../../components/popup/ProductOrderPopup";
import { IoPrintSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdDriveFolderUpload } from "react-icons/md";
import InvoiceUpload from "../../components/popup/InvoiceUpload";
import { LuFileImage } from "react-icons/lu";
import { AiOutlineSearch } from "react-icons/ai";
import NormalInput from "../../components/customInput/NormalInput";

const Orders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [orderProductList, setOrderProductLsit] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [bool, setBool] = useState(false);
  const [search, setSearch] = useState("");
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
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // const filteredOrders = ordersList.filter((order) =>
    //   order.poId.toLowerCase().includes(e.target.value.toLowerCase())
    // );
    // setOrdersList(filteredOrders);
  }
  const handleUpload = (item) => {
    setOrderId(item._id);
    setIsUpload(true);
  };
  return (
    <>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Purchase Orders</h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">{ordersList?.length} Orders</span>


          </div>
          <div className="relative flex items-center">
              <AiOutlineSearch className="absolute text-lg text-lightGray left-[10px]" />
              <NormalInput
                name="name"
                inputStyles={{
                  'width': "280px",
                  borderRadius: "16px",
                  padding: "5px 40px",
                  fontSize: "14px",
                  borderColor: "#D9D9D9"
                }}
                value={search}
                placeholder="Search by PO Id"
                onChange={handleSearchChange}
              />
            </div>
        </div>


        {/* Table of Recent Orders */}
        <table
          className="styled-table order-table"
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
                <td className="py-5">{item?.poId}</td>
                <td className="py-5">{FormatDate(item.createdAt)}</td>
                <td className="py-5">{FormatDate(item?.updatedAt)}</td>
                <td className="py-5">
                  {item.brand}- {item.type}
                </td>
                <td className="py-5">{item.products.length}</td>

                <td className="py-5">
                  <div className="flex gap-4">
                    {item.status === 1 ? (
                      <FaEdit
                        className={`text-black text-xl ${item.status === 1
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
                  className={`font-semibold text-sm ${item.status === 1 ? "text-red-500" : "text-green-600"
                    } `}
                >
                  {item.status === 1 ? "Pending" : "Received"}
                </td>
                {item?.poInvoiceUrl ? (
                  <td className="py-5">
                    <MdDriveFolderUpload className="text-xl text-center w-full text-green-700 cursor-not-allowed" />
                  </td>
                ) : (
                  <td className="py-5">
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
