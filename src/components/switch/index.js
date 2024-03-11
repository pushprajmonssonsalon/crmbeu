import React, { useState, useEffect } from "react";
import Switch from "react-switch";
import { postApiData } from "../../utils/services";

const SwitchExample = ({ isActive,id }) => {
  const [checked, setChecked] = useState(isActive === "active");

  useEffect(() => {
    setChecked(isActive === "active");
  }, [isActive]);

  const handleChange = (checked) => {
    setChecked(checked);
    const newStatus = checked ? "active" : "inactive";
    const data = {
      isActive : newStatus==="active"?true:false,
      id : id
    }
    postApiData("owner/editStaff",
    data,
    (resp)=>{
      console.log("edit response",resp)
    },(error)=>{
      console.log("error",error)
    }
    )
  };

  return (
    <label>
      <span className="mr-5">{isActive}</span>
      <Switch onChange={handleChange} checked={checked} />
    </label>
  );
};

export default SwitchExample;
