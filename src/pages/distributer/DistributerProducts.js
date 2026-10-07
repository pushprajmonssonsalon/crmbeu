import { useEffect, useState } from "react";
import "../Inventorydetails/inventorydetails.css";
import { postApiData } from "../../utils/services";
import Pagination from "../../components/pagination";
import { toast } from "react-hot-toast";
import Table from "../../components/Table";
import DistributerProductTable from "../../components/Table/distributerProduct";
import DistributerOrderPopup from "../../components/popup/DistributerOrderPopup";
import InventoryModel from "../../components/inventoryProductAdd/InventoryModel";
import * as XLSX from "xlsx";
import GridRows from "../../components/pagination/gridRows";
import NormalInput from "../../components/customInput/NormalInput";
import NormalSelect from "../../components/customInput/NormalSelect";
import Loader from "../../components/loader/Loader";
import { AiOutlineSearch } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";

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

const brandData = [
  { brandName: "Loreal" },
  { brandName: "SpringH2O" },
  { brandName: "Thalgo" },
  { brandName: "Skinconyc" },
  { brandName: "Argatinkeratin" },
  { brandName: "Kerastase" },
  { brandName: "Rica" },
  { brandName: "Milk & Shake" },
  { brandName: "Casmara" },
  { brandName: "PHYT" },
];
const TypeData = [{ productType: "Retail" }, { productType: "Professional" }];

const inputFields = [
  { name: "brand", label: "Select Brand" },
  { name: "type", label: "Select Type" },
];

// tab 0 = All Products (shared catalogue), tab 1 = My Products (distributer stock)
const DistributerProducts = ({ tab }) => {
  const [loading, setLoading] = useState(false);
  const [allProductFilters, setAllProductFilters] = useState({
    name: "",
    brand: "",
    type: "",
  });
  const [myProductFilters, setMyProductFilters] = useState({
    name: "",
    brand: "",
    type: "",
  });
  const [newMyProducts, setNewMyProducts] = useState([]);
  const [totalMyProducts, setTotalMyProducts] = useState(0);
  const [totalAllProducts, setTotalAllProducts] = useState(0);
  const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [showInventryModel, setShowInventryModel] = useState(false);
  const [allProductId, setAllProductId] = useState("");
  const [isDelete, setIsDeleted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // pagination — mirrors the salon page: page/itemsPerPage drive My Products,
  // page1/itemsPerPage1 drive All Products.
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [itemsPerPage1, setItemsPerPage1] = useState(10);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageChange1 = (page) => setCurrentPage1(page);
  const handleRowschange = (e) => setItemsPerPage(+e.target.value);
  const handleRows1change = (e) => setItemsPerPage1(+e.target.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (tab === 0) {
      setAllProductFilters((prev) => ({ ...prev, [name]: value }));
    } else {
      setMyProductFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const orderClick = (item) => {
    const product = cart?.find((elm) => item.itemId === elm.itemId);
    if (!product) {
      setCart((prev) => [...prev, item]);
      toast.success("Product added successfully");
    } else {
      toast.error("Product is already added!");
    }
  };

  const removeItem = (idx) => {
    if (idx) {
      setCart((prev) => prev.filter((elm) => elm.itemId !== idx));
      toast.success("Product removed");
    }
  };

  const clearClick = () => {
    if (tab === 0) {
      setAllProductFilters({ brand: "", type: "", name: "" });
    } else {
      setMyProductFilters({ brand: "", type: "", name: "" });
    }
  };

  // My Products — the distributer's own stock
  const myproduct = () => {
    const data = { ...myProductFilters };
    setLoading(true);
    postApiData(
      `dbInventory/getDistributerProducts/?limit=${itemsPerPage}&page=${currentPage}`,
      data,
      (resp) => {
        setLoading(false);
        if (resp?.products?.length > 0) {
          setNewMyProducts(resp.products);
          setTotalMyProducts(resp.totalCount);
        } else {
          setNewMyProducts([]);
          setTotalMyProducts(0);
        }
      },
      () => {
        setLoading(false);
        setNewMyProducts([]);
        setTotalMyProducts(0);
      }
    );
  };

  // All Products — the same shared catalogue the salon side reads
  const getAllProducts = () => {
    const data = { ...allProductFilters };
    setLoading(true);
    postApiData(
      `inventory/getAllProducts/?limit=${itemsPerPage1}&page=${currentPage1}`,
      data,
      (resp) => {
        setLoading(false);
        setAllProducts(resp?.products || []);
        setTotalAllProducts(resp?.total || 0);
      },
      () => {
        setLoading(false);
        setAllProducts([]);
        setTotalAllProducts(0);
      }
    );
  };

  useEffect(() => {
    if (tab !== 0) return;
    const timeoutId = setTimeout(() => getAllProducts(), 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProductFilters, currentPage1, itemsPerPage1, tab, isAdded]);

  useEffect(() => {
    if (tab !== 1) return;
    const timeoutId = setTimeout(() => myproduct(), 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, myProductFilters, isDelete, isAdded, currentPage, itemsPerPage]);

  const handleInventryOpen = (id) => {
    setAllProductId(id);
    setShowInventryModel(true);
  };

  const handleExport = () => {
    const transformedData = newMyProducts.map((item) => item.products);
    if (transformedData.length === 0) return;
    const headers = Object.keys(transformedData[0]);
    const worksheetData = [
      headers,
      ...transformedData.map((product) =>
        headers.map((header) => product[header])
      ),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "distributer-products.xlsx");
  };

  const brandOptions = brandData.map((elm) => ({
    name: elm.brandName,
    value: elm.brandName,
  }));
  const typeOptions = TypeData.map((elm) => ({
    name: elm.productType,
    value: elm.productType,
  }));

  return (
    <>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex flex-col md:flex-row items-start md:items-center mb-6 justify-between gap-3">
          <div className="flex items-center gap-5 flex-wrap">
            <h2 className="text-black text-start font-normal text-[22px] leading-[28px]">
              {tab === 0 ? "All" : "My"} Products
            </h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">
              {tab === 0 ? totalAllProducts || 0 : totalMyProducts || 0} Products
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex items-center w-full sm:w-auto">
              <AiOutlineSearch className="absolute text-lg text-lightGray left-[10px]" />
              <NormalInput
                name="name"
                inputStyles={{
                  width: "280px",
                  maxWidth: "100%",
                  borderRadius: "16px",
                  padding: "5px 40px",
                  fontSize: "14px",
                  borderColor: "#D9D9D9",
                }}
                value={
                  tab === 1 ? myProductFilters["name"] : allProductFilters["name"]
                }
                placeholder="Search by Product Name"
                onChange={handleChange}
              />
            </div>
            <div
              onClick={() => setShowOrderPopup(true)}
              className="relative cursor-pointer "
            >
              <FaShoppingCart className="text-xl" />
              {cart?.length > 0 && (
                <span className="w-5 h-5 absolute -top-3 -right-2 rounded-full text-[10px] flex items-center justify-center bg-green-600 text-white">
                  {cart?.length > 9 ? "9+" : cart?.length}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 items-center mb-9 ">
          {inputFields.map((item, index) => {
            const { name, label } = item;
            const value =
              tab === 1 ? myProductFilters[name] : allProductFilters[name];
            return (
              <div key={index} className="flex flex-col gap-1 w-full sm:w-auto">
                <NormalSelect
                  label={label}
                  value={value}
                  inputStyles={{
                    width: "280px",
                    maxWidth: "100%",
                    borderRadius: "16px",
                    padding: "5px 40px",
                    fontSize: "14px",
                    borderColor: "#D9D9D9",
                  }}
                  onChange={handleChange}
                  options={name === "brand" ? brandOptions : typeOptions}
                  name={name}
                />
              </div>
            );
          })}
          <button
            className="h-[36px] mt-4 w-[100px] bg-black rounded-[16px] flex items-center justify-center text-white text-sm"
            onClick={clearClick}
          >
            clear
          </button>
          {tab === 1 && (
            <button
              className="h-[36px] mt-4 w-[100px] bg-ternary rounded-[16px] flex items-center justify-center text-white text-sm"
              onClick={handleExport}
            >
              Export All
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader />
          </div>
        ) : tab === 1 ? (
          <div className="w-full">
            <DistributerProductTable
              data={newMyProducts}
              isChanged={isDelete}
              setIsChanged={setIsDeleted}
            />
          </div>
        ) : (
          <div className="w-full">
            <Table
              header={allProductHeading}
              data={allProducts}
              addClick={() => {}}
              orderClick={orderClick}
              handleInventryOpen={handleInventryOpen}
            />
          </div>
        )}

        <div className="flex justify-between mt-4 items-center">
          <GridRows
            totalItems={tab === 1 ? totalMyProducts : totalAllProducts}
            itemsPerPage={tab === 1 ? itemsPerPage : itemsPerPage1}
            handleRowschange={tab === 1 ? handleRowschange : handleRows1change}
          />
          <Pagination
            totalItems={tab === 1 ? totalMyProducts : totalAllProducts}
            itemsPerPage={tab === 1 ? itemsPerPage : itemsPerPage1}
            currentPage={tab === 1 ? currentPage : currentPage1}
            onPageChange={tab === 1 ? handlePageChange : handlePageChange1}
          />
        </div>

        <InventoryModel
          data={allProducts.find((item) => item._id === allProductId)}
          isVisible={showInventryModel}
          onClose={() => setShowInventryModel(false)}
          endpoint="dbInventory/addProductToDistributer"
          onAdded={() => setIsAdded((prev) => !prev)}
        />

        <DistributerOrderPopup
          isVisible={showOrderPopup}
          onClose={() => setShowOrderPopup(false)}
          data={cart}
          removeItem={removeItem}
          clearCart={() => setCart([])}
        />
      </div>
    </>
  );
};

export default DistributerProducts;
