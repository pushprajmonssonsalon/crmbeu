import { FiMessageSquare } from "react-icons/fi";
import { IoIosMail, IoIosMailOpen, IoIosNotifications } from "react-icons/io";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import NormalPagination from "../../components/pagination/normalPagination";
import { formatDateToFull, getApiCall } from "../../utils/services";
import { useNavigate } from "react-router";

const Notification = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, settotalItems] = useState(0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    (() => {
      getApiCall(
        `notification/getNoticationsForCrm?page=${currentPage}&limit=${itemsPerPage}`,
        (res) => {
          setNotifications(res.data);
          settotalItems(res.total);
        },
        (err) => {
          
        }
      );
    })();
  }, [currentPage, itemsPerPage]);
  const itemsOptions = [
    {
      name: "5",
      value: 5,
    },
    {
      name: "10",
      value: 10,
    },
    {
      name: "20",
      value: 20,
    },
    {
      name: "50",
      value: 50,
    },
    {
      name: "100",
      value: 100,
    },
  ];
  return (
    <>
      <div className="mt-48 shadow-md xl:mt-32 w-[95%] mx-auto">
        <div className="flex border border-b-0 border-gray-300/75  bg-gray-300 p-3 rounded-t-lg  text-black items-center gap-3 ">
          <IoIosNotifications size={25} />

          <h2 className="font-medium  text-2xl">Notifications</h2>
        </div>
        {notifications.length > 0 && (
          <div className="border border-gray-300/75 bg-gray-200 ">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-6 md:flex-row items-center justify-between w-full py-6 border border-b-gray-300/75   px-3">
                <div className="flex text-black font-semibold gap-1 justify-center">
                  <h2>{totalItems} </h2>
                  <h2>Notification </h2>
                </div>
                <div className="text-sm flex items-center gap-6">
                  <div className="flex gap-2 w-[180px] items-center">
                    <div className="flex gap-1 items-center">
                      <div>Showing </div>
                      <div>
                        {(currentPage - 1) * itemsPerPage + 1} -
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                      </div>
                    </div>
                    <div> of {totalItems}</div>
                  </div>
                  <div>
                    <select
                      value={itemsPerPage}
                      className="border-none outline-none text-black bg-transparent w-[66px]"
                      onChange={(e) => setItemsPerPage(e.target.value)}
                    >
                      {itemsOptions?.map((item, id) => {
                        const { name, value } = item;
                        return <option value={value}>{name}</option>;
                      })}
                    </select>
                  </div>
                  <div className=" w-[100px] ">
                    <NormalPagination
                      itemsPerPage={itemsPerPage}
                      totalItems={totalItems}
                      onPageChange={handlePageChange}
                      currentPage={currentPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="max-h-[calc(100vh-400px)] xl:max-h-[calc(100vh-300px)] overflow-y-auto">
          {notifications?.length > 0 &&
            notifications?.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => navigate(item._id)}
                  className={` ${
                    item.read
                      ? "text-black/40 bg-gray-300/70 "
                      : "text-black/70"
                  } flex justify-around cursor-pointer  items-center p-3 border border-neutral-400/30 hover:border-neutral-400/60 hover:shadow-md border-b-0 last:border-b  transition-colors duration-100`}
                >
                  <div className="flex gap-6">
                    <FiMessageSquare className=" w-[50px]" size={20} />
                  </div>
                  <div className=" font-medium text-sm w-full max-w-[calc(100%-380px)] overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.message}
                  </div>

                  <div className="flex items-center gap-9">
                    <div className="text-xs w-[150px]">
                      {formatDateToFull(item?.createdAt)}
                    </div>
                    <div>
                      {item.read ? (
                        <IoIosMailOpen
                          className="text-green-700 w-[40px]"
                          size={18}
                        />
                      ) : (
                        <IoIosMail
                          className="text-red-800 w-[40px]"
                          size={18}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="bg-gray-300 p-4 w-full rounder-b-lg "></div>
      </div>
    </>
  );
};

export default Notification;
