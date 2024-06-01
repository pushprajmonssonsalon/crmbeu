import React, { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md';
import { useDropzone } from 'react-dropzone';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import toast from 'react-hot-toast';
import { postApiData } from '../../utils/services';

const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY ,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY ,
  region: process.env.REACT_APP_AWS_REGION ,
});
const InvoiceUpload = ({isVisible,onClose,orderId}) => {

    
  const [pdfNames, setPdfNames] = useState('');
  const [pdfUrls, setPdfUrls] = useState('')
    const handleDrop = async (acceptedFiles) => {
        const uniqueId = uuidv4()
        const promises = acceptedFiles.map((file) => {
            const params = {
              Bucket: 'tphpdfs',
              Key: `uploaded/${uniqueId}/${file.name}`,
              Body: file,
          };
          return s3.upload(params).promise();
        });
    
        try {
          const uploadedFiles = await Promise.all(promises);
           const fileUrl = uploadedFiles.map((file) => file.Location);
          setPdfUrls(fileUrl);
          setPdfNames(acceptedFiles.map((file) => file.name));
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };
    console.log("uploaded files:",pdfUrls)
    const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });
    const onSubmit=()=>{
      
      const data = {
          poInvoiceUrl: pdfUrls[0],
          id: orderId
      };
      postApiData("purchaseorder/editPurchaseOrder",
      data,
      (resp)=>{
          console.log("orders resp",resp)
          toast.success("Order Has been Placed Successfully!")
          onClose()
          setPdfNames("")
          setPdfUrls("")
      },
      (error)=>{
          console.log("Something went wrong", error)
          toast.error("Somting went wrong!!")
      }
      )
      
    }
    if(!isVisible) return null;
    return (
        <div className='fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
    <div className='absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-auto'>

        <div className='bg-white p-4 rounded-xl '>
            <div className='flex justify-between font-bold items-center'>
            <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>Upload your invoice</h1>
            <button className='text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent' onClick={()=>onClose()}><MdOutlineClose /></button>

            </div>

            <div className='grid w-full items-center'>
           
            <label htmlFor='text'>
              <span className='font-bold text-md'>Invoice :</span>
            </label>
            <div {...getRootProps()} className='dropzone'>
              <input {...getInputProps({ multiple: true })} />
              <p className='border-2 border-gray-500 my-3 px-4 py-2 rounded-lg cursor-pointer'>Drag 'n' drop file here, or click to select files</p>
              <ul>
                {pdfNames}
              </ul>
            </div>
          </div>
          <button className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `} onClick={onSubmit}>Submit</button>
            

        </div>

        

    </div>

</div>
  )
}

export default InvoiceUpload