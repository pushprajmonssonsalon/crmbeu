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
import Loader from "../../components/loader/Loader";
import exportToExcel from "../../utils/exportToExcel";
import { MdOutlineClose } from "react-icons/md";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import CustomSelect from "../../components/customInput/CustomSelect";

export default function CustomerServices({ tab }) {
  const [customerServiceData, setCustomerServiceData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false)
  const [addproductModal, setAddProductModal] = useState(false);
  const [serviceItem, setServiceItem] = useState({
    name: "",
    mrp: "",
    price: "",
    appMrp: "",
    appPrice: "",
    category: "",
    subCategory: "",
  });

  const [myServiceData, setMyserviceData] = useState([]);
  // show popup
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
  const subCategoryData = [
    "Hair Straightening",
    "Bridal Makeup",
    "Cleanup",
    "Threading",
    "Portable Bed Massage",
    "Piercing",
    "Occassion Makeup",
    "Body Polishing",
    "Nail Extensions",
    "Nail Art",
    "Mehendi",
    "Body Wax",
    "Express Spa",
    "Hd Bridal Makeup",
    "Facials",
    "Light Makeup",
    "Hair Color",
    "Scrubs & Wraps",
    "Hair Treatment",
    "Color Touch Up",
    "Mani/ Pedi",
    "MANICURE & PEDICURE",
    "Massages",
    "Cut & Style",
    "Nail Refill",
    "Bleach",
    "Others",
    "Hair Spa",
    "Basic Makeup",
    "Package"
  ]
  const categoryOptions = CategoryData.map((elm) => ({
    name: elm.name,
    value: elm.name,
  }));
  const subCategoryOptions = subCategoryData?.map((elm) => ({
    name: elm,
    value: elm
  }))
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const [currentPage1, setCurrentPage1] = useState(1);
  const [itemsPerPage1, setItemsPerPage1] = useState(10);

  const allServicesItemFields = [

    {
      name: "category",
      label: "Select Category"
    },
    {
      name: "gender",
      label: 'Select Gender'
    },
  ];
  const serviceItemFields = [
    {
      name: "name",
      placeholder: "Name",
      label: "Name",
      // disabled: true,
    },
    {
      name: "category",
      placeholder: "Category",
      label: "Category",
      options: categoryOptions
      // disabled: true,
    },
    {
      name: "subCategory",
      placeholder: "Sub Category",
      label: "Sub Category",
      options: subCategoryOptions
      // disabled: true
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
    setLoading(true)
    postApiData(
      `salonService/getAllServices/?limit=${itemsPerPage}&page=${currentPage}`,
      allServiceFilters,
      (resp) => {
        setLoading(false)
        setCustomerServiceData(resp.services);
        setTotal(resp.totalCount);
      },
      (error) => {
        setLoading(false)

      }
    );
  };

  useEffect(() => {
    // Debounce function for API call
    if (tab == 0) {
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
    if (tab === 0) {
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
    setLoading(true)

    postApiData(
      `salonService/getSalonServices/?limit=${itemsPerPage1}&page=${currentPage1}`,
      myServiceFilters,
      (resp) => {
        setLoading(false)

        setMyserviceData(resp.services);
        setTotal1(resp.totalCount);
      },
      (error) => {
        setLoading(false)

      }
    );
  };
  useEffect(() => {
    // Debounce function for API call
    if (tab == 1) {
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

  const handleEditService = (id) => {
    const item = myServiceData?.find(
      (item) => item?.services?.serviceId === id
    );

    if (item) {
      setSelectedMyService(item.services);
      setShowPopup(true);
    }
  };
  const handleDeleteService = (id) => {
    const item = myServiceData?.find(
      (item) => item?.services?.serviceId === id
    );

    if (item) {
      setSelectedMyService(item.services);
      setShowConfirm(true);
    }
  };
  const handleDelete = () => {
    const data = {
      uniqueCode: selectedMyService?.uniqueCode,
    };
    postApiData(
      "salonService/deleteServiceInParlor",
      data,
      (resp) => {
        // if (resp) {
        toast.success("Service deleted Sucessfully");
        setMyserviceData((prev) =>
          prev.filter((item) => item?.services?.uniqueCode !== selectedMyService?.uniqueCode)
        );
        setShowConfirm(false);

      },
      (error) => {

        toast.error("Service already deleted");
      }
    );

  }
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
  const handleExport = () => {
    if (myServiceData) {
      const formattedData = myServiceData.map((item) => {
        const { services } = item;
        return {
          ...services,
          category: services.category,
          subCategory: services.subCategory,
          serviceId: services.serviceId,
        };
      });
      exportToExcel(formattedData, "Services", "Services.xlsx");
    }

  };
  const handleAddService = () => {
    setAddProductModal(true);
  };
  return (
    <>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex flex-col md:flex-row items-start md:items-center mb-6 justify-between gap-3">
          <div className="flex items-center gap-5 flex-wrap">

            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">{tab === 0 ? "All" : "My"} Services</h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">{tab === 0 ? total || 0 : total1 || 0} Products</span>
          </div>

          <div className="relative flex items-center w-full md:w-auto">
            <AiOutlineSearch className="absolute text-lg text-lightGray left-[10px]" />
            <NormalInput
              name="name"
              inputStyles={{
                'width': "280px",
                maxWidth: "100%",
                borderRadius: "16px",
                padding: "5px 40px",
                fontSize: "14px",
                borderColor: "#D9D9D9"
              }}
              value={tab === 0 ? allServiceFilters["name"] : myServiceFilters["name"]}
              placeholder="Search by Product Name"
              onChange={handleFiltersChange}
            />
          </div>

        </div>
        <div className="flex flex-wrap gap-6 items-center mb-9 ">
          {allServicesItemFields.map((item, index) => {
            const { name, label, placeholder } = item;
            const value =
              tab === 0 ? allServiceFilters[name] : myServiceFilters[name];

            return (
              <div className="flex flex-col gap-1 w-full sm:w-auto">

                <NormalSelect
                  key={index}
                  label={label}
                  value={value}
                  inputStyles={{
                    'width': "280px",
                    maxWidth: "100%",
                    borderRadius: "16px",
                    padding: "5px 40px",
                    fontSize: "14px",
                    borderColor: "#D9D9D9"
                  }}
                  onChange={handleFiltersChange}
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
            <>
              <button
                className="h-[36px] mt-4 w-[100px] bg-ternary rounded-[16px] flex items-center justify-center text-white text-sm"
                onClick={handleExport}
              >
                Export All
              </button>
              {/* 
              <button
                className="h-[36px] mt-4 w-[120px] bg-green-600 rounded-[16px] flex items-center justify-center text-white text-sm"
                onClick={handleAddService}
              >
                Add Service
              </button> */}
            </>
          )}
        </div>


        {/* <div className="h-[700px] overflow-y-auto mt-3">
      <div className="table-container"> */}
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader />
          </div>
        ) :

          tab === 0 ? (
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
              handleDeleteService={handleDeleteService}
            />
          )}
        <div className="flex justify-between mt-4 items-center">
          <GridRows
            totalItems={tab === 0 ? total : total1}
            itemsPerPage={tab === 0 ? itemsPerPage : itemsPerPage1}
            handleRowschange={tab === 0 ? handleRowschange : handleRows1change}
          />

          <Pagination
            totalItems={tab == 0 ? total : total1}
            itemsPerPage={tab == 0 ? itemsPerPage : itemsPerPage1}
            currentPage={tab == 0 ? currentPage : currentPage1}
            onPageChange={tab == 0 ? handlePageChange : handlePageChange1}
          />
        </div>
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
            overlayClassName={'fixed inset-0 z-40 bg-black/20'}
            className='fixed z-50 inset-0 bg-black/20 flex items-start justify-center p-4 overflow-y-auto'
            contentLabel="Example Modal"
          >
            <div className='w-full sm:w-[350px] md:w-[450px] bg-white p-4 rounded-xl relative my-auto mx-auto max-h-full overflow-y-auto overflow-x-hidden'>
              {/* Category Name */}
              <div className='flex justify-between items-center mb-6'>
                <h1 className={`text-2xl text-black `}>Edit your response</h1>
                <button className='text-black text-xl' onClick={closeModal}><MdOutlineClose /></button>

              </div>
              <div className="grid grid-cols-1 gap-y-3 mb-4">
                {serviceItemFields.map((input, index) => {
                  const { name, placeholder, label, options = null, disabled } = input;
                  const value = serviceItem[name];


                  return (
                    <div key={index} className="grid grid-cols-2 ">
                      {/* <NormalInput
                        name={name}
                        value={value}
                        label={label}
                        disabled={disabled}

                        inputStyles={{
                          'borderRadius': '10px',
                          padding: "10px 15px",

                        }}
                        lableStyles={{
                          'fontWeight': '400',
                          "fontSize": "14px",
                          'color': '#000000'
                        }} placeholder={placeholder}
                        onChange={handleChange}
                      /> */}
                      {options ? (
                        <>
                          <CustomSelect
                            name={name}
                            value={value}
                            label={label}
                            disabled={disabled}
                            placeholder={placeholder}
                            onChange={handleChange}
                            inputStyles={{
                              borderRadius: "10px",
                              padding: "10px 15px",
                              fontSize: "13px",
                              fontWeight: "400",
                            }}
                            lableStyles={{
                              fontWeight: "500",
                              fontSize: "13px",
                            }}
                            options={options}
                          />


                        </>
                      ) : (
                        <NormalInput
                          name={name}
                          value={value}
                          label={label}
                          disabled={disabled}
                          placeholder={placeholder}
                          onChange={handleChange}
                          inputStyles={{
                            borderRadius: "10px",
                            padding: "10px 15px",
                            fontSize: "13px",
                            fontWeight: "400",
                          }}
                          lableStyles={{
                            fontWeight: "500",
                            fontSize: "13px",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-4 mt-6">
                <button
                  className="rounded-[5px] w-[120px] text-sm  border border-ternary text-ternary py-[5px] px-[24px]"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
                  onClick={onclickService}
                >
                  Submit
                </button>
              </div>

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
        {showConfirm && (
          <ConfirmationModal
            show={showConfirm}
            setShow={setShowConfirm}

            text={`Are You Sure You Want To Delete this Service  ${selectedMyService?.name || ""} ?`}
            onConfirm={handleDelete}
          />
        )}{" "}
      </div>
    </>
  );
}
