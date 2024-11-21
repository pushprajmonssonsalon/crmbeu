import React, { useState } from 'react';
import { MdOutlineClose } from "react-icons/md";
import { postApiData } from '../../utils/services';
import toast from 'react-hot-toast';
const NewMembershipModal= ({isVisible,onClose}) => {
    const [name,setName] = useState("");
    const [price,setPrice] = useState(null);
    const [coins,setCoins] = useState(null);
    const [expiry,setExpiry] = useState("");
   
    if(!isVisible) return null;
    // 
    

    

    const handleAddMembership=()=>{
        const data = {
            name: name,
            price: +price,
            credits: +coins,
            expiry: +expiry
        }
        postApiData("parlor/createMembershipForParlor",
        data,
        (res)=>{
            
            toast.success("Membership Added Successfully!")
            onClose()
            setName("")
            setPrice(null)
            setCoins(null)
            setExpiry(null)
        },
        (error)=>{
            
            toast.error("Something went wrong!")
        }
        )
    }

  return (
    <div className='fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div className='absolute z-40 mx-3 w-1/3 my-10 overflow-y-auto'>

            <div className='bg-white p-4 rounded-xl '>
                <div className='flex justify-between font-bold items-center'>
                <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>Add your Memberships</h1>
                <button className='text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent' onClick={()=>onClose()}><MdOutlineClose /></button>

                </div>

                {/* {popupService?.map((item,index)=>( */}
                     <div className="grid w-full items-center">
                     <label htmlFor="name"><span className='font-bold text-md'>Name :</span></label>
                     <input type="text" placeholder='Membership Name' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={name} onChange={(e)=>setName(e.target.value)} />
                     <label htmlFor="name"><span className='font-bold text-md'>Price :</span></label>
                     <input type="number" placeholder='Price' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={price} onChange={(e)=>setPrice(e.target.value)}/>
                     <label htmlFor="email"><span className='font-bold text-md'>Coins :</span></label>
                     <input type="number" placeholder='Coins' id="email" className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={coins} onChange={(e)=>setCoins(e.target.value)}/>
                     <label htmlFor="number"><span className='font-bold text-md'>Expiry:</span></label>
                        <div className="flex w-full gap-x-2 items-center">
                            <input id="number" className='rounded-lg border-none bg-gray-300 placeholder:font-semibold w-[90%] gap-x-2' type="number" placeholder="Enter number" onChange={(e)=>setExpiry(e.target.value)}/>
                                <select className="rounded-lg border-none bg-gray-300 h-[40px] -mt-2" defaultValue="months" >
                                    
                                    <option value="months">Months</option>
                                </select>
                        </div>
                 </div>
                {/* ))} */}
                <button className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `} onClick={handleAddMembership}>Submit</button>
                
                

            </div>

            

        </div>

    </div>
  )
}

export default NewMembershipModal