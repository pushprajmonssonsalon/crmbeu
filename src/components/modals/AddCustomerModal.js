import NormalInput from "../customInput/NormalInput";
import Modal from "react-modal";
import NormalSelect from "../customInput/NormalSelect";
import "./AddCustomerModal.css";
import CustomDateMonth from "../customInput/CustomDateMonth";
const AddCustomerModal = ({
  isModalOpen,
  closeModal,
  heading,
  addCustomerFields,
  handleSubmit,
  handleChange,
}) => {
  return (
    <>
      {" "}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="w-[80%] lg:w-[70%] relative top-[10%] bottom-[10%]  z-30  mx-auto"
        style={{
          content: {

            height: "fit-content",
            maxHeight:'calc(100% - 200px)',
            overflowY:"auto",

            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            padding: "20px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Set the overlay background color
          },
        }}
      >
          <h1 className=" text-black text-2xl mb-6">{heading}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-4 mb-4">
            {addCustomerFields.map((input, index) => {
              const { name, placeholder, label, value, options ,value1,value2} = input;
              return (
                <div key={index} className="flex  flex-col gap-1">
                  {(name === "dob" || name === "aniversary") ?
                    <CustomDateMonth
                        placeholder={placeholder}
                      label={label}
                      name={name}
                      value1={value1}
                      value2={value2}
                      onChange={handleChange}
                       

                    />
                    :
                    !options ? <NormalInput
                      placeholder={placeholder}
                      label={label}
                      name={name}
                      value={value}
                      onChange={handleChange}
                      inputStyles={{
                            'borderRadius': '10px',
                            padding: "10px 15px",

                          }}
                          lableStyles={{
                            'fontWeight': '400',
                            "fontSize": "14px",
                            'color': '#000000'
                          }}
                    />
                      :
                      <NormalSelect
                        label={label}
                        name={name}
                        value={value}
                        options={options}
                        onChange={handleChange}
                        inputStyles={{
                            'borderRadius': '10px',
                            padding: "10px 15px",

                          }}
                          lableStyles={{
                            'fontWeight': '400',
                            "fontSize": "14px",
                            'color': '#000000'
                          }}
                      />}
                </div>
              );
            })}
          </div>
     

        {/* </div> */}
        <div className="flex items-center justify-end gap-4 mt-4">
            <button
              className="rounded-[5px] w-[120px] text-sm  border border-ternary text-ternary py-[5px] px-[24px]"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
              onClick={handleSubmit}
              >
              ADD
            </button>
          </div>
     
      </Modal>
    </>
  );
};

export default AddCustomerModal;
