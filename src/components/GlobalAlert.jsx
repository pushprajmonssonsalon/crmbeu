import React from "react";

const GlobalAlert = ({ message }) => {
  return (
    <div className="global-alert-bar">
      <p>{message}</p>
    </div>
  );
};

export default GlobalAlert;
