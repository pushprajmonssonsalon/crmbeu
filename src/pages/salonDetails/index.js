import React, { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { getApiCall, postApiData } from '../../utils/services';
import Layout from '../../components/Layout';
import { useDropzone } from 'react-dropzone';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { parlordetail } from '../../redux/actions';
import { MdCancel } from "react-icons/md";
import axios from 'axios';
const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY ,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY ,
  region: process.env.REACT_APP_AWS_REGION ,
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
  const [del,setDel] = useState(false)
  const [bool,setBool] = useState(false)
  const [contactNumber, setContactNumber] = useState('');
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageKey, setImageKey] = useState('');
  const [fileNames, setFileNames] = useState([]);
  const [parlorDetails, setParlorDetails] = useState([]);
  
  const token = localStorage.getItem("token");
  const handleFileChange = async(e) => {
    setImageFile(e.target.files[0]);
    console.log(e.target.files[0]);
    let imageData = e.target.files[0]
    const formData = new FormData();
    formData.append('image', imageData);
    console.log("imageData------",imageData)
  
    try {
      // const response = await fetch('http://192.168.2.19:4002/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
  
      // if (response.ok) {
      //   console.log("images link", response.data)
      //   // alert('Image uploaded successfully');
      //   setImageKey(imageData.name); 
      // } else {
      //   alert('Failed to upload image');
      // }
      // http://192.168.2.19:4002
      // https://crm.smartsalon.in
      const response = await axios.post("https://crm.smartsalon.in/upload",formData,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if(response){
        console.log("resp------->",response.data.data)
        setImages((prevUrls) => [...prevUrls, response.data.data]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  console.log("images",images)
  


//   const handleDrop = async (acceptedFiles) => {
//     const data = {
//       id: parlorDetails._id,
//       image: acceptedFiles
//     }
//     postApiData("/upload",data,
//       (resp)=>{
//         console.log("resp")
//       },(error)=>{
//         console.log("error")
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
console.log("uploaded files:",images)

  // const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });
  useEffect(() => {
    getApiCall(
      "parlor/getParlorDetail",
      (resp) => {
        console.log("getparlour", resp);
        setParlorDetails(resp);
        // parlorDetails(resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [bool,del]);
  useEffect(()=>{
    setImages(parlorDetails?.images)
  },[parlorDetails])

  const handleSubmit=()=>{
    
    const data = {
      gstNumber: gst,
      stateName: state,
        address:address,
        address2: address2,
        contactNumber: contactNumber, 
        images: images,
        email:email,
        trade:tradename,
        owner:owner,
        live:openDate
    }
    postApiData("parlor/editParlorDetails",data,
    (resp)=>{
        toast.success("Details has been Submitted!");
        
        setAddress("")
        setAddress2("")
        setContactNumber("")
        setImages([])
        setFileNames([])
        setBool(!bool)
    },
    (error)=>{
        toast.error("Something went wrong!");
        // console.log("error",error)
    }
)
  }

  const handleCancelImages=(index)=>{
    images.splice(index,1);
    setImages([...images]);
    handleSubmit()
  }
  

  return (
    <Layout>
      <div className='mt-32 w-[90%] my-10 h-auto mx-auto '>
        <div className='p-4 rounded-xl '>
          <div className='flex justify-center font-bold items-center'>
            <h1 className={`text-black text-xl font-bold mb-10 text-center font-serif`}>Edit your salon details</h1>
          </div>
          <div className='grid grid-cols-2 w-full items-center'>
            <label htmlFor='name'>
              <span className='font-bold text-md font-serif '>Salon Catergory :</span>
            </label>
            <input type='text' placeholder='Name' className='rounded-lg border-none bg-white placeholder:font-semibold'  value={parlorDetails.name} disabled/>
            <label htmlFor='name'>
              <span className='font-bold text-md font-serif '>Location :</span>
            </label>
            <input type='text' placeholder='Address' className='rounded-lg border-none bg-white placeholder:font-semibold' defaultValue={parlorDetails.address} onChange={(e) => setAddress(e.target.value)} />
            <label htmlFor='name'>
              <span className='font-bold text-md font-serif '>Address  :</span>
            </label>
            <input type='text' placeholder='Address 2' className='rounded-lg border-none bg-white placeholder:font-semibold' defaultValue={parlorDetails.address2} onChange={(e) => setAddress2(e.target.value)} />
            <label htmlFor='name'>
              <span className='font-bold text-md font-serif '>State :</span>
            </label>
            <input type='text' placeholder='State' className='rounded-lg border-none bg-white placeholder:font-semibold' defaultValue={parlorDetails.stateName} onChange={(e) => setState(e.target.value)} />
            <label htmlFor='text'>
              <span className='font-bold text-md font-serif '>Contact Number :</span>
            </label>
            <input type='text' placeholder='Contact Number' className='rounded-lg border-none bg-white placeholder:font-semibold' defaultValue={parlorDetails.contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            <label htmlFor='text'>
              <span className='font-bold text-md font-serif '>GST Number :</span>
            </label>
            <input type='text' placeholder='GST Number' className='rounded-lg border-none bg-white placeholder:font-semibold' defaultValue={parlorDetails.gstNumber} onChange={(e) => setGst(e.target.value)} />
            <label htmlFor='text'>
              <span className='font-bold text-md font-serif '>Trade Name :</span>
            </label>
            <input type='text' placeholder='Trade Name' className='rounded-lg border-none bg-white placeholder:font-semibold' defaultValue={parlorDetails?.trade} onChange={(e) => setTradeName(e.target.value)} />
            <label htmlFor='text'>
              <span className='font-bold text-md font-serif '>Email :</span>
            </label>
            <input type='text' placeholder='Email' className='rounded-lg border-none bg-white placeholder:font-semibold' defaultValue={parlorDetails?.email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor='text'>
              <span className='font-bold text-md font-serif '>Owner Name :</span>
            </label>
            <input type='text' placeholder='Owner Name' className='rounded-lg border-none bg-white placeholder:font-semibold' defaultValue={parlorDetails?.owner} onChange={(e) => setOwner(e.target.value)} />
            <label htmlFor='text'>
              <span className='font-bold text-md font-serif '>Salon Operational Date :</span>
            </label>
            <input type='text' placeholder='Salon Operational Date' className='rounded-lg border-none bg-white placeholder:font-semibold' defaultValue={parlorDetails?.live} onChange={(e) => setOpenDate(e.target.value)} />
            <label htmlFor='text'>
              <span className='font-bold text-md font-serif '>Images :</span>
            </label>
            <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border rounded-md"
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
          <button className={`text-xl bg-blue-400 text-white font-bold font-serif p-3 rounded-xl w-full my-5 hover:bg-blue-500 hover:text-gray-200 transition-all duration-150 ease-in-out`} onClick={handleSubmit}>Submit</button>
        </div>
        <div className='flex justify-evenly items-center flex-wrap w-full'>
        {
          parlorDetails?.images?.map((image,index)=>(
            <div className='w-1/4 h-[150px] relative'>
              <img src={image} alt="img" className='w-full h-full bg-cover'/>
              <MdCancel className='absolute text-2xl text-black top-0 right-0 cursor-pointer' onClick={()=>handleCancelImages(index)}/>
           
           
            </div>
          ))
        }
        </div>
      </div>
    </Layout>
  );
};

export default SalonDeatils;
