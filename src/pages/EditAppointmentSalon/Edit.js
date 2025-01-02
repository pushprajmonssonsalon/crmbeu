import { useEffect, useState } from "react";
import { getApiCall, postApiData } from "../../utils/services";
import { useNavigate, useParams } from "react-router";
import Layout from "../../components/Layout";
import { MdDeleteOutline } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";
import MultiSelectInput from "../../components/customInput/MultiSelectInput";
import useDebouncer from "../../utils/hooks/useDebouncer";
import NormalSelect from "../../components/customInput/NormalSelect";
import NormalInput from "../../components/customInput/NormalInput";
import CustomInput from "../../components/customInput/CustomInput";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { debouncedFunction } = useDebouncer();
  //Staff data fiktering
  const [staffData, setStaffData] = useState([]);

  const [appointementProducts, setAppointmentProducts] = useState([]);
  const [addedAppointmentDetails, setAddedAppointmentDetails] = useState([]);

  const [serviceSelection, setServiceSelection] = useState({
    category: "",
    subCategory: "",
    miniSubcategory: "",

    staffs: [],
    price: 0,

  });
  const [productData, setProductData] = useState(null);
  const [userId, setUserId] = useState("");

  // services getting state
  const [service, setService] = useState([]);
  const [subservice, setSubService] = useState([]);
  const [miniservice, setMiniService] = useState([]);
  const [gender, setGender] = useState("F");
  const [searchProduct, setsearchProduct] = useState("");
  const [showSearchProduct, setShowSearchProduct] = useState([]);

  const [discount, setDiscount] = useState(0);
  // membership details
  const [membershipDetails, setMembershipDetails] = useState([]);
  const [memberShipStatus, setMemberShipStatus] = useState(false);
  const [membershipCoin, setMembershipCoin] = useState(0);
  const [filterMembershipId, setFilterMembershipId] = useState("");
  const [memberShipId, setMemberShipId] = useState("");
  const [creditUsed, setCreditUsed] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subServiceTotal, setSubServiceTotal] = useState(0);

  const handleStaffSelection = (tag, _id, idx) => (e) => {
    const { value, checked } = e.target;
    const splited = value?.split("-");
    const satffName = splited[1];

    const staffId = splited[0];
    if (checked) {

      if (tag === "service") {

        const arr = [...serviceSelection.staffs, { satffName, staffId }]

        const updatedStaffs = arr.map((prev) => ({ ...prev, share: parseInt(100 / arr.length) }))
        setServiceSelection((prev) => ({
          ...prev,
          staffs: updatedStaffs
        }))
      }
      else if (tag === "edit") {



        setAddedAppointmentDetails((prev) => prev?.map((elm, index) => {
          if (index === idx) {
            return {
              ...elm, staffs: (() => {
                const arr = [...elm.staffs, { satffName, staffId }]
                return arr.map((item) => ({ ...item, share: parseInt(100 / arr?.length) }))
              })()
            }
          }
          return elm
        }))


      }
      else {

        const arr = [...productData?.staffs, {
          staffId: staffId,
          staffName: satffName

        }]

        const updatedStaffs = arr.map((prev) => ({ ...prev, share: parseInt(100 / arr.length) }))
        setProductData((prev) => ({
          ...prev,
          staffs: updatedStaffs
        }))

      }
    }
    else {
      if (tag === "service") {
        const arr = serviceSelection?.staffs?.filter((elm) => elm.staffId !== staffId)
        const updatedStaffs = arr.map((prev) => ({ ...prev, share: parseInt(100 / arr.length) }))

        setServiceSelection((prev) => ({
          ...prev,
          staffs: updatedStaffs
        }))
      }
      else if (tag === "edit") {
        const updatedAppointments = addedAppointmentDetails?.map((elm, index) => {
          if (index === idx) {
            return {
              ...elm, staffs: (() => {
                const newArr = elm?.staffs?.filter((elm) => elm.staffId !== staffId)
                return newArr.map((item) => ({ ...item, share: parseInt(100 / newArr?.length) }))


              })()
            }
          }
          return elm
        })

        setAddedAppointmentDetails(updatedAppointments)


      } else {
        const arr = productData?.staffs?.filter((elm) => elm.staffId !== staffId)
        const updatedStaffs = arr.map((prev) => ({ ...prev, share: parseInt(100 / arr.length) }))

        setProductData((prev) => ({
          ...prev,
          staffs: updatedStaffs
        }))
      }
    }

  }
  const handleShareChange = (tag, _id, idx) => (e) => {
    const newShare = +e.target.value; // Get the updated share value from input


    if (tag === "service") {
      setServiceSelection((prev) => {
        // Calculate the current total share excluding the current staff
        const currentTotal = prev.staffs.reduce(
          (sum, staff) => (staff.staffId === _id ? sum : sum + staff.share),
          0
        );

        // Limit the new share to ensure total does not exceed 100
        const adjustedShare = Math.min(newShare, 100 - currentTotal);

        return {
          ...prev,
          staffs: prev.staffs.map((staff) =>
            staff.staffId === _id
              ? { ...staff, share: adjustedShare }
              : staff
          ),
        };
      });

    }
    else if (tag === "edit") {

      setAddedAppointmentDetails((prev) => prev.map((elm, index) => {


        // Limit the new share to ensure total does not exceed 100
        if (index === idx) {
          const currentTotal = elm.staffs.reduce(
            (sum, staff) => (staff.staffId === _id ? sum : sum + staff.share),
            0
          );
          const adjustedShare = Math.min(newShare, 100 - currentTotal);

          return {
            ...elm,
            staffs: elm.staffs.map((staff) =>
              staff.staffId === _id
                ? { ...staff, share: adjustedShare }
                : staff
            ),
          }
        }
        return elm

      }))

    }
    else {
      setProductData((prev) => {
        // Calculate the current total share excluding the current staff
        const currentTotal = prev.staffs.reduce(
          (sum, staff) => (staff.staffId === _id ? sum : sum + staff.share),
          0
        );

        // Limit the new share to ensure total does not exceed 100
        const adjustedShare = Math.min(newShare, 100 - currentTotal);

        return {
          ...prev,
          staffs: prev.staffs.map((staff) =>
            staff.staffId === _id
              ? { ...staff, share: adjustedShare }
              : staff
          ),
        };
      });
    }

  };


  // api call for getting service category
  useEffect(() => {
    // const data = {
    //     gender: gender,
    //   };
    getApiCall(
      "salonService/getServiceCategory",

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

      }
    );
  }, [serviceSelection.subCategory]);

  console.log(miniservice, "miniservice")

  //single appointment api
  useEffect(() => {
    getApiCall(
      `appointment/getSingleAppointmentDetails?id=${id}`,
      (resp) => {

        setDiscount(resp?.discountPercentage || 0);
        setAddedAppointmentDetails(
          resp?.services?.map((elm) => ({ ...elm, staffs: elm?.staffs?.length > 0 ? elm?.staffs : [] }))
        );
        setAppointmentProducts(resp?.products);
        // setMembershipDetails(resp.customer.activeMembership)
        setMemberShipStatus(resp.membershipUsed);
        setFilterMembershipId(resp.membershipId);
        // setUserId(resp.customer._id);
        setMemberShipId(resp.membershipId);
        setSubServiceTotal(resp.membershipCreditUsed);
        setPhoneNumber(resp.customer.phoneNumber);

        // setCreditUsed(resp.membershipCreditUsed)
      },
      (error) => {

      }
    );
  }, []);


  // staff get api
  useEffect(() => {
    getApiCall(
      "owner/getStaff",
      (res) => {
        setStaffData(res?.filter(elm => elm?.isActive));
      },
      (error) => {

      }
    );
  }, [serviceSelection.subCategory]);

  useEffect(() => {
    if (phoneNumber)
      postApiData(
        `/membership/getActiveMembershipOfUser`,
        { phoneNumber },
        (resp) => {
          if (resp) {
            // 
            setMembershipDetails(resp[0]?.activeMembership)
            setUserId(resp[0]?._id)

          }
        },
        (error) => {

        }
      );
  }, [phoneNumber])

  // handle buttons for add service
  const serviceAddpress = () => {
    const { miniSub, staffs, miniSubcategory, ...rest } = serviceSelection;

    const selected = {

      ...rest,
      staffs,
      miniSubcategory: miniSub,
    };
    console.log(selected, "selected")
    const isEveryEmpty = Object?.values(selected).some((elm) => !elm);
    const isStaffEmpty = staffs?.some((elm) => !elm.share);
    if (isEveryEmpty || isStaffEmpty || staffs?.length === 0) {
      return toast.error("Please Select All Fields");
    }
    setAddedAppointmentDetails([...addedAppointmentDetails, selected]);

  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target

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
    } else {

      setServiceSelection((prev) => ({
        ...prev,
        [name]: value
      }));
    }

  };




  const fetchSearchProduct = (val) => {
    const data = {
      name: val,
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
  }


  // search product api
  // on search product click
  const searchProductOnchange = (e) => {
    setsearchProduct(e.target.value);
    debouncedFunction(fetchSearchProduct, 500, e.target.value)

  };
  const productNameOnclick = (item) => {
    const { name, itemId, price, brand,stockQuantity } = item;
    setProductData({
      name,
      brand,
      itemId,
      price,
      quantity: 1,
      staffs: [],
      stockQuantity
    })
    setsearchProduct("");
  };
  const onChangeProdutName = (e) => {
    setProductData({
      ...productData,
      name: e.target.value,
    });
  };
  const addproductPress = () => {

    if (!productData) {
      toast.error("Please Select All Fields");

      return;
    }
    const { staffs, ...rest } = productData;
    const isEveryEmpty = Object?.values(rest).some(elm => !elm)
    const isStaffEmpty = staffs?.some(elm => !elm.share)
    if (isEveryEmpty || isStaffEmpty || staffs.length == 0) {
      toast.error("Please Select All Fields");

      return;
    }
    const index = appointementProducts.findIndex((elm) => elm?.itemId === productData?.itemId)

    if (index !== -1) {
      const updatedDetails = [...appointementProducts]
      updatedDetails[index] = productData;
      setAppointmentProducts(updatedDetails)

    }
    else {
      setAppointmentProducts([...appointementProducts, productData])


    }



    // dispatch(EditproductAdded(itemWithAdditionalInfo));
    // setProductData(itemWithAdditionalInfo)
  };

  const deleteEditService = (indexId) => {
    // const updatedDetails = [addedAppointmentDetails]
    const updatedDetails = addedAppointmentDetails?.filter(
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
      subCategory: "",
      miniSubcategory: "",

      staffs: [],
      price: 0,
    });
    setSubService(null);
    setMiniService(null);
    setStaffData(null);
  };

  // handle book appointment
  const handleBookAppointment = () => {

    const hasInvalidStaffs = addedAppointmentDetails.some((service) => {
      // Check if the `staffs` array is empty
      if (service.staffs.length === 0) {
        return true;
      }
      // Check if any staff's `share` is invalid
      return service.staffs.some((staff) => !staff.share);
    });
    const hasInvalidProdStaffs = appointementProducts?.some((product) => {
      // Check if the `staffs` array is empty
      if (product?.staffs?.length === 0) {
        return true;
      }
      // Check if any staff's `share` is invalid
      return product?.staffs?.some((staff) => !staff.share);
    });
    if (hasInvalidStaffs) {
      return toast.error("Select Staffs on Each Service")
    }
    if (hasInvalidProdStaffs) {
      return toast.error("Select Staffs on Each Product")
    }
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

          navigate(-1);
        }
      },
      (error) => {

      }
    );
  };
  const applyMemberShip = () => {
    const data = {
      //   creditsUsed:5000,
      creditsUsed: memberShipStatus ? subServiceTotal : totalService,
      // creditsUsed: totalSubServices,
      userId,
      memId: memberShipId,
      isMembershipUsed: !memberShipStatus,
    };
    // 


    postApiData(
      "membership/applyMembership",
      data,
      (resp) => {
        if (resp) {

          if (memberShipStatus) {
            setMembershipCoin(resp?.creditsLeft);
            setMemberShipStatus(false);
            setCreditUsed(resp.creditsUsed - resp.remainingAmount);
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

        alert("Select Correct Options");
      }
    );
  };
  const arr = membershipDetails?.filter(
    (item) => item?._id === filterMembershipId
  );


  const subTotalServices = addedAppointmentDetails ? addedAppointmentDetails?.reduce(
    (acc, item) => acc + +item?.price,
    0
  ) : 0;


  const subProductTotal = appointementProducts
    ?.map((item) => item.price * item.quantity)
    ?.reduce((acc, val) => acc + val, 0);

  const serviceDiscount = subTotalServices * (discount / 100);

  const totalService = subTotalServices - serviceDiscount;

  const totalAmount = totalService + subProductTotal;
  const membershipPress = (e) => {
    const selectedMembership = e.target.value;
    setMemberShipId(e.target.value);
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handlePriceChange = (index, newPrice) => {
    const updatedAppointments = [...addedAppointmentDetails];
    updatedAppointments[index].price = + newPrice;
    setAddedAppointmentDetails(updatedAppointments);
  };

  const staffOptions = staffData?.map((elm) => ({
    name: elm?.name,
    value: `${elm?._id}-${elm?.name}`,
  }))
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
      name: "staffs",
    },

  ];
  const servicesOptions = {
    category: service,
    subCategory: subservice,
    miniSubcategory: miniservice?.map((elm) => ({
      name: elm.name,
      value: `${elm.price}---${elm.name}`,
    })),
    staffs: staffOptions,
  };
  const productFields = [
    {
      name: "name",
      placeholder: "Name"

    },
    {
      name: "price",
      placeholder: "Price"

    },
    {
      name: "quantity",
      placeholder: "Quantity"

    },
    {
      name: "staffs",

      options: staffOptions
    },


  ];
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
        <div className="mx-auto my-2 rounded-lg bg-[#fffffe] shadow-xl  border-2 border-gray-300 w-[95%] h-full  p-5">
          <h1 className="text-4xl font-bold text-black mt-2 ml-2">
            Your Services
          </h1>
          <div className="w-full   max-w-[90%] h-full  my-4">
            <div className="">
              <table className="h-full w-full">
                <thead>
                  <tr>
                    <th className="bg-black  lg:text-lg text-white">Name</th>
                    <th className="bg-black  lg:text-lg text-white">Category</th>
                    <th className="bg-black  lg:text-lg text-white"> Sub Category</th>
                    <th className="bg-black  lg:text-lg text-white">Staff</th>
                    <th className="bg-black  lg:text-lg text-white">Price</th>
                    <th className="bg-black text-lg text-white">Action</th>

                    {/* <th>Brand</th> */}
                  </tr>
                </thead>
                <tbody>
                  {addedAppointmentDetails?.length > 0
                    ? addedAppointmentDetails?.map((item, index) => (
                      <tr key={index} className="bg-white">
                        <td>{item?.miniSubcategory || item?.name}</td>
                        <td>{item?.category}</td>
                        <td>{item?.subCategory}</td>
                        <td>
                          <MultiSelectInput
                            options={staffOptions}
                            val={item?.staffs}
                            handleStaffSelection={handleStaffSelection}
                            handleShareChange={handleShareChange}
                            tag="edit"
                            data={index}

                          />

                      
                        </td>
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
        <div className="mx-auto my-14 rounded-lg bg-[#fffffe] shadow-xl border-2 border-gray-300 w-[95%] ">
          <h1 className="text-4xl font-bold text-black mt-2 ml-2">
            ADD Services
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-6 mt-9 p-3">
            {servicesFields.map((item, elm) => {
              const { name } = item;
              const value = serviceSelection[name];
              const options = servicesOptions[name];


              return (
                name === "staffs" ?
                  <MultiSelectInput
                    options={options}
                    handleStaffSelection={handleStaffSelection}
                    handleShareChange={handleShareChange}
                    val={value}
                    tag="service"
                  />


                  :
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
              onClick={serviceAddpress}
            >
              Add Service
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
                      <th>Staff Name</th>

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
                          {item.staffs
                            ?.map((data) => (
                              <div className="flex mb-2 items-center justify-between">
                                <span className="">{data?.staffName}</span>

                                <CustomInput


                                  value={data?.share}
                                  readOnly={true}
                                />

                              </div>
                            ))}
                        </td>                        <td>
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
        <div className="mx-auto my-2 rounded-lg bg-[#fffffe] shadow-xl   border-2 border-gray-300 w-[95%] h-80  mt-10">
          <h1 className="text-4xl font-bold text-black mt-2 ml-2">
            ADD Products
          </h1>
          {/* Search Table */}
          <div className="search-container w-[95%] mx-auto h-auto  ">
            <div className="flex w-fit mx-auto flex-row relative mb-10 ">
              {/* <h1 className="text-lg font-semibold">Search Product</h1> */}
              <div className="flex w-full min-w-[350px] md:min-w-[450px] relative mx-auto border-2 bg-white h-[50px] border-gray-300 rounded-lg">
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
                  className="absolute  shadow-xl bg-white top-16 h-[104px] w-[450px] overflow-auto"
                >
                  {showSearchProduct?.map((item) => {

                    return (
                      <div
                        style={{ display: "flex" }}
                        onClick={() => productNameOnclick(item)}
                        className="flex items-center px-4 py-2 mb-0 transition-all duration-300 ease-in-out transform hover:bg-[#f5da42] hover:scale-95 cursor-pointer"
                      >
                        <p className="mr-2 font-semibold">{item.name}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {productData && (
              <div className="">
                <table className="">
                  <thead className="">
                    <tr className="">
                      <th className="bg-black text-white">Name</th>
                      <th className="bg-black text-white">Price</th>
                      <th className="bg-black text-white">Quantity</th>
                      <th className="bg-black text-white">Staff</th>
                      <th className="bg-black text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>


                    <tr >
                      {productFields?.map((field, idx) => {
                        const { name, options, placeholder } = field;
                        const value = productData[name];

                        return (

                          <td key={idx} >
                            {
                              name === "staffs" ?
                                <MultiSelectInput
                                  options={options}
                                  handleStaffSelection={handleStaffSelection}
                                  handleShareChange={handleShareChange}
                                  val={value}
                                  tag="Product"
                                />

                                : <NormalInput
                                  disabled={name === "name"}
                                  placeholder={placeholder}
                                  type={name === "price" ? "number" : name === "quantity" ? "number" : typeof value === "number" ? "number" : "text"}
                                  name={name}
                                  onChange={handleProductChange}
                                  value={value}

                                />
                            }


                          </td>
                        )
                      })}


                      <td>
                        <button
                          className="  py-2 px-5 font-semibold mx-auto text-white bg-black"

                          onClick={
                            addproductPress

                          }
                        >
                          <span className="">Add Product</span>
                        </button>
                      </td>
                    </tr>

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
                  className="bg-black font-medium rounded-md text-white h-[40px] w-[150px]"
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
                    className=" font-medium rounded-md text-white h-[40px] px-6 bg-red-600 hover:bg-red-500"
                    >
                    Remove Membership
                  </button>
                ) : (
                  <button
                    onClick={applyMemberShip}
                    className="bg-black font-medium rounded-md text-white h-[40px] w-[150px]"
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
            className="mt-3 w-[50%] py-4 text-lg font-semibold mx-auto text-white bg-black"
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
