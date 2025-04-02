import React, { useEffect, useState } from "react";
import { postApiData } from "../../utils/services";
import Layout from "../../components/Layout";

export default function OwnerService() {
  const [service, setService] = useState([]);
  const [subCategory,setSubcategory]=useState([])
  const [categoryName,setCategoryName]=useState('')
  const [miniservice,setMiniService]=useState([])
  const [subservice,setSubService]=useState('')
  const [bookAppointment,setBookAppointment]=useState({
    
  })
  
  const colors = ["#b2ddeb", "#f0c2a0", "#9ad3bc", "#f4e4bb", "#c1b1d1"];
  const serviceClick=(item)=>{
    setCategoryName(item)

  }
const subserviceClick=(item)=>{
    setSubService(item)

}
  useEffect(() => {
    const data = {
      gender: "F",
    };

    postApiData(
      "salonService/getServiceCategory",
      data,
      (resp) => {
        
        setService(resp);
      },
      (error) => {
        
      }
    );
  }, []);
  useEffect(() => {
    const categorydata = {
        categoryName: categoryName,
        gender: "F",
      };
    postApiData(
      "salonService/getSubServiceCategory",
      categorydata,
      (resp) => {
        
        setSubcategory(resp);
      },
      (error) => {
        
      }
    );
  }, [categoryName]);
  const minicatgdata = {
    category: categoryName,
    gender: "F",
    subCategory: subservice,
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
  }, [subservice]);

  return (
    <>
    <div className="flex">
      <div style={{ background: "white", }} className="mt-32"
    >
        {service.map((item,index) => (
          <div
            style={{
              marginTop: "152px",
              display: "flex",
              border: "1px solid whitesmoke",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors[index % colors.length],
            }}
            key={item.id}
            onClick={()=>serviceClick(item.name)}
          >
            <p>{item.name}</p>
          </div>
        ))}
   
      </div>
      <div style={{width:'13%',display:'flex',flexDirection:"column",marginLeft:'20px',marginTop:'14px'}}>
      {subCategory?.map((item,index) => (
          <div
            style={{
            //   marginTop: "12px",
            //   display: "flex",
            //   border: "1px solid whitesmoke",
            //   alignItems: "center",
            //   justifyContent: "center",
            
              backgroundColor: colors[index % colors.length],
            }}
            key={item.id}
            onClick={()=>subserviceClick(item.name)}
          >
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <div style={{width:'13%',display:'flex',flexDirection:"column",marginLeft:'20px',marginTop:'14px'}}>
      {miniservice?.map((item,index) => (
          <div
            style={{
            //   marginTop: "12px",
            //   display: "flex",
            //   border: "1px solid whitesmoke",
            //   alignItems: "center",
            //   justifyContent: "center",
            
              backgroundColor: colors[index % colors.length],
            }}
            key={item.id}
            // onClick={()=>subserviceClick(item.name)}
          >
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
