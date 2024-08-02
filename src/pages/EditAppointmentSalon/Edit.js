import React, { useEffect, useState } from "react";
import { getApiCall, postApiData } from "../../utils/services";
import { useNavigate, useParams } from "react-router";
import Layout from "../../components/Layout";
import { MdDeleteOutline } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Edit = () => {
  const { id } = useParams();
  console.log("parmasid", id);
  const navigate = useNavigate();
  //Staff data fiktering
  const [staffData, setStaffData] = useState([]);
  // states
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  //appointment service and services state
  const [appointmentServices, setAppointmentServices] = useState([]);
  // appointment product and products state
  const [appointementProducts, setAppointmentProducts] = useState([]);
  // after adding services state
  const [addedAppointmentDetails, setAddedAppointmentDetails] = useState([]);
  const [userData, setUserData] = useState([]);
  //   const [addedProductAppointmentDetails,setAddedProductAppointmentDetails] = useState([])
  // service selection obj
  const [serviceSelection, setServiceSelection] = useState({
    category: "",
    subCategory: "",
    miniSubcategory: "",
    staffId: "",
    price: 0,
    satffName: "",
  });
  const [productData, setProductData] = useState({});
  const [userId, setUserId] = useState("");

  // services getting state
  const [service, setService] = useState([]);
  const [subservice, setSubService] = useState([]);
  const [miniservice, setMiniService] = useState([]);
  const [gender, setGender] = useState("F");
  const [searchProduct, setsearchProduct] = useState("");
  const [showSearchProduct, setShowSearchProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQnt, setProductQnt] = useState(0);
  const [productStaff, setProductStaff] = useState("");
  const [discount, setDiscount] = useState(0);
  const [totalSubServices, setTotalSubServices] = useState(0);
  // membership details
  const [membershipDetails, setMembershipDetails] = useState([]);
  const [memberShipStatus, setMemberShipStatus] = useState(false);
  const [membershipCoin, setMembershipCoin] = useState(0);
  const [filterMembershipId, setFilterMembershipId] = useState("");
  const [memberShipId, setMemberShipId] = useState("");
  const [creditUsed, setCreditUsed] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subServiceTotal, setSubServiceTotal] = useState(0);
  const [staffNames, setStaffNames] = useState(
    Array(addedAppointmentDetails.length).fill("")
  );

  const handleStaffNameChange = (index, newName) => {
    setStaffNames((prevStaffNames) => {
      const newStaffNames = [...prevStaffNames];
      newStaffNames[index] = newName;

      const newAddedAppointmentDetails = addedAppointmentDetails.map(
        (appointment, i) => {
          if (i === index) {
            return {
              ...appointment,
              staffName: newName,
            };
          }
          return appointment;
        }
      );

      setAddedAppointmentDetails(newAddedAppointmentDetails);
      return newStaffNames;
    });
  };

  // api call for getting service category
  useEffect(() => {
    // const data = {
    //     gender: gender,
    //   };
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
  // mini category get api
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
        console.log("error", error);
      }
    );
  }, [serviceSelection.subCategory]);

  //single appointment api
  useEffect(() => {
    getApiCall(
      `appointment/getSingleAppointmentDetails?id=${id}`,
      (resp) => {
        console.log("new edit ki single data :", resp);
        setDiscount(resp.discountPercentage);
        setAppointmentDetails(resp);
        setAddedAppointmentDetails(resp.services);
        setAppointmentProducts(resp.products);
        // setMembershipDetails(resp.customer.activeMembership)
        setMemberShipStatus(resp.membershipUsed);
        setFilterMembershipId(resp.membershipId);
        setUserId(resp.customer._id);
        setMemberShipId(resp.membershipId);
        setTotalSubServices(resp.membershipCreditUsed);
        setSubServiceTotal(resp.membershipCreditUsed);
        setPhoneNumber(resp.customer.phoneNumber);

        // setCreditUsed(resp.membershipCreditUsed)
      },
      (error) => {
        console.log(`newEdit page error: ${error}`);
      }
    );
  }, []);

  console.log({ appointmentDetails });
  console.log({ appointementProducts });
  console.log({ appointmentServices });
  // staff get api
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

  // handle buttons for add service
  const serviceAddpress = () => {
    console.log("click handle addon");
    setAddedAppointmentDetails([...addedAppointmentDetails, serviceSelection]);
    //  let myServicesPrice = getTotalServicePrice(addedAppointmentDetails, discount)
    //  setTotalSubServices(myServicesPrice)
    //  setSubServiceTotal(totalService)
  };
  console.log("adding or added services", addedAppointmentDetails);
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

  console.log();
  console.log("added services ", addedAppointmentDetails);

  // search product api
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
  const productNameOnclick = (item) => {
    setSelectedProduct(item);
    setsearchProduct("");
  };
  console.log({ selectedProduct });
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

    // dispatch(EditproductAdded(itemWithAdditionalInfo));
    // setProductData(itemWithAdditionalInfo)
    setAppointmentProducts([...appointementProducts, itemWithAdditionalInfo]);
  };

  const deleteEditService = (indexId) => {
    // const updatedDetails = [addedAppointmentDetails]
    const updatedDetails = addedAppointmentDetails.filter(
      (_, index) => index !== indexId
    );
    setAddedAppointmentDetails(updatedDetails);
  };
  const deleteEditProduct = (indexId) => {
    const updatedDetails = appointementProducts.filter(
      (_, index) => index !== indexId
    );
    // updatedDetails.splice(index, 1);
    setAppointmentProducts(updatedDetails);
  };
  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    setServiceSelection({
      category: "",
    });
    setSubService(null);
    setMiniService(null);
    setStaffData(null);
  };

  // handle book appointment
  const handleBookAppointment = () => {
    console.log("book Appointment");

    const data = {
      services: addedAppointmentDetails,

      subTotal: subTotalServices,
      total: totalAmount,

      membershipUsed: memberShipStatus,
      membershipId: memberShipStatus ? memberShipId : "",
      // membershipCreditUsed: (memberShipStatus)? (+subTotalServices):0,
      membershipCreditUsed: memberShipStatus ? +creditUsed : 0,
      products: appointementProducts,
      discount: serviceDiscount,
      discountPercentage: discount,
    };

    postApiData(
      `appointment/editAppointmentBookedFromCrm?id=${id}`,
      data,
      (resp) => {
        if (resp) {
          toast.success("Appointment Booked SuccessFully");
          console.log("appointment", resp);
          navigate("/viewAppointment");
        }
      },
      (error) => {
        console.log("error", error);
      }
    );
  };
  const applyMemberShip = () => {
    const data = {
      //   creditsUsed:5000,
      creditsUsed: memberShipStatus ? subServiceTotal : totalService,
      // creditsUsed: totalSubServices,
      userId: userId,
      memId: memberShipId,
      isMembershipUsed: !memberShipStatus,
    };
    // console.log("after",subTotalService)
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
            setCreditUsed(resp.creditsUsed - resp.remainingAmount);
            setTotalSubServices(resp.creditsUsed);
            toast.error("MemberShip Removed sucessfully");
          } else {
            toast.success("MemberShip Applied sucessfully");
            setMembershipCoin(resp.creditsLeft);
            setSubServiceTotal(resp.creditsUsed - resp.remainingAmount);
            setCreditUsed(resp.creditsUsed - resp.remainingAmount);
            setMemberShipStatus(true);
          }
        }
      },
      (error) => {
        console.log("error", error);
        alert("Select Correct Options");
      }
    );
  };
  const arr = membershipDetails?.filter(
    (item) => item?._id === filterMembershipId
  );
  console.log({ arr });

  const subTotalServices = addedAppointmentDetails.reduce(
    (acc, item) => acc + +item?.price,
    0
  );

  console.log("subtotalsumservice", subTotalServices);

  const subProductTotal = appointementProducts
    ?.map((item) => item.price * item.quantity)
    ?.reduce((acc, val) => acc + val, 0);
  console.log("subproduct ka total", subProductTotal);

  const serviceDiscount = subTotalServices * (discount / 100);
  console.log("service ka discount", serviceDiscount);

  const totalService = subTotalServices - serviceDiscount;
  console.log("total ka service", totalService);

  const totalAmount = totalService + subProductTotal;
  const membershipPress = (e) => {
    const selectedMembership = e.target.value;
    console.log("selectedMembership", selectedMembership);
    setMemberShipId(e.target.value);
    setTotalSubServices(subTotalServices);
  };

  useEffect(() => {
    const data = {
      phoneNumber: phoneNumber,
    };
    postApiData(
      "user/searchUser",
      data,
      (resp) => {
        console.log("respons", resp);
        setMembershipDetails(resp[0].activeMembership);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [memberShipStatus]);
  const handlePriceChange = (index, newPrice) => {
    const updatedAppointments = [...addedAppointmentDetails];
    updatedAppointments[index].price = +newPrice;
    console.log("newprice",+newPrice)
    setAddedAppointmentDetails(updatedAppointments);
  };

  return (
    <Layout>
      <div className="my-40">
        {/* Services Table section*/}
        <div
          className=""
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
        </div>
        <div className="mx-auto my-2 rounded-lg bg-[#fffffe] shadow-xl  border-2 border-gray-300 w-[95%] h-80 overflow-y-auto">
          <h1 className="text-4xl font-bold text-black mt-2 ml-2">
            Your Services
          </h1>
          <div className="w-full overflow-x-auto my-4">
            <div className="table-container">
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
                  {addedAppointmentDetails?.length > 0
                    ? addedAppointmentDetails.map((item, index) => (
                        <tr key={index} className="bg-white">
                          <td>{item?.miniSubcategory || item?.name}</td>
                          <td>{item?.category}</td>
                          <td>{item?.subCategory}</td>
                          <td>
                            {staffData
                              ?.filter((staff) => staff?._id === item?.staffId)
                              ?.map((data) => (
                                <span>{data.name}</span>
                              ))}
                            {!staffData?.some(
                              (staff) => staff?._id === item?.staffId
                            ) && (
                              <input
                                type="text"
                                value={staffNames[index]}
                                onChange={(e) =>
                                  handleStaffNameChange(index, e.target.value)
                                }
                              />
                            )}
                          </td>
                          {/* <td>{item?.price}</td> */}
                          <td>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handlePriceChange(index, e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <MdDeleteOutline
                              onClick={() => deleteEditService(index)}
                              className="text-xl text-red-600 font-bold cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))
                    : ""}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/*ADD Services Selection section */}
        <div className="mx-auto my-14 rounded-lg bg-[#fffffe] shadow-xl border-2 border-gray-300 w-[95%]  overflow-y-auto">
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
              paddingBottom: "30px",
              marginTop: "20px",
            }}
          >
            <select
              className="px-3 py-2 text-md font-medium bg-slate-300 rounded-lg outline-none"
              onChange={handleServiceChange}
              value={serviceSelection.category} // Use 'value' for controlled components
            >
              <option value={service}>Select Category</option>
              {service?.map((item, index) => (
                <option
                  key={item?.id}
                  value={item?.value}
                  style={{ width: "700px" }}
                >
                  {item?.name}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 text-md font-medium bg-slate-300 rounded-lg outline-none"
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
              className="px-3 py-2 text-md font-medium bg-slate-300 rounded-lg outline-none"
              onChange={handleminiChange}
              value={serviceSelection.miniSubcategory}
            >
              <option value={miniservice}>Select MiniCategory</option>
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
                backgroundColor: "red",
                cursor: "pointer",
              }}
              onClick={serviceAddpress}
            >
              <label
                style={{ color: "white", fontSize: "14px", fontWeight: "500" }}
              >
                Add Service
              </label>
            </button>
          </div>
        </div>

        {/* Product Table section */}
        {appointementProducts?.length > 0 && (
          <div className="mx-auto my-2 rounded-lg bg-[#fffffe] shadow-xl  border-2 border-gray-300 w-[95%] h-80 overflow-y-auto">
            <h1 className="text-4xl font-bold text-black mt-2 ml-2">
              Your Products
            </h1>

            <div className="w-full overflow-x-auto my-4">
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
                    {appointementProducts?.map((item, index) => (
                      <tr key={index} className="bg-white">
                        <td>{item?.name}</td>
                        <td>{item?.price}</td>
                        <td>{item?.brand}</td>
                        <td>{item?.quantity}</td>
                        <td>
                          {" "}
                          <MdDeleteOutline
                            onClick={() => deleteEditProduct(index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ADD PRODUTS SECTION */}
        <div className="mx-auto my-2 rounded-lg bg-[#fffffe] shadow-xl   border-2 border-gray-300 w-[95%] h-80 overflow-y-auto mt-10">
          <h1 className="text-4xl font-bold text-black mt-2 ml-2">
            ADD Products
          </h1>
          {/* Search Table */}
          <div className="search-container h-auto  ">
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
                  className="absolute left-80 shadow-xl bg-white top-16 ml-12 h-[104px] w-[450px] overflow-auto"
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
                                cursor: "pointer",
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

        {/* Book Appointment Section */}
        <div className="border-2 border-gray-300 p-4 rounded-lg bg-[#fffffe] shadow-xl  my-12 flex flex-col w-[95%] mx-auto">
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
                <button
                  //    onClick={applyDiscount}
                  className="bg-black"
                >
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
                    disabled={memberShipStatus ? true : false}
                  >
                    <option value="">Membership</option>
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
              </div>
            </div>
            <div>
              {arr?.length > 0 && (
                <div className="flex flex-col">
                  <p className=" text-lg font-bold text-black">
                    MEMBERSHIP:{" "}
                    <span className="text-md font-medium ml-1 text-green-600">
                      {arr[0]?.name}
                    </span>
                  </p>
                  <p className=" text-lg font-bold text-black">
                    CREDITS LEFT:
                    <span className="text-md font-medium ml-1 text-green-600">
                      {arr[0]?.creditsLeft}
                    </span>
                  </p>
                  <p className=" text-lg font-bold text-black">
                    AMOUNT:
                    <span className="text-md font-medium ml-1 text-green-600">
                      {arr[0]?.amount}
                    </span>
                  </p>
                </div>
              )}
              <p className=" text-lg font-bold text-black">
                SubTotal Services:
                <span className="text-md font-medium ml-1 text-green-600">
                  {subTotalServices}
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                SubTotal Products:
                <span className="text-md font-medium ml-1 text-green-600">
                  {subProductTotal}
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                DISCOUNT:
                <span className="text-md font-medium ml-1 text-green-600">
                  {serviceDiscount}
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                Total Services:
                <span className="text-md font-medium ml-1 text-green-600">
                  {totalService}
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                Total Products:
                <span className="text-md font-medium ml-1 text-green-600">
                  {subProductTotal}
                </span>
              </p>
              <p className=" text-lg font-bold text-black">
                Total Payable:
                <span className="text-md font-medium ml-1 text-green-600">
                  {totalAmount}
                </span>
              </p>
            </div>
          </div>

          <button
            className="mt-3 w-[50%] py-4 text-lg font-semibold mx-auto bg-black"
            onClick={handleBookAppointment}
          >
            Update Appointment
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
