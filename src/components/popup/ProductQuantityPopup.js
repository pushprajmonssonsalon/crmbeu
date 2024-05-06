import React, { useEffect, useState } from 'react'
import { MdOutlineClose } from "react-icons/md";
import { getApiCall, postApiData } from '../../utils/services';
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
const ProductQuantityPopup= ({isVisible,onClose,id,alreadyAddedProduct}) => {
  
    const [searchProduct,setSearchProduct] = useState("")
    const [selectedProducts, setSelectedProducts] = useState([])
    console.log("selectedProducts",selectedProducts)
    useEffect(()=>{
      setSelectedProducts(alreadyAddedProduct)
    },[isVisible])
    const [editingProductIndex, setEditingProductIndex] = useState(null);
    const [products,setProducts] = useState([])
    console.log("appointment id",id)
    console.log("productUsed",alreadyAddedProduct)
    useEffect(()=>{
        const data={
            name: searchProduct,
            type: 'Professional'
        }
        postApiData('inventory/getSalonProducts',data,
        (resp)=>{
            console.log("result success",resp);
            setProducts(resp)
        },
        (error)=>{
            console.log("result error",error)
        }
    )
    },[searchProduct])

    const handleProductClick = (product) => {
        if (!selectedProducts.includes(product)) {
          setSelectedProducts([...selectedProducts, product]);
          setSearchProduct("")
        }
      };
      const removeSelectedProduct = (product) => {
        setSelectedProducts(selectedProducts.filter((p) => p !== product));
      };
      const handleQuantityChange = (productIndex, sizeUsed) => {
        setSelectedProducts((prevSelectedProducts) =>
          prevSelectedProducts.map((p, index) =>
            index === productIndex ? { ...p, sizeUsed: parseInt(sizeUsed) || ''} : p
          )
        );
      };
    if(!isVisible) return null;

    console.log("selectedProducts",selectedProducts)

    const handleSubmit=()=>{
        const data = {
            appointmentId:id,
            productUsed: selectedProducts
        }
        postApiData("appointment/usedProductInAppointment",data,
        (resp)=>{
            toast.success("Product Quanity Updated Successfully!")
            setSelectedProducts([])
            onClose()
        },
        (error)=>{
            toast.error("Something went wrong! Please try again")

        }
    )
    }

  return (
    <div className='fixed z-30 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div className='absolute z-40 mx-3 w-1/3 my-10 h-[70%] overflow-y-auto'>

            <div className='bg-white p-4 rounded-xl '>
                <div className='flex justify-between font-bold items-center'>
                <h1 className={`text-blue-500 text-lg font-bold mb-4 `}>Edit your response</h1>
                <button className='text-3xl font-bold mt-4 text-red-600 hover:text-red-900 bg-transparent' onClick={()=>{
                  setSelectedProducts([])
                  onClose()
                }}><MdOutlineClose /></button>

                </div>

                <div className='flex items-center justify-center w-full gap-x-3 relative'>
                    <input type='text' value={searchProduct} onChange={(e)=>setSearchProduct(e.target.value)} className='w-full' placeholder='Enter Professional Products'/>
                    {searchProduct?.length > 0 && (
                    <div
                      className="absolute top-[60px] h-[104px] w-full overflow-auto border-2 border-gray-200 bg-white shadow-xl rounded-lg z-1"
                    >
                      {products.length > 0 &&
                        products?.map((item) => {
                          return (
                            <div
                              style={{ display: "flex" }}
                              onClick={() => handleProductClick(item.products)}
                              className="flex items-center px-4 py-2 mb-0 transition-all duration-300 ease-in-out transform hover:bg-[#f5da42] hover:scale-95 cursor-pointer"
                            >
                              <p className="mr-2 font-semibold">{item.products.name}</p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {selectedProducts.length > 0 && (
        <div className="flex flex-col items-start px-4 py-2 my-5 ">
          {selectedProducts.map((product,index) => (
            <div key={product.id} className="flex items-center justify-between my-2 w-full border-2 border-[#ccc] px-3 py-1">
              <p className="mr-2 font-semibold text-lg">{product.name}</p>
              {/* <button onClick={() => removeSelectedProduct(product)}>Remove</button> */}
              <input
                // type="number"
                min="1"
                value={product.sizeUsed}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                onFocus={() => setEditingProductIndex(index)}
                onBlur={() => setEditingProductIndex(null)}
                className="w-16 px-2 py-1 border border-gray-300 rounded-md"
              />
              <MdDelete onClick={() => removeSelectedProduct(product)} className='text-lg text-red-700 cursor-pointer'/>
            </div>
          ))}
        </div>
      )}
                {/* {popupService?.map((item,index)=>( */}
                     {/* <div className="grid w-full items-center">
                     <label htmlFor="name"><span className='font-bold text-md'>Name :</span></label>
                     <input type="text" placeholder='name' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold'  disabled/>
                     <label htmlFor="name"><span className='font-bold text-md'>Category :</span></label>
                     <input type="text" placeholder='Category' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold'  disabled/>
                     <label htmlFor="email"><span className='font-bold text-md'>Subcategory :</span></label>
                     <input type="email" placeholder='email' id="email" className='rounded-lg border-none bg-gray-300 placeholder:font-semibold'  disabled/>
                     <label htmlFor="number"><span className='font-bold text-md'>Mrp :</span></label>  
                     <input placeholder='MRP' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold'  />
                     <label htmlFor="number"><span className='font-bold text-md'>Price :</span></label>
                     <input placeholder='Price' className='rounded-lg border-none bg-gray-300 placeholder:font-semibold' />
                 </div> */}
                {/* ))} */}
                <button className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `} onClick={handleSubmit}>Submit</button>
                
                

            </div>

            

        </div>

    </div>
  )
}

export default ProductQuantityPopup