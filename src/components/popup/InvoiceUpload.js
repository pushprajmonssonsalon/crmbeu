import { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { getApiCall } from '../../utils/services';
import axios from 'axios';
import { MdCancel } from "react-icons/md";

const InvoiceUpload = ({ isVisible, onClose, orderId }) => {

  const [pdfNames, setPdfNames] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [OrdersList, setOrdersList] = useState([])
  const [cancel, setCancel] = useState(false)
  const token = localStorage.getItem("token");

  useEffect(() => {
    getApiCall(
      "purchaseorder/getPurchaseOrders",
      (res) => {

        setOrdersList(res)


      }, (error) => {

      }
    )
  }, [isVisible, imageFiles, cancel])
  const handleFileChange = async (e) => {
    setImageFiles(e.target.files[0]);
    let imageData = e.target.files[0];
    const formData = new FormData();
    formData.append("image", imageData);
    // formData.append("fileId", fileId);
    formData.append("fieldId", orderId);
    // 

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

        // setImages(response.data.data);
        getApiCall(
          "purchaseorder/getPurchaseOrders",
          (res) => {

            setOrdersList(res)


          }, (error) => {

          }
        )

      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onSubmit = () => {


  };

  if (!isVisible) return null;
  const handleCancelImages = async (id, url) => {
    const data = {
      id: id,
      url: url
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
    if (response) {
      setCancel(!cancel)
    }
  };

  return (
    <div className='fixed z-30 inset-0 bg-black/20 top-0 left-0 '>
      <div className=' w-[85%] sm:w-[350px] md:w-[450px] bg-white p-4 rounded-xl relative top-[10%] bottom-[10%]   mx-auto max-h-[calc(100%-150px)] overflow-y-auto overflow-x-hidden'>
        <div className=''>
          <div className='flex justify-between items-center mb-6'>
            <h1 className={`text-2xl text-black `}>Upload Your Invoice</h1>
            <button className='text-black text-xl' onClick={onClose}><MdOutlineClose /></button>

          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>


            {
              OrdersList?.map((item, index) => {
                if (item._id === orderId) {
                  return item.invoiceImg.map((img, imgIndex) => {
                    return (
                      <>
                        <img key={imgIndex} src={img} style={{ height: 120, width: 120 }} />
                        <MdCancel

                          onClick={() => handleCancelImages(item?._id, img)}
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
              <span className='text-md'>Invoice:</span>
            </label>
            <input
              type='file'
              id='image'
              accept='image/*'
              onChange={handleFileChange}
            // multiple
            />
            <div className='mt-4'>
              <h2 className=''>Selected Files:</h2>
              <ul className='flex flex-wrap gap-2'>
                {pdfNames.map((name, index) => (
                  <li key={index} className='text-gray-600'>{name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 mt-6">
            <button
              className="rounded-[5px] w-[120px] text-sm  border border-ternary text-ternary py-[5px] px-[24px]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceUpload;
