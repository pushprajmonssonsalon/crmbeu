import { useState } from "react";
import "./BookAppointment.css";
import { formatValue, getApiCall, postApiData } from "../../utils/services";
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
import { toast } from "react-hot-toast";
import { IoMdPersonAdd } from "react-icons/io";
import NormalRadio from "../../components/customInput/NormalRadio";
import NormalInput from "../../components/customInput/NormalInput";
import NormalSelect from "../../components/customInput/NormalSelect";
import AddCustomerModal from "../../components/modals/AddCustomerModal";
const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
const BookAppointment = () => {
  const [subTotalService, setSubTotalService] = useState(0);
  const [membershipCoin, setMembershipCoin] = useState(0);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    gender: "F",
  });
  const [visible, setVisible] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [userData, setUserData] = useState([]);
  const [date, setDate] = useState(formatDate(new Date()));

  const [service, setService] = useState([]);
  const [subservice, setSubService] = useState([]);
  const [miniservice, setMiniService] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [productStaff, setProductStaff] = useState({
    staffId: "",
    satffName: "",
  });
  const [time, setTime] = useState("");
  const [discount, setDiscount] = useState(0);
  const [membershipitem, setMemberShipItem] = useState(null);
  const [userId, setUserId] = useState("");
  const [activeMembership, setActiveMemberShip] = useState({});
  const [memberShipStatus, setMemberShipStatus] = useState(false);
  // product table state
  const activemember = membershipitem?.activeMembership;

  const [applyDisountPer, setApplyDiscountPer] = useState(0);
  const [productQnt, setProductQnt] = useState(1);
  const [searchProduct, setsearchProduct] = useState("");
  const [showSearchProduct, setShowSearchProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const x = useSelector((store) => store.serviceAddReducer.serviceData);
  const [services, setServices] = useState(x);
  const navigate = useNavigate();

  useEffect(() => {
    setServices(x);
  }, [x]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "gender") {
      setServiceSelection({
        ...serviceSelection,
        category: "",
        subCategory: "",
        miniSubcategory: "",
     
        
      
      });
      setSubService(null);
      setMiniService(null);
    }
  };
  const membershipPress = (e) => {
    if(e.target.value)
    setActiveMemberShip(activemember?.find((elm) => elm._id === e.target.value));
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setDate(currentDate);
  }, []);
  useEffect(() => {
    const currentTime = moment()._d.toString();

    const timeString = currentTime.split(" ")[4];
    setTime(timeString);
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
    const timeString = selectedTime._d.toString().split(" ")[4];
    setTime(timeString);
  };
  const handleAmPmChange = (ampm) => {};

  const productDataReducer = useSelector(
    (store) => store.ProductAddReducer.ProductData
  );

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

  
  useEffect(() => {
    getApiCall(
      "salonService/getServiceCategory",

      (resp) => {
        setService(resp);
      },
      (error) => {}
    );
  }, [customerDetails?.gender]);
  // api call for getting subcategory
  const categorydata = {
    categoryName: serviceSelection.category,
    gender: customerDetails.gender,
  };
  useEffect(() => {
    postApiData(
      "salonService/getSubServiceCategory",
      categorydata,
      (resp) => {
        setSubService(resp);
      },
      (error) => {}
    );
  }, [serviceSelection.category]);
  const minicatgdata = {
    category: serviceSelection.category,
    gender: customerDetails.gender,
    subCategory: serviceSelection.subCategory,
  };
  useEffect(() => {
    postApiData(
      "salonService/getSuggestedSalonServices",
      minicatgdata,
      (resp) => {
        setMiniService(resp[0]);
      },
      (error) => {}
    );
  }, [serviceSelection.subCategory]);
  useEffect(() => {
    getApiCall(
      "owner/getStaff",
      (res) => {
        setStaffData(res.filter((elm) => elm.isActive));
      },
      (error) => {}
    );
  }, [serviceSelection.subCategory]);

  const dispatch = useDispatch();
  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    if (name === "miniSubcategory") {
      const splited = value.split("---");
      const price = splited[0];
      const val = splited[1];
      setServiceSelection({
        ...serviceSelection,
        miniSubcategory: value,
        price: +price,
        miniSub: val,
      });
    } else if (name === "staff") {
      const splited = value.split("-");
      const Name = splited[1];
      const Id = splited[0];

      setServiceSelection({
        ...serviceSelection,
        staffId: Id,
        satffName: Name,
      });
    } else {
      setServiceSelection((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handldeAddButton = () => {
    const { miniSub, miniSubcategory, ...rest } = serviceSelection;

    const selected = {
    
      ...rest,
      miniSubcategory: miniSub,
    };
    const isEveryEmpty = Object.values(selected).some((elm) => !elm);
    if (isEveryEmpty) {
      return toast.error("Please Select All Fields");
    }
    dispatch(serviceAdded(selected));
    // alert("All service added")
    toast.success("All Service Added!!");
  };
  const handldeBookAppointment = () => {
    const data = {
      services: services,
      customer: customerDetails,
      subTotal: subtotalPrice,
      // total: subtotalPrice,
      total: totalProductServicePayable,
      appointmentDate: date + "T" + time + ".000Z",
      membershipUsed: memberShipStatus,
      // membershipCreditUsed: +memberShip,
      membershipCreditUsed: memberShipStatus ? +subTotalService : 0,
      products: productDataReducer,
      discount: +countdiscount,
      discountPercentage: applyDisountPer,
      membershipId: activeMembership?._id,
    };
    // if (serviceDataReducerLength > 0) {
    postApiData(
      "appointment/bookAppointmentFromCrm",
      data,
      (resp) => {
        if (resp) {
          // alert("Appointment Booked Sucessfully");
          toast.success("Appointment Booked Sucessfully");
          dispatch(removeAppointmentProductsData());
          navigate("/viewAppointment");
        }
      },
      (error) => {
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
    setCustomerDetails((prev) => ({
      ...prev,
      name: item.name,
      phoneNumber: item.phoneNumber,
    }));

    setUserId(item._id);
    setVisible(false);
  };

  // product name on click

  const productNameOnclick = (item) => {
    setSelectedProduct(item);
    setsearchProduct("");
  };

  const deleteService = (item) => {
    dispatch(deletItems(item));
  };
  const deleteProduct = (id) => {
    dispatch(deleteProducts(id));
  };
  const handleSubmit = () => {
    postApiData(
      "parlor/registerUserForCrm",
      customerDetails,
      (resp) => {},
      (error) => {}
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
        setShowSearchProduct(resp.products);
      },
      (error) => {}
    );
  };
  const applyDiscount = () => {
    setApplyDiscountPer(discount);
    // alert("Discount Added sucessfully");
    toast.success("Discount Added Successfully");
  };

  const applyMemberShip = () => {
    // console.log(activeMembership)
    // let credLeft=activeMembership?activeMembership?.creditsLeft>0?activeMembership.creditsLeft:0:0;
    // let credUsed=Math.min((subtotalPrice ), credLeft || 0);
    // let remCred=Math.max(credLeft-credUsed,0);
    const data = {
      creditsUsed: memberShipStatus
        ? subTotalService
        : subtotalPrice - countdiscount,
      userId: userId,
      memId: activeMembership?._id,
      isMembershipUsed: !memberShipStatus,
    };

    postApiData(
      "membership/applyMembership",
      data,
      (resp) => {
        if (resp) {
          if (memberShipStatus) {
            setMembershipCoin(resp?.creditsLeft);
            setMemberShipStatus(false);
            // setMemberShip(-memberShip)
            // setSubTotalService(subtotalPrice)
            setSubTotalService(resp.creditsUsed - resp.remainingAmount);
            toast.error("MemberShip Removed sucessfully");
          } else {
            // alert("MemberShip Applied sucessfully");
            toast.success("MemberShip Applied sucessfully");
            setMembershipCoin(resp?.creditsLeft);
            setSubTotalService(resp.creditsUsed - resp.remainingAmount);
            setMemberShipStatus(true);
            // setMemberShip(-memberShip)
          }
        }
      },
      (error) => {
        // alert("Select Correct Options");
        toast.error("Select Correct Options !");
      }
    );
  };
  const handleMobileChange = (event) => {
    const enteredMobileNumber = event.target.value;
    setCustomerDetails((prev) => ({
      ...prev,
      phoneNumber: enteredMobileNumber,
    }));
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
        setUserData(resp);
      },
      (error) => {}
    );
  };
  const onChangeProdutName = (e) => {
    setProductData({
      ...productData,
      name: e.target.value,
    });
  };
  const addproductPress = (
    item,
    productQnt,
    productStaffid,
    productStaffName
  ) => {
    if (productQnt === "0" || !productQnt) {
      toast.error("Please Enter Quantiy");

      return;
    }
    if (!productStaffid || !productStaffName) {
      toast.error("Please Select Staff");

      return;
    }

    // productQnt,productStaffid
    const itemWithAdditionalInfo = {
      ...item, // Copying existing properties of item
      quantity: +productQnt, // Adding quantity key
      staffId: productStaffid,
      staffName: productStaffName, // Adding staffId key
    };

    dispatch(productAdded(itemWithAdditionalInfo));
    toast.success("product added succesfully");
  };

 

  const handlePriceChange = (index, newPrice) => {
    const updatedServices = services.map((item, i) =>
      i === index ? { ...item, price: +newPrice } : item
    );
    setServices(updatedServices);
    dispatch(newUpdateService(updatedServices));
  };
  const handleProductStaff = (e) => {
    const { value } = e.target;
    const splited = value.split("-");
    const Name = splited[1];
    const Id = splited[0];

    setProductStaff({
      ...serviceSelection,
      staffId: Id,
      satffName: Name,
    });
  };
  const genderFields = [
    {
      name: "Male",
      value: "M",
    },
    {
      name: "Female",
      value: "F",
    },
  ];
  const servicesFields = [
    {
      name: "category",
    },
    {
      name: "subCategory",
    },
    {
      name: "miniSubcategory",
    },
    {
      name: "staff",
    },
  ];
  const addCustomerFields = [
    {
      name: "name",
      label: "First Name",
      placeholder: "Enter Name",
      value: customerDetails.name,
    },
    {
      name: "phoneNumber",
      label: "Mobile Number",
      placeholder: "Enter Mobile Number",
      value: customerDetails.phoneNumber,
    },
    {
      name: "email",
      label: "Email Address",
      value: customerDetails.email,

      placeholder: "Enter Email Address",
    },
    {
      name: "gender",
      label: "Gender",
      value: customerDetails.gender,
      options: genderFields,
    },
  ];

  const servicesOptions = {
    category: service,
    subCategory: subservice,
    miniSubcategory: miniservice?.services?.map((elm) => ({
      name: elm.name,
      value: `${elm.price}---${elm.name}`,
    })),
    staff: staffData?.map((elm) => ({
      name: elm.name,
      value: `${elm._id}-${elm.name}`,
    })),
  };
  const customerDetailsArray = [
    { label: "NAME", value: customerDetails.name },
    {
      label: "MEMBERSHIP",
      value:
        membershipitem?.activeMembership?.length > 0 ? "Active" : "Inactive",
    },
    { label: "TOTAL VISITS", value: 0 },
    { label: "CARD ON FILE", value: 0 },
    { label: "LAST VISIT", value: 0 },
    { label: "POINTS", value: 0 },
  ];

  const paymentDetailsArray = [
    { label: "SUBTOTAL", value: subtotalPrice },
    { label: "DISCOUNT", value: countdiscount },
    { label: "TOTAL AMOUNT", value: payableAmount },
    { label: "PRODUCT PRICE", value: productTotalPrice },
    { label: "PAYABLE AMOUNT", value: totalProductServicePayable },
  ];

  const tableFields = [customerDetailsArray, paymentDetailsArray];

  return (
    <Layout>
      <div className="mt-52 md:mt-40  w-[90%] mx-auto ">
        <div className="flex flex-wrap   justify-center items-center gap-5">
          <h1 className="text-green-600  font-semibold text-lg">
            Select Gender :{" "}
          </h1>
          <div className="flex items-center justify-center">
            {genderFields.map((elm, index) => {
              return (
                <NormalRadio
                  key={index}
                  onChange={handleChange}
                  checked={customerDetails.gender === elm.value}
                  name="gender"
                  label={elm.name}
                  value={elm.value}
                />
              );
            })}
          </div>
        </div>

        <div className="">
          <div className="flex mt-10 justify-between items-center flex-wrap">
            {/* CUSTOMER */}
            <div className="flex flex-col  p-4 rounded-lg bg-[#fffffe] mr-2 shadow-xl w-full">
              <div className="flex justify-between flex-wrap items-center">
                <div className="relative ">
                  <div className="flex flex-col gap-4">
                    <NormalInput
                      placeholder="Enter your Number"
                      value={customerDetails.phoneNumber}
                      label="Customer"
                      name="phoneNumber"
                      onChange={handleMobileChange}
                      lableStyles={{
                        color: "#000000",
                        fontSize: "20px",
                      }}
                      inputStyles={{
                        width: "250px",
                        border: "1px solid grey",
                        borderRadius: "11px",
                      }}
                    />
                  </div>

                  {visible && customerDetails.phoneNumber?.length > 0 && (
                    <div
                      style={{}}
                      className="absolute top-[100px] h-[104px] w-[283px] overflow-auto border-2 border-gray-200 bg-white shadow-xl rounded-lg z-1"
                    >
                      {userData.length > 0 &&
                        userData?.map((item, index) => {
                          return (
                            <div
                              key={index}
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

                <button
                  className={`mx-4 ${
                    isMobileValid ? "add-customer-btn" : "disabled-btn"
                  }`}
                  onClick={isMobileValid ? openModal : null}
                  disabled={!isMobileValid}
                >
                  <IoMdPersonAdd />
                </button>

                <AddCustomerModal
                  isModalOpen={isModalOpen}
                  closeModal={closeModal}
                  addCustomerFields={addCustomerFields}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  heading={"Add Customer Appointment"}
                />


                <div className="">
                  <div className="flex flex-col gap-3">
                    <NormalInput
                      type="date"
                      name="date"
                      label="Date"
                      lableStyles={{
                        color: "#000000",
                        fontSize: "20px",
                      }}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      inputStyles={{
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
                    defaultOpenValue={moment()}
                    onAmPmChange={handleAmPmChange}
                  />
                </div>
              </div>

              {/* ADD SERVICE SECTION */}

              <h1 className="text-4xl font-bold block ml-3 mt-20 poppins-semibold text-green-600">
                {" "}
                SERVICES{" "}
              </h1>
              <div className="flex items-center justify-between flex-wrap gap-6 mt-9 p-3">
                {servicesFields.map((item, elm) => {
                  const { name } = item;
                  const value = serviceSelection[name];
                  const options = servicesOptions[name];
                  return (
                    <NormalSelect
                      inputStyles={{ background: "#cbd5e1" }}
                      name={name}
                      value={value}
                      options={options}
                      onChange={handleServiceChange}
                    />
                  );
                })}

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
                              className="p-2.5"
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
                    <th>Staff</th>
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
                      <td>{item?.staffName}</td>
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
              <div className="flex relative w-[70%] xl:w-[40%] mx-auto  bg-white h-[50px]  rounded-lg">
                <NormalInput
                  value={searchProduct}
                  name="searchProduct"
                  inputStyles={{ paddingRight: "60px" }}
                  placeholder="search product by name "
                  onChange={searchProductOnchange}
                />

                <FaSearch className="absolute right-6 text-xl ml-3 mt-[15px]" />
                {searchProduct?.length > 0 && (
                  <div
                    style={{}}
                    className="absolute top-16 w-full p-2 max-h-[200px]  overflow-y-auto bg-white shadow-lg "
                  >
                    {showSearchProduct?.map((item) => {
                      return (
                        <div
                          onClick={() => productNameOnclick(item.itemId)}
                          className="flex bg-gray-100 mb-2 last:mb-0 items-center px-4 py-2 border shadow-md transition-all duration-300 ease-in-out transform hover:bg-[#f5da42] hover:scale-95 cursor-pointer"
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

                                borderRadius: "8px",
                              }}
                              onChange={handleProductStaff}
                              value={`${productStaff.staffId}-${productStaff.satffName}`}
                            >
                              <option value="">Select Staff</option>
                              {staffData?.map((item) => (
                                <option
                                  key={item._id}
                                  value={`${item._id}-${item.name}`}
                                  style={{ width: "300px" }}
                                >
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <button
                              className="flex items-center justify-center"
                              style={{
                                font: "white",
                                fontWeight: "500",
                                font: "14px",

                                height: "40px",
                                borderRadius: "20px solid grey",
                                width: "150px",
                                backgroundColor: "black",
                              }}
                              onClick={() =>
                                addproductPress(
                                  item,
                                  productQnt,
                                  productStaff.staffId,
                                  productStaff.satffName
                                )
                              }
                            >
                              <span className="">Add Product</span>
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

          <div className="flex flex-wrap justify-start gap-3 items-center">
            <div className="flex items-center">
              <NormalInput
                type="number"
                value={discount}
               
                lableStyles={{
                  display: "flex",
                  width: "150px",
                  color: "#535b61",
                  fontWeight: "medium",
                  fontSize: "1.15rem",
                }}
                inputStyles={{
                  width: "200px",
                }}
                label="Apply Discount"
                onChange={(e) => setDiscount(Math.min(Math.max(e.target.value, 0), 100))}
                />
            </div>
            <button onClick={applyDiscount} className="bg-black">
              Apply Discount
            </button>
          </div>

          <div className="flex gap-3 flex-wrap mt-6 justify-start items-center mb-3">
            <div className="flex  items-center justify-center">
              <h1 className="text-[1.15rem] w-[150px] font-semibold">
                Membership
              </h1>
              <NormalSelect
                inputStyles={{
                  width: "300px",
                }}
                name="membership"
                value={activeMembership?._id}
                onChange={membershipPress}
                options={activemember?.map((item) => ({
                  name: `${item.name}-${item.creditsLeft}`,
                  value: item._id,
                }))}
                disabled={memberShipStatus ? true : false}
              />
            </div>

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
          </div>

          <button
            className="mt-3 w-[50%] py-4 text-lg font-semibold mx-auto bg-black"
            onClick={handldeBookAppointment}
          >
            Book Appointment
          </button>
        </div>
        {customerDetails?.phoneNumber && (
          <div className="  bg-[#ffc232] rounded-lg px-3 py-5 w-full shadow-xl mb-10 flex justify-between  items-center">
            {tableFields.map((elm, idx) => {
              return (
                <div key={idx} className="w-[40%] mb-auto ">
                  <table className="table-auto  w-full">
                    <thead></thead>
                    <tbody>
                      {elm?.map((item, index) => (
                        <tr key={index}>
                          <td className="font-bold text-black  text-lg border-none px-4 py-2">
                            {item.label}
                          </td>
                          <td className=" font-bold   text-lg border-none px-4 py-2 text-green-800">
                            {formatValue(item.value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>

    
    </Layout>
  );
};

export default BookAppointment;
