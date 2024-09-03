import { useEffect, useState } from "react";
import { postApiData } from "../../utils/services";
import Modal from "react-modal";
import Layout from "../../components/Layout";
import Popup from "../../components/popup";
import { toast } from "react-hot-toast";
import ServiceTable from "../../components/Table/ServiceTable";
import Pagination from "../../components/pagination";
import MyServiceTable from "../../components/Table/MyService";
import GridRows from "../../components/pagination/gridRows";
import NormalInput from "../../components/customInput/NormalInput";
import NormalSelect from "../../components/customInput/NormalSelect";

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
    },
    {
      name: "subCategory",
      placeholder: "Sub Category",
      label: "Sub Category",
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
  console.log({ myServiceData });
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
    if (tab == 1) {
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
        console.log(resp);
        setCustomerServiceData(resp.services);
        setTotal(resp.totalCount);
      },
      (error) => {
        console.log("errro", error);
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
    if (tab == 1) {
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
        console.log("myservice----------respone", resp);
        setMyserviceData(resp.services);
        setTotal1(resp.totalCount);
      },
      (error) => {
        console.log("errro", error);
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
        console.log("my service ki error", error);
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
    <Layout>
      <div className="mt-32 w-[90%] mx-auto">
        <ul className="nav-list">
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
              tab == 1 ? allServiceFilters[name] : myServiceFilters[name];

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
        {tab == 1 ? (
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
            itemsPerPage={tab == 1 ? itemsPerPage : itemsPerPage1}
            handleRowschange={tab == 1 ? handleRowschange : handleRows1change}
          />
        </div>
        <Pagination
          totalItems={tab == 1 ? total : total1}
          itemsPerPage={tab == 1 ? itemsPerPage : itemsPerPage1}
          currentPage={tab == 1 ? currentPage : currentPage1}
          onPageChange={tab == 1 ? handlePageChange : handlePageChange1}
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
            <div className="flex gap-3 flex-col items-center justify-start">
              {/* Category Name */}
              {serviceItemFields.map((input, index) => {
                const { name, placeholder, label } = input;
                const value = serviceItem[name];
                const type =
                  typeof serviceItem[name] === "number" ? "number" : "text";
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center "
                  >
                    <NormalInput
                      name={name}
                      type={type}
                      value={value}
                      placeholder={placeholder}
                      label={label}
                      onChange={handleChange}
                      labelStyles={{ fontWeight: "bold" }}
                      inputStyles={{
                        width: "280px",
                        background: "white",
                        padding: "8px",
                        alignSelf: "center",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                );
              })}

              <button onClick={onclickService} className="px-4 py-3 ">
                Update
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
    </Layout>
  );
}
