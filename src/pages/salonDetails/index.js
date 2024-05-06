import React, { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { getApiCall, postApiData } from '../../utils/services';
import Layout from '../../components/Layout';
import { useDropzone } from 'react-dropzone';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const s3 = new AWS.S3({
  accessKeyId: 'AKIAYMT4VMYFJLJQD363',
  secretAccessKey: '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',
  region: 'ap-south-1',
});

const SalonDeatils = () => {
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [images, setImages] = useState([]);
  const [fileNames, setFileNames] = useState([]);

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
      const imageUrls = uploadedFiles.map((file) => file.Location);
      setImages(prevImages => [...prevImages, ...imageUrls]);
      setFileNames(prevFileNames => [...prevFileNames, ...acceptedFiles.map((file) => file.name)]);
    } catch (error) {
        console.error('Error uploading files:', error);
    }
};
console.log("uploaded files:",images)

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  const handleSubmit=()=>{
    if (!address || !address2 || !contactNumber || !images) {
        toast.error("Enter all required details!");
        return;
      }
    const data = {
        address:address,
        address2: address2,
        contactNumber: contactNumber, 
        images: images

    }
    postApiData("parlor/editParlorDetails",data,
    (resp)=>{
        toast.success("Details has been Submitted!");
        setAddress("")
        setAddress2("")
        setContactNumber("")
        setImages([])
        setFileNames([])
    },
    (error)=>{
        toast.error("Something went wrong!");
    }
)
  }

  return (
    <Layout>
      <div className='mt-32 w-1/3 my-10 h-auto mx-auto '>
        <div className='bg-white p-4 rounded-xl '>
          <div className='flex justify-between font-bold items-center'>
            <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>Enter your salon details</h1>
          </div>
          <div className='grid w-full items-center'>
            <label htmlFor='name'>
              <span className='font-bold text-md'>Address :</span>
            </label>
            <input type='text' placeholder='Address' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={address} onChange={(e) => setAddress(e.target.value)} />
            <label htmlFor='name'>
              <span className='font-bold text-md'>Address 2 :</span>
            </label>
            <input type='text' placeholder='Address 2' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={address2} onChange={(e) => setAddress2(e.target.value)} />
            <label htmlFor='text'>
              <span className='font-bold text-md'>contactNumber :</span>
            </label>
            <input type='text' placeholder='contactNumber' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            <label htmlFor='text'>
              <span className='font-bold text-md'>images :</span>
            </label>
            <div {...getRootProps()} className='dropzone'>
              <input {...getInputProps({ multiple: true })} />
              <p className='border-2 border-gray-500 my-3 px-4 py-2 rounded-lg '>Drag 'n' drop file here, or click to select file</p>
              <ul>
                {fileNames.map((fileName, index) => (
                  <li key={index}>{fileName}</li>
                ))}
              </ul>
            </div>
          </div>
          <button className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `} onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </Layout>
  );
};

export default SalonDeatils;
