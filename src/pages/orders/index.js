import { useEffect, useState } from "react";
import { getApiCall } from "../../utils/services";
import ProductOrderPopup from "../../components/popup/ProductOrderPopup";
import { useNavigate } from "react-router-dom";
import { MdDriveFolderUpload, MdOutlineDriveFolderUpload, MdOutlineEdit, MdOutlineLocalPrintshop } from "react-icons/md";
import InvoiceUpload from "../../components/popup/InvoiceUpload";
import { LuFileImage } from "react-icons/lu";
import { AiOutlineSearch } from "react-icons/ai";
import NormalInput from "../../components/customInput/NormalInput";
import GridRows from "../../components/pagination/gridRows";
import Pagination from "../../components/pagination";

const Orders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [orderProductList, setOrderProductLsit] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [bool, setBool] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const filteredData = ordersList.filter((order) => order.poId === search || order.poId.toLowerCase().includes(search.toLowerCase()));
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );


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
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
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
            {paginatedData.map((item, index) => (
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
                      <MdOutlineEdit
                        className={` text-xl ${item.status === 1
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                          } `}
                        onClick={() => handleProductsPopup(item)}
                      />
                    ) : (
                      <MdOutlineLocalPrintshop
                        className={`text-xl cursor-pointer `}
                        onClick={() => handleInvoice(item)}
                      />
                    )}
                  </div>
                </td>
                <td
                >
                  <span className={`${item.status === 1 ? "text-primaryRed2" : "text-primaryGreen2"}`}>
                    {item.status === 1 ? "Pending" : "Received"}

                  </span>
                </td>
               
                  <td className="py-5">
                    <MdOutlineDriveFolderUpload
                      className={`text-xl text-center w-full   ${item.poInvoiceUrl ? "cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={() => {
                        if (!item.poInvoiceUrl) 
                           handleUpload(item)
                      }}
                    />
                  </td>
               
                <td className="py-5">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4 items-center">
          <GridRows
            totalItems={filteredData?.length}
            itemsPerPage={rowsPerPage}
            handleRowschange={handleChangeRowsPerPage}
          />
          <Pagination
            totalItems={filteredData?.length}
            itemsPerPage={rowsPerPage}
            currentPage={page}
            onPageChange={handleChangePage}
          />
        </div>
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
