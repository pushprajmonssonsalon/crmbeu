import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { postApiData } from "../../utils/services";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import NormalInput from "../customInput/NormalInput";
import useDebouncer from "../../utils/hooks/useDebouncer";
const ProductQuantityPopup = ({
  isVisible,
  onClose,
  id,
  alreadyAddedProduct,
}) => {
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    setSelectedProducts(alreadyAddedProduct);
  }, [isVisible, alreadyAddedProduct]);
  

  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const { debouncedFunction } = useDebouncer();

  const fetchProducts = () => {
    const data = {
      name: searchProduct,
      type: "Professional",
    };

    postApiData(
      "inventory/getSalonProducts",
      data,
      (resp) => {
        
        setProducts(resp?.products);
      },
      (error) => {
        
      }
    );
  };

  useEffect(() => {
    debouncedFunction(fetchProducts, 500);
  }, [searchProduct]);

  const handleProductClick = (product) => {
    const isAlreadyPresent = selectedProducts.find(
      (elm) => elm._id === product?._id
    );
    if (!isAlreadyPresent) {
      setSelectedProducts([...selectedProducts, product]);
      setSearchProduct("");
    }

  };
  
  const removeSelectedProduct = (product) => {
    setSelectedProducts(selectedProducts.filter((p) => p !== product));
  };
  const handleQuantityChange = (productIndex, sizeUsed) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.map((p, index) =>
        index === productIndex
          ? { ...p, sizeUsed: parseInt(sizeUsed) || "" }
          : p
      )
    );
  };
  if (!isVisible) return null;

  

  const handleSubmit = () => {
    const data = {
      appointmentId: id,
      productUsed: selectedProducts.map((elm)=>{
      
        const {itemId,name,unit,sizeUsed}=elm
        return {
          itemId,
          sizeUsed,
          name,
         
          unit
        }
        
      }),
    };
    postApiData(
      "appointment/usedProductInAppointment",
      data,
      (resp) => {
        toast.success("Product Quanity Updated Successfully!");
        setSelectedProducts([]);
        onClose();
      },
      (error) => {
        toast.error("Something went wrong! Please try again");
      }
    );
  };

  

  return (
    <div className="fixed z-40 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center p-3 overflow-y-auto">
      <div className="relative z-40 mx-3 w-full sm:w-[70%] lg:w-1/3 my-6 sm:my-10 max-h-[85dvh] overflow-y-auto">
        <div className="bg-white p-4 rounded-xl ">
          <div className="flex justify-between mb-3 font-bold items-center">
            <h1 className={`text-blue-500 text-lg font-bold  `}>
              Edit your response
            </h1>
            <span
              className="text-3xl flex items-center justify-center cursor-pointer text-rose-600  hover:scale-105 hover:font-extrabold transition-all ease-in duration-100 font-bold  bg-transparent"
              onClick={() => {
                setSelectedProducts([]);
                onClose();
              }}
            >
              <MdOutlineClose />
            </span>
          </div>

          <div className="flex items-center  w-full gap-x-3 relative">
            <NormalInput
              name="search"
              inputStyles={{ width: "100%" }}
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              placeholder="Enter Professional Products"
            />

            {searchProduct?.length > 0 && (
              <div className="absolute top-[50px] p-3  max-h-[300px] w-full overflow-auto border-2 border-gray-200 bg-white shadow-xl rounded-lg z-1">
                {products?.length > 0 &&
                  products?.map((item) => {
                    return (
                      <div
                        style={{ display: "flex" }}
                        onClick={() => handleProductClick(item.products)}
                        className="flex   bg-gray-100 border-b-1 mb-1 last:mb-0 items-center px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-gray-200 cursor-pointer"
                      >
                        <p className="mr-2 font-semibold">
                          {item.products.name}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {selectedProducts.length > 0 && (
            <div className="flex max-h-[200px] overflow-y-auto flex-col items-start  my-5 ">
              {selectedProducts.map((product, index) => {
                
               return( <div
                  key={product?.id}
                  className="flex gap-3 flex-wrap items-center justify-between my-2 w-full bg-gray-100 p-3"
                >
                  <p className="mr-2 font-medium text-sm">{product?.name}</p>
                  {/* <button onClick={() => removeSelectedProduct(product)}>Remove</button> */}
                  <div className="flex gap-3 items-center justify-center">
                    <input
                      // type="number"
                      min="1"
                      placeholder="Quantity"
                      value={product?.sizeUsed}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      onFocus={() => setEditingProductIndex(index)}
                      onBlur={() => setEditingProductIndex(null)}
                      className="max-w-xs grow px-2 py-1 border border-gray-300 rounded-md"
                    />
                    <div className="w-[40px]">{product?.unit}</div>
                    <MdDelete
                      onClick={() => removeSelectedProduct(product)}
                      className="text-lg w-[40px] text-red-700 cursor-pointer"
                    />
                  </div>
                </div>)
              })}
            </div>
          )}
          {selectedProducts.length > 0 && (
            <button
              className={`bg-blue-400 text-white font-bold p-3 hover:text-gray-500 rounded-xl `}
              onClick={handleSubmit}
            >
              Submit
            </button>
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
        </div>
      </div>
    </div>
  );
};

export default ProductQuantityPopup;
