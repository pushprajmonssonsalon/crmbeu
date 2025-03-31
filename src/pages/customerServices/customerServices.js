import { useEffect, useState } from "react";
import { postApiData } from "../../utils/services";
import Modal from "react-modal";
import Popup from "../../components/popup";
import { toast } from "react-hot-toast";
import ServiceTable from "../../components/Table/ServiceTable";
import Pagination from "../../components/pagination";
import MyServiceTable from "../../components/Table/MyService";
import GridRows from "../../components/pagination/gridRows";
import NormalInput from "../../components/customInput/NormalInput";
import NormalSelect from "../../components/customInput/NormalSelect";
import { AiOutlineSearch } from "react-icons/ai";

export default function CustomerServices() {
  const [customerServiceData, setCustomerServiceData] = useState([]);
  const [total, setTotal] = useState(0);
  const [addproductModal, setAddProductModal] = useState(false);
  const [serviceItem, setServiceItem] = useState({
    mrp: 0,
    price: 0,
    appMrp: 0,
    appPrice: 0,
    category: "",
    subCategory: "",
  });

  const [myServiceData, setMyserviceData] = useState([]);
  const [tab, setTab] = useState(1);
  // show popup
  const [showPopup, setShowPopup] = useState(false);
  // selected
  const [allServiceFilters, setAllServiceFilters] = useState({
    category: "",
    gender: "",
    name: "",
  });
  const [myServiceFilters, setMyServiceFilters] = useState({
    category: "",
    gender: "",
    name: "",
  });

  // my selected service
  const [selectedMyService, setSelectedMyService] = useState({});
  const [total1, setTotal1] = useState(0);

  const CategoryData = [
    {
      name: "Hair",
    },
    {
      name: "Makeup",
    },
    {
      name: "Beauty",
    },
    {
      name: "Hand & Feet",
    },
    {
      name: "Spa",
    },
    {
      name: "Nail",
    },
  ];
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const [currentPage1, setCurrentPage1] = useState(1);
  const [itemsPerPage1, setItemsPerPage1] = useState(10);

  const allServicesItemFields = [
    {
      name: "name",
      placeholder: "Search By Service Name",
    },
    {
      name: "category",
    },
    {
      name: "gender",
    },
  ];
  const serviceItemFields = [
    {
      name: "category",
      placeholder: "Category",
      label: "Category",
      disabled:true,
    },
    {
      name: "subCategory",
      placeholder: "Sub Category",
      label: "Sub Category",
      disabled:true
    },
    {
      name: "mrp",
      placeholder: "Mrp",
      label: "Mrp",
    },
    {
      name: "price",
      placeholder: "Price",
      label: "Price",
    },
    {
      name: "appMrp",
      placeholder: "App Mrp",
      label: "App Mrp",
    },
    {
      name: "appPrice",
      placeholder: "App Price",
      label: "App Price",
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePageChange1 = (page) => {
    setCurrentPage1(page);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const closeModal = () => {
    setAddProductModal(false);
  };
  const handleFiltersChange = (e) => {
    const { name, value } = e.target;
    if (tab === 0) {
      setAllServiceFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setMyServiceFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const getAllServices = () => {
    postApiData(
      `salonService/getAllServices/?limit=${itemsPerPage}&page=${currentPage}`,
      allServiceFilters,
      (resp) => {

        setCustomerServiceData(resp.services);
        setTotal(resp.totalCount);
      },
      (error) => {

      }
    );
  };

  useEffect(() => {
    // Debounce function for API call
    if (tab == 1) {
      let timeoutId;
      const debouncedFetchData = () => {
        timeoutId = setTimeout(() => {
          getAllServices(); // Function to fetch data from API
        }, 500); // 500ms debounce delay
      };

      // Call debouncedFetchData whenever formData or currentPage changes
      debouncedFetchData();

      // Cleanup function to clear timeout on component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [tab, allServiceFilters, tab, itemsPerPage, currentPage]);
  const clearService = () => {
    if (tab === 1) {
      setAllServiceFilters({
        name: "",
        category: "",
        gender: "",
      });
    } else {
      setMyServiceFilters({
        name: "",
        category: "",
        gender: "",
      });
    }
  };



  const getSalonServices = () => {
    postApiData(
      `salonService/getSalonServices/?limit=${itemsPerPage1}&page=${currentPage1}`,
      myServiceFilters,
      (resp) => {

        setMyserviceData(resp.services);
        setTotal1(resp.totalCount);
      },
      (error) => {

      }
    );
  };
  useEffect(() => {
    // Debounce function for API call
    if (tab == 2) {
      let timeoutId;
      const debouncedFetchData = () => {
        timeoutId = setTimeout(() => {
          getSalonServices(); // Function to fetch data from API
        }, 500); // 500ms debounce delay
      };

      // Call debouncedFetchData whenever formData or currentPage changes
      debouncedFetchData();

      // Cleanup function to clear timeout on component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [tab, myServiceFilters, itemsPerPage1, currentPage1]);

  const addclick = (item) => {
    setAddProductModal(true);
    setServiceItem({ ...item, appMrp: item.mrp, appPrice: item.price });
  };

  const onclickService = () => {
    const data = {
      id: serviceItem?._id,
      ...serviceItem,
    };
    postApiData(
      "salonService/addServicesToSalon",
      data,
      (resp) => {
        // if (resp) {
        toast.success("Service Added Sucessfully");
        setAddProductModal(false);
      },
      (error) => {

        toast.error("Service already Added");
      }
    );
  };

  const handleTab = (tabNumber) => {
    setTab(tabNumber);
  };
  const handleEditService = (id) => {
    const item = myServiceData?.find(
      (item) => item?.services?.serviceId === id
    );

    if (item) {
      setSelectedMyService(item.services);
      setShowPopup(true);
    }
  };
  const handleUpdate = (updatedItem) => {
    setMyserviceData((prev) =>
      prev.map((item) => {
        if (item?.services?.serviceId === updatedItem.serviceId) {
          return { services: updatedItem };
        }
        return item;
      })
    );
    setShowPopup(false);
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
    const { name, value, type } = e.target;
    setServiceItem((prev) => ({
      ...prev,
      [name]: type === "number" ? +value : value,
    }));
  };
  const categoryOptions = CategoryData.map((elm) => ({
    name: elm.name,
    value: elm.name,
  }));
  const genderOptions = [
    {
      name: "Female",
      value: "F",
    },
    {
      name: "Male",
      value: "M",
    },
  ];

  return (
    <>
      <div className="">
         <div className="flex items-center mb-6 justify-between">
                <div className="flex items-center gap-5">
      
                  <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">{tab===0?"All":"My"} Services</h2>
                  <span className="rounded-[16px] text-xs px-6 border border-gray2">{tab === 0 ? total || 0 : total1 || 0} Products</span>
                </div>
      
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
                      value={tab == 1 ? allServiceFilters["name"] : myServiceFilters["name"]}
                      placeholder="Search by Product Name"
                      onChange={handleChange}
                    />
                  </div>
                 
              
              </div>
              <div className="flex gap-6 items-center mb-9 ">
                {allServicesItemFields.map((item, index) => {
                  const { name, label, placeholder } = item;
                  const value =
                  tab === 0? allServiceFilters[name] : myServiceFilters[name];
      
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
                      options={name === "category" ? categoryOptions : genderOptions}
                      name={name}
                    />
                    </div>
                  )
                 
                })}
                <button
                  className="h-[36px] mt-4 w-[100px] bg-black rounded-[16px] flex items-center justify-center text-white text-sm"
                  onClick={clearService}
                >
                  clear
                </button>
                {tab === 1 && (
                  <button
                  className="h-[36px] mt-4 w-[100px] bg-ternary rounded-[16px] flex items-center justify-center text-white text-sm"
                  onClick={()=>{}}
                  >
                    Export All
                  </button>
                )}
              </div>
        <ul className="">
          <li className="mx-6 font-medium inter text-lg text-slate-100 cursor-pointer">
            <button
              className="  py-2 px-4 rounded-lg text-white flex justify-center items-center bg-black "
              onClick={() => handleTab(1)}
            >
              <h3
                className="font-semibold text-lg poppins "
                style={{ color: tab == 1 ? "white" : "gray" }}
              >
                All Service
              </h3>
            </button>
          </li>
          <li className="mx-6 font-medium inter text-lg text-slate-100 cursor-pointer">
            <button
              className="py-2 px-4 rounded-lg text-white flex justify-center items-center bg-black "
              onClick={() => handleTab(2)}
            >
              <h3
                className="font-semibold text-lg poppins "
                style={{ color: tab == 2 ? "white" : "gray" }}
              >
                My Service
              </h3>
            </button>
          </li>
        </ul>
        <div className="flex my-6 gap-6 flex-wrap justify-between items-center mt-6">
          {allServicesItemFields.map((item, index) => {
            const { name, label, placeholder } = item;
            const value =
              tab === 0 ? allServiceFilters[name] : myServiceFilters[name];

            const isTypeSelect = placeholder ? true : false;
            return isTypeSelect ? (
              <NormalInput
                key={index}
                name={name}
                label={label}
                value={value}
                placeholder={placeholder}
                onChange={handleFiltersChange}
              />
            ) : (
              <NormalSelect
                key={index}
                value={value}
                onChange={handleFiltersChange}
                options={name === "category" ? categoryOptions : genderOptions}
                name={name}
              />
            );
          })}

          <button
            className="px-3 py-2 mt-5px bg-black roounded-lg text-white font-semibold"
            onClick={clearService}
          >
            Clear
          </button>
        </div>
        {/* <div className="h-[700px] overflow-y-auto mt-3">
      <div className="table-container"> */}
        {tab ===0 ? (
          <ServiceTable
            data={customerServiceData}
            startIndex={startIndex}
            endIndex={endIndex}
            addclick={addclick}
          />
        ) : (
          <MyServiceTable
            data={myServiceData}
            handleEditService={handleEditService}
          />
        )}
        <div className="my-3">
          <GridRows
            itemsPerPage={tab === 0 ? itemsPerPage : itemsPerPage1}
            handleRowschange={tab === 0 ? handleRowschange : handleRows1change}
          />
        </div>
        <Pagination
          totalItems={tab == 0 ? total : total1}
          itemsPerPage={tab == 0 ? itemsPerPage : itemsPerPage1}
          currentPage={tab == 0 ? currentPage : currentPage1}
          onPageChange={tab == 0 ? handlePageChange : handlePageChange1}
        />
        {/* </div>
      </div> */}
        {/* <Pagination
        postsPerPage={postsPerPage}
        totalPosts={serviceData.length}
        paginate={paginate}
        currentPage={currentPage}
      /> */}
        {addproductModal && (
          <Modal
            ariaHideApp={false}
            isOpen={addproductModal}
            //   onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div className="flex w-[400px] bg-transparent gap-3 flex-col items-center justify-start">
              {/* Category Name */}

              <div className="grid gap-1 w-full items-center">
                {serviceItemFields.map((input, index) => {
                  const { name, placeholder, label ,disabled } = input;
                  const value = serviceItem[name];


                  return (
                    <div key={index} className="flex flex-col gap-1">
                      <NormalInput
                        name={name}
                        value={value}
                        label={label}
                        disabled={disabled}
                      
                        inputStyles={{ background: "#d1d5db" }}
                        placeholder={placeholder}
                        onChange={handleChange}
                      />
                    </div>
                  );
                })}
              </div>

              <button
                className={`bg-blue-400 mt-3 text-white font-bold p-3 hover:text-gray-500 rounded-xl `}
                onClick={onclickService}
              >
                Submit
              </button>

            </div>
          </Modal>
        )}
        {showPopup && (
          <Popup
            isVisible={showPopup}
            onClose={() => setShowPopup(false)}
            onUpdate={handleUpdate}
            editItem={selectedMyService}
          />
        )}{" "}
      </div>
    </>
  );
}
