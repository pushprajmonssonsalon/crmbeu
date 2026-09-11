import { useEffect, useState } from "react";
import { postApiData } from "../../utils/services";
import DistributerReceivePopup from "../../components/popup/DistributerReceivePopup";
import { MdOutlineEdit } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import NormalInput from "../../components/customInput/NormalInput";
import GridRows from "../../components/pagination/gridRows";
import Pagination from "../../components/pagination";

const iconClass = "h-[18px] w-[18px] sm:h-5 sm:w-5 lg:h-[22px] lg:w-[22px]";
const actionBtnClass =
  "shrink-0 grid place-items-center h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-transparent transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95";

// dbPurchaseOrder.status: 1-Placed, 2-Received, 3-Canceled, 4-Accepted,
// 5-Packaging, 6-Dispatch, 7-Waiting for Payment
const STATUS_LABEL = {
  1: "Placed",
  2: "Received",
  3: "Canceled",
  4: "Accepted",
  5: "Packaging",
  6: "Dispatched",
  7: "Waiting For Payment",
};

const statusClass = (status) => {
  if (status === 2) return "text-primaryGreen2";
  if (status === 3) return "text-primaryRed2";
  return "text-primaryRed2";
};

const DistributerOrders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [orderProductList, setOrderProductList] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [bool, setBool] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const onClose = () => setIsVisible(false);

  useEffect(() => {
    postApiData(
      "distributerPo/getPurchaseOrders",
      {},
      (res) => setOrdersList(res || []),
      () => setOrdersList([])
    );
  }, [bool]);

  function FormatDate(date) {
    if (!date) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  }

  const filteredData = ordersList.filter((order) =>
    (order?.poId || "").toLowerCase().includes(search.toLowerCase())
  );
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleProductsPopup = (item) => {
    setOrderProductList(item?.products || []);
    setOrderId(item._id);
    setIsVisible(true);
  };

  return (
    <>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-5 flex-wrap">
            <h2 className="text-black text-start font-normal text-[22px] leading-[28px]">
              Purchase Orders
            </h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">
              {ordersList?.length} Orders
            </span>
          </div>
          <div className="relative flex items-center w-full md:w-auto">
            <AiOutlineSearch className="absolute text-lg text-lightGray left-[10px]" />
            <NormalInput
              name="name"
              inputStyles={{
                width: "280px",
                maxWidth: "100%",
                borderRadius: "16px",
                padding: "5px 40px",
                fontSize: "14px",
                borderColor: "#D9D9D9",
              }}
              value={search}
              placeholder="Search by PO Id"
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="styled-table order-table">
            <thead>
              <tr>
                <th>Po id</th>
                <th>Order Date</th>
                <th>Receive Date</th>
                <th>Category</th>
                <th>Total Ordered Items</th>
                <th>Order Total</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td className="py-5">{item?.poId}</td>
                  <td className="py-5">{FormatDate(item?.createdAt)}</td>
                  <td className="py-5">{FormatDate(item?.receivedDate)}</td>
                  <td className="py-5">
                    {item?.brand}- {item?.type}
                  </td>
                  <td className="py-5">{item?.products?.length}</td>
                  <td className="py-5">{item?.orderTotal}</td>
                  <td className="py-5">
                    <div className="flex w-fit flex-nowrap items-center gap-1 sm:gap-2">
                      {/* Receive is only offered while the PO is still open. */}
                      {item.status !== 2 && item.status !== 3 && (
                        <button
                          type="button"
                          className={actionBtnClass + " text-secondaryGreen"}
                          aria-label="Receive order"
                          onClick={() => handleProductsPopup(item)}
                        >
                          <MdOutlineEdit className={iconClass} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={statusClass(item.status)}>
                      {STATUS_LABEL[item.status] || "Placed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between mt-4 items-center gap-2">
          <GridRows
            totalItems={filteredData?.length}
            itemsPerPage={rowsPerPage}
            handleRowschange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(1);
            }}
          />
          <Pagination
            totalItems={filteredData?.length}
            itemsPerPage={rowsPerPage}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>

      <DistributerReceivePopup
        isVisible={isVisible}
        onClose={onClose}
        data={orderProductList}
        orderId={orderId}
        bool={bool}
        setBool={setBool}
      />
    </>
  );
};

export default DistributerOrders;
