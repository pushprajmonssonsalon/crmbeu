import { useEffect, useState } from "react";
import "./inventorydetails.css";
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
import NormalInput from "../../components/customInput/NormalInput";
import NormalSelect from "../../components/customInput/NormalSelect";
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
  const [tab, setTab] = useState(2);
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
      name: "name",
      placeholder: "Search by Product Name",
    },
    {
      name: "brand",
    },
    {
      name: "type",
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
    if (tab === 2) {
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

  const addclick = (item) => {};

  const orderClick = (item) => {
    const product = cart?.find((elm) => item._id === elm._id);

    if (!product) {
      setCart((prev) => [...prev, item]);
      toast.success("Product added successfully");
    } else {
      toast.error("Product is already added!");
    }
  };
  const removeItem = (idx) => {

    if (idx) {
      setCart((prev) => prev.filter(elm=>elm._id!==idx));
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
    if (tab === 2) {
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
    postApiData(
      `inventory/getSalonProducts/?limit=${itemsPerPage}&page=${currentPage}`,
      data,
      (resp) => {
        console.log("getMyProduct----------------------------------", resp);
        if (resp.products.length > 0) {
          // setMyProductList(resp.products);
          setNewMyProducts(resp.products);
          setTotalMyProducts(resp.totalCount);
        }
        else{
          setNewMyProducts([]);
          setTotalMyProducts(0);
        }
      },
      (error) => {
        setNewMyProducts([]);
        setTotalMyProducts(0);

        console.log("error");
      }
    );
  };
  console.log({ newMyProducts });

  const getAllProducts = () => {
    const data = {
      page: currentPage,
      limit: itemsPerPage1,
      ...allProductFilters,
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
  };
  // All products
  useEffect(() => {
    // Debounce function for API call
    if (tab === 2) {
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
  const handleTab = (num) => {
    setTab(num);
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
    <Layout>
      <nav className="navbar mt-52 md:mt-38 w-[80%] mx-auto ">
        <ul className="nav-list mt-40 ">
          <li
            className=" hover:scale-110 px-6 bg-[#191919] text-white font-semibold py-4 rounded-lg cursor-pointer"
            onClick={() => handleTab(2)}
          >
            All PRODUCTS
          </li>
          <li
            className="hover:scale-110 px-6 bg-[#191919] text-white font-semibold py-4 rounded-lg cursor-pointer"
            onClick={() => handleTab(1)}
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
        <div className="flex flex-wrap gap-3 justify-between items-center mt-6">
          {inputFields.map((item, index) => {
            const { name, label, placeholder } = item;
            const value =
              tab == 1 ? myProductFilters[name] : allProductFilters[name];

            const isTypeSelect = placeholder ? true : false;
            return isTypeSelect ? (
              <NormalInput
                key={index}
                name={name}
                label={label}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
              />
            ) : (
              <NormalSelect
                key={index}
                value={value}
                onChange={handleChange}
                options={name === "brand" ? brandOptions : typeOptions}
                name={name}
              />
            );
          })}
          <button
            className="px-3 py-2 bg-black roounded-lg text-white font-semibold"
            onClick={clearClick}
          >
            clear
          </button>
          {tab === 1 && (
            <button
              className="px-3 py-2 bg-green-700 hover:bg-green-600 transition-all duration-150 ease-in-out roounded-lg text-white font-semibold"
              onClick={handleExport}
            >
              export to excel
            </button>
          )}
        </div>
        {tab === 1 ? (
          <div className="flex ">
            <div className="inventory-container-main">
              <MyProductTable
                data={newMyProducts}
                isChanged={isDelete}
                setIsChanged={setIsDeleted}
                handleOpen={handleOpen}
              />
            </div>
          </div>
        ) : (
          <div>
            <Table
              header={allProductHeading}
              data={getSalonProducts}
              
              addClick={addclick}
              orderClick={orderClick}
              handleInventryOpen={handleInventryOpen}
            />
          </div>
        )}
        <GridRows
          itemsPerPage={tab === 1 ? itemsPerPage : itemsPerPage1}
          handleRowschange={tab === 1 ? handleRowschange : handleRows1change}
        />

        <Pagination
          totalItems={tab === 1 ? totalMyProducts : totalProducts}
          itemsPerPage={tab === 1 ? itemsPerPage : itemsPerPage1}
          currentPage={tab === 1 ? currentPage : currentPage1}
          onPageChange={tab === 1 ? handlePageChange : handlePageChange1}
        />
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
          data={newMyProducts?.find((elm)=>elm.products._id===myProductId)?.products}
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
