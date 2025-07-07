import { useEffect, useState } from "react";
import { formatValue, getApiCall, postApiData } from "../../utils/services";
import { useNavigate, useParams } from "react-router";
import { MdDeleteOutline } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";
import NormalInput from "../../components/customInput/NormalInput";
import NormalSelect from "../../components/customInput/NormalSelect";
import NormalRadio from "../../components/customInput/NormalRadio";
import useDebouncer from "../../utils/hooks/useDebouncer";

const Edit = () => {
  const gstToken =localStorage.getItem("gstApplied");
  const gstApplied =(gstToken==="true")
  const { id } = useParams();
  //Staff data fiktering
  const navigate = useNavigate();
  const {debouncedFunction}=useDebouncer()
  const [staffData, setStaffData] = useState([]);
  const [activeMembership, setActiveMemberShip] = useState({});

  const [appointementProducts, setAppointmentProducts] = useState([]);
  const [addedAppointmentDetails, setAddedAppointmentDetails] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    gender: "F",
    'dob-date': "",
    'dob-month': "",
    'aniversary-date': "",
    'aniversary-month': "",
    dob: '',
    aniversary: '',
  });
  const [serviceSelection, setServiceSelection] = useState({
    category: "",
    subCategory: "",
    miniSubcategory: "",
    staffId: "",
    price: 0,
    satffName: "",
  });

  // services getting state
  const [service, setService] = useState([]);
  const [subservice, setSubService] = useState([]);
  const [miniservice, setMiniService] = useState([]);
  const [searchProduct, setsearchProduct] = useState("");
  const [showSearchProduct, setShowSearchProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [discount, setDiscount] = useState(0);
  const [applyDisountPer, setApplyDiscountPer] = useState(0);

  // membership details
  const [membershipDetails, setMembershipDetails] = useState([]);
  const [memberShipStatus, setMemberShipStatus] = useState(false);
  const [isMembershipApplied, setIsMembershipApplied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subServiceTotal, setSubServiceTotal] = useState(0);


  const applyDiscount = () => {
    setApplyDiscountPer(discount);
    // alert("Discount Added sucessfully");
    toast.success("Discount Added Successfully");
  };


  useEffect(() => {
    getApiCall(
      "salonService/getServiceCategory",

      (resp) => {
        setService(resp);
      },
      (error) => { }
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
      (error) => { }
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
      (error) => { }
    );
  }, [serviceSelection.subCategory]);

  //single appointment api
  useEffect(() => {
    getApiCall(
      `appointment/getSingleAppointmentDetails?id=${id}`,
      (resp) => {

        setDiscount(resp?.discountPercentage || 0);
        setApplyDiscountPer(resp?.discountPercentage || 0);
        setAddedAppointmentDetails(
          resp.services.map((item) => ({ ...item, staffId: item?.staffId || "", satffName: item?.satffName || "" }))
        );
        setIsMembershipApplied(parseInt(resp?.membershipCreditUsed) > 0 ? true : false);
        setAppointmentProducts(resp.products);
        // setMembershipDetails(resp.customer.activeMembership)
        setMemberShipStatus(resp.membershipUsed);
        setActiveMemberShip(resp.userMembership)
        // setUserId(resp.customer._id);
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

          }
        },
        (error) => {

        }
      );
  }, [phoneNumber])

  // handle buttons for add service
  const serviceAddpress = () => {
    const { miniSub, miniSubcategory, ...rest } = serviceSelection;

    const selected = {

      ...rest,
      miniSubcategory: miniSub,
    };
    const isEveryEmpty = Object.values(selected).some((elm) => !elm || elm === "0" || elm.toString().trim() === "");
    if (isEveryEmpty) {
      return toast.error("Please Select All Fields");
    }
    setAddedAppointmentDetails([...addedAppointmentDetails, serviceSelection]);

  };

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
        [name]: name === "price" ? Math.max(0, +value) : value,
      }));
    }
  };

  
  
  const handlestaffChange = (e, index, newService, type = "service") => {
    let splited = e.target.value.split("-");
    let Name = splited[1];
    let Id = splited[0];

    if (type === "service") {
      if (newService) {
        setServiceSelection({
          ...serviceSelection,
          staffId: Id,
          satffName: Name,
        });
      } else {
        setAddedAppointmentDetails((prev) =>
          prev.map((item, idx) => {
            if (index === idx) {
              return {
                ...item,
                staffId: Id,
                satffName: Name,
              };
            }
            return item;
          })
        );
      }
    }
    else {
      setAppointmentProducts((prev) =>
        prev.map((item, idx) => {
          if (index === idx) {
            return {
              ...item,
              staffId: Id,
              staffName: Name,
            };
          }
          return item;
        })
      );
    }
  };



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

        setShowSearchProduct(resp.products);
      },
      (error) => {

      }
    );
  };
  const productNameOnclick = (item) => {
    setSelectedProduct({
      ...item,
      quantity: 1

    });
    setsearchProduct("");
  };


  const addproductPress = (
  ) => {
    if (!selectedProduct) return toast.error("Please Select Product");

    const { quantity, // Adding quantity key
      staffId,
      staffName, price, } = selectedProduct
    if (!quantity || quantity === "0") {
      toast.error("Please Enter Quantiy");

      return;
    }
    if (!price || price === "0") {
      toast.error("Please Enter Price");

      return;
    }
    if (!staffId || !staffName) {
      toast.error("Please Select Staff");

      return;
    }
    if (!price) {
      toast.error("Please Select Product");

      return;
    }
    // productQnt,productStaffid



    setAppointmentProducts((prev) => {
      const index = prev.findIndex((elm) => elm._id === selectedProduct._id);

      if (index !== -1) {
        return prev.map((elm, i) =>
          i === index ? selectedProduct : elm
        );
      } else {
        return [...prev, selectedProduct];
      }
    });
    toast.success("Product Added Successfully");

    // dispatch(EditproductAdded(itemWithAdditionalInfo));
    // setProductData(itemWithAdditionalInfo)
  };

 
  const handleGenderChange = (e) => {
    const { name, value } = e.target;

    setCustomerDetails((prev) => ({
      ...prev,
      [name]: name === "phoneNumber" ? value.slice(0, 10) : value,
    }));
    if (name === "gender") {
      setServiceSelection({
        ...serviceSelection,
        category: "",
        subCategory: "",
        miniSubcategory: "",
        price: 0



      });
      setSubService(null);
      setMiniService(null);
    };
  }

  
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    if (name === 'staffName') {
      const splited = value.split("-");
      const Name = splited[1];
      const Id = splited[0];
      setSelectedProduct((prev) => ({
        ...prev,
        staffId: Id,
        staffName: Name,
      }));

    }
    else {

      setSelectedProduct((prev) => ({
        ...prev,
        [name]: name === "quantity" ? Math.max(0, +value) : value
      }))
    }


  }
  
 

  const subTotalServices = addedAppointmentDetails.reduce(
    (acc, item) => acc + +item?.price,
    0
  );


  const subProductTotal = appointementProducts
    ?.map((item) => item.price * item.quantity)
    ?.reduce((acc, val) => acc + val, 0);

  const serviceDiscount = Math.floor(subTotalServices * (applyDisountPer / 100));
  
  const totalService = formatValue(subTotalServices - serviceDiscount);
  const serviceGst = gstApplied?formatValue(totalService*0.18):0;
  const serviceTotal =Math.round(totalService + serviceGst);

  const totalAmount = Math.round(serviceTotal + subProductTotal);
  const membershipPress = (e) => {
    if (e.target.value) {
      const activeMemb = membershipDetails?.find((elm) => elm._id === e.target.value);
      if (activeMemb?.discount) {
        setDiscount(activeMemb?.discount)
      }
      else if (activeMembership?.discount && !activeMemb?.discount) {
        setDiscount(0)
      }
      setActiveMemberShip(activeMemb);
      setMemberShipStatus(true)
      toast.success("membership Applied")

    }
    else {
      setActiveMemberShip({});
      setMemberShipStatus(false);
      toast.success("membership Removed")
    }
  };
  const handleChange = (e, index, type) => {
    const { name, value } = e.target;

    if (type === "service") {
      const updatedAppointments = [...addedAppointmentDetails];
      updatedAppointments[index][name] = name === "price" ? Math.max(0, +value) : value;
      setAddedAppointmentDetails(updatedAppointments);
    }
    else {
      const updatedAppointmentsProds = [...appointementProducts];
      updatedAppointmentsProds[index][name] = (name === "price" && name === "quantity") ? Math.max(0, +value) : value;
      setAppointmentProducts(updatedAppointmentsProds);
    }

  };
  const deleteProduct = (idx) => {
    setAppointmentProducts((prev) => prev.filter((elm, index) => index !== idx))
  }
  const deleteService = (idx) => {
    setAddedAppointmentDetails((prev) => prev.filter((elm, index) => index !== idx))
  }
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
      label: "Add Service",
      options: service

    },
    {
      name: "subCategory",
      label: "Category",
      options: subservice
    },
    {
      name: "miniSubcategory",
      label: "Sub Category",
      options: miniservice?.services?.map((elm) => ({
        name: elm.name,
        value: `${elm.price}---${elm.name}`,
      })),
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "Enter Price",


    },
    {
      name: "staff",
      label: "Select Staff",
      options: staffData?.map((elm) => ({
        name: elm.name,
        value: `${elm._id}-${elm.name}`,
      })),
    },
    // {
    //   name: "product",
    //   label: "Search Product",
    //   type: "text",
    //   placeholder: "Product Name"
    // },

  ];

  const productFields = [
    {
      name: "name",
      label: "Product Name",
      placeholder: "Product Name",
      value: selectedProduct?.name,
    },
    {
      name: "price",
      label: "Price",
      type: "Number",
      placeholder: "Price",
      value: selectedProduct?.price,
    },
    {
      name: "brand",
      label: "Brand",
      value: selectedProduct?.brand,
      readOnly: true,
      placeholder: "Brand",
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      value: selectedProduct?.quantity,
      placeholder: "Quantity",
    },
    {
      name: "staffName",
      label: "Select Staff",
      value: `${selectedProduct?.staffId}-${selectedProduct?.staffName}`,
      options: staffData?.map((item) => ({ name: item?.name, value: `${item._id}-${item.name}` }))


    }
  ]
  const discounFields = [
    {
      label: "Discount Percentage",
      name: "discount",
      placeholder: "Discount %",
      value: discount,
      type: "number",
      onChange: (e) => setDiscount(Math.min(Math.max(e.target.value, 0), 100))
    },
    {
      label: "Membership",
      name: "membership",
      value: activeMembership?._id,
      options: membershipDetails?.map((item) => ({
        name: `${item.name}-${item.creditsLeft}`,
        value: item._id,
      })),
      onChange: membershipPress,
      readOnly: memberShipStatus,
    },
    {
      label: "Membership Balance",
      name: "membershipBalance",
      value: activeMembership?.creditsLeft || 0,
      readOnly: true
    }
  ]
  const handleApplyDiscount = () => {

      applyDiscount()
  
    if (!isMembershipApplied) {

      if (activeMembership?.creditsLeft > 0) {
        setMemberShipStatus(true)
        toast.success("membership Applied")
      }
    }


  }

  const customerDetailsArray = [
    {
      label: "MEMBERSHIP",
      value: activeMembership?.name
    },
    {
      label: "CREDIT LEFT",
      value: formatValue(activeMembership?.creditsLeft)
    },
    {
      label: "AMOUNT",
      value: formatValue(activeMembership?.amount)
    },

  ];
  const paymentDetailsArray = [
    { label: "SERVICES SUBTOTAL", value: formatValue(subTotalServices) },
    { label: "DISCOUNT", value: formatValue(serviceDiscount) },
        (gstApplied&& ({ label: "SERVICE GST", value: serviceGst })),
        { label: "TOTAL SERVICES", value: formatValue(serviceTotal) },

    { label: "PRODUCT SUBTOTAL", value: formatValue(subProductTotal) },

    { label: "TOTAL PRODUCTS", value: formatValue(subProductTotal) },
    { label: "PAYABLE AMOUNT", value: formatValue(totalAmount) },
  ];
  const tableFields = [customerDetailsArray, paymentDetailsArray];
  // handle book appointment
  const handleBookAppointment = () => {


    const data = {
      services: addedAppointmentDetails,

      subTotal: subTotalServices,
      total: totalAmount,

      membershipUsed: memberShipStatus,
      membershipId: memberShipStatus ? activeMembership?._id : "",
      isMembershipApplied: memberShipStatus,

      // membershipCreditUsed: (memberShipStatus)? (+subTotalServices):0,
      membershipCreditUsed: isMembershipApplied ? +subServiceTotal: memberShipStatus? Math.max(0,Math.min(activeMembership?.creditsLeft || 0, serviceTotal)) : 0,
      products: appointementProducts,
      discount: serviceDiscount,
      discountPercentage: applyDisountPer,
    };

    postApiData(
      `appointment/editAppointmentBookedFromCrm?id=${id}`,
      data,
      (resp) => {
        if (resp) {
          toast.success("Appointment Booked SuccessFully");

         navigate(`/?tab=${1}`);
        }
      },
      (error) => {

      }
    );
  };
   useEffect(() => {
      if (discount >= 0) {
        debouncedFunction(applyDiscount, 800, discount)
      }
  
    }, [discount])
  return (
    <>
      <div className="mx-auto ">
        {/* customer details */}
        <div className="rounded-[10px] bg-white shadow-tab border p-5 mb-9">
          <div className="flex items-center mb-9 justify-between">
            <h2 className="font-normal leading-[20px]   text-black text-[24px]">Customer Details</h2>

          </div>
          <div className="flex flex-col mb-9  gap-5">
            <h1 className="text-black  font-normal text-md">
              Gender
            </h1>
            <div className="flex items-center gap-9">
              {genderFields.map((elm, index) => {
                return (
                  <NormalRadio
                    key={index}
                    onChange={handleGenderChange}
                    checked={customerDetails.gender === elm.value}
                    name="gender"
                    label={elm.name}
                    value={elm.value}
                  />
                );
              })}
            </div>
          </div>

        </div>  {/* service Detail */}
        <div className="rounded-[10px] bg-secondaryGray shadow-tab border p-5 mb-9">

          <div className="flex items-center gap-6  mb-9 ">
            <h2 className="font-normal text-start leading-[20px]  text-black text-[24px]">Service Detail</h2>
            <span className="border text-black text-[13px] border-gray2 w-[27px] flex items-center justify-center rounded-[16px] h-[21px]">{addedAppointmentDetails?.length > 9 ? '9+' : addedAppointmentDetails?.length + "+"}</span>
          </div>

          {addedAppointmentDetails.length > 0 && (
            <div className="w-full">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border-none  overflow-hidden text-ellipsis text-sm font-normal text-gray2 2xl:text-md">#</th>
                    <th className="border-none  overflow-hidden text-ellipsis text-sm font-normal text-gray2 2xl:text-md">Name</th>
                    <th className="border-none  overflow-hidden text-ellipsis text-sm font-normal text-gray2 2xl:text-md">Category</th>
                    <th className="border-none  overflow-hidden text-ellipsis text-sm font-normal text-gray2 2xl:text-md">Sub Category</th>
                    <th className="border-none  overflow-hidden text-ellipsis text-sm font-normal text-gray2 2xl:text-md">Price</th>
                    <th className="border-none  overflow-hidden text-ellipsis text-sm font-normal text-gray2 2xl:text-md">Staff</th>
                    <th className="border-none  overflow-hidden text-ellipsis text-sm font-normal text-gray2 2xl:text-md">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {addedAppointmentDetails?.map((item, index) => (
                    <tr key={index}>
                      <td className="border-none text-sm 2xl:text-md text-gray2 font-normal">{index + 1}</td>
                      <td className="border-none text-sm 2xl:text-md text-gray2 font-normal">{item?.miniSubcategory}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">{item?.category}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">{item?.subCategory}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">
                        <NormalInput
                          type="price"
                          name="price"
                          value={item.price}
                          inputStyles={{ width: "120px", padding: "5px 10px" }}

                          onChange={(e) => handleChange(e, index, "service")
                          } />
                      </td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">
                        <NormalSelect
                          options={staffData?.map((elm) => ({
                            value: `${elm._id}-${elm.name}`,
                            name: elm.name
                          }))}
                          onChange={(e) =>
                            handlestaffChange(e, index, false)
                          }
                          inputStyles={{ width: "150px", padding: "5px 10px" }}

                          // value={item.staffId}
                          value={`${item.staffId}-${item.satffName}`}

                        /></td>
                      <td className="border-none text-sm 2xl:text-md text-gray2 font-normal">
                        {" "}
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


        {/* service select */}
        <div className="rounded-[10px] bg-white shadow-tab border p-5 mb-9">
          <h2 className="font-normal text-start leading-[20px] mb-9   text-black text-[24px]">Select Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-9 ">
            {
              servicesFields?.map((customer, index) => {
                const { name, label, placeholder, options, type } = customer

                const value = serviceSelection[name];
                return (
                  <div key={index} className="relative">
                    <div className="flex flex-col gap-1">

                      {name === "price" ?

                        <NormalInput
                          name={name}
                          type={type}
                          label={label}
                          onChange={handleServiceChange}
                          placeholder={placeholder}
                          value={value}
                          inputStyles={{
                            'borderRadius': '16px'

                          }}
                          lableStyles={{
                            'fontWeight': '400',
                            "fontSize": "16px",
                            'color': '#000000'
                          }}



                        />
                        : <NormalSelect

                          name={name}
                          label={label}
                          options={options}
                          onChange={handleServiceChange}
                          value={value}
                          inputStyles={{
                            'borderRadius': '16px'

                          }}
                          lableStyles={{
                            'fontWeight': '400',
                            "fontSize": "16px",
                            'color': '#000000'
                          }}



                        />}
                    </div>

                  </div>
                )
              })
            }
          </div>
          <div className="flex justify-end mt-5">

            <button onClick={serviceAddpress}
              className="bg-black text-white rounded-[16px] w-[190px] text-sm font-normal ">Confirm</button>
          </div>

        </div>
        <div className="rounded-[10px] bg-secondaryGray shadow-tab border p-5 mb-9">
          <div className="flex items-center gap-6  mb-9 ">
            <h2 className="font-normal text-start leading-[20px]  text-black text-[24px]">Product Detail</h2>
            <span className="border text-black text-[13px] border-gray2 w-[27px] flex items-center justify-center rounded-[16px] h-[21px]">{appointementProducts?.length > 9 ? '9+' : appointementProducts?.length + "+"}</span>

          </div>

          {appointementProducts?.length > 0 && (
            <div className="w-full">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border-none text-sm font-normal text-gray2 2xl:text-md">#</th>
                    <th className="border-none text-sm font-normal text-gray2 2xl:text-md">Name</th>
                    <th className="border-none text-sm font-normal text-gray2 2xl:text-md">Price</th>
                    <th className="border-none text-sm font-normal text-gray2 2xl:text-md">Brand</th>
                    <th className="border-none text-sm font-normal text-gray2 2xl:text-md">Quantity</th>
                    <th className="border-none text-sm font-normal text-gray2 2xl:text-md">Staff</th>
                    <th className="border-none text-sm font-normal text-gray2 2xl:text-md">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointementProducts?.map((item, index) => (
                    <tr key={index}>
                      <td className="border-none text-sm 2xl:text-md text-gray2 font-normal">{index + 1}</td>
                      <td className="border-none text-sm 2xl:text-md text-gray2 font-normal">{item?.name}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal"> <NormalInput
                        type="price"
                        name="price"
                        value={item.price}
                        inputStyles={{ width: "120px", padding: "5px 10px" }}

                        onChange={(e) =>
                          handleChange(e, index, "product")
                        } /></td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">{item?.brand}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">
                        <NormalInput
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          inputStyles={{ width: "120px", padding: "5px 10px" }}

                          onChange={(e) =>
                            handleChange(e, index, "product")
                          } /></td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal"> <NormalSelect
                        options={staffData?.map((elm) => ({
                          value: `${elm._id}-${elm.name}`,
                          name: elm.name
                        }))}
                        inputStyles={{ width: "150px", padding: "5px 10px" }}

                        onChange={(e) =>
                          handlestaffChange(e, index, false, "product")
                        }
                        // value={item.staffId}
                        value={`${item.staffId}-${item.staffName}`}

                      /></td>
                      <td className="border-none text-sm 2xl:text-md text-gray2 font-normal">
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

        </div>
        {/* product select */}
        <div className="rounded-[10px] mb-9 bg-white border p-5 ">
          <h2 className="font-normal text-start leading-[20px] mb-9   text-black text-[24px]">Select Product</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-9 mb-4 ">
            <div className="relative w-full flex flex-col gap-1">
              <NormalInput
                name="product"
                label="Search Product"
                placeholder="Product Name"
                onChange={searchProductOnchange}

                value={searchProduct}
                inputStyles={{
                  'borderRadius': '16px'

                }}
                lableStyles={{
                  'fontWeight': '400',
                  "fontSize": "16px",
                  'color': '#000000'
                }}



              />
              <FaSearch className="absolute right-4  bottom-[13px] text-xl " />
              {searchProduct?.length > 0 && (
                <div
                  style={{}}
                  className="absolute top-[80px] w-full p-2 max-h-[200px]  overflow-y-auto bg-white shadow-lg z-[2]"
                >
                  {showSearchProduct?.map((item) => {
                    return (
                      <div
                        onClick={() => productNameOnclick(item)}
                        className="flex bg-gray-100 mb-2 last:mb-0 items-center px-4 py-2 border shadow-md transition-all duration-300 ease-in-out transform hover:bg-[#f5da42] hover:scale-95 cursor-pointer"
                      >
                        <p className="mr-2 capitalize font-semibold">{item.name}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-9">
            {
              productFields?.map((elm, index) => {
                const { name, label, placeholder, value, readOnly, type, options } = elm
                return (
                  <div key={index}
                    className="relative">
                    <div className="flex flex-col gap-1">
                      {name === "staffName" ? <NormalSelect

                        name={name}
                        label={label}
                        options={options}
                        onChange={handleProductChange}
                        value={value}
                        inputStyles={{
                          'borderRadius': '16px'

                        }}
                        lableStyles={{
                          'fontWeight': '400',
                          "fontSize": "16px",
                          'color': '#000000'
                        }}



                      /> : <NormalInput
                        name={name}
                        type={type}
                        label={label}
                        disabled={readOnly}
                        onChange={handleProductChange}
                        placeholder={placeholder}
                        value={value}
                        inputStyles={{
                          'borderRadius': '16px'

                        }}
                        lableStyles={{
                          'fontWeight': '400',
                          "fontSize": "16px",
                          'color': '#000000'
                        }}



                      />}
                    </div>  </div>
                )

              })

            }



          </div>
          <div className="flex justify-end mt-5">

            <button onClick={addproductPress}
              className="bg-black text-white rounded-[16px] w-[190px] text-sm font-normal ">Confirm</button>
          </div>

        </div>

        {/* Apply Discount */}
        <div className="rounded-[10px] bg-white shadow-tab border p-5 mb-9">

          <h2 className="font-normal text-start leading-[20px] mb-9 text-black text-[24px]">Apply Discount</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-9">
            {
              discounFields?.map((elm, index) => {
                const { name, label, placeholder, value, readOnly, type, options, onChange } = elm
                return (
                  <div key={index}
                    className="relative">
                    <div className="flex flex-col gap-1">
                      {name === "membership" ? <NormalSelect

                        name={name}
                        label={label}
                        options={options}
                        onChange={onChange}
                        value={value}
                        inputStyles={{
                          'borderRadius': '16px'

                        }}
                        disabled={isMembershipApplied}
                        lableStyles={{
                          'fontWeight': '400',
                          "fontSize": "16px",
                          'color': '#000000'
                        }}



                      /> : <NormalInput
                        name={name}
                        type={type}
                        label={label}
                        disabled={readOnly}
                        onChange={onChange}
                        placeholder={placeholder}
                        value={value}
                        inputStyles={{
                          'borderRadius': '16px'

                        }}
                        lableStyles={{
                          'fontWeight': '400',
                          "fontSize": "16px",
                          'color': '#000000'
                        }}



                      />}
                    </div>  </div>
                )

              })

            }



          </div>
         

        </div>
        {/* book appointment */}
        <div className="rounded-[10px] bg-secondaryGray shadow-tab border p-5 mb-9">
          <h2 className="font-normal text-start leading-[20px] mb-9 text-black text-[24px]">Booking Detail</h2>


          <div className="p-2 w-full   flex justify-between  items-center">
            {tableFields.map((elm, idx) => {
              return (
                <div key={idx} className="w-[40%] mb-auto ">
                  <table className="table-auto  w-full">
                    <thead></thead>
                    <tbody>
                      {elm?.map((item, index) => (
                        <tr key={index}>
                          <td className="font-normal text-black text-sm  2xl:text-md border-none px-4 py-2">
                            {item.label}
                          </td>
                          <td className=" font-normal   text-sm 2xl:text-md border-none px-4 py-2 text-green-800">
                            {formatValue(item?.value) || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end mt-12">

            <button onClick={handleBookAppointment}
              className="bg-black text-white rounded-[16px] w-[250px] text-sm font-normal ">Update Appointment</button>
          </div>
        </div>
        {/*  */}




      </div>
   
    </>
  );
};

export default Edit;
