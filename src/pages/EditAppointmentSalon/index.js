import React, { useEffect, useState } from "react";
import { getApiCall, postApiData } from "../../utils/services";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
    EditproductAdded,
    UpdateServiceAdded,
    deletEditItems, deleteProducts
} from "../../redux/actions";
import { MdDeleteOutline } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import Layout from "../../components/Layout";
import { toast } from "react-hot-toast";
const EditAppointment = () => {
  const { id } = useParams();
  
  const [editAppointmentDetails, setEditAppointmentDetails] = useState([]);
  // membership details
  const [membershipDetails,setMembershipDetails] = useState([]);
  const [filterMembershipId,setFilterMembershipId] = useState("");
  
  const userAppointmentDetails = editAppointmentDetails;
  
// sum of total servicex


const servicesData = useSelector((store) => store.UpdateServices.EditService);

// const mergedArray = [...editAppointmentDetails?.services, ...servicesData];
// 
const deleteEditService = (index) => {
  const updatedDetails = [editAppointmentDetails];
  updatedDetails.splice(index, 1);
  setEditAppointmentDetails(updatedDetails);
};
const mergedArray = servicesData.concat(editAppointmentDetails.services);


  const deleteEditProduct = (index) => {
    const updatedDetails = [editproduct];
    updatedDetails.splice(index, 1);
    setEditProduct(updatedDetails);
  };

  useEffect(() => {
    // dispatch(UpdateServiceAdded({...serviceSelection,...editAppointmentDetails}));
  }, []);

  // from book

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [membershipCoin, setMembershipCoin] = useState(0);
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  // const [gender, setGender] = useState("male");
  const [selectedState, setSelectedState] = useState("");
  const [address, setAddress] = useState("");
  const [userData, setUserData] = useState([]);
  const [date, setDate] = useState("");
  const [service, setService] = useState([]);
  const [subservice, setSubService] = useState([]);
  const [miniservice, setMiniService] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [staffData, setStaffData] = useState([]);
  const [time, setTime] = useState("");
  const [gender, setGender] = useState("F");
  const [memberShip, setMemberShip] = useState(0);
  const [applyDisountPer, setApplyDiscountPer] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [membershipitem, setMemberShipItem] = useState(null);
  const [userId, setUserId] = useState("");
  const [memberShipId, setMemberShipId] = useState("");
  const [memberShipStatus, setMemberShipStatus] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [subServiceCoins,setSubServiceCoins] = useState(0);
  // product table state
  const activemember = membershipitem?.activeMembership;

  const serviceDataReducerLength = useSelector(
    (store) => store.serviceAddReducer.serviceData.length
  );
  const [searchProduct, setsearchProduct] = useState("");
  const [showSearchProduct, setShowSearchProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQnt, setProductQnt] = useState(0);
  const [productStaff, setProductStaff] = useState("");
  const [editproduct, setEditProduct] = useState([]);
  
  
  // const [singleResponse,setSingleResponse]= useState([])
  

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };
  const membershipPress = (e) => {
    const selectedMembership = e.target.value;
    
    setMemberShipId(e.target.value);
  };
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
      
      setTime(selectedTime);
      // Add your logic here
    } else {
      // Handle the case when selectedTime is null
      console.error("Selected time is null");
    }
  };
  
  const productDataReducer = useSelector(
    (store) => store.ProductAddReducer.ProductData
  );
  

  const x = useSelector((store) => store.serviceAddReducer.serviceData);
  const subtotalPrice = x.reduce((accumulator, currentItem) => {
    return accumulator + Number(currentItem.price);
  }, 0);

  const countdiscount = (subtotalPrice * applyDisountPer) / 100;
  
  const payableAmount = subtotalPrice - countdiscount;

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
  

  const isServiceSelectionValid = () => {
    for (const key in serviceSelection) {
      if (serviceSelection[key] === "") {
        return false; // If any field is empty, return false
      }
    }
    return true; // All fields are filled, return true
  };

  const data = {
    gender: gender,
  };
  // api call for getting service category
  useEffect(() => {
    postApiData(
      "salonService/getServiceCategory",
      data,
      (resp) => {
        
        setService(resp);
      },
      (error) => {
        
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
      "salonService/getServices",
      minicatgdata,
      (resp) => {
        setMiniService(resp);
      },
      (error) => {
        
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
        
      }
    );
  }, [serviceSelection.subCategory]);

  const dispatch = useDispatch();
  const handleServiceChange = (e) => {
    
    setServiceSelection({
      ...serviceSelection,
      category: e.target.value,
      subCategory: "",
    });
  };
  const handleSubCategoryChange = (e) => {
    
    setServiceSelection({
      ...serviceSelection,
      subCategory: e.target.value,
      miniSubcategory: "",
    });
  };

  const handleminiChange = (event) => {
    // 
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedPrice = selectedOption.getAttribute("data-price");
    
    // Now you have the selected price, you can use it as needed
    setServiceSelection({
      ...serviceSelection,
      miniSubcategory: event.target.value,
      price: +selectedPrice,
    });
  };
  const handlestaffChange = (e) => {
    
    setServiceSelection({
      ...serviceSelection,
      staffId: e.target.value,
      satffName: e.target.value,
    });
  };
  const handldeAddButton = () => {
    if (isServiceSelectionValid()) {
      dispatch(UpdateServiceAdded(serviceSelection));
    } else {
      // alert("all feilds should be filled");
      toast.error("all feilds should be filled");
    }
  };
  const handldeBookAppointment = () => {
    

    const data = {
      services: x,
      customer: {
        name: name,
        phoneNumber: phoneNumber,
      },
      subTotal: subtotalPrice,
      total: subtotalPrice,
      appointmentDate: combinedDateTime,
      membershipUsed: memberShipStatus,
      membershipCreditUsed: +memberShip,
      products: productDataReducer,
      discount: +countdiscount,
    };
    if (serviceDataReducerLength > 0) {
      postApiData(
        "appointment/bookAppointmentFromCrm",
        data,
        (resp) => {
          if (resp) {
            // alert("Appointment Booked Sucessfully");
            toast.success("Appointment Booked SuccessFully");
            
          }
        },
        (error) => {
          
          // alert(" Booking Status Failed");
          toast.error("Booking Status Failed");
        }
      );
    }
  };
  // ...`
  const nameOnclick = (item) => {
    
    // e.preventDefault();
    setMemberShipItem(item);

    setName(item.name);
    setPhoneNumber(item.phoneNumber);
    setUserId(item._id);
  };
  
  // product name on click

  const productNameOnclick = (item) => {
    setSelectedProduct(item);
    setsearchProduct("");
  };
  

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    // Do something with the selected value, for example, store it in state
    
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
    dispatch(deletEditItems(item));
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
        
      },
      (error) => {
        
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
        
        setShowSearchProduct(resp.products);
      },
      (error) => {
        
      }
    );
  };
  const applyDiscount = () => {
    setApplyDiscountPer(discount);
  };
  // const applyMemberShip = () => {
  //   // post api = {"creditsUsed":650, "userId":"659ba793f289e0151305cba0", "memId":"65b0e6dc44201e04eae2ae7b"}
  //   const data = {
  //     creditsUsed: memberShip,
  //     userId: userId,
  //     memId: memberShipId,
  //   };
  //   postApiData(
  //     "membership/applyMembership",
  //     data,
  //     (resp) => {
  //       
  //       if (resp) {
  //         // alert("MemberShip Applied sucessfully");
  //         toast.success("Membership applied sucessfully");
  //         setMemberShipStatus(true);
  //       }
  //     },
  //     (error) => {
  //       
  //       // alert("Select Correct Options");
  //       toast.error("Select Correct Options");
  //     }
  //   );
  // };
  const applyMemberShip = () => {
    // 
    // setIsMembershipUsed(!isMembershipUsed)
    // post api = {"creditsUsed":650, "userId":"659ba793f289e0151305cba0", "memId":"65b0e6dc44201e04eae2ae7b"}
    // setMemberShipStatus(!memberShipStatus)
    const data = {
      // creditsUsed:memberShip,
      creditsUsed: memberShipStatus ? subTotalServices : subtotalPrice,
      userId: userId,
      memId: memberShipId,
      isMembershipUsed: !memberShipStatus
    };
    // 
    


    postApiData(
      "membership/applyMembership",
      data,
      (resp) => {
        if (resp) {
          
          if(memberShipStatus){
            // setMembershipCoin(resp?.creditsLeft)
            setMemberShipStatus(false)
            // setMemberShip(-memberShip)
            // setSubTotalService(subtotalPrice)
            // setIsMembershipUsed(true)
            toast.error("MemberShip Removed sucessfully")
          } 
          else {
            // alert("MemberShip Applied sucessfully");
            toast.success("MemberShip Applied sucessfully")
            // setMembershipCoin(resp?.creditsLeft)
            // setSubTotalService(resp.creditsUsed - resp.remainingAmount)
            setSubServiceCoins(resp.creditsUsed - resp.remainingAmount)
            setMemberShipStatus(true);
            // setIsMembershipUsed(false)      
          // setMemberShip(-memberShip)
          }
        }
      },
      (error) => {
        
        alert("Select Correct Options");
      }
    );
  };
  const handleMobileChange = (event) => {
    const enteredMobileNumber = event.target.value;
    setPhoneNumber(enteredMobileNumber);
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
      (error) => {
        
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
    

    dispatch(EditproductAdded(itemWithAdditionalInfo));
  };

  // last book

  useEffect(() => {
    getApiCall(
      `appointment/getSingleAppointmentDetails?id=${id}`,
      (resp) => {
        
        // resp.customer.activeMembership
        // setDiscountPercent(resp.discountPercentage);
        setDiscount(resp.discountPercentage)
        // setSingleResponse(resp)
        setEditProduct(resp.products);
        setEditAppointmentDetails(resp);
        setMembershipDetails(resp.customer.activeMembership)
        setFilterMembershipId(resp.membershipId)
        setMemberShipId(resp.membershipId)
        setMemberShipStatus(resp.membershipUsed)
        setMemberShip(resp.membershipCreditUsed)
        setUserId(resp.customer._id)
        setSubServiceCoins(subTotalServices)
      },
      (error) => {
        
      }
    );
  }, []);
  // const isMembershipUsed = singleResponse?.membershipUsed;
  // 
  
  
  

  const arr = membershipDetails?.filter((item)=>item?._id === filterMembershipId)
  

  const subTotalServices = mergedArray.reduce((acc,item)=>acc+item?.price,0);
  

  const subProductTotal = productDataReducer.reduce((acc,item)=>acc+item.price,0);
  

  const serviceDiscount = (subTotalServices*(discount/100));
  

  const totalService = subTotalServices-serviceDiscount;
  

  const totalAmount = totalService+subProductTotal;

  return (
    <Layout>
      <div className="w-[85%] mx-auto mt-32 ">
      <div className="flex justify-between">
        {/* your servic section */}

        <div className="mx-auto my-2 rounded-lg bg-slate-200 border-2 border-gray-300 w-[95%] h-80 overflow-y-auto">
          {/* <h1 className="text-4xl font-bold text-black mt-2 ml-2">
            Your Services
          </h1> */}
          <div className="w-full overflow-x-auto my-4">
            <div className="table-container">
              {/* <table className="styled-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Mobile No.</th>
      <th>Services</th>
    
      <th>Amount</th>
      <th>MembershipCreditUsed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>{userAppointmentDetails?.customer?.name}</td>
        <td>{userAppointmentDetails?.customer?.phoneNumber}</td>
        <td>
                    {userAppointmentDetails?.services?.map((itemdata) => {
                      // setTotalAmount(item.total-item.membershipCreditUsed)
                      return (
                        <>
                          <span>
                            {itemdata.category} {itemdata.subCategory}{" "}
                            {itemdata.miniSubcategory}
                          </span>
                        </>
                      );
                    })}
                  </td>
                  
                  <td>{userAppointmentDetails?.total}</td>
                    {userAppointmentDetails?.membershipCreditUsed > 0 ? (
                    <td>{userAppointmentDetails?.membershipCreditUsed}</td>
                  ) : (
                    <td>{"0"}</td>
                  )}
      </tr>
  </tbody>
</table> */}
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
                  {userAppointmentDetails?.services?.map((item, index) => (
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
                      <td>{item?.price}</td>
                      <td>
                        <MdDeleteOutline
                          onClick={() => deleteEditService(index)}
                          className="text-xl text-red-600 font-bold cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}

                  {servicesData?.map((item, index) => (
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
                      <td>{item?.price}</td>
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
          </div>
        </div>
        {/* Membership shown section */}
       
            {/* <div className="border-2 border-gray-300  rounded-lg bg-slate-100 px-3 py-3 ml-6">
              <p className=" text-lg font-bold text-black">MEMBERSHIP: <span className="text-md font-medium ml-1 text-green-600">{arr[0].name}</span></p>
              <p className=" text-lg font-bold text-black">CREDITS LEFT:<span className="text-md font-medium ml-1 text-green-600">{arr[0].creditsLeft}</span></p>
              <p className=" text-lg font-bold text-black">AMOUNT:<span className="text-md font-medium ml-1 text-green-600">{arr[0].amount}</span></p>
    
              
            </div> */}
            </div>
        
        

        {/* ADD SERVICES  */}

        <div className="mx-auto my-14 rounded-lg bg-slate-200 border-2 border-gray-300 w-[95%]  overflow-y-auto">
          <h1 className="text-4xl font-bold text-black mt-2 ml-2">
            ADD Services
          </h1>

          <div
            style={{
              border: "",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              paddingBottom:"30px",
              marginTop: "20px",
            }}
          >
            <select
              className="px-3 py-2 text-md font-medium bg-slate-300 rounded-lg outline-none"
              onChange={handleServiceChange}
              value={serviceSelection.category} // Use 'value' for controlled components
            >
              <option value="" disabled>
                Select Category
              </option>
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
              className="px-3 py-2 text-md font-medium bg-slate-300 rounded-lg outline-none"
              onChange={handleSubCategoryChange}
              value={serviceSelection.subCategory} // Use 'value' for controlled components
            >
              <option value="" disabled>
                Select SubCategory
              </option>
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
              className="px-3 py-2 text-md font-medium bg-slate-300 rounded-lg outline-none"
              onChange={handleminiChange}
              value={serviceSelection.miniSubcategory}
            >
              <option value="" disabled>
                Select MiniCategory
              </option>
              {miniservice?.map((item) => (
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
              className="px-3 py-2 text-md font-medium bg-slate-300 rounded-lg outline-none"
              onChange={handlestaffChange}
              value={serviceSelection.staffId}
            >
              <option value="" className="bg-white" disabled>
                Select Staff
              </option>
              {staffData?.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
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
                cursor:"pointer"
              }}
              onClick={handldeAddButton}
            >
              <label
                style={{ color: "white", fontSize: "14px", fontWeight: "500" }}
              >
                Add Service
              </label>
            </button>
          </div>
        </div>

        {/* ADD PRODUCTS */}

        <div className="mx-auto my-4 rounded-lg bg-slate-200 border-2 border-gray-300 w-[95%] ">
          <h1 className="text-4xl font-bold text-black mt-2 ml-2">
            ADD Products
          </h1>
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
                {editproduct?.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.name}</td>
                    <td>{item?.price}</td>
                    <td>{item?.brand}</td>
                    <th>{item?.quantity}</th>
                    <th>
                      {" "}
                      <MdDeleteOutline
                        onClick={() => deleteEditProduct(index)}
                      />
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                        <MdDeleteOutline onClick={() => deleteProduct(index)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Search Table */}
          <div className="search-container h-auto ">
            <div className="flex flex-row relative mb-10 ">
              {/* <h1 className="text-lg font-semibold">Search Product</h1> */}
              <div className="flex relative w-[40%] mx-auto border-2 bg-white h-[50px] border-gray-300 rounded-lg">
                <input
                  value={searchProduct}
                  placeholder="search product By Name "
                  onChange={searchProductOnchange}
                  className="border-none outline-none w-full text-lg"
                />
                <FaSearch className="absolute right-6 text-xl ml-3 mt-3" />
              </div>
              {searchProduct?.length > 0 && (
                <div
                  style={{}}
                  className="absolute left-80 shadow-xl bg-white top-16 ml-8 h-[104px] w-[260px] overflow-auto"
                >
                  {showSearchProduct?.map((item) => {
                    
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
                                cursor:"pointer"
                              }}
                              onClick={() =>
                                addproductPress(item, productQnt, item._id)
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
      </div>
      <div className="border-2 border-gray-300 p-4 rounded-lg bg-slate-100 my-12 flex flex-col w-[95%] mx-auto">
        <h1 className="text-4xl font-bold mb-10 mt-10 text-center text-black">
          BOOK APPOINTMENT
        </h1>

        <div className="flex justify-between items-center">
        <div className="flex flex-col">
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
              value={memberShipId}
            >
              <option value="" >
                Membership
              </option>
              {membershipDetails?.map((item) => {
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
            <button onClick={applyMemberShip} className="bg-black">
              Remove Membership
            </button>
          ) : (
            <button onClick={applyMemberShip} className="bg-black">
              Apply Membership
            </button>
          )}

          <div className="flex ml-6">
            <h3 className="text-lg font-bold text-black">
              BALANCE :{" "}
              <span className="text-green-600 font-bold">{membershipCoin}</span>
            </h3>
          </div>

          {/* <button onClick={applyMemberShip} className="bg-black">{memberShipStatus ? "Remove MemberShip" : "Apply MemberShip" }</button> */}
          {/* </div> */}
        </div>
        </div>
        {
          arr?.length>0 && (
            <div>
        <p className=" text-lg font-bold text-black">MEMBERSHIP: <span className="text-md font-medium ml-1 text-green-600">{arr[0]?.name}</span></p>
              <p className=" text-lg font-bold text-black">CREDITS LEFT:<span className="text-md font-medium ml-1 text-green-600">{arr[0]?.creditsLeft}</span></p>
              <p className=" text-lg font-bold text-black">AMOUNT:<span className="text-md font-medium ml-1 text-green-600">{arr[0]?.amount}</span></p>
              <p className=" text-lg font-bold text-black">SubTotal Services:<span className="text-md font-medium ml-1 text-green-600">{subTotalServices}</span></p>
              <p className=" text-lg font-bold text-black">SubTotal Products:<span className="text-md font-medium ml-1 text-green-600">{subProductTotal}</span></p>
              <p className=" text-lg font-bold text-black">DISCOUNT:<span className="text-md font-medium ml-1 text-green-600">{serviceDiscount}</span></p>
              <p className=" text-lg font-bold text-black">Total Services:<span className="text-md font-medium ml-1 text-green-600">{totalService}</span></p>
              <p className=" text-lg font-bold text-black">Total Products:<span className="text-md font-medium ml-1 text-green-600">{subProductTotal}</span></p>
              <p className=" text-lg font-bold text-black">Total Payable:<span className="text-md font-medium ml-1 text-green-600">{totalAmount}</span></p>



        </div>
          )
        }
       
        </div>


        

        <button
          className="mt-3 w-[50%] py-4 text-lg font-semibold mx-auto bg-black"
          onClick={handldeBookAppointment}
        >
          Book Appointment
        </button>
      </div>
    </Layout>
  );
};

export default EditAppointment;
