import React, { useEffect, useState } from 'react'
import { MdOutlineClose } from "react-icons/md";
import { getApiCall, postApiData } from '../../utils/services';
const Popup= ({isVisible,onClose,id}) => {
    const [serviceData,setServiceData] = useState([]);
    const [price,setPrice] = useState(null);
    const [mrp,setMrp] = useState(null);
    const [bool,setBool] = useState(false);
    console.log({price,mrp})
    useEffect(() => {
      const data = {
      name: '',
      category: '',
      gender: ""
    }
        postApiData(
          "salonService/getSalonServices",
          data,
          (resp) => {
            console.log("servicerespone", resp);
            setServiceData(resp);
          },
          (error) => {
              console.log("errro", error);
          }
          );
      }, [bool]);
      console.log("popup ki service",serviceData)
    if(!isVisible) return null;
    // console.log({id})
    var popupService = serviceData?.filter((item)=>item?.services?.serviceId==id);
    
    console.log("popservice",popupService[0].services.price)
const handleEditServiceApi=()=>{
  
    const data = {
        uniqueCode: popupService[0]?.services?.uniqueCode,
            price: +price==0? popupService[0].services.price : +price,
            mrp: +mrp==0 ? popupService[0].services.mrp : +mrp ,
          };
          postApiData(
            "salonService/editServiceInParlor",
            data,
            (resp) => {
              if (resp) {
              } else {
                alert("Chnages Applied Succesfully");
              }
            },
            (error) => {
              console.log("error", error);
              alert("service already Added");
            }
          );
          setBool(!bool)
          onClose();
    }

  return (
    <div className='fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div className='absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-scroll'>

            <div className='bg-white p-4 rounded-xl '>
                <div className='flex justify-between font-bold items-center'>
                <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>Edit your response</h1>
                <button className='text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent' onClick={()=>onClose()}><MdOutlineClose /></button>

                </div>

                {popupService?.map((item,index)=>(
                     <div className="grid w-full items-center">
                     <label htmlFor="name"><span className='font-bold text-md'>Name :</span></label>
                     <input type="text" placeholder='name' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={item?.services?.name} disabled/>
                     <label htmlFor="name"><span className='font-bold text-md'>Category :</span></label>
                     <input type="text" placeholder='Category' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={item?.services?.category} disabled/>
                     <label htmlFor="email"><span className='font-bold text-md'>Subcategory :</span></label>
                     <input type="email" placeholder='email' id="email" className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={item?.services?.subCategory} disabled/>
                     <label htmlFor="number"><span className='font-bold text-md'>Mrp :</span></label>  
                     <input placeholder='MRP' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' defaultValue={item?.services?.mrp} onChange={(e)=>setMrp(e.target.value)} />
                     <label htmlFor="number"><span className='font-bold text-md'>Price :</span></label>
                     <input placeholder='Price' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' defaultValue={item?.services?.price} onChange={(e)=>setPrice(e.target.value)}/>
                 </div>
                ))}
                <button className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `} onClick={handleEditServiceApi}>Submit</button>
                
                

            </div>

            

        </div>

    </div>
  )
}

export default Popup