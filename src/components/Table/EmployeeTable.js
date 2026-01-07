import { useState } from 'react';

import SwitchExample from '../switch';
import { MdOutlineModeEdit, MdDeleteOutline } from "react-icons/md";
import { postApiData } from '../../utils/services';
import toast from 'react-hot-toast';
import EditCustomerModal from '../modals/EditCustomerModal';
import ConfirmationModal from '../modals/ConfirmationModal';

const EmployeeTable = ({ data, setData, startIndex, endIndex, isBool, setIsBool }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [show, setShow] = useState(false);

  const [editItem, setEditItem] = useState({

  });
  const handleClose = () => {
    setIsEdit(false);
    setEditItem({});
  }


  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };
  const cols = [
    { name: "NAME", value: "name" },
    { name: "MOBILE NO.", value: "phoneNumber" },
    { name: "DESIGNATION", value: "role" },
    { name: "SALARY", value: "salary" },
  ];
  const handleEditClick = (item) => {

    setIsEdit(true);

    setEditItem({
      id: item._id,
      isActive: item.isActive,
      name: item.name,
      phoneNumber: item.phoneNumber,
      role: item.role,
      salary: item.salary
    });

  }
  const handleEdit = (e) => {
    const { name, value } = e.target;

    setEditItem((prev) => ({
      ...prev,
      [name]: value
    }));
  }
  const staffOptions = [{ name: "Manager", value: "manager" }, { "name": "Staff", value: "staff" }]
  const handleSubmit = () => {

    postApiData("owner/editStaff",
      editItem,
      (res) => {
        toast.success("Updated Successfully");
        setEditItem({});
        setData((prev) => {
          const newData = prev.map((item) => {
            if (item._id === editItem.id) {
              return { ...res };
            }
            return item;
          });
          return newData;
        });
        setIsEdit(false);
      },
      () => {
        toast.error("Something went wrong");
      }
    )

  }
  const handleDelete = () => {

    postApiData(`owner/deleteStaff/${editItem?.id}`,
      {},
      (res) => {
        toast.success("Deleted Successfully");
        setData((prev) =>  prev.filter((elm) => elm._id !== editItem?.id));
        setShow(false);
      },
      () => {
        toast.error("Something went wrong");
      }
    )

  }
  const handleDeleteClick = (item) => {
    setShow(true);
    setEditItem({
      id: item._id,
      isActive: item.isActive,
      name: item.name,
      phoneNumber: item.phoneNumber,
      role: item.role,
      salary: item.salary
    });
   
  }
  const formFields = [
    {
      label: "Name",
      placeholder: "Enter your name",
      type: "text",
      name: "name",
      readOnly: true,
      value: editItem.name,
    },
    {
      label: "Designation",
      type: "select",
      name: "role",
      options: staffOptions,
      readOnly: true,

      value: editItem.role // this is your dynamic list
    },
    {
      label: "Salary",
      placeholder: "Enter Your Salary",
      type: "number",
      value: editItem.salary,
      name: "salary",
    },
  ];
  return (
    <>
      <table className="styled-table" style={{ height: "40px" }}>
        <thead>
          <tr>
            <th>#</th>
            {cols.map((elm, index) => {
              return (
                <th key={index} className='text-left'>{elm.name}</th>
              )
            })}
            <th>ACTION</th>

          </tr>
        </thead>
        <tbody>
          {data.slice(startIndex, endIndex).map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {
                cols.map((elm, idx) => {
                  return (
                    <td key={idx} className='text-left '>
                      {item[elm.value] ? item[elm.value] : ""}
                    </td>
                  )
                }
                )
              }


              <td>
                <div className='flex items-center gap-1'>
                  <SwitchExample isActive={item.isActive ? "active" : "inactive"} id={item._id} isBool={isBool} setIsBool={setIsBool} />

                  {item.role !== "owner" && <> <button onClick={() => handleEditClick(item)} className='text-xl text-lightGray2'> <MdOutlineModeEdit />

                  </button>
                    <button onClick={() => handleDeleteClick(item)} className='text-xl text-lightGray2'> <MdDeleteOutline />


                    </button>
                  </>
                  }

                </div>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditCustomerModal
       label="Edit Staff"
  heading="Edit Staff"
        isModalOpen={isEdit}
        closeModal={handleClose}
        formFields={formFields}
        handleChange={handleEdit}
        handleSubmit={handleSubmit}
      />
      <ConfirmationModal
      show={show} 
      setShow={setShow} 
      text={'Are you sure you want to delete this employee?'} 
      onConfirm={handleDelete}

      />
    </>
  )
}

export default EmployeeTable