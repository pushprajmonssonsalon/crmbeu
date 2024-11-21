import React, { useState } from "react";
import Modal from "react-modal";
import { postApiData } from "../../utils/services";
import toast from "react-hot-toast";

export default function InventoryProductAddModal({
  addproductModal,
  setAddProductModal,
  productDetailsModal,
}) {
  
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const [productName, setProductName] = useState(productDetailsModal.name);
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
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setAddProductModal(false);
  };
  const onchangeProduct = (e) => {
    setProductName(e.target.value);
  };
  const onchangeProductQuantity = (e) => {
    setQuantity(e.target.value);
  };
  const onchangeProductPrice = (e) => {
    setPrice(e.target.value);
  };
  const onclickProdut = () => {
    const data = {
      id: productDetailsModal._id,
      quantity: quantity,
      price: price,
    };
    postApiData(
      "inventory/addProductToSalons",
      data,
      (resp) => {
        
        // alert("product Added Succesfully")
        toast.success("Product Added Successfully!!")
      },
      (error) => {
        
        toast.error("Something Went Wrog!!")
      }
    );
  };
  return (
    <>
      <Modal
        isOpen={addproductModal}
        //   onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div
          style={{
            height: "400px",
            width: "700px",
            backgroundColor: "whitesmoke",
            paddingLeft: "20px",
          }}
        >
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Prodcut Name</label>
              <input
                value={productName}
                placeholder="Search by Product Name"
                style={{
                  height: "40px",
                  border: "1px solid grey",
                  width: "270px",
                  borderRadius: "11px",
                  paddingRight: "30px", // Add space for the eye icon
                }}
                onChange={onchangeProduct}
                disabled
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginLeft: "20px" }}>Brand</label>
              <input
                value={productDetailsModal.brand}
                placeholder="Product Brand"
                style={{
                  height: "40px",
                  border: "1px solid grey",
                  width: "270px",
                  borderRadius: "11px",
                  paddingRight: "30px", // Add space for the eye icon
                  marginLeft: "20px",
                }}
                onChange={onchangeProduct}
                disabled
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Quantity</label>
              <input
                value={quantity}
                placeholder="Enter Product Quantity"
                style={{
                  height: "40px",
                  border: "1px solid grey",
                  width: "270px",
                  borderRadius: "11px",
                  paddingRight: "30px", // Add space for the eye icon
                }}
                onChange={onchangeProductQuantity}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginLeft: "20px" }}>Price</label>
              <input
                value={price}
                placeholder="Enter Price"
                style={{
                  height: "40px",
                  border: "1px solid grey",
                  width: "270px",
                  borderRadius: "11px",
                  paddingRight: "30px", // Add space for the eye icon
                  marginLeft: "20px",
                }}
                onChange={onchangeProductPrice}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "black",
                borderRadius: "10px",
                height: "35px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "200px",
                cursor:"pointer"
              }}
              onClick={onclickProdut}
            >
              <p
                style={{
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                {"ADD"}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
