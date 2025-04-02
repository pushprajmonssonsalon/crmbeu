import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { AiFillNotification } from "react-icons/ai";
import { useParams } from "react-router";
import { formatDateToFull, getApiCall } from "../../utils/services";

const SingleNotification = () => {
  const params = useParams();
  const { id } = params;
  const [notification, setNotification] = useState({});
  useEffect(() => {
    (() => {
      getApiCall(
        `notification/getSingleNoticationForCrm/${id}`,
        (res) => {
          setNotification(res);
        },
        (err) => {
          
        }
      );
    })();
  }, []);
  return (
    <>
     
        <div className="border rounded-lg border-gray-300/75 overflow-y-auto bg-white shadow-sm w-full mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <AiFillNotification
                className="text-green-700 w-[40px]"
                size={25}
              />
              <h2 className="text-start font-normal text-xl text-black">
                {notification?.title}{" "}
              </h2>
            </div>
            <div className="flex w-[150px] items-center gap-3">
              {formatDateToFull(notification?.createdAt)}
            </div>
          </div>
          <div className="  w-full h-full py-9 mx-auto ">
            <div className="bg-gray-100 py-12 h-full w-full">
              <div className="flex items-center justify-center ">
                <div className="flex flex-col w-full max-w-md leading-1.5 p-4 border-gray-200 bg-white rounded-e-xl rounded-es-xl ">
                  <p className="text-sm font-normal py-2.5 text-gray-900 ">
                    {notification?.message}
                  </p>
                  <span className="text-sm font-normal text-gray-500 ">
                    Recieved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
     
    </>
  );
};

export default SingleNotification;
