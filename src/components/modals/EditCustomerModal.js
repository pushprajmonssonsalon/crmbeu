import NormalInput from "../customInput/NormalInput";
import Modal from "react-modal";
import NormalSelect from "../customInput/NormalSelect";
import "./AddCustomerModal.css";
const EditCustomerModal = ({
  isModalOpen,
  closeModal,
  formFields,
  handleSubmit,
  label,
  heading,
  handleChange
}) => {
  return (
    <>
      {" "}
    <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className=" w-[80%] sm:w-[70%]  relative top-[10%] bottom-[10%]  z-30  mx-auto"

          contentLabel={label}
          style={{
            content: {

              height: "fit-content",
              maxHeight: 'calc(100% - 200px)',
              overflowY: "auto",

              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
              padding: "20px",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.3)", // Set the overlay background color
            },
          }}        >
          <h1 className=" text-2xl  text-black mb-4  text-start ">{heading}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-4 mb-4">
            {
              formFields?.map((customer, index) => {
                const { name, label, placeholder, type, value, options,readOnly } = customer
                return (
                  <div key={index} className="relative">
                    <div className="flex flex-col gap-1">

                      {!options ?

                        <NormalInput
                          name={name}
                          disabled={readOnly}
                          label={label}
                          type={type}
                          onChange={handleChange}
                          placeholder={placeholder}
                          value={value}
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
                        : <NormalSelect

                          name={name}
                          disabled={readOnly}
                          label={label}
                          options={options}
                          onChange={handleChange}
                          value={value}
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

                  </div>
                )
              })
            }
          </div>


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
              Edit
            </button>
          </div>
        </Modal>
    </>
  );
};

export default EditCustomerModal;
