import React, { useEffect, useState } from 'react';
import { getApiCall, postApiData } from '../../utils/services';
import AWS from 'aws-sdk';
import toast from 'react-hot-toast';
import { MdCancel } from "react-icons/md";
import axios from 'axios';
import NormalInput from '../../components/customInput/NormalInput';
const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const SalonDeatils = () => {
  const [address, setAddress] = useState('');
  const [gst, setGst] = useState('');
  const [tradename, setTradeName] = useState('');
  const [email, setEmail] = useState('');
  const [owner, setOwner] = useState('');
  const [openDate, setOpenDate] = useState('');
  const [state, setState] = useState('');
  const [address2, setAddress2] = useState('');
  const [del, setDel] = useState(false)
  const [bool, setBool] = useState(false)
  const [contactNumber, setContactNumber] = useState('');
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageKey, setImageKey] = useState('');
  const [fileNames, setFileNames] = useState([]);
  const [parlorDetails, setParlorDetails] = useState([]);

  const token = localStorage.getItem("token");
  const handleFileChange = async (e) => {
    setImageFile(e.target.files[0]);

    let imageData = e.target.files[0]
    const formData = new FormData();
    formData.append('image', imageData);


    try {
      // const response = await fetch('http://192.168.2.19:4002/upload', {
      //   method: 'POST',
      //   body: formData,
      // });

      // if (response.ok) {
      //   
      //   // alert('Image uploaded successfully');
      //   setImageKey(imageData.name); 
      // } else {
      //   alert('Failed to upload image');
      // }
      // http://192.168.2.19:4002
      // https://crm.smartsalon.in
      const response = await axios.post("https://crm.smartsalon.in/upload", formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response) {

        setImages((prevUrls) => [...prevUrls, response.data.data]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };





  //   const handleDrop = async (acceptedFiles) => {
  //     const data = {
  //       id: parlorDetails._id,
  //       image: acceptedFiles
  //     }
  //     postApiData("/upload",data,
  //       (resp)=>{
  //         
  //       },(error)=>{
  //         
  //       }
  //     )
  //     // const uniqueId = uuidv4()
  //     // const promises = acceptedFiles.map((file) => {
  //     //   const params = {
  //     //       Bucket: 'tphpdfs',
  //     //       Key: `uploaded/${uniqueId}/${file.name}`,
  //     //       Body: file,
  //     //   };
  //     //   return s3.upload(params).promise();
  //     // });

  //     // try {
  //     //   const uploadedFiles = await Promise.all(promises);
  //     //   const imageUrls = uploadedFiles.map((file) => file.Location);
  //     //   setImages(prevImages => [...prevImages, ...imageUrls]);
  //     //   setFileNames(prevFileNames => [...prevFileNames, ...acceptedFiles.map((file) => file.name)]);
  //     // } catch (error) {
  //     //     console.error('Error uploading files:', error);
  //     // }
  // };


  // const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });
  useEffect(() => {
    getApiCall(
      "parlor/getParlorDetail",
      (resp) => {

        setParlorDetails(resp);
        // parlorDetails(resp);
      },
      (error) => {

      }
    );
  }, [bool, del]);
  useEffect(() => {
    setImages(parlorDetails?.images)
  }, [parlorDetails])

  const handleSubmit = () => {

    const data = {
      gstNumber: gst,
      stateName: state,
      address: address,
      address2: address2,
      contactNumber: contactNumber,
      images: images,
      email: email,
      trade: tradename,
      owner: owner,
      live: openDate
    }
    postApiData("parlor/editParlorDetails", data,
      (resp) => {
        toast.success("Details has been Submitted!");

        setAddress("")
        setAddress2("")
        setContactNumber("")
        setImages([])
        setFileNames([])
        setBool(!bool)
      },
      (error) => {
        toast.error("Something went wrong!");
        // 
      }
    )
  }

  const handleCancelImages = (index) => {
    images.splice(index, 1);
    setImages([...images]);
    handleSubmit()
  }
  const formFields = [
    {
      label: 'Salon Category',
      placeholder: 'Name',
      value: parlorDetails.name,
      disabled: true,
    },
    {
      label: 'Location',
      placeholder: 'Address',
      value: parlorDetails.address,
      onChange: (e) => setAddress(e.target.value),
    },
    {
      label: 'Address',
      placeholder: 'Address 2',
      value: parlorDetails.address2,
      onChange: (e) => setAddress2(e.target.value),
    },
    {
      label: 'State',
      placeholder: 'State',
      value: parlorDetails.stateName,
      onChange: (e) => setState(e.target.value),
    },
    {
      label: 'Contact Number',
      placeholder: 'Contact Number',
      value: parlorDetails.contactNumber,
      onChange: (e) => setContactNumber(e.target.value),
    },
    {
      label: 'GST Number',
      placeholder: 'GST Number',
      value: parlorDetails.gstNumber,
      onChange: (e) => setGst(e.target.value),
    },
    {
      label: 'Trade Name',
      placeholder: 'Trade Name',
      value: parlorDetails.trade,
      onChange: (e) => setTradeName(e.target.value),
    },
    {
      label: 'Email',
      placeholder: 'Email',
      value: parlorDetails.email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      label: 'Owner Name',
      placeholder: 'Owner Name',
      value: parlorDetails.owner,
      onChange: (e) => setOwner(e.target.value),
    },
    {
      label: 'Salon Operational Date',
      placeholder: 'Salon Operational Date',
      value: parlorDetails.live,
      onChange: (e) => setOpenDate(e.target.value),
    },
  ];


  return (
    <>
      <h2 className="text-black text-start mb-5 font-normal text-[22px] leading-[28px]">Edit your salon details</h2>



      <div className=" rounded-[16px] border border-primaryGray p-5  ">

        <div className=' '>

          <div className='grid grid-cols-2 gap-y-2 w-full items-center'>
            {formFields.map((field, index) => (
              <React.Fragment key={index}>
               
                <NormalInput
                  type='text'
                  name={`field-${index}`}
                  label={field.label}
                  lableStyles={{
                    fontWeight:'400',
                    fontSize:'16px',
                  }}
                  inputStyles={{
                    border:"none"
                  }}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={field.disabled}
                />
                {/* <input
                  type='text'
                  id={`field-${index}`}
                  placeholder={field.placeholder}
                  className='rounded-lg border-none bg-white placeholder:font-semibold'
                  value={field.value}
                  defaultValue={field.defaultValue}
                  onChange={field.onChange}
                  disabled={field.disabled}
                /> */}
              </React.Fragment>
            ))}

            {/* Static Image Input */}
            <label htmlFor='image'>
              <span className='text-lg'>Images:</span>
            </label>
            <input
              type='file'
              id='image'
              accept='image/*'
              onChange={handleFileChange}
              
              className="bg-gray-50 min-w-sm capitalize border-none text-black text-sm rounded-lg   py-[12px] px-[27px]  "
              />
           
            {/* <div {...getRootProps()} className='dropzone'>
              <input {...getInputProps({ multiple: true })} />
              <p className='border-2 border-gray-500 my-3 px-4 py-2 rounded-lg bg-white'>Drag 'n' drop multiple images here, or click to select multiple images</p>
              <p className='text-black'>maximum size of 2mb</p>
              <ul>
                {fileNames.map((fileName, index) => (
                  <li key={index}>{fileName}</li>
                ))}
              </ul>
            </div> */}
          </div>
          <div className='flex mt-5 items-center justify-end'>
          <button className="bg-black  text-white rounded-[16px] w-[190px] text-sm font-normal " onClick={handleSubmit}>Submit</button>

          </div>
        </div>
        <div className='flex justify-evenly items-center flex-wrap w-full'>
          {
            parlorDetails?.images?.map((image, index) => (
              <div className='w-1/4 h-[150px] relative'>
                <img src={image} alt="img" className='w-full h-full bg-cover' />
                <MdCancel className='absolute text-2xl text-black top-0 right-0 cursor-pointer' onClick={() => handleCancelImages(index)} />


              </div>
            ))
          }
        </div>
      </div>
    </>
  );
};

export default SalonDeatils;
