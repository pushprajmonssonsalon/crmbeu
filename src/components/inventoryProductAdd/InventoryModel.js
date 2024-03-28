import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { MdOutlineClose } from 'react-icons/md';
import { postApiData } from '../../utils/services';

const InventoryModel = ({data,isVisible,onClose,id}) => {
    const [quantity, setQuantity] = useState(null);
  const [price, setPrice] = useState(null);
    if(!isVisible) return null;
    console.log("all product id", id)
    console.log("all product data", data)
    const selectedProduct = data.filter((item)=>item._id === id)
    console.log("selected all products", selectedProduct)
    const onclickProdut = () => {
        const data = {
          id: id,
          itemId:selectedProduct[0].itemId,
          quantity: quantity,
          price: price,
        };
        postApiData(
          "inventory/addProductToSalons",
          data,
          (resp) => {
            console.log("productDetails", resp);
            // alert("product Added Succesfully")
            toast.success("Product Added Successfully!!")
          },
          (error) => {
            // console.log("my product error", error.response.data.message);
            toast.error(error.response.data.message)
          }
        );
        onClose()
      };
  return (
    <div className='fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div className='absolute z-40 mx-3 w-1/3 my-10'>

            <div className='bg-white p-4 rounded-xl '>
                <div className='flex justify-between font-bold items-center'>
                <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>Add Your Products</h1>
                <button className='text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent' onClick={onClose}><MdOutlineClose /></button>

                </div>

          
                     <div className="grid w-full items-center">
                     <label htmlFor="name"><span className='font-bold text-md'>Name :</span></label>
                     <input type="text" placeholder='name' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={selectedProduct[0].name}  disabled/>
                     <label htmlFor="name"><span className='font-bold text-md'>Brand :</span></label>
                     <input type="text" placeholder='Category' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' value={selectedProduct[0].brand} disabled/>
                     <label htmlFor="number"><span className='font-bold text-md'>Quantity :</span></label>  
                     <input placeholder='Quantity' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' onChange={(e)=>setQuantity(e.target.value)}  />
                     <label htmlFor="number"><span className='font-bold text-md'>Price :</span></label>
                     <input placeholder='Price' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' onChange={(e)=>setPrice(e.target.value)}/>
                 </div>
              
                <button className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `} onClick={onclickProdut}>Submit</button>
                
                

            </div>

            

        </div>

    </div>
  )
}

export default InventoryModel