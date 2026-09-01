import { useState } from 'react';

import SwitchExample from '../switch';
import { MdOutlineModeEdit, MdDeleteOutline } from "react-icons/md";
import { formatDateForInput, formatDateToFull, postApiData } from '../../utils/services';
import toast from 'react-hot-toast';
import EditCustomerModal from '../modals/EditCustomerModal';
import ConfirmationModal from '../modals/ConfirmationModal';

const EmployeeTable = ({ data, setData, startIndex, endIndex, isBool, setIsBool }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [editItem, setEditItem] = useState({});

  const handleClose = () => {
    setIsEdit(false);
    setEditItem({});
  };

  const cols = [
    { name: "NAME", value: "name" },
    { name: "MOBILE NO.", value: "phoneNumber" },
    { name: "DESIGNATION", value: "role" },
    { name: "SALARY", value: "salary" },
    { name: "JOINING DATE", value: "joinAt" },
  ];

  const toEditItem = (item) => ({
    id: item._id,
    isActive: item.isActive,
    name: item.name,
    phoneNumber: item.phoneNumber,
    role: item.role,
    salary: item.salary,
    joinAt: item.joinAt,
  });

  const handleEditClick = (item) => {
    setIsEdit(true);
    setEditItem(toEditItem(item));
  };

  const handleDeleteClick = (item) => {
    setShow(true);
    setEditItem(toEditItem(item));
  };

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({ ...prev, [name]: value }));
  };

  const staffOptions = [
    { name: "Manager", value: "manager" },
    { name: "Staff", value: "staff" },
  ];

  const handleSubmit = () => {
    postApiData(
      "owner/editStaff",
      editItem,
      (res) => {
        toast.success("Updated Successfully");
        setData((prev) =>
          prev.map((item) => (item._id === editItem.id ? { ...res } : item))
        );
        setEditItem({});
        setIsEdit(false);
      },
      () => {
        toast.error("Something went wrong");
      }
    );
  };

  const handleDelete = () => {
    postApiData(
      `owner/deleteStaff/${editItem?.id}`,
      {},
      () => {
        toast.success("Deleted Successfully");
        setData((prev) => prev.filter((elm) => elm._id !== editItem?.id));
        setShow(false);
      },
      () => {
        toast.error("Something went wrong");
      }
    );
  };

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
      value: editItem.role,
    },
    {
      label: "Salary",
      placeholder: "Enter Your Salary",
      type: "number",
      value: editItem.salary,
      name: "salary",
    },
    {
      label: "Joining Date",
      placeholder: "Enter date",
      type: "date",
      value: formatDateForInput(editItem.joinAt),
      name: "joinAt",
    },
  ];

  const rows = data.slice(startIndex, endIndex);

  // Icons get an explicit pixel size so they never inherit a tiny font-size
  // from the table cell, and the buttons have a fixed 40px touch target.
  const RowActions = ({ item }) => (
    <div className="flex flex-nowrap items-center gap-1 sm:gap-2">
      <SwitchExample
        isActive={item.isActive ? "active" : "inactive"}
        id={item._id}
        isBool={isBool}
        setIsBool={setIsBool}
      />

      {item.role !== "owner" && (
        <>
          <button
            onClick={() => handleEditClick(item)}
            aria-label="Edit employee"
            className="shrink-0 grid h-10 w-10 place-items-center rounded-full text-lightGray2 transition-colors hover:bg-gray-100 hover:text-ternary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
          >
            <MdOutlineModeEdit size={20} />
          </button>

          <button
            onClick={() => handleDeleteClick(item)}
            aria-label="Delete employee"
            className="shrink-0 grid h-10 w-10 place-items-center rounded-full text-lightGray2 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
          >
            <MdDeleteOutline size={20} />
          </button>
        </>
      )}
    </div>
  );

  const cellValue = (item, col) => {
    const val = item[col.value];
    if (!val) return "";
    return col.value === "joinAt" ? formatDateToFull(val, false) : val;
  };

  return (
    <>
      {/* ---------- Mobile: card list (below md) ---------- */}
      <div className="space-y-3 md:hidden">
        {rows.map((item, index) => (
          <div
            key={item._id ?? index}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{item.name}</p>
                <p className="mt-0.5 text-sm text-gray-500">{item.phoneNumber}</p>
              </div>
              <RowActions item={item} />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-gray-100 pt-3 text-sm">
              {cols
                .filter((col) => col.value !== "name" && col.value !== "phoneNumber")
                .map((col) => (
                  <div key={col.value}>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">
                      {col.name}
                    </dt>
                    <dd className="mt-0.5 break-words text-gray-800">
                      {cellValue(item, col) || "—"}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="hidden w-full overflow-x-auto md:block">
        <table
          className="styled-table w-full min-w-[720px]"
          style={{ borderCollapse: "separate", borderSpacing: 0 }}
        >
          <thead>
            <tr>
              <th className="whitespace-nowrap">#</th>
              {cols.map((elm, index) => (
                <th key={index} className="whitespace-nowrap text-left">
                  {elm.name}
                </th>
              ))}
              <th className="sticky right-0 z-5 whitespace-nowrap bg-white text-left">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={item._id ?? index}>
                <td>{index + 1}</td>
                {cols.map((col, idx) => (
                  <td key={idx} className="whitespace-nowrap text-left">
                    {cellValue(item, col)}
                  </td>
                ))}

                <td className="sticky right-0 z-5 bg-white">
                  <RowActions item={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
  );
};

export default EmployeeTable;