import { useEffect, useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import {
  formatDateToFull,
  formatValue,
  getApiCall,
  handleProductAndServiceGst,
  postApiData,
} from "../../utils/services";

const PAYMENT_METHODS = ["Cash", "Upi", "Card", "Online", "Pending"];

const inputClass =
  "w-full min-w-0 bg-gray-50 border border-primaryGray text-black text-sm rounded-[10px] py-[10px] px-[15px] disabled:opacity-60";
const labelClass = "text-xs uppercase tracking-wide text-gray-500";

// CRM service rows show `miniSubcategory || name`; edit whichever one the bill
// actually prints.
const nameKeyFor = (row) => (row?.miniSubcategory ? "miniSubcategory" : "name");

// Owner-only correction of a completed CRM bill. The totals are worked out the
// same way booking/editing an appointment does (bookAppointment,
// EditAppointmentSalon/Edit.js), so the printed bill reads exactly as if it had
// been booked with these values.
const EditBillModal = ({ appointment, onClose, onSaved }) => {
  const isOpen = Boolean(appointment);
  const [customerName, setCustomerName] = useState("");
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [discountPer, setDiscountPer] = useState(0);
  const [payments, setPayments] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!appointment) return;
    const rows = appointment.services || [];
    const subTotal = rows.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
    setCustomerName(appointment.customer?.name || "");
    setServices(
      rows.map((s) => ({
        ...s,
        nameKey: nameKeyFor(s),
        staffName: s.staffName || s.satffName || "",
      }))
    );
    setProducts(appointment.products || []);
    setDiscountPer(
      appointment.discountPercentage ??
        (subTotal ? formatValue(((appointment.discount || 0) * 100) / subTotal) : 0)
    );
    const stored = appointment.paymentMethod || [];
    setPayments(
      stored.length
        ? stored.map((m) => ({ name: m.name, amount: m.amount || 0 }))
        : PAYMENT_METHODS.map((name) => ({ name, amount: 0 }))
    );
  }, [appointment]);

  useEffect(() => {
    if (!isOpen) return;
    getApiCall("owner/getStaff", (res) => setStaffData(res || []), () => {});
  }, [isOpen]);

  if (!appointment) return null;

  // Active staff, plus whoever is already on the bill so the pick still shows
  // even if that person has since been switched off.
  const staffOptions = staffData.filter((s) => s.isActive);
  [...services, ...products].forEach((row) => {
    if (row.staffId && !staffOptions.some((s) => s._id === row.staffId)) {
      staffOptions.push({ _id: row.staffId, name: row.staffName || row.satffName || "Previous staff" });
    }
  });

  const updateRow = (setRows) => (index, patch) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  const updateService = updateRow(setServices);
  const updateProduct = updateRow(setProducts);
  const staffPatch = (staffId) => ({
    staffId,
    staffName: staffOptions.find((s) => s._id === staffId)?.name || "",
  });

  const gstApplied = localStorage.getItem("gstApplied") === "true";
  const subTotalServices = services.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
  const serviceDiscount = Math.floor(subTotalServices * ((Number(discountPer) || 0) / 100));
  const totalService = formatValue(subTotalServices - serviceDiscount || 0);
  const serviceGst = gstApplied ? formatValue(totalService * 0.05) : 0;
  const serviceTotal = Math.round(totalService + serviceGst);
  const productTotal = products.reduce(
    (acc, p) => acc + (Number(p.price) || 0) * (Number(p.quantity) || 0),
    0
  );
  const total = Math.round(serviceTotal + productTotal);

  const otherPayments = [
    { name: "Membership Used", amount: appointment.membershipCreditUsed || 0 },
    { name: "Advance Used", amount: appointment.advanceUsed || 0 },
    { name: "Cashback Used", amount: appointment.cashbackUsed || 0 },
  ].filter((m) => m.amount > 0);
  const paid =
    payments.reduce((acc, m) => acc + (Number(m.amount) || 0), 0) +
    otherPayments.reduce((acc, m) => acc + m.amount, 0);
  const remaining = formatValue(total - paid);

  const handleSave = () => {
    if (!customerName.trim()) return toast.error("Client name is required");
    if (services.some((s) => !String(s[s.nameKey] || "").trim())) {
      return toast.error("Every service needs a name");
    }
    if ([...services, ...products].some((r) => r.price === "" || !(Number(r.price) >= 0))) {
      return toast.error("Enter a valid price for every item");
    }
    const discount = Number(discountPer);
    if (!(discount >= 0 && discount <= 100)) return toast.error("Discount must be between 0 and 100%");
    if (payments.some((m) => !(Number(m.amount) >= 0))) return toast.error("Payment amounts can't be negative");
    if (Math.abs(remaining) > 0.01) {
      return toast.error(
        remaining > 0
          ? `₹${remaining} of the bill isn't assigned to a payment method`
          : `Payments are ₹${-remaining} more than the bill`
      );
    }

    const split = handleProductAndServiceGst(totalService, products, appointment.appointmentDate);
    const data = {
      id: appointment._id,
      customerName: customerName.trim(),
      services: services.map(({ nameKey, ...s }) => ({ ...s, price: Number(s.price) })),
      products: split.updatedProducts.map((p) => ({ ...p, price: Number(p.price) })),
      subTotal: subTotalServices,
      discount: serviceDiscount,
      discountPercentage: discount,
      serviceSubTotal: split.serviceSubTotal || 0,
      serviceGst: split.serviceGst || 0,
      serviceTotal: split.serviceTotal || 0,
      productGst: split.productGstTotal || 0,
      productSubTotal: split.productBaseAmountTotal || 0,
      productTotal: split.productTotal || 0,
      total,
      paymentMethod: payments.map((m) => ({ name: m.name, amount: Number(m.amount) || 0 })),
    };

    setSaving(true);
    postApiData(
      "appointment/editAppointmentBill",
      data,
      () => {
        setSaving(false);
        toast.success("Bill updated");
        onSaved?.();
      },
      (error) => {
        setSaving(false);
        toast.error(error?.response?.data?.message || "Could not update the bill");
      }
    );
  };

  const renderStaffSelect = (value, onChange) => (
    <select className={inputClass} value={value || ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">Choose staff</option>
      {staffOptions.map((s) => (
        <option key={s._id} value={s._id}>
          {s.name}
        </option>
      ))}
    </select>
  );

  const summary = [
    { label: "Services", value: formatValue(subTotalServices) },
    { label: "Discount", value: serviceDiscount, minus: true },
    gstApplied && { label: "Service GST", value: formatValue(serviceGst) },
    { label: "Service Total", value: serviceTotal },
    products.length > 0 && { label: "Products", value: formatValue(productTotal) },
    { label: "Bill Total", value: total, strong: true },
  ].filter(Boolean);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={saving ? undefined : onClose}
      className="w-[92%] sm:w-[85%] lg:w-[70%] relative top-[5%] z-30 mx-auto"
      contentLabel="Edit Bill"
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
        <h1 className="text-2xl text-black text-start">Edit Bill</h1>
        <p className="text-sm text-gray-500">
          {appointment.invoiceId ? `Invoice ${appointment.invoiceId} · ` : ""}
          {formatDateToFull(appointment.appointmentDate)}
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Client Name</span>
          <input className={inputClass} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Mobile No.</span>
          <input className={inputClass} value={appointment.customer?.phoneNumber || ""} disabled />
        </label>
      </section>

      <h2 className="text-start text-base font-semibold text-black mb-2">Services</h2>
      <div className="flex flex-col gap-3 mb-6">
        {services.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)] gap-2 rounded-xl border border-gray-200 p-3"
          >
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Service</span>
              <input
                className={inputClass}
                value={row[row.nameKey] || ""}
                onChange={(e) => updateService(i, { [row.nameKey]: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Staff</span>
              {renderStaffSelect(row.staffId, (id) => updateService(i, staffPatch(id)))}
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Price</span>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={row.price}
                onChange={(e) => updateService(i, { price: e.target.value })}
              />
            </label>
          </div>
        ))}
      </div>

      {products.length > 0 && (
        <>
          <h2 className="text-start text-base font-semibold text-black mb-1">Products</h2>
          <p className="text-xs text-gray-500 mb-2">
            Quantity is locked because stock was already deducted when the bill was completed.
          </p>
          <div className="flex flex-col gap-3 mb-6">
            {products.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,0.7fr)_minmax(0,1.5fr)_minmax(0,1fr)] gap-2 rounded-xl border border-gray-200 p-3"
              >
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Product</span>
                  <input className={inputClass} value={row.name || ""} disabled />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Qty</span>
                  <input className={inputClass} value={row.quantity ?? ""} disabled />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Staff</span>
                  {renderStaffSelect(row.staffId, (id) => updateProduct(i, staffPatch(id)))}
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Price (each)</span>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={row.price}
                    onChange={(e) => updateProduct(i, { price: e.target.value })}
                  />
                </label>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <section>
          <label className="flex flex-col gap-1 mb-4 max-w-[200px]">
            <span className={labelClass}>Service Discount (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              className={inputClass}
              value={discountPer}
              onChange={(e) => setDiscountPer(e.target.value)}
            />
          </label>
          <dl className="rounded-xl bg-gray-50 p-4 text-sm flex flex-col gap-2">
            {summary.map((row) => (
              <div key={row.label} className={`flex justify-between ${row.strong ? "font-semibold text-black border-t border-gray-200 pt-2" : "text-gray-700"}`}>
                <dt>{row.label}</dt>
                <dd>{row.minus ? "− " : ""}₹{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-start text-base font-semibold text-black mb-2">Payment</h2>
          <div className="grid grid-cols-2 gap-2">
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
          {otherPayments.length > 0 && (
            <ul className="mt-3 text-xs text-gray-500 flex flex-col gap-1">
              {otherPayments.map((m) => (
                <li key={m.name} className="flex justify-between">
                  <span>{m.name} (not editable here)</span>
                  <span>₹{m.amount}</span>
                </li>
              ))}
            </ul>
          )}
          <p
            className={`mt-3 text-sm font-medium ${Math.abs(remaining) > 0.01 ? "text-red-600" : "text-secondaryGreen"}`}
            aria-live="polite"
          >
            {Math.abs(remaining) <= 0.01
              ? "Payments match the bill total"
              : remaining > 0
              ? `₹${remaining} still to assign`
              : `₹${-remaining} more than the bill`}
          </p>
        </section>
      </div>

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
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
};

export default EditBillModal;
