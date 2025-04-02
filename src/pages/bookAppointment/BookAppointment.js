import { useState } from "react";
import "./BookAppointment.css";
import { formatDateWOYear, formatValue, getApiCall, postApiData } from "../../utils/services";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProducts, productAdded, removeAppointmentProductsData, serviceAdded } from "../../redux/actions";
import { deletItems } from "../../redux/actions";
import { MdDeleteOutline } from "react-icons/md";
import TimePicker from "rc-time-picker";
import { FaSearch } from "react-icons/fa";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import { toast } from "react-hot-toast";
import NormalRadio from "../../components/customInput/NormalRadio";
import NormalInput from "../../components/customInput/NormalInput";
import NormalSelect from "../../components/customInput/NormalSelect";
import AddCustomerModal from "../../components/modals/AddCustomerModal";
import useDebouncer from "../../utils/hooks/useDebouncer";
const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
const BookAppointment = ({onTabChange}) => {
  
  const { debouncedFunction } = useDebouncer()
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
  const [appointmentDetails, setAppointmentDetails] = useState({

    date: formatDate(new Date()),
    time: ''

  })
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState([]);

  const [service, setService] = useState([]);
  const [subservice, setSubService] = useState([]);
  const [miniservice, setMiniService] = useState([]);
  const [staffData, setStaffData] = useState([]);
 
  const [discount, setDiscount] = useState(0);
  const [membershipitem, setMemberShipItem] = useState(null);
  const [userId, setUserId] = useState("");
  const [activeMembership, setActiveMemberShip] = useState({});
  const [memberShipStatus, setMemberShipStatus] = useState(false);
  // product table state
  const activemember = membershipitem?.activeMembership;

  const [applyDisountPer, setApplyDiscountPer] = useState(0);
  const [searchProduct, setsearchProduct] = useState("");
  const [showSearchProduct, setShowSearchProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const x = useSelector((store) => store.serviceAddReducer.serviceData);
  const [services, setServices] = useState(x);

  useEffect(() => {
    setServices(x);
  }, [x]);
 
  const appFields = [
    "date",
    "time"

  ]
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (appFields.includes(name)) {

      setAppointmentDetails((prev) => ({
        ...prev,
        [name]: value
      }))
    }
    else {
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



        });
        setSubService(null);
        setMiniService(null);
      }
    }


  };
  const membershipPress = (e) => {
    if (e.target.value) {
      setActiveMemberShip(activemember?.find((elm) => elm._id === e.target.value));
    }
    else {
      setActiveMemberShip({})
    }
  };

 
  useEffect(() => {
    const currentTime = moment()._d.toString();

    const timeString = currentTime.split(" ")[4];
    setAppointmentDetails((prev) => ({
      ...prev,
      time: timeString,
      date: formatDate(new Date())
    }))
  }, []);


  const handleTimeChange = (selectedTime) => {
    const timeString = selectedTime._d.toString().split(" ")[4];
    setAppointmentDetails((prev) => ({
      ...prev,
      time: timeString
    }))
  };

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
  useEffect(() => {
    getApiCall(
      "owner/getStaff",
      (res) => {
        setStaffData(res.filter((elm) => elm.isActive));
      },
      (error) => { }
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
    const { name,
      phoneNumber,
      email,
      gender
    } = customerDetails;

    if(!name)return toast.error("Please Add Customer")

    const data = {
      services: services,
      customer: {
        name,
        phoneNumber,
        email,
        gender,
        dob: formatDateWOYear(customerDetails["dob-date"], customerDetails["dob-month"]),
        aniversary: formatDateWOYear(customerDetails["aniversary-date"], customerDetails["aniversary-month"]),
      },
      subTotal: subtotalPrice,
      // total: subtotalPrice,
      total: totalProductServicePayable,
      // appointmentDate: date + "T" + time + ".000Z",
      appointmentDate: appointmentDetails?.date + "T" + appointmentDetails?.time + ".000Z",
      membershipUsed: memberShipStatus,
      isMembershipApplied: memberShipStatus,
      // membershipCreditUsed: +memberShip,
      // membershipCreditUsed: memberShipStatus ? +subTotalService : 0,
      membershipCreditUsed: memberShipStatus ? Math.min(activeMembership?.creditsLeft || 0, subtotalPrice - countdiscount) : 0,
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
          onTabChange(1)
          
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
    setSelectedProduct({
      ...item,
      quantity: 1

    });
    setsearchProduct("");
  };

  const deleteService = (item) => {
    dispatch(deletItems(item));
  };
  const deleteProduct = (id) => {
    dispatch(deleteProducts(id));
  };

  const handleSubmit = () => {
    const payload = {
      ...customerDetails,
      dob: formatDateWOYear(customerDetails["dob-date"], customerDetails["dob-month"]),
      aniversary: formatDateWOYear(customerDetails["aniversary-date"], customerDetails["aniversary-month"]),

    }
    if(!payload?.phoneNumber||payload.phoneNumber?.length!==10){

      return toast.error("Enter Valid Phone Number") 
    }
    if(!payload?.name){

      return toast.error("Enter Valid Customer Name") 
    }
    postApiData(
      "parlor/registerUserForCrm",
      payload,
      (resp) => {
        toast.success("Customer Added Sucessfully");
      },
      (error) => { }
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

  const fetchProd = (data) => {
    postApiData(
      "inventory/getSuggestedProductOfSalon",
      data,
      (resp) => {
        setShowSearchProduct(resp.products);
      },
      (error) => { }
    );
  }

  // on search product click
  const searchProductOnchange = (e) => {
    setsearchProduct(e.target.value);
    const data = {
      name: searchProduct,
    };
    debouncedFunction(fetchProd, 500, data)

  };
  const applyDiscount = () => {
    setApplyDiscountPer(discount);
    // alert("Discount Added sucessfully");
    toast.success("Discount Added Successfully");
  };

  
  
  const fetchUser = () => {

    setVisible(true);
    const data = {
      phoneNumber: customerDetails?.phoneNumber,
    };
    postApiData(
      "user/searchUser",
      data,
      (resp) => {
        setUserData(resp);
      },
      (error) => { }
    );

  }
  
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
    if (!staffId || !staffName) {
      toast.error("Please Select Staff");

      return;
    }
    if (!price) {
      toast.error("Please Select Product");

      return;
    }

    // productQnt,productStaffid


    dispatch(productAdded(selectedProduct));
    toast.success("product added succesfully");
  };



 
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
        [name]: name === "quantity" ? Math.max(1, +value) : value
      }))
    }


  }
 
  const handleApplyDiscount = () => {

    if (discount) {
      applyDiscount()
    }
   
    if (activeMembership?.creditsLeft > 0) {
      setMemberShipStatus(true)
      toast.success("membership Applied")
    }


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
      label: "Add Service"
    },
    {
      name: "subCategory",
      label: "Category"
    },
    {
      name: "miniSubcategory",
      label: "Sub Category"

    },
    {
      name: "staff",
      label: "Select Staff"
    },
    // {
    //   name: "product",
    //   label: "Search Product",
    //   type: "text",
    //   placeholder: "Product Name"
    // },

  ];
  const addCustomerFields = [
    {
      name: "name",
      label: "Enter Name",
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
    {
      name: "dob",
      label: "Birthday",
      value1: customerDetails["dob-date"],
      value2: customerDetails["dob-month"],
      placeholder: "Enter Aniversary",
    },
    {
      name: "aniversary",
      label: "Aniversary",
      value1: customerDetails["aniversary-date"],
      value2: customerDetails["aniversary-month"],
      placeholder: "Enter Aniversary",
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
  const customerFields = [
    {
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: "9876543210",
      value: customerDetails.phoneNumber,
    },
    {
      name: "name",
      label: "Customer Name",
      placeholder: "Customer Name",
      readOnly: true,
      value: customerDetails.name,
    },
    {
      name: "email",
      label: "Email Address",
      value: customerDetails.email,
      type: "email",
      readOnly: true,
      placeholder: "Enter Email Address",
    },
    {
      name: "date",
      label: "Date",
      type: 'date',
      value: appointmentDetails?.date,
      placeholder: "DD-MM-YYYY"

    },
    {
      name: "time",
      label: "Time",
      value: appointmentDetails?.time,
      placeholder: "DD-MM-YYYY"

    }
  ]
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
      placeholder: "Price",
      readOnly: true,
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
      options: activemember?.map((item) => ({
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


  useEffect(() => {
    if (customerDetails?.phoneNumber) {
      debouncedFunction(fetchUser, 500)
    }
  }, [customerDetails?.phoneNumber])

  const tableFields = [customerDetailsArray, paymentDetailsArray];

  return (
    <>
      <div className="mx-auto ">
        {/* customer details */}
        <div className="rounded-[10px] bg-white shadow-tab border p-5 mb-9">
          <div className="flex items-center mb-9 justify-between">
            <h2 className="font-normal leading-[20px]   text-black text-[24px]">Customer Details</h2>
            <button
              onClick={openModal}
              className="w-[190px] bg-ternary font-normal h-[36px] flex items-center justify-center active:bg-ternary/90 transition-colors ease-in duration-100 rounded-[16px] text-white text-sm leading-[24px]">Add New Customer</button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-9 ">
            {
              customerFields?.map((customer, index) => {
                const { name, label, placeholder, value, readOnly, type } = customer
                return (
                  <div className="relative">
                    <div className="flex flex-col gap-1">
                      {name !== "time" ? <NormalInput
                        key={index}
                        name={name}
                        type={type}
                        label={label}
                        disabled={readOnly}
                        onChange={handleChange}
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



                      /> :
                        <div className="flex time flex-col gap-1">
                          <p className="text-md mb-1  text-black">Time</p>

                          <TimePicker
                            placeholder="Select Time"
                            use12Hours
                            allowEmpty={false}
                            showSecond={false}
                            focusOnOpen={true}
                            format="hh:mm A"
                            onChange={handleTimeChange}
                            inputIcon
                            className="rounded-[16px] border border-primaryGray text-black py-[12px] px-[27px] text-sm"

                            defaultValue={moment()}
                            defaultOpenValue={moment()}
                          />

                        </div>}
                    </div>
                    {visible && name === "phoneNumber" &&userData.length > 0 && (
                      <div
                        className="absolute -bottom-[110px] h-[110px] w-full py-2 overflow-auto border-2 border-gray-200 bg-white shadow-xl rounded-lg z-[2]"
                      >
                        {userData.length > 0 &&
                          userData?.map((item, index) => {
                            return (
                              <div
                                key={index}
                                style={{ display: "flex" }}
                                onClick={() => nameOnclick(item)}
                                className="flex items-center  px-4 py-2 mb-0 transition-all duration-300 ease-in-out transform hover:bg-[#f5da42] hover:scale-95 cursor-pointer"
                              >
                                <p className="mr-2 capitalize font-semibold">{item.name}</p>
                                <p className="font-semibold">
                                  {item.phoneNumber}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )
              })
            }
          </div>
        </div>
        {/* service select */}
        <div className="rounded-[10px] bg-white shadow-tab border p-5 mb-9">
          <h2 className="font-normal text-start leading-[20px] mb-9   text-black text-[24px]">Select Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-9 ">
            {
              servicesFields?.map((customer, index) => {
                const { name, label } = customer

                const value = serviceSelection[name];
                const options = servicesOptions[name]
                return (
                  <div key={index} className="relative">
                    <div className="flex flex-col gap-1">

                      <NormalSelect

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



                      />
                    </div>

                  </div>
                )
              })
            }
          </div>
          <div className="flex justify-end mt-5">

            <button onClick={handldeAddButton}
              className="bg-black text-white rounded-[16px] w-[190px] text-sm font-normal ">Confirm</button>
          </div>

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
        {/* product Detail  */}
        <div className="rounded-[10px] bg-secondaryGray shadow-tab border p-5 mb-9">
          <div className="flex items-center gap-6  mb-9 ">
            <h2 className="font-normal text-start leading-[20px]  text-black text-[24px]">Product Detail</h2>
            <span className="border text-black text-[13px] border-gray2 w-[27px] flex items-center justify-center rounded-[16px] h-[21px]">{productDataReducer?.length > 9 ? '9+' : productDataReducer?.length + "+"}</span>

          </div>

          {productDataReducer?.length > 0 && (
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
                  {productDataReducer?.map((item, index) => (
                    <tr key={index}>
                      <td className="border-none text-sm 2xl:text-md text-gray2 font-normal">{index + 1}</td>
                      <td className="border-none text-sm 2xl:text-md text-gray2 font-normal">{item?.name}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">{item?.price}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">{item?.brand}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">{item?.quantity}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">{item?.staffName}</td>
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
        {/* service Detail */}
        <div className="rounded-[10px] bg-secondaryGray shadow-tab border p-5 mb-9">

          <div className="flex items-center gap-6  mb-9 ">
            <h2 className="font-normal text-start leading-[20px]  text-black text-[24px]">Service Detail</h2>
            <span className="border text-black text-[13px] border-gray2 w-[27px] flex items-center justify-center rounded-[16px] h-[21px]">{x?.length > 9 ? '9+' : x?.length + "+"}</span>
          </div>

          {x.length > 0 && (
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
                  {x?.map((item, index) => (
                    <tr key={index}>
                      <td className="border-none text-sm 2xl:text-md text-gray2 font-normal">{index + 1}</td>
                      <td className="border-none text-sm 2xl:text-md text-gray2 font-normal">{item?.miniSubcategory}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">{item?.category}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">{item?.subCategory}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">{item?.price}</td>
                      <td className="border-none text-sm 2xl:text-md text-ternaryGray font-normal">{item?.satffName}</td>
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
          <div className="flex justify-end mt-12">

            <button onClick={handleApplyDiscount}
              className="bg-black text-white rounded-[16px] w-[190px] text-sm font-normal ">Confirm</button>
          </div>


        </div>
        {/* book appointment */}
        {customerDetails?.phoneNumber && (<div className="rounded-[10px] bg-secondaryGray shadow-tab border p-5 mb-9">
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
          <div className="flex justify-end mt-12">

            <button onClick={handldeBookAppointment}
              className="bg-black text-white rounded-[16px] w-[250px] text-sm font-normal ">Book Appointment</button>
          </div>
        </div>)}
        {/*  */}
        <AddCustomerModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          addCustomerFields={addCustomerFields}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          heading={"Add Customer Appointment"}
        />



      </div>


    </>
  );
};

export default BookAppointment;
