import React, { useState } from "react";
import "./BookAppointment.css";
import Modal from "react-modal";
import { getApiCall, postApiData } from "../../utils/services";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProducts,
  newUpdateService,
  productAdded,
  removeAppointmentProductsData,
  serviceAdded,
} from "../../redux/actions";
import { deletItems } from "../../redux/actions";
import { MdDeleteOutline } from "react-icons/md";
import TimePicker from "rc-time-picker";
import { FaSearch } from "react-icons/fa";
import "rc-time-picker/assets/index.css";
import Layout from "../../components/Layout";
import moment from "moment";
import { useNavigate } from "react-router";
import { isVisible } from "@testing-library/user-event/dist/utils";
import CustomAlert from "../../components/customAlert";
import { toast } from "react-hot-toast";
import { IoMdPersonAdd } from "react-icons/io";
import { maleData } from "../../Dummyjson/maleservice";

const BookAppointment = () => {
  const [subTotalService, setSubTotalService] = useState(0);
  const [membershipCoin, setMembershipCoin] = useState(0);
  const [isMembershipUsed, setIsMembershipUsed] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  // const [gender, setGender] = useState("male");
  const [selectedState, setSelectedState] = useState("");
  const [address, setAddress] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [sentPhoneNo, setSendPhoneNo] = useState("");
  const [userData, setUserData] = useState([]);
  const [date, setDate] = useState("");
  const [showAddButton, setShowAddButton] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedoption, setSelectedoption] = useState(null);
  const [openOne, setOpenOne] = useState(false);
  const [selectedoptionOne, setSelectedoptionOne] = useState(null);
  const [service, setService] = useState([]);
  const [subservice, setSubService] = useState([]);
  const [miniservice, setMiniService] = useState([]);
  const [slectedItem, setSelectedItem] = useState("");
  const [staffData, setStaffData] = useState([]);
  const [productStaff, setProductStaff] = useState("");
  const [time, setTime] = useState("");
  const [gender, setGender] = useState("F");
  const [memberShip, setMemberShip] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [membershipitem, setMemberShipItem] = useState(null);
  const [userId, setUserId] = useState("");
  const [memberShipId, setMemberShipId] = useState("");
  console.log("mebershipId", memberShipId);
  const [memberId, setMemberShipid] = useState("");
  const [memberShipStatus, setMemberShipStatus] = useState(false);
  // product table state
  const [showProductTable, setShowProductTable] = useState("");
  const activemember = membershipitem?.activeMembership;
  const serviceDataReducerLength = useSelector(
    (store) => store.serviceAddReducer.serviceData.length
  );
  const [applyDisountPer, setApplyDiscountPer] = useState(0);
  const [productQnt, setProductQnt] = useState(1);
  const [searchProduct, setsearchProduct] = useState("");
  const [showSearchProduct, setShowSearchProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const x = useSelector((store) => store.serviceAddReducer.serviceData);
  const [services, setServices] = useState(x);
  const navigate = useNavigate();
  const maleDatas = maleData;
  console.log({ maleDatas });
  console.log({ showSearchProduct });
  useEffect(() => {
    setServices(x);
  }, [x]);
  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    setServiceSelection({
      category: "",
    });
    setSubService(null);
    setMiniService(null);
    setStaffData(null);
  };
  const membershipPress = (e) => {
    const selectedMembership = e.target.value;
    console.log("selectedMembership", selectedMembership);
    setMemberShipId(e.target.value);
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setDate(currentDate);
  }, []);
  useEffect(() => {
    const currentTime = moment();
    setTime(currentTime);
  }, []);
  const datePart = new Date(date);
  // Date object for the date part

  // Example time
  const timePart = new Date(time); // Date object for the time part
  // Combine date and time
  const combinedDateTime = new Date(datePart);
  combinedDateTime.setHours(
    timePart.getHours(),
    timePart.getMinutes(),
    timePart.getSeconds(),
    timePart.getMilliseconds()
  );

  const handleTimeChange = (selectedTime) => {
    // Check if selectedTime is not null before accessing its properties
    if (selectedTime && selectedTime.format) {
      // Handle the time change
      console.log("Selected time:", selectedTime.format("hh:mm A"));
      setTime(selectedTime);
      // Add your logic here
    } else {
      // Handle the case when selectedTime is null
      console.error("Selected time is null");
    }
  };
  console.log({ time });
  const productDataReducer = useSelector(
    (store) => store.ProductAddReducer.ProductData
  );
  console.log("productDatacoming", productDataReducer);

  console.log({ x });
  const subtotalPrice = services.reduce((accumulator, currentItem) => {
    return accumulator + Number(currentItem.price);
  }, 0);
  const productTotalPrice = productDataReducer.reduce(
    (accumulator, { price, quantity }) => {
      return accumulator + quantity * price;
    },
    0
  );
  const countdiscount = Math.ceil((subtotalPrice * applyDisountPer) / 100);
  console.log("countdiscount", applyDisountPer);
  const payableAmount = subtotalPrice - countdiscount;
  const totalProductServicePayable = payableAmount + productTotalPrice;
  const [serviceSelection, setServiceSelection] = useState({
    category: "",
    subCategory: "",
    miniSubcategory: "",
    staffId: "",
    price: 0,
    satffName: "",
  });
  const [productData, setProductData] = useState({
    name: "",
    itemId: "",
    price: 0,
    staffId: "",
  });

  console.log("serviceSelection", serviceSelection.subCategory);

  const isServiceSelectionValid = () => {
    for (const key in serviceSelection) {
      if (serviceSelection[key] === "") {
        return false; // If any field is empty, return false
      }
    }
    return true; // All fields are filled, return true
  };

  // const data = {
  //   gender: gender,
  // };
  // api call for getting service category
  useEffect(() => {
    getApiCall(
      "salonService/getServiceCategory",

      (resp) => {
        console.log("salonService", resp);
        setService(resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [gender]);
  // api call for getting subcategory
  const categorydata = {
    categoryName: serviceSelection.category,
    gender: gender,
  };
  useEffect(() => {
    postApiData(
      "salonService/getSubServiceCategory",
      categorydata,
      (resp) => {
        setSubService(resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [serviceSelection.category]);
  const minicatgdata = {
    category: serviceSelection.category,
    gender: gender,
    subCategory: serviceSelection.subCategory,
  };
  useEffect(() => {
    postApiData(
      "salonService/getSuggestedSalonServices",
      minicatgdata,
      (resp) => {
        setMiniService(resp[0]);
        console.log("min cat resp", resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [serviceSelection.subCategory]);
  useEffect(() => {
    getApiCall(
      "owner/getStaff",
      (res) => {
        setStaffData(res);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [serviceSelection.subCategory]);

  const dispatch = useDispatch();
  const handleServiceChange = (e) => {
    console.log("selected value", e.target.value);
    setServiceSelection({
      ...serviceSelection,
      category: e.target.value,
      subCategory: "",
    });
  };
  const handleSubCategoryChange = (e) => {
    console.log("selected value", e.target.value);
    setServiceSelection({
      ...serviceSelection,
      subCategory: e.target.value,
      miniSubcategory: "",
    });
  };

  const handleminiChange = (event) => {
    // console.log("minichangedata", e.target.value);
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedPrice = selectedOption.getAttribute("data-price");
    console.log("selectedPrice", +selectedPrice);
    // Now you have the selected price, you can use it as needed
    setServiceSelection({
      ...serviceSelection,
      miniSubcategory: event.target.value,
      price: +selectedPrice,
    });
  };
  const handlestaffChange = (e) => {
    let splited = e.target.value.split("-");
    let Name = splited[1];
    let Id = splited[0];
    console.log("staffffffff------", Name, Id);
    console.log("staffselect", e.target.value);
    setServiceSelection({
      ...serviceSelection,
      staffId: Id,
      satffName: Name,
    });
  };
  console.log("serveicekaname", serviceSelection.satffName);
  const handldeAddButton = () => {
    if (isServiceSelectionValid()) {
      dispatch(serviceAdded(serviceSelection));
      // alert("All service added")
      toast.success("All Service Added!!");
    } else {
      // alert("all feilds should be filled");
      toast.error("All fields should be filled!");
    }
  };
  console.log("seerrvice selection", serviceSelection);
  const handldeBookAppointment = () => {
    console.log("book Appointment");
    const data = {
      services: services,
      customer: {
        name: name,
        phoneNumber: phoneNumber,
      },
      subTotal: subtotalPrice,
      // total: subtotalPrice,
      total: totalProductServicePayable,
      appointmentDate: combinedDateTime,
      membershipUsed: memberShipStatus,
      // membershipCreditUsed: +memberShip,
      membershipCreditUsed: memberShipStatus ? +subTotalService : 0,
      products: productDataReducer,
      discount: +countdiscount,
      discountPercentage: applyDisountPer,
      membershipId: memberShipId,
    };
    // if (serviceDataReducerLength > 0) {
    postApiData(
      "appointment/bookAppointmentFromCrm",
      data,
      (resp) => {
        if (resp) {
          // alert("Appointment Booked Sucessfully");
          toast.success("Appointment Booked Sucessfully");
          console.log("appointment", resp);
          dispatch(removeAppointmentProductsData());
          navigate("/viewAppointment");
        }
      },
      (error) => {
        console.log("error", error);
        // alert(" Booking Status Failed");
        toast.error("Booking status failed!");
      }
    );
    // }
  };
  // ...`
  const nameOnclick = (item) => {
    // e.preventDefault();
    setMemberShipItem(item);
    setName(item.name);
    setPhoneNumber(item.phoneNumber);
    setUserId(item._id);
    setVisible(false);
  };
  console.log({ membershipitem });
  // product name on click

  const productNameOnclick = (item) => {
    setSelectedProduct(item);
    setsearchProduct("");
  };
  console.log({ selectedProduct });

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    // Do something with the selected value, for example, store it in state
    console.log("selectedValue", event.target.value);
    setSelectedItem(selectedValue);
  };

  const handleCheckboxChange = (service) => {
    setSelectedServices((prevSelectedServices) => {
      if (prevSelectedServices.some((s) => s.name === service.name)) {
        return prevSelectedServices.filter((s) => s.name !== service.name);
      } else {
        return [...prevSelectedServices, service];
      }
    });
  };
  const deleteService = (item) => {
    dispatch(deletItems(item));
  };
  const deleteProduct = (id) => {
    dispatch(deleteProducts(id));
  };
  const handleSubmit = () => {
    const apiData = {
      name,
      phoneNumber,
      email,
      dob,
      gender,
      selectedState,
      address,
    };

    postApiData(
      "parlor/registerUserForCrm",
      apiData,
      (resp) => {
        console.log("respns", resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
    closeModal();
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // on search product click
  const searchProductOnchange = (e) => {
    setsearchProduct(e.target.value);
    const data = {
      name: searchProduct,
    };
    postApiData(
      "inventory/getSuggestedProductOfSalon",
      data,
      (resp) => {
        console.log("resp.products", resp.products);
        setShowSearchProduct(resp.products);
      },
      (error) => {
        console.log("error", error);
      }
    );
  };
  const applyDiscount = () => {
    setApplyDiscountPer(discount);
    // alert("Discount Added sucessfully");
    toast.success("Discount Added Successfully");
  };

  const applyMemberShip = () => {
    console.log("before", subTotalService);
    // setIsMembershipUsed(!isMembershipUsed)
    // post api = {"creditsUsed":650, "userId":"659ba793f289e0151305cba0", "memId":"65b0e6dc44201e04eae2ae7b"}
    // setMemberShipStatus(!memberShipStatus)
    const data = {
      // creditsUsed:+memberShip,
      creditsUsed: memberShipStatus
        ? subTotalService
        : subtotalPrice - countdiscount,
      // creditsUsed: payableAmount,
      userId: userId,
      memId: memberShipId,
      isMembershipUsed: !memberShipStatus,
    };
    console.log("after", subTotalService);
    console.log("------------------------------data", data);

    postApiData(
      "membership/applyMembership",
      data,
      (resp) => {
        if (resp) {
          console.log("resp.data.creditsLeft", resp?.creditsLeft);
          if (memberShipStatus) {
            setMembershipCoin(resp?.creditsLeft);
            setMemberShipStatus(false);
            // setMemberShip(-memberShip)
            // setSubTotalService(subtotalPrice)
            setSubTotalService(resp.creditsUsed - resp.remainingAmount);
            setIsMembershipUsed(true);
            toast.error("MemberShip Removed sucessfully");
          } else {
            // alert("MemberShip Applied sucessfully");
            toast.success("MemberShip Applied sucessfully");
            setMembershipCoin(resp?.creditsLeft);
            setSubTotalService(resp.creditsUsed - resp.remainingAmount);
            setMemberShipStatus(true);
            setIsMembershipUsed(false);
            // setMemberShip(-memberShip)
          }
        }
      },
      (error) => {
        console.log("error", error);
        // alert("Select Correct Options");
        toast.error("Select Correct Options !");
      }
    );
  };
  console.log("Sub Total Serive", subTotalService);
  const handleMobileChange = (event) => {
    const enteredMobileNumber = event.target.value;
    setPhoneNumber(enteredMobileNumber);
    setVisible(true);
    // Check if the entered mobile number has 10 digits
    setIsMobileValid(enteredMobileNumber.length === 10);
    const data = {
      phoneNumber: enteredMobileNumber,
    };
    postApiData(
      "user/searchUser",
      data,
      (resp) => {
        console.log("respons", resp);
        setUserData(resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
  };
  const onChangeProdutName = (e) => {
    setProductData({
      ...productData,
      name: e.target.value,
    });
  };
  const addproductPress = (item, productQnt, productStaffid) => {
    // productQnt,productStaffid
    const itemWithAdditionalInfo = {
      ...item, // Copying existing properties of item
      quantity: +productQnt, // Adding quantity key
      staffId: productStaffid, // Adding staffId key
    };
    console.log("product data coming", itemWithAdditionalInfo);

    dispatch(productAdded(itemWithAdditionalInfo));
    toast.success("product added succesfully");
  };

  console.log({ staffData });

  // Function to format the date as "dd-mm-yyyy"
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const handlePriceChange = (index, newPrice) => {
    const updatedServices = services.map((item, i) =>
      i === index ? { ...item, price: +newPrice } : item
    );
    setServices(updatedServices);
    dispatch(newUpdateService(updatedServices));
  };
  // const handleChangePrice = (index) => {
  //   dispatch(serviceAdded(services));
  // };

  return (
    <Layout>
      <div className="md:mt-32 mt-20 w-[90%] mx-auto ">
        <div className="flex justify-center items-center gap-5">
          <h1 className="text-green-600 font-semibold text-lg">
            Select Gender :{" "}
          </h1>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={gender === "M"}
            onChange={() => handleGenderChange("M")}
            className="mt-3"
          />
          <h1 className="text-black font-semibold text-lg">MALE</h1>
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={gender === "F"}
            onChange={() => handleGenderChange("F")}
            className="mt-3"
          />
          <h1 className="text-black font-semibold text-lg">FEMALE </h1>
        </div>

        {/* <div className=""
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}

        >
        <h1 className="text-green-600 text-lg font-semibold">SELECT GENDER:</h1>
          <label style={{ width: "70px" }}>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={gender === "M"}
              onChange={() => handleGenderChange("M")}
            />
            <span
              style={{
                marginLeft: "8px",
                fontSize: "20px",
                fontWeight: "500",
                color: "black",
              }}
            >
              Male
            </span>
          </label>

          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={gender === "F"}
              onChange={() => handleGenderChange("F")}
            />
            <span
              style={{
                marginLeft: "8px",
                fontSize: "20px",
                fontWeight: "500",
                color: "black",
              }}
            >
              Female
            </span>
          </label>

          {/* <div>
        Selected Gender: {gender && <strong>{gender}</strong>}
      </div> */}
        {/* </div> */}

        <div className="">
          <div className="flex mt-10 justify-between items-center flex-wrap">
            {/* CUSTOMER */}
            <div className="flex flex-col  p-4 rounded-lg bg-[#fffffe] mr-2 shadow-xl w-full">
              <div className="flex justify-between items-center">
                <div className="relative ">
                  <h1 className="invoice-heading">Customer</h1>
                  <input
                    type="text"
                    className="w-[250px] outline-none"
                    placeholder="Enter your Number/Name"
                    value={phoneNumber}
                    onChange={handleMobileChange}
                    style={{
                      border: "1px solid grey",
                      borderRadius: "11px",
                    }}
                  />
                  {visible && phoneNumber?.length > 0 && (
                    <div
                      style={{}}
                      className="absolute top-[100px] h-[104px] w-[283px] overflow-auto border-2 border-gray-200 bg-white shadow-xl rounded-lg z-1"
                    >
                      {userData.length > 0 &&
                        userData?.map((item) => {
                          return (
                            <div
                              style={{ display: "flex" }}
                              onClick={() => nameOnclick(item)}
                              className="flex items-center px-4 py-2 mb-0 transition-all duration-300 ease-in-out transform hover:bg-[#f5da42] hover:scale-95 cursor-pointer"
                            >
                              <p className="mr-2 font-semibold">{item.name}</p>
                              <p className="font-semibold">
                                {item.phoneNumber}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* {isMobileValid && (
              <button className="add-customer-btn" onClick={openModal}>
                Add Customer
              </button>
            )} */}

                <button
                  className={`mx-4 ${
                    isMobileValid ? "add-customer-btn" : "disabled-btn"
                  }`}
                  onClick={isMobileValid ? openModal : null}
                  disabled={!isMobileValid}
                >
                  <IoMdPersonAdd />
                </button>

                {/* <button className='add-customer-btn' onClick={openModal}>Add Customer</button> */}
                <Modal
                  isOpen={isModalOpen}
                  onRequestClose={closeModal}
                  style={{
                    content: {
                      width: "50%",
                      height: "70%",
                      margin: "auto",
                      marginTop: "70px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fff",
                      padding: "20px",
                    },
                    overlay: {
                      backgroundColor: "rgba(0, 0, 0, 0.3)", // Set the overlay background color
                    },
                  }}
                >
                  <div className="formgroup-section">
                    <h1 className="form-heading">Add Customer Appointment</h1>
                    <div className="first-row">
                      <div className="input-container">
                        <div>First Name</div>
                        <input
                          type="text"
                          placeholder="Enter name"
                          className="input-field"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="input-container">
                        <div>Mobile Number</div>
                        <input
                          type="text"
                          placeholder="Enter mobile number"
                          className="input-field"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="first-row">
                      <div
                        className="input-container"
                        style={{ marginLeft: "-31px" }}
                      >
                        <div>Email Address</div>
                        <input
                          type="text"
                          placeholder="Enter email address"
                          className="input-field"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="first-row"></div>
                  </div>

                  {/* </div> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                    }}
                  >
                    <button className="btn-crm" onClick={handleSubmit}>
                      Add
                    </button>
                    <button onClick={closeModal} className="btn-crm">
                      Cancel
                    </button>
                  </div>
                </Modal>

                {!showAddButton && (
                  <div className="suggestions">
                    <div>Suggestion 1</div>
                    <div>Suggestion 2</div>
                    <div>Suggestion 3</div>
                  </div>
                )}
                <div>
                  <h1 className="invoice-heading">Date</h1>
                  <input
                    type="date"
                    value={date}
                    defaultValue={() => formatDate(new Date())}
                    className="invoice-input"
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      height: "40px",
                      border: "1px solid grey",
                      width: "270px",
                      borderRadius: "11px",
                      paddingRight: "30px",
                      outline: "none",
                      cursor: "pointer", // Add space for the eye icon
                    }}
                  />
                </div>
                <div className="w-[150px] ml-4">
                  <p className="text-xl font-bold text-black">Time Picker </p>
                  <TimePicker
                    placeholder="Select Time"
                    use12Hours
                    showSecond={false}
                    focusOnOpen={true}
                    format="hh:mm A"
                    onChange={handleTimeChange}
                    inputIcon
                    className=" mt-5"
                    defaultValue={moment()}
                  />
                </div>
              </div>

              {/* ADD SERVICE SECTION */}

              <h1 className="text-4xl font-bold block ml-3 mt-20 poppins-semibold text-green-600">
                {" "}
                SERVICES{" "}
              </h1>
              <div
                style={{
                  border: "",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  marginTop: "20px",
                }}
              >
                <select
                  className="px-2 py-2 mx-2 text-md font-medium bg-slate-300 rounded-lg outline-none"
                  onChange={handleServiceChange}
                  value={serviceSelection.category} // Use 'value' for controlled components
                >
                  <option value={service}>Select Category</option>
                  {service?.map((item, index) => (
                    <option
                      key={item.id}
                      value={item.value}
                      style={{ width: "700px" }}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>

                <select
                  className="px-2 py-2 text-md font-medium bg-slate-300 rounded-lg outline-none mx-2"
                  onChange={handleSubCategoryChange}
                  value={serviceSelection.subCategory} // Use 'value' for controlled components
                >
                  <option value={subservice}>Select SubCategory</option>
                  {subservice?.map((item) => (
                    <option
                      key={item.id}
                      value={item.value}
                      style={{ width: "300px" }}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
                <select
                  className="px-2 py-2 mx-2 text-md font-medium bg-slate-300 rounded-lg outline-none"
                  onChange={handleminiChange}
                  value={serviceSelection.miniSubcategory}
                >
                  <option value={miniservice}>Select MiniCategory</option>
                  {miniservice?.services?.map((item) => (
                    <option
                      key={item.id}
                      value={item.value}
                      style={{ width: "300px" }}
                      data-price={item.price}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>

                <select
                  className="px-2 py-2 mx-2 text-md font-medium bg-slate-300 rounded-lg outline-none"
                  onChange={handlestaffChange}
                  // value={serviceSelection.satffName}
                  value={`${serviceSelection.staffId}-${serviceSelection.satffName}`}
                >
                  <option value={staffData} className="bg-white">
                    Select Staff
                  </option>
                  {staffData?.map((item) => (
                    <option
                      key={item._id}
                      value={`${item._id}-${item.name}`}
                      //  value={`${item._id}`}
                      className="border-none shadow-lg rounded-lg bg-white "
                    >
                      {item.name}
                    </option>
                  ))}
                </select>

                <button
                  style={{
                    height: "40px",
                    borderRadius: "20px solid grey",
                    width: "150px",
                    backgroundColor: "black",
                    cursor: "pointer",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onClick={handldeAddButton}
                >
                  Add Service
                </button>
              </div>
              {/* COPIED Service TABLE */}

              {x.length > 0 && (
                <div className="table-container w-[90%] overflow-x-scroll">
                  <table className="styled-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th> Sub Category</th>
                        <th>Staff</th>
                        <th>Price</th>
                        <th>Action</th>

                        {/* <th>Brand</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {x?.map((item, index) => (
                        <tr key={index} className="bg-white">
                          <td>{item?.miniSubcategory}</td>
                          <td>{item?.category}</td>
                          <td>{item?.subCategory}</td>
                          <td>
                            {staffData
                              ?.filter((staff) => staff._id === item.staffId)
                              ?.map((data) => (
                                <span>{data.name}</span>
                              ))}
                          </td>
                          {/* <td>{item?.price}</td> */}
                          <td>
                            <input
                              type="number"
                              defaultValue={item?.price}
                              className=""
                              onChange={(e) =>
                                handlePriceChange(index, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <MdDeleteOutline
                              onClick={() => deleteService(index)}
                              className="text-xl text-red-600 font-bold cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=" p-4 rounded-lg bg-[#fffffe] w-full mx-auto mt-12 shadow-xl">
          <h1 className="text-4xl text-center  font-bold block mb-10 mt-10 poppins-bold text-green-600">
            ADD PRODUCTS
          </h1>
          {productDataReducer.length > 0 && (
            <div className="table-container">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Brand</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productDataReducer?.map((item, index) => (
                    <tr key={index}>
                      <td>{item?.name}</td>
                      <td>{item?.price}</td>
                      <td>{item?.brand}</td>
                      <td>{item?.quantity}</td>
                      <td>
                        {" "}
                        <MdDeleteOutline
                          onClick={() => deleteProduct(index)}
                          className="text-xl text-red-600 font-bold cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Search Table */}
          <div className="search-container">
            <div className="flex flex-row relative mb-10 ">
              {/* <h1 className="text-lg font-semibold">Search Product</h1> */}
              <div className="flex relative w-[40%] mx-auto border-2 bg-white h-[50px] border-gray-300 rounded-lg">
                <input
                  value={searchProduct}
                  placeholder="search product by name "
                  onChange={searchProductOnchange}
                  className="border-none outline-none w-full text-lg"
                />
                <FaSearch className="absolute right-6 text-xl ml-3 mt-3" />
                {searchProduct?.length > 0 && (
                  <div
                    style={{}}
                    className="absolute top-16 ml-8 h-[104px] w-[283px] overflow-auto bg-slate-300 shadow-lg "
                  >
                    {showSearchProduct?.map((item) => {
                      console.log({ "product id": item });
                      return (
                        <div
                          style={{ display: "flex" }}
                          onClick={() => productNameOnclick(item.itemId)}
                          className="flex items-center px-4 py-2 mb-0 transition-all duration-300 ease-in-out transform hover:bg-[#f5da42] hover:scale-95 cursor-pointer"
                        >
                          <p className="mr-2 font-semibold">{item.name}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {selectedProduct && (
              <div className="table-container">
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Staff</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showSearchProduct
                      ?.filter((item) => item.itemId === selectedProduct)
                      ?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              value={item.name}
                              placeholder="product Quantity "
                              disabled
                              onChange={onChangeProdutName}
                            />
                          </td>
                          <td>{item?.price}</td>
                          <td>
                            <input
                              value={productQnt}
                              placeholder="product Quantity "
                              onChange={(e) => setProductQnt(e.target.value)}
                            />
                          </td>
                          <td>
                            {" "}
                            <select
                              style={{
                                // border: "1px solid green",
                                height: "30px",
                                borderRadius: "8px",
                              }}
                              onChange={handlestaffChange}
                              value={serviceSelection.staffId}
                            >
                              <option value="" disabled>
                                Select Staff
                              </option>
                              {staffData?.map((item) => (
                                <option
                                  key={item._id}
                                  value={item._id}
                                  style={{ width: "300px" }}
                                  onChange={(e) =>
                                    setProductStaff(e.target.value)
                                  }
                                >
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <button
                              style={{
                                height: "40px",
                                borderRadius: "20px solid grey",
                                width: "150px",
                                backgroundColor: "black",
                              }}
                              onClick={() =>
                                addproductPress(
                                  item,
                                  productQnt,
                                  serviceSelection.staffId
                                )
                              }
                            >
                              <label
                                style={{
                                  color: "white",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                }}
                              >
                                Add Product
                              </label>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* BOOK APPOINTMENT */}

        <div className="  p-4 rounded-lg bg-[#fffffe] my-12 flex flex-col shadow-lg">
          <h1 className="text-4xl font-bold mb-10 mt-10 text-center text-green-600">
            BOOK APPOINTMENT
          </h1>

          <div className="flex justify-start gap-3 items-center">
            <h1 className="text-lg font-semibold">Apply Discount</h1>
            <input
              type="number"
              className="outline-none"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <button onClick={applyDiscount} className="bg-black">
              Apply Discount
            </button>
          </div>

          <div className="flex mt-6 justify-start items-center mb-3">
            {/* MEMBERSHIP STATUS */}
            <div className="flex items-center justify-center">
              <h1 className="text-lg font-semibold">Membership</h1>
              <select
                className="mx-3 w-80 h-10 outline-none border-2 border-gray-500 rounded-lg"
                onChange={membershipPress}
                disabled={memberShipStatus ? true : false}
              >
                <option value="" disabled selected>
                  Membership
                </option>
                {activemember?.map((item) => {
                  return (
                    <option value={item._id}>
                      {" "}
                      {item?.name}
                      {" -"}
                      {item.creditsLeft}
                    </option>
                  );
                })}
              </select>
            </div>
            {/* MEMBERSHIP COIN */}
            {/* <div className="flex"> */}
            {/* <div className="flex justify-center items-center">
          <h1 className="text-lg font-semibold">Membership Coin</h1>
          <input type="number" placeholder="Enter membership coin" value={memberShip} className="outline-none mx-3 border-2 border-gray-500 rounded-lg " onChange={(e) => setMemberShip(e.target.value)} disabled={memberShipStatus == true}/>
          </div> */}

            {/* Membership Button */}
            {memberShipStatus ? (
              <button
                onClick={applyMemberShip}
                className="bg-red-600 hover:bg-red-500"
              >
                Remove Membership
              </button>
            ) : (
              <button
                onClick={applyMemberShip}
                className="bg-black hover:bg-gray-800"
              >
                Apply Membership
              </button>
            )}

            <div className="flex ml-6">
              <h3 className="text-lg font-bold text-black">
                BALANCE :{" "}
                <span className="text-green-600 font-bold">
                  {membershipCoin}
                </span>
              </h3>
            </div>

            {/* <button onClick={applyMemberShip} className="bg-black">{memberShipStatus ? "Remove MemberShip" : "Apply MemberShip" }</button> */}
            {/* </div> */}
          </div>

          <button
            className="mt-3 w-[50%] py-4 text-lg font-semibold mx-auto bg-black"
            onClick={handldeBookAppointment}
          >
            Book Appointment
          </button>
        </div>
        {phoneNumber && (
          <div className="  bg-[#ffc232] rounded-lg px-3 py-5 w-full shadow-xl mb-10 flex  items-center">
            <div className="w-1/2 ">
              <p className=" text-lg font-bold text-black">
                NAME:{" "}
                <span className="text-md font-medium ml-1 text-green-800">
                  {name}
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                MEMBERSHIP:{" "}
                <span className="text-md font-medium ml-1 text-green-800">
                  {membershipitem?.activeMembership?.length > 0
                    ? "Active"
                    : "Inactive "}
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                TOTAL VISITS:
                <span className="text-md font-medium ml-1 text-green-800">
                  0
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                CARD ON FILE:
                <span className="text-md font-medium ml-1 text-green-800">
                  0
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                LAST VISIT:
                <span className="text-md font-medium ml-1 text-green-800">
                  0
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                POINTS:
                <span className="text-md font-medium ml-1 text-green-800">
                  0
                </span>
              </p>
            </div>
            <div className="w-1/2">
              <p className=" text-lg font-bold text-black ">
                {"SUBTOTAL:"}{" "}
                <span className="text-md font-medium ml-1 text-green-800">
                  {subtotalPrice}
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                {"DISCOUNT"}{" "}
                <span className="text-md font-medium ml-1 text-green-800">
                  {countdiscount}
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                {"TOTAL AMOUNT :"}
                <span className="text-md font-medium ml-1 text-green-800">
                  {payableAmount}
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                {"PRODUCT PRICE:"}
                <span className="text-md font-medium ml-1 text-green-800">
                  {productTotalPrice}
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                {"PAYABLE AMOUNT :"}

                <span className="text-md font-medium ml-1 text-green-800">
                  {" "}
                  {totalProductServicePayable}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {alertVisible && (
        <CustomAlert message={alertMessage} onClose={handleAlertClose} />
      )}
    </Layout>
  );
};

export default BookAppointment;
