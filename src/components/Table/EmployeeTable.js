import { useEffect, useState } from 'react';

import SwitchExample from '../switch';
import { MdOutlineModeEdit, MdDeleteOutline, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { formatDateForInput, formatDateToFull, getApiCall, postApiData } from '../../utils/services';
import toast from 'react-hot-toast';
import EditCustomerModal from '../modals/EditCustomerModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import { isSalonOwner } from '../../utils/auth';
import { formatShift, parseShift } from '../../utils/shift';

// Owner-only: a staff member's login password, hidden until revealed.
// The button sets its own padding/colour because pages/login/login.css styles
// every <button> (white text, 10px padding).
const PasswordCell = ({ password, status }) => {
  const [visible, setVisible] = useState(false);
  if (status === "loading") return <span className="text-gray-400">…</span>;
  // A failed load must not read as "no password".
  if (status === "error") {
    return <span className="text-gray-400" title="Couldn't load login passwords">Unavailable</span>;
  }
  if (!password) return <span className="text-gray-400">Not set</span>;
  return (
    <span className="inline-flex items-center gap-1">
      <span className={visible ? "font-mono text-gray-800" : "tracking-widest text-gray-800"}>
        {visible ? password : "••••••"}
      </span>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="shrink-0 grid h-8 w-8 place-items-center rounded-full bg-transparent p-0 text-gray-500 hover:bg-gray-100 hover:text-ternary"
      >
        {visible ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
      </button>
    </span>
  );
};

const EmployeeTable = ({ data, setData, startIndex, endIndex, isBool, setIsBool }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [editItem, setEditItem] = useState({});
  // Staff Contacts is read-only for everyone but the salon owner: only the
  // owner switches staff on/off, edits or deletes them (and sees salaries and
  // passwords).
  const isOwner = isSalonOwner();
  // staffId -> login password. Only the owner can load these; the staff list
  // itself never carries passwords because managers load it too.
  const [logins, setLogins] = useState({ status: "loading", byId: {} });

  useEffect(() => {
    if (!isOwner) return;
    getApiCall(
      "owner/getStaffLogins",
      // Anything but a list (e.g. a backend without this route answering with
      // its web page) is a failure, not "nobody has a password".
      (res) =>
        setLogins(
          Array.isArray(res)
            ? { status: "ok", byId: Object.fromEntries(res.map((s) => [s._id, s.password])) }
            : { status: "error", byId: {} }
        ),
      () => setLogins({ status: "error", byId: {} })
    );
  }, [isOwner, data]);

  const handleClose = () => {
    setIsEdit(false);
    setEditItem({});
  };

  const cols = [
    { name: "NAME", value: "name" },
    { name: "MOBILE NO.", value: "phoneNumber" },
    { name: "DESIGNATION", value: "role" },
    { name: "SHIFT", value: "shiftTiming" },
    // Salaries are the owner's business; managers don't see them.
    ...(isOwner ? [{ name: "SALARY", value: "salary" }] : []),
    { name: "JOINING DATE", value: "joinAt" },
    ...(isOwner ? [{ name: "LOGIN PASSWORD", value: "password" }] : []),
  ];

  const toEditItem = (item) => ({
    id: item._id,
    isActive: item.isActive,
    name: item.name,
    phoneNumber: item.phoneNumber,
    role: item.role,
    salary: item.salary,
    joinAt: item.joinAt,
    password: "",
    // Edited as two time pickers; compared on save so an untouched (or
    // unreadable, older free-text) shift is left as it is.
    shiftStart: parseShift(item.shiftTiming).start,
    shiftEnd: parseShift(item.shiftTiming).end,
    shiftOriginal: parseShift(item.shiftTiming),
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
    const { password, shiftStart, shiftEnd, shiftOriginal, ...rest } = editItem;
    if (Boolean(shiftStart) !== Boolean(shiftEnd)) {
      toast.error("Set both the shift start and end, or clear both");
      return;
    }
    if (shiftStart && shiftStart === shiftEnd) {
      toast.error("Shift start and end can't be the same");
      return;
    }
    const shiftChanged = shiftStart !== shiftOriginal?.start || shiftEnd !== shiftOriginal?.end;
    postApiData(
      "owner/editStaff",
      {
        ...rest,
        ...(password && { password }),
        // "" clears the shift on the backend.
        ...(shiftChanged && { shiftTiming: formatShift(shiftStart, shiftEnd) }),
      },
      (res) => {
        toast.success("Updated Successfully");
        setData((prev) =>
          prev.map((item) => (item._id === editItem.id ? { ...res } : item))
        );
        setEditItem({});
        setIsEdit(false);
      },
      (error) => {
        toast.error(error?.response?.data?.message || "Something went wrong");
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
      (error) => {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    );
  };

  const formFields = [
    {
      label: "Name",
      placeholder: "Enter your name",
      type: "text",
      name: "name",
      value: editItem.name,
    },
    {
      label: "Designation",
      type: "select",
      name: "role",
      options: staffOptions,
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
    {
      label: "Shift Start",
      type: "time",
      value: editItem.shiftStart,
      name: "shiftStart",
    },
    {
      label: "Shift End",
      type: "time",
      value: editItem.shiftEnd,
      name: "shiftEnd",
    },
    // Managers log in to the CRM and staff to the owner app, both with their
    // mobile number and this password.
    {
      label: "Login Password",
      placeholder: logins.byId[editItem.id] ? "Leave blank to keep current" : "At least 6 characters",
      type: "password",
      value: editItem.password,
      name: "password",
    },
  ];

  const rows = data.slice(startIndex, endIndex);

  // Owner only. Icons get an explicit pixel size so they never inherit a tiny
  // font-size from the table cell, and the buttons have a fixed 40px touch target.
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
    if (col.value === "password") {
      return item.role === "owner" ? "" : <PasswordCell password={logins.byId[item._id]} status={logins.status} />;
    }
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
              {isOwner && <RowActions item={item} />}
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
          className={`styled-table w-full ${isOwner ? "min-w-[960px]" : "min-w-[720px]"}`}
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
              {isOwner && (
                <th className="sticky right-0 z-5 whitespace-nowrap bg-white text-left">
                  ACTION
                </th>
              )}
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

                {isOwner && (
                  <td className="sticky right-0 z-5 bg-white">
                    <RowActions item={item} />
                  </td>
                )}
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