import { useState } from "react";
import Modal from "../modal/Modal";
import NormalInput from "../customInput/NormalInput";
import { postApiData } from "../../utils/services";
import toast from "react-hot-toast";

const ChangePassword = ({ show, setShow, onSubmit }) => {
  return (
    <>
      {" "}
      <Modal show={show} setShow={setShow}>
        <ChildComponent onSubmit={onSubmit} />
      </Modal>
    </>
  );
};

const ChildComponent = ({ closeModal, onSubmit,modalRef }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fields = [
    {
      label: "Current Password",
      name: "currentPassword",
      value: formData?.currentPassword,

      placeholder: "Current Password",
      type: "password",
    },
    {
      label: "New Password",
      name: "newPassword",
      value: formData?.newPassword,

      placeholder: "New Password",
      type: "password",
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      value: formData?.confirmPassword,

      placeholder: "Confirm Password",
      type: "password",
    },
  ];
  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    toast.dismiss()
    const isEveryEmpty =Object.keys(formData).every((elm)=>!formData[elm]||formData[elm]==="")
    if(isEveryEmpty){
      return toast.error("Fill all Fields")
    }
    if (formData.currentPassword !== formData.confirmPassword) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      return toast.error("Password not Matched");
    }
    const data ={
      oldPassword:formData.currentPassword,
      newPassword:formData.confirmPassword,
    }
    postApiData(
      "owner/changePassword",
      data,
      (res) => {
        if (res) {
          onSubmit();
          toast.success("Password Changed Succesfully");
        }
      },
      (err) => {
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.error("Password Not Changed");
      }
    );
  };

  return (
    <div className="relative top-[20%] bottom-[20%] m-auto p-4 w-fit min-w-[300px] md:min-w-[380px] h-full my-auto max-w-[60vw] max-h-full">
      {/* Modal content */}
      <div ref={modalRef} className="slide-in-top relative h-fit max-h-full w-full  my-auto bg-white rounded-lg shadow ">
        {/* Modal header */}
        <div className="flex w-full items-center justify-between p-4 md:p-5 border-b rounded-t ">
          <h3 className="text-lg font-semibold text-gray-900 ">
            Change Password
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center  "
            data-modal-toggle="select-modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        {/* Modal body */}
        <div className="p-4 max-h-[60vh] flex flex-col gap-2 overflow-y-auto md:p-5">
          {fields.map((field, idx) => {
            const { name, value, label, placeholder, type } = field;
            return (
              <div className="flex flex-col gap-1">
                <NormalInput
                  name={name}
                  value={value}
                  label={label}
                  onChange={handleChange}
                  placeholder={placeholder}
                  type={type}
                />
              </div>
            );
          })}
          <button
            onClick={handleSubmit}
            className="text-white mt-5 inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
