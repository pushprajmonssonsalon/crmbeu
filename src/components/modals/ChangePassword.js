import { useState } from "react";
import Modal from "../modal/Modal";
import NormalInput from "../customInput/NormalInput";
import { postApiData } from "../../utils/services";
import toast from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";

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

const ChildComponent = ({ closeModal, onSubmit, modalRef }) => {
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
    const isEveryEmpty = Object.keys(formData).every((elm) => !formData[elm] || formData[elm] === "")
    if (isEveryEmpty) {
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
    const data = {
      oldPassword: formData.currentPassword,
      newPassword: formData.confirmPassword,
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
      <div ref={modalRef} className="slide-in-top relative h-fit max-h-full w-full  my-auto bg-white rounded-lg shadow p-4">
        {/* Modal header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className={`text-2xl text-black `}>Change Password</h1>
          <button className='text-black text-xl' onClick={closeModal}><MdOutlineClose /></button>

        </div>

        {/* Modal body */}
        <div className="grid grid-cols-1 gap-y-3 mb-4">
          {fields.map((field, idx) => {
            const { name, value, label, placeholder, type } = field;
            return (
              <div key={idx} className="grid grid-cols-2 ">
                <NormalInput
                  name={name}
                  value={value}
                  label={label}
                  onChange={handleChange}
                  placeholder={placeholder}
                  type={type}
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
              </div>
            );
          })}
          <div className="flex items-center justify-end gap-4 mt-6">
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
              Submit
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
