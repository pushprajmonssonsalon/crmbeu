import { useMemo, useState } from "react";
import { MdAdd, MdDeleteOutline, MdOutlineReceiptLong, MdSearch } from "react-icons/md";
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
    ? "grid grid-cols-6 gap-x-2 gap-y-2 md:grid-cols-[minmax(0,1fr)_150px_64px_96px_72px_88px_36px]"
    : "grid grid-cols-6 gap-x-2 gap-y-2 md:grid-cols-[minmax(0,1fr)_150px_64px_96px_88px_36px]";

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
  if (services.length + products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
        <MdOutlineReceiptLong className="h-8 w-8 text-ternaryGray" />
        <p className="text-sm text-secondary">{emptyHint}</p>
      </div>
    );
  }
  const showGst = products.length > 0;
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
      <select
        aria-label="Staff"
        value={line.staffId || ""}
        disabled={disabled}
        onChange={(e) => onChange("staff", e.target.value)}
        className={`${CELL} col-span-6 md:col-span-1 ${bad(!line.staffId)}`}
      >
        <option value="">Select Staff</option>
        {staffOptions.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>
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
    if (field === "staff") return { ...l, ...withStaff(staffData.find((s) => s._id === value)) };
    if (field === "quantity") {
      return { ...l, quantity: value === "" ? "" : Math.max(1, parseInt(value) || 1) };
    }
    if (field === "price") return { ...l, price: value === "" ? "" : Math.max(0, +value) };
    if (field === "gst") return { ...l, gst: +value };
    return l;
  });

// Service/Product picker: type, staff for newly ticked items, search, a
// Women/Men filter, and a tick list. `serviceCount(s)` is how many cart rows
// the service has (more than one shows a "×n" badge); `servicesLocked` is a
// message shown instead of the service list.
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
  productChecked,
  onToggleService,
  onToggleProduct,
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
        visibleProducts.map((p) => (
          <PickRow
            key={productKey(p)}
            checked={productChecked(p)}
            title={p.name}
            subtitle={p.brand}
            price={toPrice(p.price)}
            onToggle={() => onToggleProduct(p)}
          />
        ))
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

const PickRow = ({ checked, count = 0, title, subtitle, price, onToggle }) => (
  <label
    className={`flex cursor-pointer items-center gap-3 border-b border-lightGray/70 px-3 py-2.5 last:border-b-0 ${checked ? "bg-ternary/5" : "bg-white hover:bg-secondaryGray/60"
      }`}
  >
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm capitalize text-gray2">{title}</span>
      {subtitle && <span className="block truncate text-xs text-secondary">{subtitle}</span>}
    </span>
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
