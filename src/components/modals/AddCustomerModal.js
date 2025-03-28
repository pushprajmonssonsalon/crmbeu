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
        className="w-[70%] lg:w-[50%] relative top-[10%] bottom-[10%]  z-30  mx-auto"
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
        <div className="my-3">
          <h1 className="font-medium text-black text-xl">{heading}</h1>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2  gap-2">
            {addCustomerFields.map((input, index) => {
              const { name, placeholder, label, value, options ,value1,value2} = input;
              return (
                <div key={index} className="flex  flex-col gap-2">
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
                          'borderRadius': '16px'

                        }}
                        lableStyles={{
                          'fontWeight': '400',
                          "fontSize": "16px",
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
                          'borderRadius': '16px'

                        }}
                        lableStyles={{
                          'fontWeight': '400',
                          "fontSize": "16px",
                          'color': '#000000'
                        }}
                      />}
                </div>
              );
            })}
          </div>
        </div>

        {/* </div> */}
        <div className="my-6 flex gap-6">
          <button
            style={{
              background: "green",
            }}
            className="flex w-[150px] h-[40px] rounded-[16px] hover:bg-opacity-65 hover:scale-105 transition-all ease-in duration-100 form-btn items-center justify-center "
            onClick={handleSubmit}
          >
            <span className="font-medium text-white">Add</span>
          </button>
          <button
            style={{
              background: "red",
              
            }}
            onClick={closeModal}
            className="flex w-[150px] h-[40px] rounded-[16px] hover:bg-opacity-65 hover:scale-105 transition-all ease-in duration-100 form-btn items-center justify-center "
          >
            <span className="font-medium text-white">Cancel</span>
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AddCustomerModal;
