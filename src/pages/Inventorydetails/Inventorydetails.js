import { useEffect, useState } from "react";
import "./inventorydetails.css";
import { getApiCall, postApiData } from "../../utils/services";
import Pagination from "../../components/pagination";
import { toast } from "react-hot-toast";
import Table from "../../components/Table";
import MyProductTable from "../../components/Table/myProduct";
import OrderPopup from "../../components/popup/OrderPopup";
import MyProductPopup from "../../components/popup/MyProductPopup";
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

const Inventorydetails = ({ tab }) => {
  const [count, setCount] = useState(0);
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

  const [getSalonProducts, setgetSalonProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState([]);

  const [isModalOpen, setModalOpen] = useState(false);

  // const [purchaseModel,setPurchaseModel] = useState(false)
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [showInventryModel, setShowInventryModel] = useState(false);
  const [showMyProductPopup, setShowMyProductPopup] = useState(false);
  const [myProductId, setMyProductId] = useState("");
  const [allProductId, setAllProductId] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [isDelete, setIsDeleted] = useState(false);
  // my products states

  const inputFields = [
  
    {
      name: "brand",
      label:"Select Brand"
    },
    {
      name: "type",
      label:"Select Type"

    },
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (tab === 0) {
      setAllProductFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setMyProductFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const brandData = [
    {
      brandName: "Loreal",
    },
    {
      brandName: "SpringH2O",
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

  const addclick = (item) => { };

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
      toast.success("Product added successfully");
    } else {
      toast.error("Product is already added!");
    }
  };

  const shopKartClick = () => {


    setShowOrderPopup(true);
  };

  // clear button

  // my product clear button

  const clearClick = () => {
    if (tab === 0) {
      setAllProductFilters({
        brand: "",
        type: "",
        name: "",
      });
    } else {
      setMyProductFilters({
        brand: "",
        type: "",
        name: "",
      });
    }
  };

  // my Products
  const myproduct = () => {
    const data = {
      page: currentPage1,
      limit: itemsPerPage1,
      ...myProductFilters,
    };
    setLoading(true);
    postApiData(
      `inventory/getSalonProducts/?limit=${itemsPerPage}&page=${currentPage}`,
      data,
      (resp) => {
        if (resp.products.length > 0) {
          // setMyProductList(resp.products);
          setLoading(false);

          setNewMyProducts(resp.products);
          setTotalMyProducts(resp.totalCount);
        } else {
          setLoading(false);

          setNewMyProducts([]);
          setTotalMyProducts(0);
        }
      },
      (error) => {
        setLoading(false);
        setNewMyProducts([]);
        setTotalMyProducts(0);
      }
    );
  };

  const getAllProducts = () => {
    const data = {
      page: currentPage,
      limit: itemsPerPage1,
      ...allProductFilters,
    };
    setLoading(true);

    postApiData(
      `inventory/getAllProducts/?limit=${itemsPerPage1}&page=${currentPage1}`,
      data,
      (resp) => {
        setLoading(false);
        setgetSalonProducts(resp.products);
        setTotalAllProducts(resp?.total);
      },
      (error) => {
        setLoading(false);
      }
    );
  };
  // All products
  useEffect(() => {
    // Debounce function for API call
    if (tab === 0) {
      let timeoutId;
      const debouncedFetchData = () => {
        timeoutId = setTimeout(() => {
          getAllProducts(); // Function to fetch data from API
        }, 500); // 500ms debounce delay
      };

      // Call debouncedFetchData whenever formData or currentPage changes
      debouncedFetchData();

      // Cleanup function to clear timeout on component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [isModalOpen, allProductFilters, currentPage1, itemsPerPage1]);

  useEffect(() => {
    getApiCall(
      "inventory/getOutOfStockProducts",
      (res) => {
        const prods = res?.products.length > 0 ? res?.products : [];
        const filterdProds = prods?.filter((elm) => {
          const isAlreadyPresent = cart.find((item) => item.itemId === elm.itemId)
          return !isAlreadyPresent

        })
        setCart((prev) => [...prev, ...filterdProds])
      },
      () => { }
    );
  }, [])
  useEffect(() => {
    // Debounce function for API call
    if (tab === 1) {
      let timeoutId;
      const debouncedFetchData = () => {
        timeoutId = setTimeout(() => {
          myproduct(); // Function to fetch data from API
        }, 500); // 500ms debounce delay
      };

      // Call debouncedFetchData whenever formData or currentPage changes
      debouncedFetchData();

      // Cleanup function to clear timeout on component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [
    isModalOpen,
    tab,
    myProductFilters,

    isChanged,
    isDelete,
    currentPage,
    itemsPerPage,
  ]);

  const handleInventryOpen = (id) => {
    setAllProductId(id);
    setShowInventryModel(true);
  };


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
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center gap-5">

            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">{tab===0?"All":"My"} Products</h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">{tab === 0 ? totalAllProducts || 0 : totalMyProducts || 0} Products</span>
          </div>
          <div className="flex items-center gap-3">

            <div className="relative flex items-center">
              <AiOutlineSearch className="absolute text-lg text-lightGray left-[10px]" />
              <NormalInput
                name="name"
                inputStyles={{
                  'width': "280px",
                  borderRadius: "16px",
                  padding: "5px 40px",
                  fontSize: "14px",
                  borderColor: "#D9D9D9"
                }}
                value={tab == 1 ? myProductFilters["name"] : allProductFilters["name"]}
                placeholder="Search by Product Name"
                onChange={handleChange}
              />
            </div>
            <div onClick={() => setShowOrderPopup(true)} className="relative cursor-pointer ">
              <FaShoppingCart className="text-xl" />
              {cart?.length>0 && <span className="w-5 h-5 absolute -top-3 -right-2 rounded-full text-[10px] flex items-center justify-center bg-green-600 text-white"> {cart?.length > 9 ? "9" : cart?.length}</span>}

            </div>
          </div>
        </div>
        <div className="flex gap-6 items-center mb-9 ">
          {inputFields.map((item, index) => {
            const { name, label, placeholder } = item;
            const value =
              tab == 1 ? myProductFilters[name] : allProductFilters[name];

            return  (
             <div className="flex flex-col gap-1">
             
              <NormalSelect
                key={index}
                label={label}
                value={value}
                inputStyles={{
                  'width': "280px",
                  borderRadius: "16px",
                  padding: "5px 40px",
                  fontSize: "14px",
                  borderColor: "#D9D9D9"
                }}
                onChange={handleChange}
                options={name === "brand" ? brandOptions : typeOptions}
                name={name}
              />
              </div>
            )
           
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
              <MyProductTable
                data={newMyProducts}
                isChanged={isDelete}
                setIsChanged={setIsDeleted}
                handleOpen={handleOpen}
              />
            </div>
       
        ) : (
          <div className="w-full">
            <Table
              header={allProductHeading}
              data={getSalonProducts}
              addClick={addclick}
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
          data={getSalonProducts.find((item) => item._id === allProductId)}
          isVisible={showInventryModel}
          onClose={() => setShowInventryModel(false)}
        />

        <OrderPopup
          isVisible={showOrderPopup}
          onClose={() => setShowOrderPopup(false)}
          data={cart}
          removeItem={removeItem}
        />
        <MyProductPopup
          data={
            newMyProducts?.find((elm) => elm.products._id === myProductId)
              ?.products
          }
          isVisible={showMyProductPopup}
          onClose={() => setShowMyProductPopup(false)}
          id={myProductId}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
        />
      </div>
    </>
  );
};

export default Inventorydetails;
