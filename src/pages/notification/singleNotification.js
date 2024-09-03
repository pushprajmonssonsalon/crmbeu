import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { AiFillNotification } from "react-icons/ai";
import { useParams } from "react-router";
import { formatDateToFull, getApiCall } from "../../utils/services";

const SingleNotification = () => {
    const params =useParams();
    const {id}=params
    const [notification,setNotification]=useState({

    })
    useEffect(() => {
        (() => {
          getApiCall(
            `notification/getSingleNoticationForCrm/${id}`,
            (res) => {
              setNotification(res)
            },
            (err) => {
              console.log(err);
            }
          );
        })();
      }, []);
  return (
    <>
      <Layout>
        <div className="p-8 md:p-16 mt-48 mb-9 border rounded-lg border-gray-300/75 overflow-y-auto bg-white shadow-sm xl:mt-32 w-[95%] mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <AiFillNotification className="text-green-700 w-[40px]" size={25} />
            <h2 className="text-start font-normal text-xl text-black">
{
    notification?.title
}            </h2>
            </div>
          <div className="flex w-[150px] items-center gap-3">
          {formatDateToFull(notification?.createdAt)}
            </div>

          </div>
          <div className="  w-full h-full py-9 mx-auto ">
            <div className="bg-gray-100 py-12 h-full w-full">
              <div className="w-[80%] md:w-[70%] p-6 h-full text-gray-500  text-pretty bg-white mx-auto">
               {notification?.message}
              
               
             
                
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SingleNotification;
