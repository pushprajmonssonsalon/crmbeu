import React, { useEffect, useState } from "react";
import { getApiCall, postApiData } from "../../utils/services";
import Modal from "react-modal";
import Layout from "../../components/Layout";
import Popup from "../../components/popup";
import { toast } from "react-hot-toast";
import { BiSolidAddToQueue } from "react-icons/bi";
import ServiceTable from "../../components/Table/ServiceTable";
import Pagination from "../../components/pagination";
import MyServiceTable from "../../components/Table/MyService";
import { productAdded } from "../../redux/actions";

export default function CustomerServices() {
  const [customerServiceData, setCustomerServiceData] = useState([]);
  const [addproductModal, setAddProductModal] = useState(false);
  const [serviceItem, setServiceItem] = useState([]);
  console.log("serviceItem", serviceItem);
  const [price, setPrice] = useState(null);
  const [mrp, setMrp] = useState(null);
  const [servicesAdd, setServices] = useState("allservices");
  const [myServiceData, setMyserviceData] = useState([]);
  const [tab,setTab] = useState(1);
  // show popup
  const [showPopup ,setShowPopup] = useState(false);
  const [editId,setEditID] = useState('');
  // selected 
 const [serviceName,setServiceName] = useState('');
 const [gender,setGender] = useState(null);
 const [categoryName,setCategoryName] = useState(null)

 // my selected service
 const [serviceName1,setServiceName1] = useState('');
 const [gender1,setGender1] = useState(null);
 const [categoryName1,setCategoryName1] = useState(null)
 const GenderData = [
  {
    name: "Female",
  },
  {
    name: "Male",
  }
];

const CategoryData = [
  {
    name: "Hair"
  },
  {
    name: "Makeup"
  },
  {
    name:"Beauty"
  },
  {
    name: "Hand & Feet"
  },
  {
    name: "Spa"
  }
]
  // pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const [currentPage1,setCurrentPage1] = useState(1);
  const itemsPerPage1 = 10;
  const startIndex1=(currentPage1 - 1)* itemsPerPage1;
  const endIndex1 = currentPage1 * itemsPerPage1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePageChange1 = (page)=> {
    setCurrentPage1(page)
  }
  console.log({myServiceData})
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
  useEffect(() => {
    const data = {
      name: serviceName,
      category: categoryName,
      gender: gender==="Female" ? "F" : gender === "Male" ?"M" : ""
    }
    postApiData(
      "salonService/getAllServices",
      data,
      (resp) => {

        setCustomerServiceData(resp);
        setCurrentPage(1)
      },
      (error) => {
        console.log("errro", error);
        
      }
    );
  }, [serviceName,categoryName,gender,tab]);

  const clearService = ()=>{
    setServiceName("")
    setGender("")
    setCategoryName("")
  } 

  const clearMyService = () =>{
    setServiceName1("")
    setGender1("")
    setCategoryName1("")
  }

  useEffect(() => {
    const data = {
      name: serviceName1,
      category: categoryName1,
      gender: gender1==="Female" ? "F" : gender1 === "Male" ?"M" : ""
    }
    postApiData(
      "salonService/getSalonServices",
      data,
      (resp) => {
        console.log("myservice----------respone", resp);
        setMyserviceData(resp);
        setCurrentPage1(1)
      },
      (error) => {
        console.log("errro", error);
      }
    );
  }, [servicesAdd,showPopup,serviceName1,categoryName1,gender1,tab]);
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
          console.log("add service response",resp)
          toast.success("Service Added Sucessfully")
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
        toast.error("Service already Added")
        // alert("service already Added");
      }
    );
  };

  const allservice = () => {
    setServices("allservices");
    handleTab(1)
  };
  const myService = () => {
    setServices("myservices");
    handleTab(2)
  };
  const handleTab = (tabNumber)=>{
    setTab(tabNumber)
  }
  const handleEditService=(id)=>{
    console.log({id})
    setShowPopup(true);
    setEditID(id)
  }
  // console.log({serviceData})
  
  return (
    <Layout>
    <div className="mt-32 w-[90%] mx-auto">
      <ul className="nav-list">
      <li className ='mx-6 font-medium inter text-lg text-slate-100 cursor-pointer'>
                    <button className='  py-2 px-4 rounded-lg text-white flex justify-center items-center bg-black ' onClick={allservice}>
               
                <h3 className='font-semibold text-lg poppins '  style={{color:tab==1 ?"white":"gray",}} >All Service</h3>
                </button></li>
                <li className ='mx-6 font-medium inter text-lg text-slate-100 cursor-pointer'>
                    <button className='py-2 px-4 rounded-lg text-white flex justify-center items-center bg-black ' onClick={myService}>
               
                <h3 className='font-semibold text-lg poppins '  style={{color:tab==2 ?"white":"gray",}}>My Service</h3>
                </button></li>
        {/* <li className="nav-item" onClick={allservice}>
          All Services
        </li>
        <li className="nav-item" onClick={myService}>
          My Services
        </li> */}
      </ul>
      {/* <div className="h-[700px] overflow-y-auto mt-3">
      <div className="table-container"> */}
        {servicesAdd == "allservices" ? (
          <>
          <div className="flex justify-between items-center mt-6">
              <input
              value={serviceName}
              placeholder="Search by service Name"
              style={{
                height: "40px",
                border: "1px solid grey",
                width: "270px",
                borderRadius: "11px",
                paddingRight: "30px", // Add space for the eye icon
                marginTop:'14px',
                outline:"none"
              }}
              onChange={(e)=>setServiceName(e.target.value)}
            />
               <select
              style={{
                height: "40px",
                border: "1px solid grey",
                width: "270px",
                borderRadius: "11px",
                paddingRight: "30px",
              }}
              onChange={(e)=>setCategoryName(e.target.value)}
              value={categoryName}
            >
              <option value="" selected >
                Search By Category
              </option>
              {CategoryData.map((item, index) => {
                return <option >{item?.name}</option>;
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
              onChange={(e)=>setGender(e.target.value)}
              value={gender}
            >
              <option value={""} selected>
                SELECT GENDER
              </option>
              {GenderData.map((item, index) => {
                return <option >{item?.name}</option>;
              })}
            </select>
              <button className="px-3 py-2 bg-black roounded-lg text-white font-semibold" onClick={clearService}>clear</button>
              </div>
          <ServiceTable data={customerServiceData} startIndex={startIndex} endIndex={endIndex} addclick={addclick}/>
          <Pagination 
              totalItems={customerServiceData?.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange} />
        </>) : (
          <>
          <div className="flex justify-between items-center mt-6">
              <input
              value={serviceName1}
              placeholder="Search by service Name"
              style={{
                height: "40px",
                border: "1px solid grey",
                width: "270px",
                borderRadius: "11px",
                paddingRight: "30px", // Add space for the eye icon
                marginTop:'14px',
                outline:"none"
              }}
              onChange={(e)=>setServiceName1(e.target.value)}
            />
               <select
              style={{
                height: "40px",
                border: "1px solid grey",
                width: "270px",
                borderRadius: "11px",
                paddingRight: "30px",
              }}
              onChange={(e)=>setCategoryName1(e.target.value)}
              value={categoryName1}
            >
              <option value="" selected >
                Search By Category
              </option>
              {CategoryData.map((item, index) => {
                return <option >{item?.name}</option>;
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
              onChange={(e)=>setGender1(e.target.value)}
              value={gender1}
            >
              <option value={""} selected>
                SELECT GENDER
              </option>
              {GenderData.map((item, index) => {
                return <option >{item?.name}</option>;
              })}
            </select>
              <button className="px-3 py-2 bg-black roounded-lg text-white font-semibold" onClick={clearMyService}>clear</button>
              </div>
            <MyServiceTable data={myServiceData} startIndex={startIndex1} endIndex={endIndex1} handleEditService={handleEditService} />
            <Pagination 
              totalItems={myServiceData?.length}
              itemsPerPage={itemsPerPage1}
              currentPage={currentPage1}
              onPageChange={handlePageChange1} />
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
              <input type="number"
                value={mrp}
                placeholder="MRP(should be greater than price):"
                className="w-[280px] self-center"
                onChange={mrpOnChange}
              />
        </div>
        {/* Price  */}
        <div className="flex justify-between items-center ">
        <label className="text-lg font-semibold ">Price :</label>
              <input type="number"
                value={price}
                placeholder="Price"
                className="w-[280px] self-center"
                onChange={onchnagPrice}
              />
        </div>

        <button onClick={onclickService} className="px-4 py-3 ">Update</button>

        </div>
          {/* <div
            className="p-4 flex flex-col"
          >
            <div style={{ justifyContent: "space-between", display: "flex" }}>
            
              <div className="flex justify-between items-center">
              <label className="text-lg font-semibold">Category :</label>
              <input
                value={serviceItem.category}
                placeholder="Category"
                style={{ border: "1px solid grey", width: "290px" }}
              />
              </div>
            </div>
            <div style={{ justifyContent: "space-between", display: "flex" }}>
            <div className="flex justify-between items-center">
            <label>SubCategory :</label>
              <input
                value={serviceItem?.subCategory}
                placeholder="subCategory"
                style={{ border: "1px solid grey", width: "290px" }}
              />
              </div>
              <div className="flex justify-between items-center">
              <label>Price :</label>
              <input
                value={price}
                placeholder="Price"
                style={{ border: "1px solid grey", width: "290px" }}
                onChange={onchnagPrice}
              />
              </div>
            </div>
            <div className="flex justify-between items-center">
            <label>MRP :</label>
            <input
              value={mrp}
              placeholder="Mrp"
              style={{ border: "1px solid grey", width: "290px" }}
              onChange={mrpOnChange}
            />
            </div>
            <div
              style={{
                background: "black",
                borderRadius: "10px",
                height: "35px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "200px",
              }}
              onClick={onclickService}
            >
              <p
                style={{
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                {"Update"}
              </p>
            </div>
          </div> */}
        </Modal>
      )}
      <Popup isVisible={showPopup} onClose={()=>setShowPopup(false)} id={editId}/>
    </div>
    </Layout>
  );
}



{/* <table className="styled-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>CATEGORY</th>
                <th>SUB CATEGORY</th>
                <th>GENDER</th>
                <th>ADD</th>

                {/* <th>Brand</th> */}
              /* </tr>
            </thead>
            <tbody>
              {serviceData?.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.subCategory}</td>
                  <td>{item.gender}</td>
                  <button
                    className="flex justify-center items-center bg-transparent mx-3 hover:bg-transparent hover:text-red-600" 
                    onClick={() => addclick(item)}
                  >
                    
                      <BiSolidAddToQueue className="text-xl font-bold text-black cursor-pointer hover:text-red-600" />
                   
                  </button>
                </tr>
              ))}
            </tbody> */
          {/* </table> */}



          // MY Serive Table

          // <table className="styled-table">
          //   <thead>
          //     <tr>
          //       <th>NAME</th>
          //       <th>CATEGORY</th>
          //       <th>SUB CATEGORY</th>
          //       <th>GENDER</th>
          //       <th>PRICE</th>
          //       <th>MRP</th>
          //       <th>ACTION</th>

          //       {/* <th>Brand</th> */}
          //     </tr>
          //   </thead>
          //   <tbody>
          //     {myServiceData?.map((item, index) => (
          //       <tr key={index}>
                //   <td>{item.name}</td>
                //   <td>{item.category}</td>
                //   <td>{item.subCategory}</td>
                //   <td>{item.gender}</td>
                //   <td>{item.price}</td>
                //   <td>{item.mrp}</td>
                //   <td><button onClick={()=>handleEditService(item.serviceId)}  className='bg-[#5865F2] py-2 px-4 rounded-lg text-white flex justify-center items-center'>
                // <h3 className='font-semibold text-lg poppins'>Edit</h3>
                
                // </button></td>
          //       </tr>
          //     ))}
          //   </tbody>
          // </table>