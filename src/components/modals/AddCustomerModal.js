import NormalInput from "../customInput/NormalInput";
import Modal from "react-modal";
import NormalSelect from "../customInput/NormalSelect";

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
        className="w-[70%] lg:w-[50%] mt-56 mx-auto"
        style={{
          content: {
          
            height: "fit-content",
         
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
          <h1 className="font-bold text-black text-xl">{heading}</h1>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2  gap-2">
            {addCustomerFields.map((input, index) => {
              const { name, placeholder, label,value,options } = input;
              return (
                <div key={index} className="flex  flex-col gap-2">
                 { !options ?<NormalInput
                    placeholder={placeholder}
                    label={label}
                    name={name}
                    value={value}
                    onChange={handleChange}
                  />
                  :
                  <NormalSelect
                    label={label}
                    name={name}
                    value={value}
                    options={options}
                    onChange={handleChange}
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
              height: "40px",
              borderRadius: "3px",
              width: "150px",
            }}
            className="flex hover:bg-opacity-65 hover:scale-105 transition-all ease-in duration-100 form-btn items-center justify-center "
            onClick={handleSubmit}
          >
            <span className="font-medium text-white">Add</span>
          </button>
          <button
            style={{
              background: "red",
              height: "40px",
              borderRadius: "3px",
              width: "150px",
            }}
            onClick={closeModal}
            className="flex hover:bg-opacity-65 hover:scale-105 transition-all ease-in duration-100 form-btn items-center justify-center "
          >
            <span className="font-medium text-white">Cancel</span>
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AddCustomerModal;
