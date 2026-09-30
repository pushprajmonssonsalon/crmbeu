import { useEffect, useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import { formatDateToFull, formatValue, getApiCall, postApiData } from "../../utils/services";

// Membership sales are paid with these (components/popup/OrderPayment.js);
// used when an older bill has no split recorded.
const PAYMENT_METHODS = ["Cash", "Upi", "Card", "Online"];

const inputClass =
  "w-full min-w-0 bg-gray-50 border border-primaryGray text-black text-sm rounded-[10px] py-[10px] px-[15px] disabled:opacity-60";
const labelClass = "text-xs uppercase tracking-wide text-gray-500";

// The Membership page shows these dates straight off the ISO string.
const toDateInput = (iso) => (iso ? String(iso).split("T")[0] : "");

// Owner-only correction of a membership bill (a membership sale), laid out like
// the appointment Edit Bill. The customer's membership that the bill created
// is kept in step by the backend (membership/editMembershipBill).
const EditMembershipBillModal = ({ bill, onClose, onSaved }) => {
  const isOpen = Boolean(bill);
  const [form, setForm] = useState({ name: "", price: "", credits: "", validFrom: "", expiry: "" });
  const [soldBy, setSoldBy] = useState([]);
  const [payments, setPayments] = useState([]);
  const [linked, setLinked] = useState(undefined); // undefined = loading, null = none
  const [creditsLeft, setCreditsLeft] = useState("");
  const [staffData, setStaffData] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!bill) return;
    setForm({
      name: bill.name || "",
      price: bill.price ?? "",
      credits: bill.credits ?? "",
      validFrom: toDateInput(bill.createdAt),
      expiry: toDateInput(bill.expiryDate),
    });
    setSoldBy((bill.employees || []).map((e) => ({ employeeId: e.employeeId, name: e.name })));
    const stored = bill.paymentMethod || [];
    setPayments(
      stored.length
        ? stored.map((m) => ({ name: m.name, amount: m.amount || 0 }))
        : PAYMENT_METHODS.map((name) => ({ name, amount: 0 }))
    );
    setLinked(undefined);
    setCreditsLeft("");
    getApiCall(
      `membership/getMembershipBill/${bill._id}`,
      (res) => {
        setLinked(res?.linked || null);
        setCreditsLeft(res?.linked?.creditsLeft ?? "");
      },
      () => setLinked(null)
    );
    getApiCall("owner/getStaff", (res) => setStaffData(res || []), () => {});
  }, [bill]);

  if (!bill) return null;

  // Active staff, plus whoever is already on the bill.
  const staffOptions = staffData.filter((s) => s.isActive);
  soldBy.forEach((s) => {
    if (!staffOptions.some((o) => o._id === s.employeeId)) {
      staffOptions.push({ _id: s.employeeId, name: s.name || "Previous staff" });
    }
  });
  const toggleStaff = (staff) =>
    setSoldBy((prev) =>
      prev.some((s) => s.employeeId === staff._id)
        ? prev.filter((s) => s.employeeId !== staff._id)
        : [...prev, { employeeId: staff._id, name: staff.name }]
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const price = Number(form.price) || 0;
  const paid = payments.reduce((acc, m) => acc + (Number(m.amount) || 0), 0);
  const remaining = formatValue(price - paid);

  const handleSave = () => {
    if (!form.name.trim()) return toast.error("Membership name is required");
    if (form.price === "" || !(Number(form.price) >= 0)) return toast.error("Enter a valid price");
    if (form.credits === "" || !(Number(form.credits) >= 0)) return toast.error("Enter valid credits");
    if (!form.validFrom || !form.expiry) return toast.error("Both dates are required");
    if (form.expiry < form.validFrom) return toast.error("Expiry can't be before valid from");
    if (!soldBy.length) return toast.error("Choose who sold the membership");
    if (linked && (creditsLeft === "" || !(Number(creditsLeft) >= 0))) {
      return toast.error("Credits left must be 0 or more");
    }
    if (payments.some((m) => !(Number(m.amount) >= 0))) return toast.error("Payment amounts can't be negative");
    if (Math.abs(remaining) > 0.01) {
      return toast.error(
        remaining > 0
          ? `₹${remaining} of the price isn't assigned to a payment method`
          : `Payments are ₹${-remaining} more than the price`
      );
    }

    setSaving(true);
    postApiData(
      "membership/editMembershipBill",
      {
        id: bill._id,
        name: form.name.trim(),
        price: Number(form.price),
        credits: Number(form.credits),
        ...(linked && { creditsLeft: Number(creditsLeft) }),
        validFrom: form.validFrom,
        expiry: form.expiry,
        employees: soldBy,
        paymentMethod: payments.map((m) => ({ name: m.name, amount: Number(m.amount) || 0 })),
      },
      () => {
        setSaving(false);
        toast.success("Membership bill updated");
        onSaved?.();
      },
      (error) => {
        setSaving(false);
        toast.error(error?.response?.data?.message || "Could not update the bill");
      }
    );
  };

  const fields = [
    { label: "Membership Name", name: "name", type: "text" },
    { label: "Price", name: "price", type: "number" },
    { label: "Credits", name: "credits", type: "number" },
    { label: "Valid From", name: "validFrom", type: "date" },
    { label: "Expiry", name: "expiry", type: "date" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={saving ? undefined : onClose}
      className="w-[92%] sm:w-[85%] lg:w-[70%] relative top-[5%] z-30 mx-auto"
      contentLabel="Edit Membership Bill"
      style={{
        content: {
          height: "fit-content",
          maxHeight: "90dvh",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
          padding: "20px",
        },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 mb-5">
        <h1 className="text-2xl text-black text-start">Edit Membership Bill</h1>
        <p className="text-sm text-gray-500">
          {bill.invoiceId ? `Invoice ${bill.invoiceId} · ` : ""}
          {formatDateToFull(bill.createdAt, false)}
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Client</span>
          <input className={inputClass} value={bill.customerName || ""} disabled />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Mobile No.</span>
          <input className={inputClass} value={bill.customerPhoneNumber || ""} disabled />
        </label>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {fields.map((field) => (
          <label key={field.name} className="flex flex-col gap-1">
            <span className={labelClass}>{field.label}</span>
            <input
              name={field.name}
              type={field.type}
              min={field.type === "number" ? "0" : undefined}
              className={inputClass}
              value={form[field.name]}
              onChange={handleChange}
            />
          </label>
        ))}
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Customer's Credits Left</span>
          <input
            type="number"
            min="0"
            className={inputClass}
            value={creditsLeft}
            onChange={(e) => setCreditsLeft(e.target.value)}
            disabled={!linked}
            placeholder={linked === undefined ? "Loading..." : linked ? "" : "Not linked"}
          />
        </label>
      </section>
      {linked === null && (
        <p className="-mt-4 mb-6 text-xs text-gray-500">
          This bill no longer drives the customer's membership (it was renewed by a later bill or removed), so only the bill changes.
        </p>
      )}

      <h2 className="text-start text-base font-semibold text-black mb-2">Sold By</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {staffOptions.map((staff) => {
          const selected = soldBy.some((s) => s.employeeId === staff._id);
          return (
            <button
              key={staff._id}
              type="button"
              onClick={() => toggleStaff(staff)}
              aria-pressed={selected}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                selected
                  ? "border-ternary bg-ternary text-white"
                  : "border-primaryGray bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {staff.name}
            </button>
          );
        })}
      </div>

      <h2 className="text-start text-base font-semibold text-black mb-2">Payment</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {payments.map((m, i) => (
          <label key={m.name} className="flex flex-col gap-1">
            <span className={labelClass}>{m.name}</span>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={m.amount}
              onChange={(e) =>
                setPayments((prev) => prev.map((p, idx) => (idx === i ? { ...p, amount: e.target.value } : p)))
              }
            />
          </label>
        ))}
      </div>
      <p
        className={`mt-3 mb-6 text-sm font-medium ${Math.abs(remaining) > 0.01 ? "text-red-600" : "text-secondaryGreen"}`}
        aria-live="polite"
      >
        {Math.abs(remaining) <= 0.01
          ? "Payments match the price"
          : remaining > 0
          ? `₹${remaining} still to assign`
          : `₹${-remaining} more than the price`}
      </p>

      <div className="flex items-center justify-end gap-4">
        <button
          className="rounded-[5px] w-[120px] text-sm border border-ternary text-ternary py-[5px] px-[24px]"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px] disabled:opacity-60"
          onClick={handleSave}
          disabled={saving || linked === undefined}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
};

export default EditMembershipBillModal;
