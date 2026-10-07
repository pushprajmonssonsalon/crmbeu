import { useEffect, useMemo, useRef, useState } from "react";
import { formatValue, getApiCall, handleProductAndServiceGst, postApiData } from "../../utils/services";
import { useNavigate, useParams } from "react-router";
import { MdDeleteOutline } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";
import NormalInput from "../../components/customInput/NormalInput";
import NormalSelect from "../../components/customInput/NormalSelect";
import NormalRadio from "../../components/customInput/NormalRadio";
import useDebouncer from "../../utils/hooks/useDebouncer";
import { useSelector } from "react-redux";

const Edit = () => {
  const gstToken = localStorage.getItem("gstApplied");
  const gstApplied = (gstToken === "true")
  const { id } = useParams();
  //Staff data fiktering
  const serviceRef= useRef(null);
  const productRef= useRef(null);
  const searchContainerRef = useRef(null);
  const productContainerRef= useRef(null);
  const { parlorLoading, parlorData, parlorError } = useSelector((state) => state.parlorReducer);
  const parlorServices= parlorData?.services||[];
  const parlorProducts=parlorData?.products||[];

   const [searchService,setSearchService]=useState("")
    const [searchServices,setSearchServices]=useState([])
    const [showSearchResults,setShowSearchResults]=useState(false);
    const [searchProduct, setsearchProduct] = useState("");
      const [showProdDropdown, setShowProdDropdown] = useState(false);
      const [showSearchProduct, setShowSearchProduct] = useState([]);
  const navigate = useNavigate();
  const { debouncedFunction } = useDebouncer()
  const [staffData, setStaffData] = useState([]);
  const [activeMembership, setActiveMemberShip] = useState({});
  const [membershipUsed, setMembershipUsed] = useState(false);
  const [appointmentDetails,setAppointmentDetails]=useState({})
  const [appointementProducts, setAppointmentProducts] = useState([]);
  const [addedAppointmentDetails, setAddedAppointmentDetails] = useState([]);
  const [membershipCreditUsed, setMembershipCreditUsed] = useState(0)
  const [userId, setUserId] = useState("")
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
    staffName: "",
  });

 
  
  // const [selectedProduct, setSelectedProduct] = useState(null);

  const [discount, setDiscount] = useState(0);
  const [applyDisountPer, setApplyDiscountPer] = useState(0);

  // membership details
  const [membershipDetails, setMembershipDetails] = useState([]);
  const [memberShipStatus, setMemberShipStatus] = useState(false);
  const [isMembershipApplied, setIsMembershipApplied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");


  const applyDiscount = () => {
    setApplyDiscountPer(discount);
    // alert("Discount Added sucessfully");
    toast.success("Discount Added Successfully");
  };


  // useEffect(() => {
  //   getApiCall(
  //     "salonService/getServiceCategory",

  //     (resp) => {
  //       setService(resp);
  //     },
  //     (error) => { }
  //   );
  // }, [customerDetails?.gender]);
  // api call for getting subcategory
  // const categorydata = {
  //   categoryName: serviceSelection.category,
  //   gender: customerDetails.gender,
  // };
  // useEffect(() => {
  //   postApiData(
  //     "salonService/getSubServiceCategory",
  //     categorydata,
  //     (resp) => {
  //       setSubService(resp);
  //     },
  //     (error) => { }
  //   );
  // }, [serviceSelection.category]);

  // const minicatgdata = {
  //   category: serviceSelection.category,
  //   gender: customerDetails.gender,
  //   subCategory: serviceSelection.subCategory,
  // };
  // useEffect(() => {
  //   postApiData(
  //     "salonService/getSuggestedSalonServices",
  //     minicatgdata,
  //     (resp) => {
  //       setMiniService(resp[0]);
  //     },
  //     (error) => { }
  //   );
  // }, [serviceSelection.subCategory]);

  const fetchAppointment=()=>{
 getApiCall(
      `appointment/getSingleAppointmentDetails?id=${id}`,
      (resp) => {
        setAppointmentDetails(resp)
        setDiscount(resp?.discountPercentage || 0);
        setApplyDiscountPer(resp?.discountPercentage || 0);
        setAddedAppointmentDetails(
          resp.services.map((item) => ({ ...item, staffId: item?.staffId || "", staffName: item?.staffName || item?.satffName || "" }))
        );
        setIsMembershipApplied(parseInt(resp?.membershipCreditUsed) > 0 ? true : false);
        setAppointmentProducts(resp.products);
        // setMembershipDetails(resp.customer.activeMembership)
        setMemberShipStatus(resp.membershipUsed);
        setActiveMemberShip(resp.userMembership)
        setUserId(resp.customer._id);
        setPhoneNumber(resp.customer.phoneNumber);

        setMembershipCreditUsed(resp?.membershipCreditUsed || 0);
         setMembershipUsed(resp?.membershipCreditUsed>0);
        
      },
      (error) => {

      }
    );
  }
  //single appointment api
  useEffect(() => {
    fetchAppointment()
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
  }, []);

   const fetchActiveMembership=async()=>{
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
   }
  useEffect(() => {
    if (phoneNumber)
    fetchActiveMembership()
  }, [phoneNumber])

  // useEffect(()=>{
  // console.log(activeMembership,'activeMemb')
  // },[activeMembership])

  // handle buttons for add service
  // const serviceAddpress = () => {
  //   const { miniSub, miniSubcategory, ...rest } = serviceSelection;

  //   const selected = {

  //     ...rest,
  //     miniSubcategory: miniSub,
  //   };
  //   const isEveryEmpty = Object.values(selected).some((elm) => !elm || elm === "0" || elm.toString().trim() === "");
  //   if (isEveryEmpty) {
  //     return toast.error("Please Select All Fields");
  //   }
  //   setAddedAppointmentDetails([...addedAppointmentDetails, serviceSelection]);

  // };

  // const handleServiceChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "miniSubcategory") {
  //     const splited = value.split("---");
  //     const price = splited[0];
  //     const val = splited[1];
  //     setServiceSelection({
  //       ...serviceSelection,
  //       miniSubcategory: value,
  //       price: +price,
  //       miniSub: val,
  //     });
  //   } else if (name === "staff") {
  //     const splited = value.split("-");
  //     const Name = splited[1];
  //     const Id = splited[0];

  //     setServiceSelection({
  //       ...serviceSelection,
  //       staffId: Id,
  //       satffName: Name,
  //     });
  //   } else {
  //     setServiceSelection((prev) => ({
  //       ...prev,
  //       [name]: name === "price" ? Math.max(0, +value) : value,
  //     }));
  //   }
  // };



  const handlestaffChange = (e, index, newService, type = "service") => {
    let splited = e.target.value.split("-");
    let Name = splited[1];
    let Id = splited[0];

    if (type === "service") {
      if (newService) {
        setServiceSelection({
          ...serviceSelection,
          staffId: Id,
          staffName: Name,
        });
      } else {
        setAddedAppointmentDetails((prev) =>
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

const matchesSearch =(searchTerm)=> {
    const services =parlorServices?.filter((service)=>{
  const matches= service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service?.subCategory?.toLowerCase().includes(searchTerm.toLowerCase())||
        service?.category?.toLowerCase().includes(searchTerm.toLowerCase());
        return matches
    })
    if(services?.length>0)
      setShowSearchResults(true)
    setSearchServices(services)
  
       
  }
 
  const searchServiceOnchange = (e) => {
    const val= e.target.value
    setSearchService(val);
    debouncedFunction(matchesSearch, 300,val)
    
  };
 const serviceNameOnclick = (item) => {
    const selected={
      ...item,
      category: item?.category,
    subCategory: item?.subCategory,
    miniSubcategory: item.name,
    price:isNaN(parseInt(item?.price))?1999:parseInt(item?.price),
  
    }
    setAddedAppointmentDetails([...addedAppointmentDetails, selected]);

     toast.success("service added")
  };

  // search product api
  // on search product click
 
  const matchProds =(searchTerm)=> {
    const products =parlorProducts?.filter((product)=>{
  const matches= product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        return matches
    })
    if(products?.length>0)
    setShowProdDropdown(true)
    setShowSearchProduct(products)
  
       
  }

  // on search product click
  const searchProductOnchange = (e) => {
    setsearchProduct(e.target.value);
  
    debouncedFunction(matchProds, 200, e.target.value)
    
  };
  const productNameOnclick = (item) => {
      
      const selected ={
        ...item,
        price:isNaN(parseInt(item.price))?1999:parseInt(item.price),
        quantity:1,
        gst:item?.gst||18,
  
      }
      setAppointmentProducts((prev) => {
      const index = prev.findIndex((elm) => elm._id === selected._id);

      if (index !== -1) {
        return prev.map((elm, i) =>
          i === index ? selected : elm
        );
      } else {
        return [...prev, selected];
      }
    });
      toast.success("product added succesfully");
    };

  // const addproductPress = (
  // ) => {
  //   if (!selectedProduct) return toast.error("Please Select Product");

  //   const { quantity, // Adding quantity key
  //     staffId,
  //     staffName, price, } = selectedProduct
  //   if (!quantity || quantity === "0") {
  //     toast.error("Please Enter Quantiy");

  //     return;
  //   }
  //   if (!price || price === "0") {
  //     toast.error("Please Enter Price");

  //     return;
  //   }
  //   if (!staffId || !staffName) {
  //     toast.error("Please Select Staff");

  //     return;
  //   }
  //   if (!price) {
  //     toast.error("Please Select Product");

  //     return;
  //   }
  //   // productQnt,productStaffid



  //   setAppointmentProducts((prev) => {
  //     const index = prev.findIndex((elm) => elm._id === selectedProduct._id);

  //     if (index !== -1) {
  //       return prev.map((elm, i) =>
  //         i === index ? selectedProduct : elm
  //       );
  //     } else {
  //       return [...prev, selectedProduct];
  //     }
  //   });
  //   toast.success("Product Added Successfully");

  //   // dispatch(EditproductAdded(itemWithAdditionalInfo));
  //   // setProductData(itemWithAdditionalInfo)
  // };


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
    
    };
  }


  // const handleProductChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === 'staffName') {
  //     const splited = value.split("-");
  //     const Name = splited[1];
  //     const Id = splited[0];
  //     setSelectedProduct((prev) => ({
  //       ...prev,
  //       staffId: Id,
  //       staffName: Name,
  //     }));

  //   }
  //   else {

  //     setSelectedProduct((prev) => ({
  //       ...prev,
  //       [name]: name === "quantity" ? Math.max(0, +value) : value
  //     }))
  //   }


  // }



  const subTotalServices = addedAppointmentDetails.reduce(
    (acc, item) => acc + +item?.price,
    0
  );


  const subProductTotal = appointementProducts
    ?.map((item) => item.price * item.quantity)
    ?.reduce((acc, val) => acc + val, 0);

  const serviceDiscount = Math.floor(subTotalServices * (applyDisountPer / 100));

  const totalService = formatValue(subTotalServices - serviceDiscount||0);
  
  // const serviceGst = gstApplied ? formatValue(totalService * 0.05) : 0;
  // const serviceTotal = Math.round(totalService + serviceGst);

  // 
  
  
  
  
  // const netPayableAmount=formatValue(totalService-parseInt(membershipCreditUsed||0))
  const serviceGst = gstApplied ? formatValue(totalService * 0.05) : 0;
  const serviceTotal = Math.round(totalService + serviceGst);
  const totalProductServicePayable = Math.round(serviceTotal + subProductTotal);
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
    let { name, value } = e.target;

    if (type === "service") {
      value = value.replace(/\D/g, ""); // remove all non-digits

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

  
  // const servicesFields = [
  //   {
  //     name: "category",
  //     label: "Add Service",
  //     options: service

  //   },
  //   {
  //     name: "subCategory",
  //     label: "Category",
  //     options: subservice
  //   },
  //   {
  //     name: "miniSubcategory",
  //     label: "Sub Category",
  //     options: miniservice?.services?.map((elm) => ({
  //       name: elm.name,
  //       value: `${elm.price}---${elm.name}`,
  //     })),
  //   },
  //   {
  //     name: "price",
  //     label: "Price",
  //     type: "number",
  //     placeholder: "Enter Price",


  //   },
  //   {
  //     name: "staff",
  //     label: "Select Staff",
  //     options: staffData?.map((elm) => ({
  //       name: elm.name,
  //       value: `${elm._id}-${elm.name}`,
  //     })),
  //   },
  //   // {
  //   //   name: "product",
  //   //   label: "Search Product",
  //   //   type: "text",
  //   //   placeholder: "Product Name"
  //   // },

  // ];

  // const productFields = [
  //   {
  //     name: "name",
  //     label: "Product Name",
  //     placeholder: "Product Name",
  //     value: selectedProduct?.name,
  //   },
  //   {
  //     name: "price",
  //     label: "Price",
  //     type: "Number",
  //     placeholder: "Price",
  //     value: selectedProduct?.price,
  //   },
  //   {
  //     name: "brand",
  //     label: "Brand",
  //     value: selectedProduct?.brand,
  //     readOnly: true,
  //     placeholder: "Brand",
  //   },
  //   {
  //     name: "quantity",
  //     label: "Quantity",
  //     type: "number",
  //     value: selectedProduct?.quantity,
  //     placeholder: "Quantity",
  //   },
  //   {
  //     name: "staffName",
  //     label: "Select Staff",
  //     value: `${selectedProduct?.staffId}-${selectedProduct?.staffName}`,
  //     options: staffData?.map((item) => ({ name: item?.name, value: `${item._id}-${item.name}` }))


  //   }
  // ]
  const discounFields = [
    {
      label: "Discount Percentage",
      name: "discount",
      placeholder: "Discount %",
      value: discount,
      type: "number",
      onChange: (e) => setDiscount(Math.min(Math.max(e.target.value, 0), 100))
    },

  ]
  const membershipFields =useMemo(()=>{
    let arr=[
    {
      label: "Membership",
      name: "membership",
      value:activeMembership?._id?activeMembership?._id:"",
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
    },
    {
      label: "Membership Used",
      name: "membershipBalance",
      value: membershipCreditUsed,
      readOnly: true
    }
  ]
  return arr;
  },[activeMembership,memberShipStatus,membershipDetails,membershipCreditUsed]) 
  // const handleApplyDiscount = () => {

  //   applyDiscount()

  //   if (!isMembershipApplied) {

  //     if (activeMembership?.creditsLeft > 0) {
  //       setMemberShipStatus(true)
  //       toast.success("membership Applied")
  //     }
  //   }


  // }

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
      value: formatValue(membershipCreditUsed)
    },

  ];
  // const paymentDetailsArray = [
  //   { label: "SERVICES SUBTOTAL", value: formatValue(subTotalServices) },
  //   { label: "DISCOUNT", value: formatValue(serviceDiscount) },
  // gstApplied ? { label: "SERVICE GST", value: serviceGst } : null,
  //   { label: "TOTAL SERVICES", value: formatValue(serviceTotal) },

  //   { label: "PRODUCT SUBTOTAL", value: formatValue(subProductTotal) },

  //   { label: "TOTAL PRODUCTS", value: formatValue(subProductTotal) },
  //   { label: "PAYABLE AMOUNT", value: formatValue(totalAmount) },
  // ]?.filter(Boolean);

    const paymentDetailsArray = [
      { label: "SERVICES", value: formatValue(subTotalServices) },
      { label: "DISCOUNT", value: `- ${serviceDiscount}` },
      { label: "SUBTOTAL", value: ` ${totalService}` },
      (gstApplied && ({ label: "SERVICE GST", value: formatValue(serviceGst) })),
      { label: "SERVICE TOTAL ", value: formatValue(serviceTotal) },
      { label: "PRODUCT PRICE", value: formatValue(subProductTotal) },
      { label: "PAYABLE AMOUNT", value: formatValue(totalProductServicePayable) },
      membershipCreditUsed&& { label: "MEMBERSHIP CREDIT USED", value: `- ${membershipCreditUsed}` },
    ]?.filter(Boolean);
  const tableFields = [customerDetailsArray, paymentDetailsArray];
  // handle book appointment
  const validate=(products)=>{
      if(addedAppointmentDetails?.length>0){
      let serviceValid = addedAppointmentDetails.some((elm)=>!elm.staffId||!elm.price)
      if(serviceValid){
        serviceRef.current?.scrollIntoView({
      behavior: "smooth", // smooth scroll
      block: "start",     // start | center | end | nearest
    });
    toast.error("Please fill fields in services")
        return false;
      }

    }
    

    if (products?.length > 0) {
      let fieldEmpty = products.some((elm) =>!elm.staffId|| !elm.price || !elm.quantity||!elm.gst)
      if (fieldEmpty) {
        
        productRef.current?.scrollIntoView({
          behavior: "smooth", // smooth scroll
          block: "start",     // start | center | end | nearest
        });
      toast.error("Please fill all fields in products")
        return false
      }
    }
    return true
  }
  const handleBookAppointment = () => {
    
    
    const {serviceGst,serviceSubTotal,serviceTotal,updatedProducts,productGstTotal,productBaseAmountTotal,productTotal} =handleProductAndServiceGst(totalService,appointementProducts,appointmentDetails?.appointmentDate);
    const data = {
      services: addedAppointmentDetails,
      serviceSubTotal:serviceSubTotal||0,
      serviceGst:serviceGst||0,
      serviceTotal:serviceTotal||0,
      productGst:productGstTotal,
      productSubTotal:productBaseAmountTotal,
      productTotal:productTotal||0,
      subTotal: subTotalServices,
      total: totalProductServicePayable,

      membershipUsed: memberShipStatus,
      membershipId: memberShipStatus ? activeMembership?._id : "",
      isMembershipApplied: memberShipStatus,

      // membershipCreditUsed: (memberShipStatus)? (+subTotalServices):0,
      membershipCreditUsed,
      products: updatedProducts,
      discount: serviceDiscount,
      discountPercentage: applyDisountPer,
    };
    if(!validate(updatedProducts))return 

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

  useEffect(()=>{
    if(!membershipUsed && activeMembership){
      let crediUsed=   Math.max(0, Math.floor(Math.min(activeMembership?.creditsLeft || 0, serviceTotal)))
        setMembershipCreditUsed(crediUsed)

    }
  },[serviceTotal,membershipUsed,activeMembership])
  useEffect(() => {
    if (discount >= 0) {
      debouncedFunction(applyDiscount, 800, discount)
    }

  }, [discount])

  useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          searchContainerRef.current &&
          !searchContainerRef.current.contains(event.target)
        ) {
          setShowSearchResults(false);
        }
        if (
          productContainerRef.current &&
          !productContainerRef.current.contains(event.target)
        ) {
          setShowProdDropdown(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
  const membershipRef= useRef(false);

  const removeMembership = async() => {
    if(membershipRef.current)return
     membershipRef.current=true;
    const data = {
      creditsUsed: membershipCreditUsed,
      userId: userId,
      memId: activeMembership._id,
      isMembershipUsed: false,
      appointmentId:appointmentDetails?._id
    }
     postApiData("membership/applyMembership", data, async (res) => {
      if (res) {
        toast.success("membership removed")
        
        await fetchActiveMembership()
        fetchAppointment()
              setActiveMemberShip(null);

        membershipRef.current=false

      }
    }, () => {
        membershipRef.current=false

    })

  }
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
        <div  ref={serviceRef} className="rounded-[10px] relative bg-secondaryGray shadow-tab border p-5 mb-9">

          <div className="flex items-center gap-6  mb-9 ">
            <h2 className="font-normal text-start leading-[20px]  text-black text-[24px]">Service Detail</h2>
            <span className="border text-black text-[13px] border-gray2 w-[27px] flex items-center justify-center rounded-[16px] h-[21px]">{addedAppointmentDetails?.length > 9 ? '9+' : addedAppointmentDetails?.length + "+"}</span>
          </div>

          {addedAppointmentDetails.length > 0 && (
            <div className={` ${membershipUsed?"blur-sm":""} w-full table-responsive`}>
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
                          value={`${item.staffId}-${item.staffName}`}

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
          {membershipUsed&&
            <div className="flex rounded-[10px] z-[3] items-center justify-center absolute  left-0 right-0 top-0 bottom-0 h-full w-full bg-white/30 ">
              <div className=" relative flex flex-col items-center gap-3">
              <span className="font-normal text-start leading-[20px]  text-black text-[24px]">Remove membership to edit services and add them later.</span>
                <button onClick={removeMembership} className="bg-rose-600 tex-white rounded-[16px] w-full max-w-[190px] text-sm font-normal">Remove Membership </button>
              </div>
            </div>
          }


        </div>


        {/* service select */}
        <div className="rounded-[10px] bg-white shadow-tab border p-5 mb-9">
          <h2 className="font-normal text-start leading-[20px] mb-9   text-black text-[24px]">Select Service</h2>
          <div className="relative w-full flex flex-col gap-1 mb-5">
              <NormalInput
                name="searchService"
                label="Search Service"
                placeholder="Service Name"
                onChange={searchServiceOnchange}

                value={searchService}
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
              {searchServices?.length > 0 && showSearchResults && (
                <div
                ref={searchContainerRef}
                  className="absolute top-[80px] w-full p-2  max-h-[350px]  overflow-y-auto bg-white shadow-lg z-[1000]"
                >
                  {searchServices?.map((item) => {
                    return (
                      <div
                        className="flex justify-between  bg-gray-100 mb-2 last:mb-0 items-center px-4 py-2 border shadow-md cursor-pointer"
                      >
                      <div className="flex gap-6  cursor-pointer">

                        <p className="mr-2 capitalize font-medium">{item.category}</p>
                        <p className="mr-2 capitalize font-medium">{item.subCategory}</p>
                        <p className="mr-2 capitalize font-semibold">{item.name}</p>
                        <p className="mr-2 capitalize font-semibold">₹{item.price}</p>
                        <p className="mr-2 capitalize font-semibold">{item.gender}</p>
                      </div>
                      <button onClick={() => serviceNameOnclick(item)} className="bg-ternary hover:scale-105 delay-100 duration-100 transition-all ease-in px-4 rounded-lg py-2 text-white font-bold">Add</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          {/* <div className="flex justify-end mt-5">

            <button onClick={serviceAddpress}
              className="bg-black text-white rounded-[16px] w-[190px] text-sm font-normal ">Confirm</button>
          </div> */}

        </div>
        <div className="rounded-[10px] bg-secondaryGray shadow-tab border p-5 mb-9">
          <div className="flex items-center gap-6  mb-9 ">
            <h2 className="font-normal text-start leading-[20px]  text-black text-[24px]">Product Detail</h2>
            <span className="border text-black text-[13px] border-gray2 w-[27px] flex items-center justify-center rounded-[16px] h-[21px]">{appointementProducts?.length > 9 ? '9+' : appointementProducts?.length + "+"}</span>

          </div>

          {appointementProducts?.length > 0 && (
            <div ref={productRef}  className="w-full table-responsive">
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
              {showProdDropdown&& showSearchProduct?.length > 0 && (
                <div
                  ref={productContainerRef}
                  className="absolute top-[80px] w-full  p-2 max-h-[300px]  overflow-y-auto bg-white shadow-lg z-[9]"
                >
                  {showSearchProduct?.map((item) => {
                    return (
                      <div
                        className="flex justify-between  bg-gray-100 mb-2 last:mb-0 items-center px-4 py-2 border shadow-md  cursor-pointer"
                      >
                        <div className="flex gap-6  cursor-pointer">

                       
                        <p className="mr-2 capitalize font-medium">{item.brand}</p>
                        <p className="mr-2 capitalize font-semibold">{item.name}</p>
                        <p className="mr-2 capitalize font-semibold">₹{item.price}</p>
                      </div>
                      <button onClick={() => productNameOnclick(item)} className="bg-ternary hover:scale-105 delay-100 duration-100 transition-all ease-in px-4 rounded-lg py-2 text-white font-bold">Add</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-9">
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
          </div> */}

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
                      <NormalInput
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



                      />
                    </div>  </div>
                )

              })

            }



          </div>


        </div>
        <div className="rounded-[10px] bg-white shadow-tab border p-5 mb-9">

          <h2 className="font-normal text-start leading-[20px] mb-9 text-black text-[24px]">Apply Membership</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-9">
            {
              membershipFields?.map((elm, index) => {
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
          {membershipUsed && <div className="flex items-center justify-end my-6">
            <button onClick={removeMembership} className="bg-rose-600 tex-white rounded-[16px] w-[190px] text-sm font-normal  ">Remove Membership</button>


          </div>}

        </div>
        {/* book appointment */}
        <div className="rounded-[10px] bg-secondaryGray shadow-tab border p-5 mb-9">
          <h2 className="font-normal text-start leading-[20px] mb-9 text-black text-[24px]">Booking Detail</h2>


          <div className="p-2 w-full   flex flex-col md:flex-row justify-between  items-start md:items-center gap-4">
            {tableFields.map((elm, idx) => {
              return (
                <div key={idx} className="w-full md:w-[40%] mb-auto ">
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
              className="bg-black text-white rounded-[16px] w-full max-w-[250px] text-sm font-normal ">Update Appointment</button>
          </div>
        </div>
        {/*  */}




      </div>

    </>
  );
};

export default Edit;
