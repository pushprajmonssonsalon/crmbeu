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
import * as XLSX from 'xlsx';
const allProductHeading = {
  name: "NAME",
  mrp: "MRP",
  sp: "SELLING PRICE",
  type: "TYPE",
  size: "SIZE",
  brand: "BRAND",
  add: "ADD",
  order: "PLACE ORDER",
};

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
  const [newMyProducts, setNewMyProducts] = useState([]);
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
  console.log("getSalonProductslength", getSalonProducts);
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
  const [brandName, setBrandName] = useState(null);
  const [typeName, setTypeName] = useState(null);
  // const [purchaseModel,setPurchaseModel] = useState(false)
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [showInventryModel, setShowInventryModel] = useState(false);
  const [productOrderId, setProductOrderId] = useState([]);
  const [showMyProductPopup, setShowMyProductPopup] = useState(false);
  const [myProductId, setMyProductId] = useState("");
  const [allProductId, setAllProductId] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [isDelete, setIsDeleted] = useState(false);
  const [salonAllProductsDetails, setSalonAllProductsDetails] = useState([])
  // my products states

  const [productName2, setProductName2] = useState("");
  const [brand2, setBrand2] = useState(null);
  const [type2, setType2] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const [currentPage1, setCurrentPage1] = useState(1);
  const itemsPerPage1 = 10;
  const startIndex1 = (currentPage1 - 1) * itemsPerPage1;
  const endIndex1 = currentPage1 * itemsPerPage1;

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
      brandName: "Milk & Shake",
    },
    {
      brandName: "Casmara",
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

  const orderClick = (item) => {
    // setShowOrderPopup(true)
    // setProductOrderId(item)
    if (!productOrderId.includes(item)) {
      setProductOrderId([...productOrderId, item]);
      setCount(productOrderId.length + 1);
      toast.success("Product added successfully");
    } else {
      toast.error("Product is already added!");
    }
  };

  const shopKartClick = () => {
    setShowOrderPopup(true);
  };

  // clear button

  const handleClear = () => {
    setsearchProduct("");
    setBrandName("");
    setTypeName("");
  };

  // my product clear button

  const clearClick = () => {
    setProductName2("");
    setBrand2("");
    setType2("");
  };

  // my Products
  const myproduct = () => {
    const data = {
      name: productName2,
      brand: brand2,
      type: type2,
    };
    postApiData(
      "inventory/getSalonProducts",
      data,
      (resp) => {
        console.log("getMyProduct----------------------------------", resp);
        // setMyProductList(resp.products);
        setNewMyProducts(resp);
        setCurrentPage(1);
      },
      (error) => {
        console.log("error");
      }
    );
  };
  console.log({ newMyProducts });
  useEffect(()=>{
    const data = {
      page: currentPage,
      limit: postsPerPage,
      name: '',
      brand: '',
      type: '',
    };
    postApiData(
      `inventory/getAllProducts`,
      data,
      (resp) => {
        console.log("getallproducts", resp);
        setSalonAllProductsDetails(resp.products);
        setCurrentPage1(1);
      },
      (error) => {
        console.log("error", error);
      }
    );
  },[])
  // All products
  useEffect(() => {
    const data = {
      page: currentPage,
      limit: postsPerPage,
      name: searchProdut,
      brand: brandName,
      type: typeName,
    };
    postApiData(
      `inventory/getAllProducts`,
      data,
      (resp) => {
        console.log("getallproducts", resp);
        setgetSalonProducts(resp.products);
        setCurrentPage1(1);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [isModalOpen, brandName, searchProdut, typeName]);
  console.log({ getSalonProducts });

  useEffect(() => {
    myproduct();
  }, [
    isModalOpen,
    allProducts,
    productName2,
    brand2,
    type2,
    isChanged,
    isDelete,
  ]);
  // console.log({myProductList})

  useEffect(() => {
    const data = {
      brand: "",
      name: "",
      type: "",
    };
    postApiData(
      "inventory/getFilteredProducts",
      data,
      (resp) => {
        console.log("getsalonproduct", resp);
        setMyProductList(resp.products);
        setCurrentPage(1);
      },
      (error) => {
        console.log("error");
      }
    );
  }, []);
  const onchangeProduct = (e) => {
    setsearchProduct(e.target.value);
  };

  const handleInventryOpen = (id) => {
    setAllProductId(id);
    setShowInventryModel(true);
  };

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
          toast.success("Product Added sucessFully");
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
  const currentPosts = getSalonProducts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const result = productOrderId.map((id) => {
    const matchingObject = salonAllProductsDetails.find((obj) => obj._id === id);
    console.log("matching Object", matchingObject);
    return matchingObject
      ? {
          name: matchingObject.name,
          size: matchingObject.size,
          itemId: matchingObject.itemId,
          brand: matchingObject.brand,
          type: matchingObject.type,
        }
      : null;
  });
  console.log("resultss------------", result);

  const handleOpen = (id) => {
    setMyProductId(id);
    setShowMyProductPopup(true);
  };

  const handleExport = () => {
    const transformedData = newMyProducts.map(item => item.products);
    if (transformedData.length === 0) {
      return;
    }
    const headers = Object.keys(transformedData[0]);
    // Create a worksheet from the data
    const worksheetData = [headers, ...transformedData.map(product => headers.map(header => product[header]))];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    // Export the workbook to Excel
    XLSX.writeFile(workbook, 'products.xlsx');
  };
  return (
    <Layout>
      <nav className="navbar w-[80%] mx-auto ">
        <ul className="nav-list mt-40 ">
          <li
            className=" hover:scale-110 px-6 bg-[#191919] text-white font-semibold py-4 rounded-lg cursor-pointer"
            onClick={allProduct}
          >
            All PRODUCTS
          </li>
          <li
            className="hover:scale-110 px-6 bg-[#191919] text-white font-semibold py-4 rounded-lg cursor-pointer"
            onClick={myProducts}
          >
            My Products
          </li>
          <li className="relative">
            <AiOutlineShoppingCart
              className="text-3xl font-bold cursor-pointer text-black hover:text-green-700"
              onClick={shopKartClick}
            />
            <span className="absolute -right-4 bottom-4 text-green-600 font-bold">
              {count}
            </span>
          </li>
        </ul>

        {allProducts == "myProducts" ? (
          <div style={{ display: "flex", width: "100%" }}>
            <div className="inventory-container-main">
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
                    marginTop: "14px",
                    outline: "none",
                  }}
                  onChange={(e) => setProductName2(e.target.value)}
                />
                <select
                  style={{
                    height: "40px",
                    border: "1px solid grey",
                    width: "270px",
                    borderRadius: "11px",
                    paddingRight: "30px",
                  }}
                  onChange={(e) => setBrand2(e.target.value)}
                  value={brand2}
                >
                  <option value="" selected>
                    Search By Brand
                  </option>
                  {brandData.map((item, index) => {
                    return <option>{item?.brandName}</option>;
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
                  onChange={(e) => setType2(e.target.value)}
                  value={type2}
                >
                  <option value={""} selected>
                    Type
                  </option>
                  {TypeData.map((item, index) => {
                    return <option>{item?.productType}</option>;
                  })}
                </select>
                <button
                  className="px-3 py-2 bg-black roounded-lg text-white font-semibold"
                  onClick={clearClick}
                >
                  clear
                </button>
                <button
                  className="px-3 py-2 bg-green-700 hover:bg-green-600 transition-all duration-150 ease-in-out roounded-lg text-white font-semibold"
                  onClick={handleExport}
                >
                  export to excel
                </button>
              </div>
              <MyProductTable
                data={newMyProducts}
                startIndex={startIndex}
                endIndex={endIndex}
                getSalonProductsPress={getSalonProductsPress}
                isChanged={isDelete}
                setIsChanged={setIsDeleted}
                handleOpen={handleOpen}
              />
              <Pagination
                totalItems={newMyProducts.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center",
                marginLeft: "20px",
              }}
            >
              <input
                value={searchProdut}
                placeholder="Search by Product Name"
                style={{
                  height: "40px",
                  border: "1px solid grey",
                  width: "270px",
                  borderRadius: "11px",
                  paddingRight: "30px", // Add space for the eye icon
                  marginTop: "14px",
                  outline: "none",
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
                onChange={(e) => setBrandName(e.target.value)}
                value={brandName}
              >
                <option value="" selected>
                  Search By Brand
                </option>
                {brandData.map((item, index) => {
                  return <option>{item?.brandName}</option>;
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
                onChange={(e) => setTypeName(e.target.value)}
                value={typeName}
              >
                <option value={""} selected>
                  Type
                </option>
                {TypeData.map((item, index) => {
                  return <option>{item?.productType}</option>;
                })}
              </select>

              <button
                className="bg-black px-3 py-2 rounded-lg text-white font-bold"
                onClick={handleClear}
              >
                CLEAR
              </button>
            </div>
            <Table
              header={allProductHeading}
              data={getSalonProducts}
              startIndex={startIndex1}
              endIndex={endIndex1}
              addClick={addclick}
              orderClick={orderClick}
              getSalonProductsPress={getSalonProductsPress}
              handleInventryOpen={handleInventryOpen}
            />
            <Pagination
              totalItems={getSalonProducts.length}
              itemsPerPage={itemsPerPage1}
              currentPage={currentPage1}
              onPageChange={handlePageChange1}
            />
          </div>
        )}
        <InventoryModel
          data={getSalonProducts}
          isVisible={showInventryModel}
          onClose={() => setShowInventryModel(false)}
          id={allProductId}
        />

        <OrderPopup
          isVisible={showOrderPopup}
          onClose={() => setShowOrderPopup(false)}
          id={productOrderId}
          data={result}
        />
        <MyProductPopup
          data={newMyProducts}
          isVisible={showMyProductPopup}
          onClose={() => setShowMyProductPopup(false)}
          id={myProductId}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
        />
      </nav>
    </Layout>
  );
};

export default Inventorydetails;
