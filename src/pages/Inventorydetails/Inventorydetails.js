import { useEffect, useState } from "react";
import "./inventorydetails.css";
import productList from "./productlist";
import { postApiData } from "../../utils/services";
import Pagination from "../../components/pagination";
import Layout from "../../components/Layout";
import { toast } from "react-hot-toast";
import Table from "../../components/Table";
import MyProductTable from "../../components/Table/myProduct";
import OrderPopup from "../../components/popup/OrderPopup";
import { AiOutlineShoppingCart } from "react-icons/ai";
import MyProductPopup from "../../components/popup/MyProductPopup";
import InventoryModel from "../../components/inventoryProductAdd/InventoryModel";
import * as XLSX from "xlsx";
import GridRows from "../../components/pagination/gridRows";
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
  const [totalMyProducts, setTotalMyProducts] = useState(0);
  const [cart, setCart] = useState([]);

  const [getSalonProducts, setgetSalonProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addproductModal, setAddProductModal] = useState(false);
  const [searchProdut, setsearchProduct] = useState(null);
  const [productDetailsModal, setProductDetailModal] = useState([]);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const [allProducts, setAllproducts] = useState("allProducts");
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
  // my products states

  const [productName2, setProductName2] = useState("");
  const [brand2, setBrand2] = useState(null);
  const [type2, setType2] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [currentPage1, setCurrentPage1] = useState(1);
  const [itemsPerPage1, setItemsPerPage1] = useState(10);
  const startIndex1 = (currentPage1 - 1) * itemsPerPage1;
  const endIndex1 = currentPage1 * itemsPerPage1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePageChange1 = (page) => {
    setCurrentPage1(page);
  };
  const handleRowschange = (e) => {
    const { value } = e.target;
    setItemsPerPage(+value);
  };
  const handleRows1change = (e) => {
    const { value } = e.target;
    setItemsPerPage1(+value);
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
    const product = cart?.find((elm) => item._id === elm._id);

    if (!product) {
      setCart((prev) => [...prev, item]);
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
      `inventory/getSalonProducts/?limit=${itemsPerPage}&page=${currentPage}`,
      data,
      (resp) => {
        console.log("getMyProduct----------------------------------", resp);
        // setMyProductList(resp.products);
        setNewMyProducts(resp.products);
        setTotalMyProducts(resp.totalCount);
      },
      (error) => {
        console.log("error");
      }
    );
  };
  console.log({ newMyProducts });

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
      `inventory/getAllProducts/?limit=${itemsPerPage1}&page=${currentPage1}`,
      data,
      (resp) => {
        console.log("getallproducts", resp);
        setgetSalonProducts(resp.products);
        setTotalProducts(resp?.total);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [
    isModalOpen,
    brandName,
    searchProdut,
    typeName,
    currentPage1,
    itemsPerPage1,
  ]);

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
    currentPage,
    itemsPerPage,
  ]);

  const onchangeProduct = (e) => {
    setsearchProduct(e.target.value);
  };

  const handleInventryOpen = (id) => {
    setAllProductId(id);
    setShowInventryModel(true);
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
  

  // const result = productOrderId.map((id) => {
  //   const matchingObject = getSalonProducts?.find((obj) => obj._id === id);
  //   console.log("matching Object", matchingObject, productOrderId);
  //   return matchingObject
  //     ? {
  //         name: matchingObject.name,
  //         size: matchingObject.size,
  //         itemId: matchingObject.itemId,
  //         brand: matchingObject.brand,
  //         type: matchingObject.type,
  //       }
  //     : null;
  // });
  // console.log("resultss------------", result);

  const handleOpen = (id) => {
    setMyProductId(id);
    setShowMyProductPopup(true);
  };

  const handleExport = () => {
    const transformedData = newMyProducts.map((item) => item.products);
    if (transformedData.length === 0) {
      return;
    }
    const headers = Object.keys(transformedData[0]);
    // Create a worksheet from the data
    const worksheetData = [
      headers,
      ...transformedData.map((product) =>
        headers.map((header) => product[header])
      ),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    // Export the workbook to Excel
    XLSX.writeFile(workbook, "products.xlsx");
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
              {cart?.length}
            </span>
          </li>
        </ul>

        {allProducts == "myProducts" ? (
          <div className="flex ">
            <div className="inventory-container-main">
              <div className="flex flex-wrap gap-3 justify-between items-center mt-6">
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
                getSalonProductsPress={getSalonProductsPress}
                isChanged={isDelete}
                setIsChanged={setIsDeleted}
                handleOpen={handleOpen}
              />
              <GridRows
                itemsPerPage={itemsPerPage}
                handleRowschange={handleRowschange}
              />

              <Pagination
                totalItems={totalMyProducts}
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
            <GridRows
              itemsPerPage={itemsPerPage1}
              handleRowschange={handleRows1change}
            />

            <Pagination
              totalItems={totalProducts}
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
          data={cart}
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
