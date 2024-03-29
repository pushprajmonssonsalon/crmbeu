import React, { useEffect, useState } from "react";
import "./inventorydetails.css";
import { HiDotsVertical } from "react-icons/hi";
import Modal from "react-modal";
import productList from "./productlist";
import { CSVLink } from "react-csv";
import { getApiCall, postApiData } from "../../utils/services";
import InventoryProductAddModal from "../../components/inventoryProductAdd";
import Pagination from "../../components/pagination";
import Layout from "../../components/Layout";
import { BiSolidAddToQueue } from "react-icons/bi";
import { toast } from "react-hot-toast";
import Table from "../../components/Table";
import MyProductTable from "../../components/Table/myProduct";
import OrderPopup from "../../components/popup/OrderPopup";
import { AiOutlineShoppingCart } from "react-icons/ai";
import MyProductPopup from "../../components/popup/MyProductPopup";
import InventoryModel from "../../components/inventoryProductAdd/InventoryModel";
const allProductHeading = {
  name: "NAME",
  mrp: "MRP",
  sp: "SELLING PRICE",
  type: "TYPE",
  brand: "BRAND",
  add: "ADD",
  order: "PLACE ORDER"
}

const DropdownRow = ({ label, options, value, onChange }) => {
  return (
    <div className="dropdown-row" style={{}}>
      <label htmlFor={label}>{label}</label>
      <select
        id={label}
        value={value}
        onChange={(e) => onChange(label, e.target.value)}
        style={{
          height: "30px",
          width: "200px",
          borderRadius: "8px",
          borderColor: "grey",
        }}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const Inventorydetails = () => {
  const [count, setCount] = useState(0);
  const [newMyProducts,setNewMyProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [skuNumber, setSkuNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [type, setType] = useState("");
  const [productName, setProductName] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [unit, setUnit] = useState("");
  const [lowQuantity, setLowQuantity] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [brand, setBrand] = useState("");
  const [getSalonProducts, setgetSalonProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addproductModal, setAddProductModal] = useState(false);
  const [searchProdut, setsearchProduct] = useState(null);
  const [productDetailsModal, setProductDetailModal] = useState([]);
  const [postsPerPage] = useState(10);
console.log("getSalonProductslength",getSalonProducts)
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const categories = ["Skincare", "category2", "category3"];
  const subcategory = ["Serums", "subcategory2", "subcategory3"];
  const brands = ["brand1", "brand2", "brand3"];
  const types = ["Retail", "Non-retail", "Both"];
  const quantities = ["quantity1", "quantity2", "quantity3"];
  const [allProducts, setAllproducts] = useState("allProducts");
  const [myProductList, setMyProductList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [productdetails, setProductdetails] = useState([]);
  const [brandName,setBrandName] = useState(null);
  const [typeName,setTypeName] = useState(null);
  // const [purchaseModel,setPurchaseModel] = useState(false)
  const [showOrderPopup,setShowOrderPopup] = useState(false);
  const [showInventryModel,setShowInventryModel] = useState(false)
  const [productOrderId,setProductOrderId] = useState([]);
  const [showMyProductPopup,setShowMyProductPopup] = useState(false);
  const [myProductId,setMyProductId] = useState("");
  const [allProductId, setAllProductId] = useState("")
  const [isChanged,setIsChanged] = useState(false)
  const [isDelete,setIsDeleted]= useState(false)
  // my products states

  const [productName2,setProductName2] = useState("");
  const [brand2,setBrand2] = useState(null);
  const [type2, setType2] = useState(null)
  

  // pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const [currentPage1, setCurrentPage1] = useState(1);
  const itemsPerPage1 = 10;
  const startIndex1 = (currentPage1 - 1) * itemsPerPage1;
  const endIndex1 = currentPage1* itemsPerPage1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePageChange1 = (page) => {
    setCurrentPage1(page);
  };
  const showopen = () => {
    setOpen(!open);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const brandData = [
    {
      brandName: "Loreal",
    },
    {
      brandName: "Thalgo",
    },
    {
      brandName: "Skinconyc",
    },
    {
      brandName: "Argatinkeratin",
    },
    {
      brandName: "Kerastase",
    },
    {
      brandName: "Rica",
    },
    {
      brandName: "	Milk & Shake",
    },
  ];
  const TypeData = [{ productType: "Retail" }, { productType: "Professional" }];
  // Add a state to store the product list

  const fetchProductList = async (category, subcategory) => {
    try {
      const filteredProducts = productList.filter(
        (product) =>
          product.category === category && product.subcategory === subcategory
      );

      setProductdetails(filteredProducts);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };

  const handleCategoryChange = (selectedCategory) => {
    setSelectedCategory(selectedCategory);

    fetchProductList(selectedCategory, selectedSubcategory);
  };

  const handleSubcategoryChange = (selectedSubcategory) => {
    setSelectedSubcategory(selectedSubcategory);

    fetchProductList(selectedCategory, selectedSubcategory);
  };

  const addclick = (item) => {
    setAddProductModal(true);
    setProductDetailModal(item);
  };

  const orderClick = (item) =>{
    // setShowOrderPopup(true)
    // setProductOrderId(item)
    if (!productOrderId.includes(item)) {
      setProductOrderId([...productOrderId, item]);
      setCount(productOrderId.length + 1);
      toast.success("Product added successfully")
    }else{
      toast.error("Product is already added!")
    }
   
  }
  console.log("productorderidarray ki maa ki chut",productOrderId)
  const shopKartClick = () =>{
    setShowOrderPopup(true)
  }

  // clear button

  const handleClear = () =>{
    setsearchProduct("");
    setBrandName("");
    setTypeName("")
  }

  // my product clear button

  const clearClick = ()=>{
    setProductName2("")
    setBrand2("")
    setType2("")
  }

  // my Products
  const myproduct =()=>{
    const data = {
      name: productName2,
      brand: brand2,
      type: type2
    }
    postApiData(
      "inventory/getSalonProducts",
      data,
      (resp) => {
        console.log("getMyProduct----------------------------------", resp);
        // setMyProductList(resp.products);
        setNewMyProducts(resp)
        setCurrentPage(1)
      },
      (error) => {
        console.log("error");
      }
    );
  }
  console.log({newMyProducts})
  // All products
  useEffect(() => {
    const data = {
      page: currentPage,
      limit:postsPerPage,
      name: searchProdut,
      brand: brandName,
      type: typeName
    };

    // let obj = {}
    // if(currentPage) obj.page = currentPage
    // if(postsPerPage) obj.limit = postsPerPage
    // if(searchProdut) obj.name = searchProdut
    // if(brandName) obj.brand = brandName
    // if(typeName) obj.type = typeName
  //   const params = new URLSearchParams({
  //     page: currentPage,
  //     limit: postsPerPage,
  //     name: searchProdut ? searchProdut : '',
  //     // brand: brandName ? brandName : null,
  //     // type: typeName ? typeName : null
  // });
    postApiData(
      `inventory/getAllProducts`,
      data,
      (resp) => {
        console.log("getallproducts", resp);
        setgetSalonProducts(resp.products);
        setCurrentPage1(1)
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [isModalOpen,brandName,searchProdut,typeName]);
  console.log({getSalonProducts})

  
  useEffect(() => {
    myproduct()
  }, [isModalOpen,allProducts,productName2,brand2,type2,isChanged,isDelete]);
  // console.log({myProductList})

  useEffect(() => {
    const data={
      brand:'',
       name:'',
        type:"",
    }
    postApiData(
      "inventory/getFilteredProducts",data,
      (resp) => {
        console.log("getsalonproduct", resp);
        setMyProductList(resp.products);
        setCurrentPage(1)
      },
      (error) => {
        console.log("error");
      }
    );
  }, []);
  const onchangeProduct = (e) => {
    setsearchProduct(e.target.value);
  };

  const handleInventryOpen=(id)=>{
    setAllProductId(id)
    setShowInventryModel(true)
  }

  const handleSubmit = () => {
    const data = {
      name: productName,
      quantity: quantity,
      price: price,
      brand: brand,
      category: category,
      mrp: cost,
      skucode: skuNumber,
      type: type,
      description: remarks,
    };
    postApiData(
      "inventory/addproduct",
      data,
      (resp) => {
        if (resp) {
          // alert("prduct added sucessfully");
          toast.success("Product Added sucessFully")
          setModalOpen(false);
        }
      },
      (error) => {
        console.log("error", error);
      }
    );
  };

  const getSalonProductsPress = (item) => {
    setSelectedItem(item);
  }; 
  const editPress = () => {
    setModalOpen(true);
  };
  const allProduct = () => {
    setAllproducts("allProducts");
  };
  const myProducts = () => {
    setAllproducts("myProducts");
    // setNewMyProducts("myProducts");
  };
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = getSalonProducts.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);


    const result = productOrderId.map((id) => {
      const matchingObject = getSalonProducts.find((obj) => obj._id === id);
      console.log("matching Object",matchingObject)
      return matchingObject ? { name: matchingObject.name, size: matchingObject.size , itemId: matchingObject.itemId,brand: matchingObject.brand , type: matchingObject.type } : null;
    });
    
    console.log("result Ki maa ki chut",result);

    const handleOpen=(id)=>{
      setMyProductId(id);
      setShowMyProductPopup(true)
    }
  return (
    <Layout>
      <nav className="navbar w-[80%] mx-auto ">
        {/* <div className="flex justify-end items-end w-[80%] mx-auto mt-40">
          {currentPosts.length > 0 && (
            <div
              style={{
                backgroundColor: "black",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "170px",
                borderRadius: "12px",
              }}
            >
              <CSVLink
                data={getSalonProducts}
                style={{ color: "white", fontSize: "15px", fontWeight: "500" }}
              >
                Export as CSV
              </CSVLink>
            </div>
          )}
        </div> */}
        <ul className="nav-list mt-40 ">
          <li className=" hover:scale-110 px-6 bg-[#191919] text-white font-semibold py-4 rounded-lg cursor-pointer" onClick={allProduct} >
            All PRODUCTS
          </li>
          <li className="hover:scale-110 px-6 bg-[#191919] text-white font-semibold py-4 rounded-lg cursor-pointer" onClick={myProducts}>
            My Products
          </li>
          <li className="relative"><AiOutlineShoppingCart  className="text-3xl font-bold cursor-pointer text-black hover:text-green-700" onClick={shopKartClick}/>
          <span className="absolute -right-4 bottom-4 text-green-600 font-bold">{count}</span>
          </li>
        </ul>
        

        {allProducts == "myProducts" ? (
          <div style={{ display: "flex", width: "100%" }}>
            <div className="inventory-container-main">
              {/* <div className="inventory-container-inner1">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "30px",

                  }}
                >
                  <span>search product by Name</span>
                  <input
                    placeholder="search by Product Name"
                    className="searchbyproductName"
                  />
                </div>
                <DropdownRow
                  label="Category"
                  options={categories}
                  onChange={(label, value) => handleCategoryChange(value)}
                />
                <DropdownRow
                  label="Sub Category"
                  options={subcategory}
                  onChange={(label, value) => handleSubcategoryChange(value)}
                />
                <div style={{ position: "relative", marginLeft: "-120px" }}>
                  <HiDotsVertical
                    style={{
                      marginLeft: "68px",
                      marginTop: "16px",
                      cursor: "pointer",
                    }}
                    onClick={showopen}
                  />
                  {open && (
                    <div
                      style={{
                        position: "absolute",
                        top: "30px",
                        right: "0",
                        background: "#fff",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "20px",
                        transition: "opacity 0.3s ease-in-out",
                        opacity: 1,
                      }}
                    >
                      {/* Header */}
                      {/* <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            width: "100px",
                            marginRight: "10px",
                            fontWeight: "bold",
                          }}
                          onClick={openModal}
                        >
                          Add Product
                        </span>
                      </div>

                      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <h1>Add Products</h1>
                        </div>
                        <div className="add-product-container">
                          <div className="add-product1">
                            <div style={{ width: "40vw", marginLeft: "20px" }}>
                              <DropdownRow
                                label="Category"
                                options={categories}
                                value={category}
                                onChange={(label, value) => setCategory(value)}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "100px",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "17vw",
                                }}
                              >
                                <label htmlFor="price" className="label">
                                  Price:
                                </label>
                                <input
                                  type="number"
                                  id="price"
                                  placeholder="Enter price"
                                  style={{ height: "35px" }}
                                  value={price}
                                  onChange={(e) => setPrice(e.target.value)}
                                />
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "17vw",
                                }}
                              >
                                <label htmlFor="cost" className="label">
                                  Cost:
                                </label>
                                <input
                                  type="number"
                                  id="cost"
                                  placeholder="Enter cost"
                                  style={{ height: "35px" }}
                                  value={cost}
                                  onChange={(e) => setCost(e.target.value)}
                                />
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: "100px",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "17vw",
                                }}
                              >
                                <label htmlFor="price" className="label">
                                  Date:
                                </label>
                                <input
                                  type="date"
                                  id="date"
                                  placeholder="Enter date"
                                  className="input-field"
                                  value={date}
                                  onChange={(e) => setDate(e.target.value)}
                                />
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "17vw",
                                }}
                              >
                                <label htmlFor="cost" className="label">
                                  Expiry Date:
                                </label>
                                <input
                                  type="date"
                                  id="exdate"
                                  placeholder="Enter expiry date"
                                  className="input-field"
                                  value={expiryDate}
                                  onChange={(e) =>
                                    setExpiryDate(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "40vw",
                                marginLeft: "20px",
                              }}
                            >
                              <label htmlFor="price" className="label">
                                Sku Number:
                              </label>
                              <input
                                type="text"
                                id="price"
                                placeholder="Enter sku number"
                                className="input-field"
                                value={skuNumber}
                                onChange={(e) => setSkuNumber(e.target.value)}
                              />
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "40vw",
                                marginLeft: "20px",
                              }}
                            >
                              <label htmlFor="price" className="label">
                                Remarks:
                              </label>
                              <input
                                type="text"
                                id="price"
                                placeholder="Enter remark"
                                className="input-field"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                              />
                            </div>
                            <div style={{ marginTop: "132px" }}>
                              <button
                                type="submit"
                                style={{
                                  backgroundColor: "#4CAF50", // Green
                                  color: "white",
                                  padding: "10px 20px",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                                onClick={handleSubmit}
                              >
                                Submit
                              </button>

                              <button
                                type="cancel"
                                style={{
                                  backgroundColor: "#f44336", // Red
                                  color: "white",
                                  padding: "10px 20px",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                                onClick={closeModal}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>

                          <div className="add-product2">
                            <div style={{ width: "40vw", marginLeft: "20px" }}>
                              <DropdownRow
                                label="Type"
                                options={types}
                                value={type}
                                onChange={(label, value) => setType(value)}
                              />
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "40vw",
                                marginLeft: "20px",
                              }}
                            >
                              <label htmlFor="price" className="label">
                                Product Name:
                              </label>
                              <input
                                type="text"
                                id="price"
                                placeholder="Enter remark"
                                className="input-field"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                              />
                            </div>

                            <div style={{ width: "40vw", marginLeft: "20px" }}>
                              <DropdownRow
                                label="Subcategory"
                                options={subcategory}
                                value={subCategory}
                                onChange={(label, value) =>
                                  setSubCategory(value)
                                }
                              />
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: "100px",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "17vw",
                                }}
                              >
                                <label htmlFor="price" className="label">
                                  Quantity:
                                </label>
                                <input
                                  type="number"
                                  id="price"
                                  placeholder="Enter price"
                                  style={{ height: "35px" }}
                                  value={quantity}
                                  onChange={(e) => setQuantity(e.target.value)}
                                />
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "17vw",
                                }}
                              >
                                <label htmlFor="cost" className="label">
                                  Lot Number:
                                </label>
                                <input
                                  type="number"
                                  id="cost"
                                  placeholder="Enter cost"
                                  style={{ height: "35px" }}
                                  value={lotNumber}
                                  onChange={(e) => setLotNumber(e.target.value)}
                                />
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: "100px",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "17vw",
                                }}
                              >
                                <label htmlFor="price" className="label">
                                  Measurement:
                                </label>
                                <input
                                  type="number"
                                  id="price"
                                  placeholder="Enter price"
                                  style={{ height: "35px" }}
                                  value={measurement}
                                  onChange={(e) =>
                                    setMeasurement(e.target.value)
                                  }
                                />
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "17vw",
                                }}
                              >
                                <label htmlFor="cost" className="label">
                                  Unit:
                                </label>
                                <input
                                  type="number"
                                  id="cost"
                                  placeholder="Enter unit"
                                  style={{ height: "35px" }}
                                  value={unit}
                                  onChange={(e) => setUnit(e.target.value)}
                                />
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: "100px",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "17vw",
                                }}
                              >
                                <label htmlFor="price" className="label">
                                  Low Quantity:
                                </label>
                                <input
                                  type="number"
                                  id="price"
                                  style={{ height: "35px" }}
                                  value={lowQuantity}
                                  onChange={(e) =>
                                    setLowQuantity(e.target.value)
                                  }
                                />
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "17vw",
                                }}
                              >
                                <label htmlFor="cost" className="label">
                                  HSN Code:
                                </label>
                                <input
                                  type="number"
                                  id="cost"
                                  placeholder="Enter hsn code"
                                  style={{ height: "35px" }}
                                  value={hsnCode}
                                  onChange={(e) => setHsnCode(e.target.value)}
                                />
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "40vw",
                                marginLeft: "20px",
                              }}
                            >
                              <label htmlFor="price" className="label">
                                Brand:
                              </label>
                              <input
                                type="text"
                                id="price"
                                placeholder="Brand"
                                className="input-field"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </Modal>

                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          marginBottom: "10px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          transition: "background-color 0.3s ease-in-out",
                        }}
                      >
                        Export
                      </div>
                      <div
                        style={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          transition: "background-color 0.3s ease-in-out",
                        }}
                      >
                        Import
                      </div>
                    </div>
                  )}
                </div>
              </div> */}
              {/* <div className="inventory-container-inner2">
                <DropdownRow label="Brand" options={brands} />
                <DropdownRow label="Type" options={types} />
                <DropdownRow label="Qty" options={quantities} />
              </div> */} 
              {/* <div className="table-container">
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Brand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newMyProducts?.map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => getSalonProductsPress(item)}
                      >
                        <td>{item.name}</td>
                        <td>{item.stockQuantity}</td>
                        <td>{item.price}</td>
                        <td>{item.brand}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
              <div className="flex justify-between items-center mt-6">
              <input
              value={productName2}
              placeholder="Search by Product Name"
              style={{
                height: "40px",
                border: "1px solid grey",
                width: "270px",
                borderRadius: "11px",
                paddingRight: "30px", // Add space for the eye icon
                marginTop:'14px',
                outline:"none"
              }}
              onChange={(e)=>setProductName2(e.target.value)}
            />
               <select
              style={{
                height: "40px",
                border: "1px solid grey",
                width: "270px",
                borderRadius: "11px",
                paddingRight: "30px",
              }}
              onChange={(e)=>setBrand2(e.target.value)}
              value={brand2}
            >
              <option value="" selected >
                Search By Brand
              </option>
              {brandData.map((item, index) => {
                return <option >{item?.brandName}</option>;
              })}
            </select>
            <select
              style={{
                height: "40px",
                border: "1px solid grey",
                width: "270px",
                borderRadius: "11px",
                paddingRight: "30px", // Add space for the eye icon
              }}
              onChange={(e)=>setType2(e.target.value)}
              value={type2}
            >
              <option value={""} selected>
                Type
              </option>
              {TypeData.map((item, index) => {
                return <option >{item?.productType}</option>;
              })}
            </select>
              <button className="px-3 py-2 bg-black roounded-lg text-white font-semibold" onClick={clearClick}>clear</button>
              </div>
              <MyProductTable data={newMyProducts} startIndex={startIndex} endIndex={endIndex} getSalonProductsPress={getSalonProductsPress} isChanged={isDelete} setIsChanged={setIsDeleted} handleOpen={handleOpen}/>
              <Pagination 
              totalItems={newMyProducts.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange} />
          
      
            </div>
      
          </div>
        ) : (
          <div>
            <div style={{justifyContent:'space-between',display:'flex',alignItems:'center',marginLeft:'20px'}}>

            <input
              value={searchProdut}
              placeholder="Search by Product Name"
              style={{
                height: "40px",
                border: "1px solid grey",
                width: "270px",
                borderRadius: "11px",
                paddingRight: "30px", // Add space for the eye icon
                marginTop:'14px',
                outline:"none"
              }}
              onChange={onchangeProduct}
            />
            <select
              style={{
                height: "40px",
                border: "1px solid grey",
                width: "270px",
                borderRadius: "11px",
                paddingRight: "30px",
              }}
              onChange={(e)=>setBrandName(e.target.value)}
              value={brandName}
            >
              <option value="" selected >
                Search By Brand
              </option>
              {brandData.map((item, index) => {
                return <option >{item?.brandName}</option>;
              })}
            </select>
            <select
              style={{
                height: "40px",
                border: "1px solid grey",
                width: "270px",
                borderRadius: "11px",
                paddingRight: "30px", // Add space for the eye icon
              }}
              onChange={(e)=>setTypeName(e.target.value)}
              value={typeName}
            >
              <option value={""} selected>
                Type
              </option>
              {TypeData.map((item, index) => {
                return <option >{item?.productType}</option>;
              })}
            </select>

            <button className="bg-black px-3 py-2 rounded-lg text-white font-bold" onClick={handleClear}>CLEAR</button>
            </div>

           {/* <div className="h-[500px] overflow-y-scroll">
           <table className="styled-table" style={{ height: "40px" }}>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>MRP</th>
                  <th>SELLING PRICE</th>
                  <th>TYPE</th>
                  <th>BRAND</th>
                  <th>ADD</th>
                </tr>
              </thead>
              <tbody>
                {getSalonProducts.map((item, index) => (
                  <tr key={index} onClick={() => getSalonProductsPress(item)}>
                    <td>{item.name}</td>
                    <td>{item.mrp}</td>
                    <td>{item.price}</td>
                    <td>{item.type}</td>
                    <td>{item.brand}</td>
                    <th>
                      <div
                        style={{
                          background: "transparent",
                          borderRadius: "10px",
                          height: "35px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor:"pointer"
                        }}
                        onClick={() => addclick(item)}
                      >
                        <p
                          style={{
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                         <BiSolidAddToQueue className="text-xl font-bold text-black"/>
                        </p>
                      </div>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
           </div> */}
           <Table header={allProductHeading} data={getSalonProducts} startIndex={startIndex1} endIndex={endIndex1} addClick={addclick} orderClick={orderClick} getSalonProductsPress={getSalonProductsPress} handleInventryOpen={handleInventryOpen}/>
           <Pagination 
              totalItems={getSalonProducts.length}
              itemsPerPage={itemsPerPage1}
              currentPage={currentPage1}
              onPageChange={handlePageChange1} />
          </div>
        )}
        {/* {addproductModal && (
          <InventoryProductAddModal
            addproductModal={addproductModal}
            setAddProductModal={setAddProductModal}
            productDetailsModal={productDetailsModal}
          />
        )} */}
        <InventoryModel data={getSalonProducts} isVisible={showInventryModel} onClose={()=>setShowInventryModel(false)} id={allProductId}/>

        <OrderPopup isVisible={showOrderPopup} onClose={()=>setShowOrderPopup(false)} id={productOrderId} data={result}/>
        <MyProductPopup data={newMyProducts} isVisible={showMyProductPopup} onClose={()=>setShowMyProductPopup(false)} id={myProductId} isChanged={isChanged} setIsChanged={setIsChanged}/>
      </nav>
      {/* <Pagination
        postsPerPage={postsPerPage}
        totalPosts={getSalonProducts.length}
        paginate={paginate}
      /> */}
    </Layout>
  );
};

export default Inventorydetails;
