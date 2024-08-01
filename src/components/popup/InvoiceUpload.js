import React, { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { getApiCall, postApiData } from '../../utils/services';
import axios from 'axios';
import { MdCancel } from "react-icons/md";

const InvoiceUpload = ({ isVisible, onClose, orderId }) => {
  console.log("orderId",orderId)
  const [pdfNames, setPdfNames] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [OrdersList,setOrdersList]=useState([])
  const [cancel,setCancel]=useState(false)
  const token = localStorage.getItem("token");
  console.log("tokencoming",token)
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
},[isVisible,imageFiles,cancel])
  const handleFileChange = async (e) => {
    setImageFiles(e.target.files[0]);
    let imageData = e.target.files[0];
    const formData = new FormData();
    formData.append("image", imageData);
    // formData.append("fileId", fileId);
    formData.append("fieldId", orderId);
    // console.log("imageData------", imageData);

    try {
      const response = await axios.post(
        // 'https://crm.smartsalon.in/uploadPO',
        'https://crm.smartsalon.in/uploadPOInvoiceImg',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        console.log("resp------->", response.data.data);
        // setImages(response.data.data);
        getApiCall(
          "purchaseorder/getPurchaseOrders",
          (res)=>{
              console.log("orderlist",res)
              setOrdersList(res)
              
             
          },(error)=>{
              console.log(error)
          }
      )
      
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onSubmit = () => {
    console.log('onSubmit');

  };

  if (!isVisible) return null;
  const handleCancelImages = async (id,url) => {
    const data = {
      id: id,
      url:url
    };
    const response = await axios.post(
      "https://crm.smartsalon.in/purchaseorder/deletePOInvoiceImg",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if(response){
      setCancel(!cancel)
    }
  };

  return (
    <div className='fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
      <div className='absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-auto'>
        <div className='bg-white p-4 rounded-xl'>
          <div className='flex justify-between font-bold items-center'>
            <h1 className={`text-blue-500 text-lg font-bold mb-4`}>Upload your invoice</h1>
            <button className='text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent' onClick={onClose}>
              <MdOutlineClose />
            </button>
          </div>
          <div style={{display:'flex',flexWrap:'wrap'}}>

      
          {
  OrdersList?.map((item, index) => {
    if (item._id === orderId) {
      return item.invoiceImg.map((img, imgIndex) => {
        return (
          <>
          <img key={imgIndex} src={img} style={{ height: 120, width: 120 }} />
          <MdCancel
    
          onClick={() => handleCancelImages(item?._id,img)}
        />
        </>
        );
      });
    }
    return null; // Ensure a return value for all cases
  })
}
</div>
          <div>

          </div>
          <div className='grid w-full items-center'>
            <label htmlFor='text'>
              <span className='font-bold text-md'>Invoice:</span>
            </label>
            <input
              type='file'
              id='image'
              accept='image/*'
              onChange={handleFileChange}
              // multiple
            />
            <div className='mt-4'>
              <h2 className='font-bold'>Selected Files:</h2>
              <ul>
                {pdfNames.map((name, index) => (
                  <li key={index} className='text-gray-600'>{name}</li>
                ))}
              </ul>
            </div>
          </div>
          <button className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl`} onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceUpload;
