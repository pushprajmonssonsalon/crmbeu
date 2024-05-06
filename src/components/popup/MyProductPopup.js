import React, { useEffect, useState } from 'react'
import { MdOutlineClose } from "react-icons/md";
import { postApiData } from '../../utils/services';
import toast from 'react-hot-toast';

const MyProductPopup= ({data,isVisible,onClose,id,setIsChanged,isChanged}) => {
    const [price,setPrice] = useState(null);
    const [mrp,setMrp] = useState(null);
    if(!isVisible) return null;
    console.log("my product id",id)
    const selectedProduct = data.filter((item)=>item.products._id === id);
    console.log("selected my product",selectedProduct)

    const handleEditServiceApi=()=>{
  
        const data = {
                id: id,
                price: +price==0? selectedProduct[0]?.products?.price : +price,
                mrp: +mrp==0 ? selectedProduct[0]?.products?.mrp : +mrp ,
              };
              postApiData(
                "inventory/editSalonProducts",
                data,
                (resp) => {
                  if (resp) {
                  } else {
                    // alert("Chnages Applied Succesfully");
                    toast.success("Chenges Applied SuccessFully")
                  }
                },
                (error) => {
                  console.log("error", error);
                //   alert("service already Added");
                toast.error("Something Went Wrong!!")
                }
              );
              setIsChanged(!isChanged)
              onClose();
        }

  return (
    <div className='fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div className='absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-auto'>

            <div className='bg-white p-4 rounded-xl '>
                <div className='flex justify-between font-bold items-center'>
                <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>Edit your response</h1>
                <button className='text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent' onClick={onClose}><MdOutlineClose /></button>

                </div>

                {/* {popupService?.map((item,index)=>( */}
                     <div className="grid w-full items-center">
                     <label htmlFor="name"><span className='font-bold text-md'>Name :</span></label>
                     <input type="text" placeholder='name' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={selectedProduct[0]?.products?.name}  disabled/>
                     <label htmlFor="name"><span className='font-bold text-md'>Brand :</span></label>
                     <input type="text" placeholder='Category' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={selectedProduct[0]?.products?.brand} disabled/>
                     <label htmlFor="number"><span className='font-bold text-md'>Mrp :</span></label>  
                     <input placeholder='MRP' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold'  defaultValue={selectedProduct[0]?.products?.mrp} onChange={(e)=>setMrp(e.target.value)}/>
                     <label htmlFor="number"><span className='font-bold text-md'>Price :</span></label>
                     <input placeholder='Price' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' defaultValue={selectedProduct[0]?.products?.price} onChange={(e)=>setPrice(e.target.value)}/>
                 </div>
                {/* ))} */}
                <button className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `} onClick={handleEditServiceApi}>Submit</button>
                
                

            </div>

            

        </div>

    </div>
  )
}

export default MyProductPopup