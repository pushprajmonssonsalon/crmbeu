import { useEffect, useMemo, useRef, useState } from "react";
import {
  MdAdd,
  MdCallSplit,
  MdClose,
  MdDeleteOutline,
  MdOutlineReceiptLong,
  MdSearch,
} from "react-icons/md";
import { formatValue, getBirthDayAndAnniversary, getDayOfToday } from "../../utils/services";

// The pieces the booking screen (NewBookAppointment.js) and the edit screen
// (EditAppointmentSalon/EditAppointment.js) share, so a bill looks and adds up
// the same in both: cart rows, the tick-to-add picker, the totals maths and
// the membership discount rule.

export const GST_OPTIONS = [18, 5];
// One shared empty list, so a missing cart or catalogue does not hand memos a
// new array (and a recompute) on every render.
export const NONE = [];

// Catalogue services carry a uniqueCode; cart lines are spread from them, so
// the same key identifies both.
export const serviceKey = (s) =>
  String(
    s?.uniqueCode ??
    s?.serviceId ??
    `${s?.category}|${s?.subCategory}|${s?.name ?? s?.miniSubcategory}`
  );
// Catalogue products have an itemId but no _id.
export const productKey = (p) => String(p?.itemId ?? p?._id ?? p?.name);

// Same fallback price the old screens used for a catalogue item without one.
export const toPrice = (v) => (isNaN(parseInt(v)) ? 1999 : parseInt(v));

// Empty while the field is being retyped counts as 1.
export const lineQty = (line) => Math.max(1, parseInt(line?.quantity) || 1);

export const rupees = (n) =>
  `₹${(Number(n) || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export const serviceLineInvalid = (l) => !l.staffId || !Number(l.price);
export const productLineInvalid = (l) =>
  !l.staffId || !Number(l.price) || !Number(l.quantity) || !l.gst;

export const withStaff = (staff) => ({
  staffId: staff?._id || "",
  staffName: staff?.name || "",
});

// New cart lines for a catalogue service or product, going to `staff`.
export const newServiceLine = (s, staff) => ({
  ...s,
  miniSubcategory: s.name,
  price: toPrice(s.price),
  quantity: 1,
  ...withStaff(staff),
});
export const newProductLine = (p, staff) => ({
  ...p,
  price: toPrice(p.price),
  quantity: 1,
  gst: p?.gst || 18,
  ...withStaff(staff),
});

// How many units of each item the cart holds, by key: a line counts its Qty,
// and the same item can sit on several lines.
export const unitsByKey = (lines, keyOf) => {
  const units = new Map();
  lines.forEach((l) => units.set(keyOf(l), (units.get(keyOf(l)) || 0) + lineQty(l)));
  return units;
};

// A line can name someone who has since left; keep them selectable for it.
export const staffOptionsFor = (staffData, line) => {
  const known = staffData.some((s) => s._id === line.staffId);
  return [
    ...(line.staffId && !known ? [{ _id: line.staffId, name: line.staffName || "Staff" }] : []),
    ...staffData,
  ];
};

// The bill maths both old screens used: a % discount on services only, 5%
// service GST when the salon charges it, products at price x quantity.
// `serviceUnits` says how many units a service line stands for.
export const computeTotals = ({ services, products, discount, gstApplied, serviceUnits = lineQty }) => {
  const discountPct = Math.min(Math.max(Number(discount) || 0, 0), 100);
  const serviceSubtotal = services.reduce(
    (sum, l) => sum + (Number(l.price) || 0) * serviceUnits(l),
    0
  );
  const discountAmount = Math.floor((serviceSubtotal * discountPct) / 100);
  const servicePayable = formatValue(serviceSubtotal - discountAmount);
  const serviceGst = gstApplied ? formatValue(servicePayable * 0.05) : 0;
  const serviceTotal = Math.round(servicePayable + serviceGst);
  const productSubtotal = products.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0),
    0
  );
  const totalPayable = Math.round(serviceTotal + productSubtotal);
  return {
    discountPct,
    serviceSubtotal,
    discountAmount,
    servicePayable,
    serviceGst,
    serviceTotal,
    productSubtotal,
    totalPayable,
  };
};

export const summaryRowsFor = (t, { gstApplied, hasProducts }) =>
  [
    { label: "Services", value: rupees(t.serviceSubtotal) },
    t.discountAmount > 0 && { label: `Discount (${t.discountPct}%)`, value: `− ${rupees(t.discountAmount)}` },
    t.discountAmount > 0 && { label: "Subtotal", value: rupees(t.servicePayable) },
    gstApplied && { label: "Service GST", value: rupees(t.serviceGst) },
    hasProducts && { label: "Service total", value: rupees(t.serviceTotal) },
    hasProducts && { label: "Products", value: rupees(t.productSubtotal) },
  ].filter(Boolean);

// The discount % to use once membership `m` is applied, or undefined to leave
// the current one. Daily/birthday/anniversary memberships take the best of
// those; flat ones set their own; switching off a flat one clears it.
export const membershipDiscount = (m, { current, previous, dob, aniversary }) => {
  if (Object.prototype.hasOwnProperty.call(m, "dailyDiscount")) {
    const today = Math.max(Number(current) || 0, m.dailyDiscount?.[`${getDayOfToday()}`] || 0);
    const { hasBirthday, hasAnniversary } = getBirthDayAndAnniversary(dob, aniversary);
    return Math.max(
      today,
      (hasBirthday ? m.bdDiscount : 0) || 0,
      (hasAnniversary ? m.anvDiscount : 0) || 0,
      Number(current) || 0
    );
  }
  if (m.discount) return m.discount;
  if (previous?.discount) return 0;
  return undefined;
};

// Shared class strings. pages/login/login.css is bundled app-wide and styles
// bare elements: `button { padding: 10px; color: white; background:
// transparent }`, `input, select { padding: 10px }` and `h2 { text-align:
// center }`. So every button sets its own padding, colour and radius, every
// field its own vertical padding (py-0, or a 36px select clips its text), and
// headings their own alignment.
export const CARD = "rounded-[10px] border border-lightGray bg-white shadow-tab";
export const LABEL = "mb-1 block text-xs font-medium text-secondary";
export const CONTROL =
  "h-10 w-full rounded-lg border border-primaryGray bg-white px-3 py-0 text-sm text-gray2 outline-none transition-colors focus:border-ternary focus:ring-2 focus:ring-ternary/20 disabled:bg-secondaryGray";
const CELL =
  "h-9 w-full rounded-md border bg-white px-2 py-0 text-sm text-gray2 outline-none focus:border-ternary focus:ring-2 focus:ring-ternary/20 disabled:bg-secondaryGray disabled:text-secondary";
// Only products carry a GST pick, so the GST column exists only while the
// cart has a product in it.
const rowGrid = (showGst) =>
  showGst
    ? "grid grid-cols-6 gap-x-2 gap-y-2 md:grid-cols-[minmax(0,1fr)_176px_64px_96px_72px_88px_36px]"
    : "grid grid-cols-6 gap-x-2 gap-y-2 md:grid-cols-[minmax(0,1fr)_176px_64px_96px_88px_36px]";

// ---- splitting a service between staff ----
// A split line carries staffSplit: [{ staffId, staffName, share }], the line's
// own (main) staff first, shares as fractions adding up to 1, and splitMode
// ("amount" or "percent") for how it was entered. The main staff is the one
// on the bill and invoice; the backend's staff reports credit each person
// their share (and count the service once for each).

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const round6 = (n) => Math.round((Number(n) || 0) * 1e6) / 1e6;

// Sets a line's split from { mode, entries }, or drops it (null, or < 2 people).
const withSplit = (line, split) => {
  const { staffSplit, splitMode, ...rest } = line;
  if (!split || split.entries.length < 2) return rest;
  return { ...rest, staffSplit: split.entries, splitMode: split.mode };
};

// After a line's main staff changes, the new person takes over the main
// share, plus their own share if they were already in the split.
const repointSplit = (next, prev) => {
  if (!prev.staffSplit) return next;
  if (!next.staffId) return withSplit(next, null);
  const [main, ...others] = prev.staffSplit;
  const own = others.find((c) => c.staffId === next.staffId);
  return withSplit(next, {
    mode: prev.splitMode,
    entries: [
      { staffId: next.staffId, staffName: next.staffName, share: round6(main.share + (own?.share || 0)) },
      ...others.filter((c) => c.staffId !== next.staffId),
    ],
  });
};

const splitSummary = (line, lineTotal) =>
  (line.staffSplit || [])
    .map((c) => `${(c.staffName || "Staff").split(" ")[0]} ${rupees(round2(c.share * lineTotal))}`)
    .join(" · ");

// The cart: a header and one row per line, or a hint when it is empty.
// onDuplicateService switches service rows from a Qty field to one unit per
// row with a "+" that adds another row of the same service (the edit screen,
// where each row can get its own staff). servicesLocked disables service rows.
export const CartItems = ({
  services,
  products,
  staffData,
  showErrors,
  onLineChange,
  onRemove,
  onDuplicateService,
  servicesLocked = false,
  emptyHint = "Tick services or products below to add them here",
}) => {
  // The service row whose split dialog is open.
  const [splitIndex, setSplitIndex] = useState(null);
  if (services.length + products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
        <MdOutlineReceiptLong className="h-8 w-8 text-ternaryGray" />
        <p className="text-sm text-secondary">{emptyHint}</p>
      </div>
    );
  }
  const showGst = products.length > 0;
  // Edit-screen rows are one unit each; booking rows carry a Qty.
  const unitsOf = (line) => (onDuplicateService ? 1 : lineQty(line));
  const splitting = splitIndex === null ? null : services[splitIndex];
  return (
    <>
      <div
        className={`${rowGrid(showGst)} hidden border-b border-lightGray px-1 pb-2 text-xs font-medium uppercase tracking-wide text-ternaryGray md:grid`}
      >
        <span>Item</span>
        <span>Staff</span>
        <span>Qty</span>
        <span>Price</span>
        {showGst && <span>GST</span>}
        <span className="text-right">Total</span>
        <span />
      </div>
      <ul className="divide-y divide-lightGray">
        {services.map((line, index) => (
          <CartRow
            key={`s-${serviceKey(line)}-${index}`}
            kind="service"
            line={line}
            showGst={showGst}
            disabled={servicesLocked}
            staffOptions={staffOptionsFor(staffData, line)}
            invalid={showErrors && serviceLineInvalid(line)}
            onChange={(field, value) => onLineChange("service", index, field, value)}
            onRemove={() => onRemove("service", index)}
            onDuplicate={onDuplicateService && (() => onDuplicateService(index))}
            onSplit={() => setSplitIndex(index)}
          />
        ))}
        {products.map((line, index) => (
          <CartRow
            key={`p-${productKey(line)}-${index}`}
            kind="product"
            line={line}
            showGst={showGst}
            staffOptions={staffOptionsFor(staffData, line)}
            invalid={showErrors && productLineInvalid(line)}
            onChange={(field, value) => onLineChange("product", index, field, value)}
            onRemove={() => onRemove("product", index)}
          />
        ))}
      </ul>
      {splitting && (
        <SplitDialog
          line={splitting}
          units={unitsOf(splitting)}
          staffData={staffData}
          onSave={(split) => {
            onLineChange("service", splitIndex, "split", split);
            setSplitIndex(null);
          }}
          onClose={() => setSplitIndex(null)}
        />
      )}
    </>
  );
};

const CartRow = ({
  kind,
  line,
  showGst,
  disabled = false,
  staffOptions,
  invalid,
  onChange,
  onRemove,
  onDuplicate,
  onSplit,
}) => {
  const isService = kind === "service";
  const perRowUnit = isService && onDuplicate;
  const qty = perRowUnit ? 1 : isService ? lineQty(line) : Number(line.quantity) || 0;
  const lineTotal = (Number(line.price) || 0) * qty;
  const name = isService ? line.miniSubcategory || line.name : line.name;
  const subtitle = isService
    ? [line.category, line.subCategory].filter(Boolean).join(" · ")
    : line.brand;
  const bad = (cond) => (invalid && cond ? "border-red-500" : "border-primaryGray");

  return (
    <li className={`${rowGrid(showGst)} items-center px-1 py-3 ${disabled ? "opacity-60" : ""}`}>
      <div className="col-span-5 min-w-0 md:col-span-1">
        <p className="truncate text-sm font-medium capitalize text-gray2" title={name}>
          {name}
        </p>
        <p className="truncate text-xs text-secondary">
          {!isService && (
            <span className="mr-1 rounded bg-ternary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-ternary">
              Product
            </span>
          )}
          {subtitle}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${name}`}
        className="col-span-1 grid h-9 w-9 place-items-center justify-self-end rounded-full bg-transparent p-0 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:hover:bg-transparent md:order-last md:col-span-1"
      >
        <MdDeleteOutline className="h-5 w-5" />
      </button>
      <div className="col-span-6 min-w-0 md:col-span-1">
        <div className="flex items-center gap-1">
          <select
            aria-label="Staff"
            value={line.staffId || ""}
            disabled={disabled}
            onChange={(e) => onChange("staff", e.target.value)}
            className={`${CELL} min-w-0 flex-1 ${bad(!line.staffId)}`}
          >
            <option value="">Select Staff</option>
            {staffOptions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          {isService && onSplit && (
            <button
              type="button"
              onClick={onSplit}
              disabled={disabled || !line.staffId || !Number(line.price)}
              aria-haspopup="dialog"
              aria-label={`${line.staffSplit ? "Change split of" : "Split"} ${name} between staff`}
              title={line.staffId ? "Split between staff" : "Pick a staff member first"}
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border p-0 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${line.staffSplit
                ? "border-ternary bg-ternary text-white hover:bg-ternary/90"
                : "border-primaryGray bg-white text-ternary hover:bg-ternary/10"
                }`}
            >
              <MdCallSplit className="h-4 w-4" />
            </button>
          )}
        </div>
        {isService && line.staffSplit && (
          <p className="mt-1 truncate text-[11px] text-ternary" title={splitSummary(line, lineTotal)}>
            Split: {splitSummary(line, lineTotal)}
          </p>
        )}
      </div>
      {perRowUnit ? (
        <div className="col-span-2 md:col-span-1">
          <span className="text-[11px] text-secondary md:hidden">Qty</span>
          <div className="flex h-9 items-center gap-1.5">
            <span className="w-4 text-center text-sm text-gray2">1</span>
            <button
              type="button"
              onClick={onDuplicate}
              disabled={disabled}
              aria-label={`Add another ${name}`}
              title="Add another of this service (it can have its own staff)"
              className="grid h-8 w-8 place-items-center rounded-md border border-primaryGray bg-white p-0 text-ternary hover:bg-ternary/10 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <MdAdd className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <label className="col-span-2 md:col-span-1">
          <span className="text-[11px] text-secondary md:hidden">Qty</span>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            aria-label="Qty"
            value={line.quantity ?? 1}
            disabled={disabled}
            onChange={(e) => onChange("quantity", e.target.value)}
            onBlur={() => line.quantity === "" && onChange("quantity", "1")}
            className={`${CELL} ${bad(!isService && !Number(line.quantity))}`}
          />
        </label>
      )}
      <label className="col-span-2 md:col-span-1">
        <span className="text-[11px] text-secondary md:hidden">Price</span>
        <input
          type="number"
          min={0}
          inputMode="decimal"
          aria-label="Price"
          value={line.price}
          disabled={disabled}
          onChange={(e) => onChange("price", e.target.value)}
          className={`${CELL} ${bad(!Number(line.price))}`}
        />
      </label>
      {isService ? (
        showGst && <span className="hidden text-sm text-ternaryGray md:block">—</span>
      ) : (
        <label className="col-span-2 md:col-span-1">
          <span className="text-[11px] text-secondary md:hidden">GST</span>
          <select
            aria-label="GST"
            value={line.gst}
            onChange={(e) => onChange("gst", e.target.value)}
            className={`${CELL} ${bad(!line.gst)}`}
          >
            {GST_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}%
              </option>
            ))}
          </select>
        </label>
      )}
      <p
        className={`text-right text-sm font-semibold text-gray2 md:col-span-1 ${isService ? "col-span-2 self-end pb-2 md:self-auto md:pb-0" : "col-span-6"
          }`}
      >
        {rupees(lineTotal)}
      </p>
    </li>
  );
};

// Applies a cart edit to a list of lines. Returns the new list.
export const editLine = (lines, index, field, value, staffData) =>
  lines.map((l, i) => {
    if (i !== index) return l;
    if (field === "staff") {
      return repointSplit({ ...l, ...withStaff(staffData.find((s) => s._id === value)) }, l);
    }
    if (field === "split") return withSplit(l, value);
    if (field === "quantity") {
      return { ...l, quantity: value === "" ? "" : Math.max(1, parseInt(value) || 1) };
    }
    if (field === "price") return { ...l, price: value === "" ? "" : Math.max(0, +value) };
    if (field === "gst") return { ...l, gst: +value };
    return l;
  });

// Service/Product picker: type, staff for newly ticked items, search, a
// Women/Men filter, and a tick list. `serviceCount(s)` / `productCount(p)` is
// how many units the cart holds (ticked when any; more than one shows "×n").
// Unticking removes the item from the cart; "Add again" on a ticked item adds
// it once more as a separate line, so it can get its own staff.
// `servicesLocked` is a message shown instead of the service list.
export const ItemPicker = ({
  services,
  products,
  loading,
  staffData,
  staffId,
  onStaffChange,
  gender,
  onGenderChange,
  serviceCount,
  productCount,
  onToggleService,
  onToggleProduct,
  onAddServiceAgain,
  onAddProductAgain,
  servicesLocked,
}) => {
  const [type, setType] = useState("service");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const pickerStaff = staffData.find((s) => s._id === staffId);

  const servicesMatching = useMemo(() => {
    const has = (...fields) => !q || fields.some((f) => String(f || "").toLowerCase().includes(q));
    return services.filter((s) => has(s.name, s.category, s.subCategory));
  }, [services, q]);
  const visibleServices = useMemo(
    () => servicesMatching.filter((s) => !s.gender || s.gender === gender),
    [servicesMatching, gender]
  );
  const otherGenderCount = servicesMatching.length - visibleServices.length;

  const serviceGroups = useMemo(() => {
    const groups = new Map();
    visibleServices.forEach((s) => {
      const key = s.category || "Other";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(s);
    });
    return [...groups.entries()];
  }, [visibleServices]);

  const visibleProducts = useMemo(() => {
    const has = (...fields) => !q || fields.some((f) => String(f || "").toLowerCase().includes(q));
    return products.filter((p) => has(p.name, p.brand));
  }, [products, q]);

  let list;
  if (loading && services.length === 0 && products.length === 0) {
    list = <p className="px-3 py-6 text-center text-sm text-secondary">Loading…</p>;
  } else if (type === "service" && servicesLocked) {
    list = <p className="px-3 py-6 text-center text-sm text-secondary">{servicesLocked}</p>;
  } else if (type === "service") {
    list =
      serviceGroups.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-3 py-6 text-center text-sm text-secondary">
          <span>No {gender === "F" ? "women's" : "men's"} services match.</span>
          {otherGenderCount > 0 && (
            <button
              type="button"
              onClick={() => onGenderChange(gender === "F" ? "M" : "F")}
              className="rounded-md bg-transparent px-2 py-1 font-medium text-ternary hover:bg-ternary/10"
            >
              Show {otherGenderCount} in {gender === "F" ? "Men" : "Women"}
            </button>
          )}
        </div>
      ) : (
        serviceGroups.map(([category, items]) => (
          <div key={category}>
            <p className="sticky top-0 z-[1] border-b border-lightGray bg-secondaryGray px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary">
              {category} <span className="font-normal">({items.length})</span>
            </p>
            {items.map((s) => {
              const count = serviceCount(s);
              return (
                <PickRow
                  key={serviceKey(s)}
                  checked={count > 0}
                  count={count}
                  title={s.name}
                  subtitle={s.subCategory}
                  price={toPrice(s.price)}
                  onToggle={() => onToggleService(s)}
                  onAddAgain={() => onAddServiceAgain(s)}
                />
              );
            })}
          </div>
        ))
      );
  } else {
    list =
      visibleProducts.length === 0 ? (
        <p className="px-3 py-6 text-center text-sm text-secondary">No products match.</p>
      ) : (
        visibleProducts.map((p) => {
          const count = productCount(p);
          return (
            <PickRow
              key={productKey(p)}
              checked={count > 0}
              count={count}
              title={p.name}
              subtitle={p.brand}
              price={toPrice(p.price)}
              onToggle={() => onToggleProduct(p)}
              onAddAgain={() => onAddProductAgain(p)}
            />
          );
        })
      );
  }

  return (
    <section className={`${CARD} p-4`}>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="grid grid-cols-2 gap-2 lg:flex">
          <select
            aria-label="Item type"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setQuery("");
            }}
            className={`${CONTROL} lg:w-32`}
          >
            <option value="service">Service</option>
            <option value="product">Product</option>
          </select>
          <select
            aria-label="Staff for ticked items"
            value={staffId}
            onChange={(e) => onStaffChange(e.target.value)}
            className={`${CONTROL} lg:w-44`}
          >
            <option value="">Select Staff</option>
            {staffData.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative min-w-0 flex-1">
          <MdSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ternaryGray" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={type === "service" ? "Search services or categories" : "Search products or brands"}
            className={`${CONTROL} pl-10`}
          />
        </div>
        {type === "service" && (
          <div
            role="group"
            aria-label="Show services for"
            className="inline-flex h-10 shrink-0 self-start overflow-hidden rounded-lg border border-primaryGray lg:self-auto"
          >
            {[
              ["F", "Women"],
              ["M", "Men"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={gender === value}
                onClick={() => onGenderChange(value)}
                className={`rounded-none px-4 py-0 text-sm font-medium transition-colors ${gender === value ? "bg-ternary text-white" : "bg-white text-gray2 hover:bg-secondaryGray"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-secondary">
        Ticked items go to{" "}
        <span className="font-medium text-gray2">{pickerStaff?.name || "no staff yet"}</span>
        {!pickerStaff && " (pick one above, or per row in the cart)"}
      </p>

      <div className="mt-2 max-h-[50vh] overflow-y-auto rounded-lg border border-lightGray xl:max-h-[440px]">
        {list}
      </div>
    </section>
  );
};

// A button inside a <label> does not toggle the label's checkbox (it is
// interactive content), so "Add again" can sit in the row.
const PickRow = ({ checked, count = 0, title, subtitle, price, onToggle, onAddAgain }) => (
  <label
    className={`flex cursor-pointer items-center gap-2 border-b border-lightGray/70 px-3 py-2.5 last:border-b-0 sm:gap-3 ${checked ? "bg-ternary/5" : "bg-white hover:bg-secondaryGray/60"
      }`}
  >
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm capitalize text-gray2">{title}</span>
      {subtitle && <span className="block truncate text-xs text-secondary">{subtitle}</span>}
    </span>
    {checked && (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onAddAgain();
        }}
        aria-label={`Add ${title} again`}
        title="Add again as a separate line (it can have its own staff)"
        className="flex h-7 shrink-0 items-center gap-0.5 rounded-md border border-ternary/40 bg-white px-1.5 py-0 text-xs font-medium text-ternary hover:bg-ternary/10 sm:px-2"
      >
        <MdAdd className="h-4 w-4" />
        <span className="hidden sm:inline">Add again</span>
      </button>
    )}
    {count > 1 && (
      <span className="shrink-0 rounded bg-ternary/10 px-1.5 py-0.5 text-xs font-semibold text-ternary">
        ×{count}
      </span>
    )}
    <span className="shrink-0 text-sm font-medium text-gray2">{rupees(price)}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-ternary"
    />
  </label>
);

// Summary lines, the payable total and any membership credit taken.
export const TotalsList = ({ rows, totalPayable, creditUsed }) => (
  <>
    <dl className="mt-4 space-y-1.5 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3">
          <dt className="text-secondary">{row.label}</dt>
          <dd className="font-medium text-gray2">{row.value}</dd>
        </div>
      ))}
    </dl>
    <div className="mt-3 flex items-baseline justify-between border-t border-lightGray pt-3">
      <span className="font-semibold text-gray2">Payable</span>
      <span className="text-xl font-bold text-ternary">{rupees(totalPayable)}</span>
    </div>
    {creditUsed > 0 && (
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="text-secondary">Membership credit used</span>
        <span className="font-medium text-secondaryGreen">− {rupees(creditUsed)}</span>
      </div>
    )}
  </>
);

// Below xl the summary sits under the picker, so the total and the action
// ride along at the bottom of the screen instead. The negative margins match
// Layout's page padding so the bar spans edge to edge.
export const MobileTotalBar = ({ itemCount, totalPayable, children }) => (
  <div className="sticky bottom-0 z-20 -mx-3 mt-4 flex items-center justify-between gap-3 border-t border-lightGray bg-white/95 px-3 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur md:-mx-6 md:px-6 xl:hidden">
    <div className="min-w-0">
      <p className="text-xs text-secondary">
        Payable · {itemCount} item{itemCount === 1 ? "" : "s"}
      </p>
      <p className="text-lg font-bold text-gray2">{rupees(totalPayable)}</p>
    </div>
    {children}
  </div>
);

// Ding-style "split between staff" dialog for one service line. The main
// staff (the line's own) keeps whatever the others don't take; amounts are
// entered against the line total (price x Qty) or as percentages. Saves
// { mode, entries: [{ staffId, staffName, share }] } or null to remove.
const SplitDialog = ({ line, units, staffData, onSave, onClose }) => {
  const name = line.miniSubcategory || line.name;
  const lineTotal = (Number(line.price) || 0) * units;
  const main = { staffId: line.staffId, staffName: line.staffName };
  const storedNames = new Map((line.staffSplit || []).map((c) => [c.staffId, c.staffName]));
  const startMode = line.splitMode === "percent" ? "percent" : "amount";

  const [mode, setMode] = useState(startMode);
  const [rows, setRows] = useState(() => {
    const others = (line.staffSplit || []).slice(1);
    if (others.length === 0) return [{ staffId: "", value: "" }];
    const whole = startMode === "amount" ? lineTotal : 100;
    return others.map((c) => ({ staffId: c.staffId, value: String(round2(c.share * whole)) }));
  });
  const [tried, setTried] = useState(false);

  // Escape closes; the first field gets focus once, on open.
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector("select:not([disabled]), input")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const whole = mode === "amount" ? lineTotal : 100;
  const show = (n) => (mode === "amount" ? rupees(round2(n)) : `${round2(n)}%`);
  const asRupees = (n) => rupees(round2(mode === "amount" ? n : (n * lineTotal) / 100));
  const othersTotal = rows.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
  const mainValue = round2(whole - othersTotal);

  let error = "";
  const seen = new Set([main.staffId]);
  for (const r of rows) {
    if (!r.staffId) {
      error = "Choose a staff member on each line.";
      break;
    }
    if (seen.has(r.staffId)) {
      error = "Each staff member can appear only once.";
      break;
    }
    seen.add(r.staffId);
    if (!(Number(r.value) > 0)) {
      error = `Enter ${mode === "amount" ? "an amount" : "a percentage"} for each staff member.`;
      break;
    }
  }
  if (!error && mainValue <= 0) {
    error = `${main.staffName || "The main staff"} must keep a part: the others add up to ${show(othersTotal)} of ${show(whole)}.`;
  }

  const optionsFor = (i) => {
    const taken = new Set([main.staffId, ...rows.filter((_, j) => j !== i).map((r) => r.staffId)]);
    const list = staffData.filter((s) => !taken.has(s._id));
    const current = rows[i].staffId;
    if (current && !staffData.some((s) => s._id === current)) {
      list.unshift({ _id: current, name: storedNames.get(current) || "Staff" });
    }
    return list;
  };
  const canAddRow = staffData.some(
    (s) => s._id !== main.staffId && !rows.some((r) => r.staffId === s._id)
  );

  const setRow = (i, patch) => setRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const switchMode = (next) => {
    if (next === mode) return;
    setRows((prev) =>
      prev.map((r) =>
        r.value === ""
          ? r
          : {
            ...r,
            value: String(
              round2(next === "percent" ? (Number(r.value) / lineTotal) * 100 : (Number(r.value) * lineTotal) / 100)
            ),
          }
      )
    );
    setMode(next);
  };

  const save = () => {
    setTried(true);
    if (error) return;
    const others = rows.map((r) => ({
      staffId: r.staffId,
      staffName: staffData.find((s) => s._id === r.staffId)?.name || storedNames.get(r.staffId) || "",
      share: round6(Number(r.value) / whole),
    }));
    const mainShare = round6(1 - others.reduce((sum, c) => sum + c.share, 0));
    onSave({ mode, entries: [{ ...main, share: mainShare }, ...others] });
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="split-title"
        className="max-h-[calc(100dvh-1rem)] w-full overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl sm:max-w-lg sm:rounded-2xl sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="split-title" className="text-left text-lg font-semibold text-gray2">
              Split between staff
            </h2>
            <p className="mt-0.5 text-sm text-secondary">
              <span className="font-medium capitalize text-gray2">{name}</span> · {rupees(lineTotal)}
              {units > 1 && ` (${units} × ${rupees(line.price)}, each split the same way)`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-transparent p-0 text-secondary hover:bg-black/5"
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm text-secondary">Split by</span>
          <div role="group" aria-label="Split by" className="inline-flex h-9 overflow-hidden rounded-lg border border-primaryGray">
            {[
              ["amount", "Amount ₹"],
              ["percent", "Percent %"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={mode === value}
                onClick={() => switchMode(value)}
                className={`rounded-none px-3 py-0 text-sm font-medium ${mode === value ? "bg-ternary text-white" : "bg-white text-gray2 hover:bg-secondaryGray"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-3 space-y-2">
          <li className="flex items-center gap-2 rounded-lg bg-secondaryGray/60 px-3 py-2">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-gray2">{main.staffName || "Main staff"}</span>
              <span className="block text-xs text-secondary">Main staff · keeps the rest</span>
            </span>
            <span className={`shrink-0 text-sm font-semibold ${mainValue > 0 ? "text-gray2" : "text-red-600"}`}>
              {show(mainValue)}
            </span>
          </li>
          {rows.map((r, i) => (
            <li key={i} className="flex items-center gap-2">
              <select
                aria-label={`Staff ${i + 2}`}
                value={r.staffId}
                onChange={(e) => setRow(i, { staffId: e.target.value })}
                className={`${CONTROL} min-w-0 flex-1 ${tried && !r.staffId ? "border-red-500" : ""}`}
              >
                <option value="">Select Staff</option>
                {optionsFor(i).map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="relative w-28 shrink-0">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-secondary">
                  {mode === "amount" ? "₹" : "%"}
                </span>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  aria-label={`${mode === "amount" ? "Amount" : "Percent"} for staff ${i + 2}`}
                  value={r.value}
                  onChange={(e) => setRow(i, { value: e.target.value })}
                  className={`${CONTROL} pl-7 ${tried && !(Number(r.value) > 0) ? "border-red-500" : ""}`}
                />
              </div>
              <button
                type="button"
                onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                aria-label={`Remove staff ${i + 2}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-transparent p-0 text-red-600 hover:bg-red-50"
              >
                <MdClose className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, { staffId: "", value: "" }])}
          disabled={!canAddRow}
          className="mt-2 flex items-center gap-1 rounded-md bg-transparent px-2 py-1 text-sm font-medium text-ternary hover:bg-ternary/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MdAdd className="h-4 w-4" /> Add staff
        </button>

        {error ? (
          tried && <p className="mt-3 text-sm text-red-600">{error}</p>
        ) : (
          <p className="mt-3 text-sm text-secondary">
            Credited: {main.staffName} {asRupees(mainValue)}
            {rows.map((r) => ` · ${staffData.find((s) => s._id === r.staffId)?.name || storedNames.get(r.staffId)} ${asRupees(Number(r.value))}`)}
          </p>
        )}
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          The bill and invoice show {main.staffName || "the main staff"}. The split only changes how this
          service is credited in staff reports, any bill discount comes off each share in proportion.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          {line.staffSplit && (
            <button
              type="button"
              onClick={() => onSave(null)}
              className="mr-auto rounded-lg bg-transparent px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Remove split
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-primaryGray bg-white px-4 py-2 text-sm font-medium text-gray2 hover:bg-secondaryGray"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-ternary px-5 py-2 text-sm font-semibold text-white hover:bg-ternary/90"
          >
            Save split
          </button>
        </div>
      </div>
    </div>
  );
};
