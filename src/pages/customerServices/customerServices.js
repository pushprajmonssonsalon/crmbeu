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

export default function CustomerServices() {
  const [customerServiceData, setCustomerServiceData] = useState([]);
  const [total, setTotal] = useState(0);
  const [addproductModal, setAddProductModal] = useState(false);
  const [serviceItem, setServiceItem] = useState([]);
  const [price, setPrice] = useState(null);
  const [mrp, setMrp] = useState(null);
  const [service, setService] = useState("allservices");
  const [myServiceData, setMyserviceData] = useState([]);
  const [tab, setTab] = useState(1);
  // show popup
  const [showPopup, setShowPopup] = useState(false);
  const [editId, setEditID] = useState("");
  // selected
  const [serviceName, setServiceName] = useState("");
  const [gender, setGender] = useState(null);
  const [categoryName, setCategoryName] = useState(null);

  // my selected service
  const [selectedMyService, setSelectedMyService] = useState({});
  const [total1,setTotal1]=useState(0)
  const [myServiceName, setMyServiceName] = useState("");
  const [myGender, setMyGender] = useState(null);
  const [myCategoryName, setMyCategoryName] = useState(null);
  const GenderData = [
    {
      name: "Female",
    },
    {
      name: "Male",
    },
  ];

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
  const getAllServices = () => {
    const data = {
      name: serviceName,
      category: categoryName,
      gender: gender === "Female" ? "F" : gender === "Male" ? "M" : "",
    };
    postApiData(
      `salonService/getAllServices/?limit=${itemsPerPage}&page=${currentPage}`,
      data,
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
    if (service === "allservices") {
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
  }, [
    service,
    serviceName,
    categoryName,
    gender,
    tab,
    itemsPerPage,
    currentPage,
  ]);
  const clearService = () => {
    setServiceName("");
    setGender("");
    setCategoryName("");
  };

  const clearMyService = () => {
    setMyServiceName("");
    setMyGender("");
    setMyCategoryName("");
  };

  const getSalonServices=()=>{
    const data = {
      name: myServiceName,
      category: myCategoryName,
      gender: myGender === "Female" ? "F" : myGender === "Male" ? "M" : "",
    };
    postApiData(
      `salonService/getSalonServices/?limit=${itemsPerPage1}&page=${currentPage1}`,
      data,
      (resp) => {
        console.log("myservice----------respone", resp);
        setMyserviceData(resp.services);
        setTotal1(resp.totalCount)
      },
      (error) => {
        console.log("errro", error);
      }
    );
  }
  useEffect(() => {
    // Debounce function for API call
    if (service !== "allservices") {
   
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
  }, [service, myServiceName, myCategoryName, myGender,itemsPerPage1,currentPage1]);


  const addclick = (item) => {
    setAddProductModal(true);
    setServiceItem(item);
  };
  const mrpOnChange = (e) => {
    setMrp(e.target.value);
  };
  const onchnagPrice = (e) => {
    setPrice(e.target.value);
  };
  const onclickService = () => {
    const data = {
      id: serviceItem?._id,
      price: +price,
      mrp: +mrp,
    };
    postApiData(
      "salonService/addServicesToSalon",
      data,
      (resp) => {
        // if (resp) {
        console.log("add service response", resp);
        toast.success("Service Added Sucessfully");
        setAddProductModal(false);
        // }
        //  else {
        //   console.log("add service response",resp)
        //   alert("service already Added");
        //   // toast.error("Service already Added")
        // }
      },
      (error) => {
        console.log("my service ki error", error);
        toast.error("Service already Added");
        // alert("service already Added");
      }
    );
  };

  const allservice = () => {
    setService("allservices");
    handleTab(1);
  };
  const myService = () => {
    setService("myservices");
    handleTab(2);
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
      setEditID(id);
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

  // console.log({serviceData})

  return (
    <Layout>
      <div className="mt-32 w-[90%] mx-auto">
        <ul className="nav-list">
          <li className="mx-6 font-medium inter text-lg text-slate-100 cursor-pointer">
            <button
              className="  py-2 px-4 rounded-lg text-white flex justify-center items-center bg-black "
              onClick={allservice}
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
              onClick={myService}
            >
              <h3
                className="font-semibold text-lg poppins "
                style={{ color: tab == 2 ? "white" : "gray" }}
              >
                My Service
              </h3>
            </button>
          </li>
          {/* <li className="nav-item" onClick={allservice}>
          All Services
        </li>
        <li className="nav-item" onClick={myService}>
          My Services
        </li> */}
        </ul>
        {/* <div className="h-[700px] overflow-y-auto mt-3">
      <div className="table-container"> */}
        {service == "allservices" ? (
          <>
            <div className="flex  gap-6 flex-wrap justify-between items-center mt-6">
              <input
                value={serviceName}
                placeholder="Search by service Name"
                style={{
                  height: "40px",
                  border: "1px solid grey",
                  width: "270px",
                  borderRadius: "11px",
                  paddingRight: "30px", // Add space for the eye icon
                  marginTop: "14px",
                  outline: "none",
                }}
                onChange={(e) => setServiceName(e.target.value)}
              />
              <select
                style={{
                  height: "40px",
                  border: "1px solid grey",
                  width: "270px",
                  borderRadius: "11px",
                  paddingRight: "30px",
                }}
                onChange={(e) => setCategoryName(e.target.value)}
                value={categoryName}
              >
                <option value="" selected>
                  Search By Category
                </option>
                {CategoryData.map((item, index) => {
                  return <option>{item?.name}</option>;
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
                onChange={(e) => setGender(e.target.value)}
                value={gender}
              >
                <option value={""} selected>
                  SELECT GENDER
                </option>
                {GenderData.map((item, index) => {
                  return <option>{item?.name}</option>;
                })}
              </select>
              <button
                className="px-3 py-2 bg-black roounded-lg text-white font-semibold"
                onClick={clearService}
              >
                clear
              </button>
            </div>
            <ServiceTable
              data={customerServiceData}
              startIndex={startIndex}
              endIndex={endIndex}
              addclick={addclick}
            />
            <div className="my-3">
            <GridRows
              itemsPerPage={itemsPerPage}
              handleRowschange={handleRowschange}
            />
             </div>
            <Pagination
              totalItems={total}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
           
          </>
        ) : (
          <>
            <div className="flex gap-6 flex-wrap justify-between items-center mt-6">
              <input
                value={myServiceName}
                placeholder="Search by service Name"
                style={{
                  height: "40px",
                  border: "1px solid grey",
                  width: "270px",
                  borderRadius: "11px",
                  paddingRight: "30px", // Add space for the eye icon
                  marginTop: "14px",
                  outline: "none",
                }}
                onChange={(e) => setMyServiceName(e.target.value)}
              />
              <select
                style={{
                  height: "40px",
                  border: "1px solid grey",
                  width: "270px",
                  borderRadius: "11px",
                  paddingRight: "30px",
                }}
                onChange={(e) => setMyCategoryName(e.target.value)}
                value={myCategoryName}
              >
                <option value="" selected>
                  Search By Category
                </option>
                {CategoryData.map((item, index) => {
                  return <option>{item?.name}</option>;
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
                onChange={(e) => setMyGender(e.target.value)}
                value={myGender}
              >
                <option value={""} selected>
                  SELECT GENDER
                </option>
                {GenderData.map((item, index) => {
                  return <option>{item?.name}</option>;
                })}
              </select>
              <button
                className="px-3 py-2 bg-black roounded-lg text-white font-semibold"
                onClick={clearMyService}
              >
                clear
              </button>
            </div>
            <MyServiceTable
              data={myServiceData}
             
              handleEditService={handleEditService}
            />
              <GridRows
              itemsPerPage={itemsPerPage1}
              handleRowschange={handleRows1change}
            />
            <Pagination
              totalItems={total1}
              itemsPerPage={itemsPerPage1}
              currentPage={currentPage1}
              onPageChange={handlePageChange1}
            />
          </>
        )}
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
            isOpen={addproductModal}
            //   onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div className="flex flex-col items-center justify-start">
              {/* Category Name */}
              <div className="flex justify-between items-center ">
                <label className="text-lg font-semibold ">Category :</label>
                <input
                  value={serviceItem?.category}
                  placeholder="Category"
                  className="w-[280px] self-center"
                />
              </div>
              {/* Sub Category */}
              <div className="flex justify-between items-center ">
                <label className="text-lg font-semibold ">Sub Category :</label>
                <input
                  value={serviceItem?.subCategory}
                  placeholder="Sub Category"
                  className="w-[280px] self-center"
                />
              </div>
              {/* MRP */}
              <div className="flex justify-between items-center ">
                <label className="text-lg font-semibold ">MRP :</label>
                <input
                  type="number"
                  value={mrp}
                  placeholder="MRP(should be greater than price):"
                  className="w-[280px] self-center"
                  onChange={mrpOnChange}
                />
              </div>
              {/* Price  */}
              <div className="flex justify-between items-center ">
                <label className="text-lg font-semibold ">Price :</label>
                <input
                  type="number"
                  value={price}
                  placeholder="Price"
                  className="w-[280px] self-center"
                  onChange={onchnagPrice}
                />
              </div>

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
