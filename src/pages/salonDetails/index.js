import React, { useEffect, useState } from 'react';
import { getApiCall, postApiData } from '../../utils/services';
import AWS from 'aws-sdk';
import toast from 'react-hot-toast';
import { MdCancel } from "react-icons/md";
import axios from 'axios';
import NormalInput from '../../components/customInput/NormalInput';
import { isSalonOwner } from '../../utils/auth';
const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const SalonDeatils = () => {
  const [editParlorDetails,setEditParlorDetails] = useState({})
  const [parlorLoaded, setParlorLoaded] = useState(false)
  const [savingCashback, setSavingCashback] = useState(false)
  const token = localStorage.getItem("token");
  const handleFileChange = async (e) => {

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
        setEditParlorDetails((prevDetails) => ({
          ...prevDetails,
          images: [...prevDetails.images, response.data.data],
        }));

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

        setEditParlorDetails(resp);
        setParlorLoaded(true);
        // parlorDetails(resp);
      },
      (error) => {

      }
    );
  }, []);
 
  const handleChange= (e) => {
    const { name, value } = e.target;
    setEditParlorDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }

  const handleSubmit = () => {
  const {gstNumber, stateName, contactNumber, images, email, trade, owner} = editParlorDetails
    const data = {
      gstNumber,
      stateName,
      contactNumber,
      images,
      email,
      trade,
      owner,
    }
    postApiData("parlor/editParlorDetails", data,
      (resp) => {
        toast.success("Details has been Submitted!");
      },
      (error) => {
        toast.error("Something went wrong!");
        // 
      }
    )
  }

  // Owner only (the backend re-checks). Earn rate is a percent 0-100 and
  // validity is a whole number of months, 0 meaning cashback never expires.
  const handleCashbackSubmit = () => {
    const { cashbackPercentage, cashbackValidity } = editParlorDetails;
    // Number("") is 0, so a cleared field must be caught before converting.
    const isBlank = (value) => value === undefined || value === null || String(value).trim() === "";
    const pct = Number(cashbackPercentage);
    const months = Number(cashbackValidity);

    if (isBlank(cashbackPercentage) || !Number.isFinite(pct) || pct < 0 || pct > 100) {
      toast.error("Enter a cashback percentage between 0 and 100");
      return;
    }
    if (isBlank(cashbackValidity) || !Number.isInteger(months) || months < 0) {
      toast.error("Enter validity as whole months (0 = never expires)");
      return;
    }

    setSavingCashback(true);
    postApiData(
      "parlor/updateCashbackSettings",
      {
        isCashback: Boolean(editParlorDetails.isCashback),
        cashbackPercentage: pct,
        cashbackValidity: months,
      },
      () => {
        setSavingCashback(false);
        toast.success("Cashback settings updated!");
      },
      (error) => {
        setSavingCashback(false);
        toast.error(
          error?.response?.data?.message || "Something went wrong!"
        );
      }
    );
  };

  const handleCancelImages = (index) => {
    setEditParlorDetails((prevDetails) => ({
      ...prevDetails,
      images: prevDetails.images.filter((_, i) => i !== index),
    }));
    handleSubmit()
  }
  const formFields = [
    {
      label: 'Salon Category',
      placeholder: 'Name',
      name: 'name',
      disabled: true,
    },
    {
      label: 'Location',
      placeholder: 'Address',
      name: 'address',
      disabled: true,
    },
    {
      label: 'Address',
      placeholder: 'Address 2',
      name: 'address2',
      disabled: true,
    },
    {
      label: 'State',
      placeholder: 'State',
      name: 'stateName',
      disabled: true,
    },
    {
      label: 'Contact Number',
      placeholder: 'Contact Number',
      name: 'contactNumber',
    },
    {
      label: 'GST Number',
      placeholder: 'GST Number',
      name: 'gstNumber',
    },
    {
      label: 'Trade Name',
      placeholder: 'Trade Name',
      name:'trade',

    },
    {
      label: 'Email',
      placeholder: 'Email',
      name: 'email',

    },
    {
      label: 'Owner Name',
      placeholder: 'Owner Name',
      name: 'owner',
    },
    {
      label: 'Salon Operational Date',
      placeholder: 'Salon Operational Date',
      disabled: true,
      name: 'live',
    },
  ];


  return (
    <>
      <h2 className="text-black text-start mb-5 font-normal text-[22px] leading-[28px]">Edit your salon details</h2>



      <div className=" rounded-[16px] border border-primaryGray p-5  ">

        <div className=' '>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-y-2 w-full items-center'>
            {formFields.map((field, index) => (
              <React.Fragment key={index}>
               
                <NormalInput
                  type='text'
                  name={field.name}
                  label={field.label}
                  lableStyles={{
                    fontWeight:'400',
                    fontSize:'16px',
                  }}
                  inputStyles={{
                    border:"none"
                  }}
                  placeholder={field.placeholder}
                  value={editParlorDetails[field.name] || ''}
                  onChange={handleChange}
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
            editParlorDetails?.images?.map((image, index) => (
              <div className='w-1/4 h-[150px] relative'>
                <img src={image} alt="img" className='w-full h-full bg-cover' />
                <MdCancel className='absolute text-2xl text-black top-0 right-0 cursor-pointer' onClick={() => handleCancelImages(index)} />


              </div>
            ))
          }
        </div>
      </div>

      {isSalonOwner() && (
        <>
          <h2 className="text-black text-start mt-8 mb-5 font-normal text-[22px] leading-[28px]">
            Cashback settings
          </h2>
          <div className="rounded-[16px] border border-primaryGray p-5">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="isCashback"
                className="w-5 h-5 accent-black cursor-pointer"
                checked={Boolean(editParlorDetails.isCashback)}
                disabled={!parlorLoaded}
                onChange={(e) =>
                  setEditParlorDetails((prev) => ({
                    ...prev,
                    isCashback: e.target.checked,
                  }))
                }
              />
              <label htmlFor="isCashback" className="font-bold text-md cursor-pointer">
                Customers earn cashback at this salon
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 w-full items-center">
              <NormalInput
                type="number"
                min={0}
                name="cashbackPercentage"
                label="Cashback percentage (%)"
                lableStyles={{ fontWeight: '400', fontSize: '16px' }}
                placeholder="e.g. 5 or 10"
                value={editParlorDetails.cashbackPercentage ?? ''}
                onChange={handleChange}
                disabled={!parlorLoaded}
              />
              <NormalInput
                type="number"
                min={0}
                name="cashbackValidity"
                label="Validity (months, 0 = never expires)"
                lableStyles={{ fontWeight: '400', fontSize: '16px' }}
                placeholder="e.g. 1 or 2"
                value={editParlorDetails.cashbackValidity ?? ''}
                onChange={handleChange}
                disabled={!parlorLoaded}
              />
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Customers earn this percentage of the service total back as
              cashback on both CRM bills and app bookings, usable only at this
              salon. Cashback earned expires after the set number of months.
              If you untick earning, customers stop earning new cashback but can
              still use the cashback they already have until it expires.
            </p>

            <div className="flex mt-5 items-center justify-end">
              <button
                className="bg-black text-white rounded-[16px] w-[190px] text-sm font-normal disabled:opacity-50"
                onClick={handleCashbackSubmit}
                disabled={!parlorLoaded || savingCashback}
              >
                {savingCashback ? "Saving..." : "Save cashback settings"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SalonDeatils;
