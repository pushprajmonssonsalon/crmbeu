import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import moment from "moment";
import { toast } from "react-hot-toast";
import { MdArrowBack, MdLockOutline } from "react-icons/md";
import { fetchParlors } from "../../redux/reducers";
import { getApiCall, handleProductAndServiceGst, postApiData } from "../../utils/services";
import {
  CARD,
  CONTROL,
  CartItems,
  ItemPicker,
  LABEL,
  MobileTotalBar,
  NONE,
  TotalsList,
  computeTotals,
  editLine,
  membershipDiscount,
  productKey,
  productLineInvalid,
  rupees,
  serviceKey,
  serviceLineInvalid,
  summaryRowsFor,
  toPrice,
  withStaff,
} from "../bookAppointment/bookingParts";

// Edit screen for a booked (not yet billed) appointment, laid out like the
// booking screen: who and when on top, the items, a tick-to-add picker, and
// the totals in a panel that stays in view.
//
// It sends the same request as the old Edit.js (kept for rollback) with the
// same maths. Each stored service line is one unit at its price (a Qty 2
// booking is saved as two lines), so each shows as its own row and can have
// its own staff; "+" on a row adds another of that service.

const ONE_UNIT = () => 1;

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gstApplied = localStorage.getItem("gstApplied") === "true";

  const { parlorLoading, parlorData } = useSelector((s) => s.parlorReducer);
  const catalogueServices = parlorData?.services || NONE;
  const catalogueProducts = parlorData?.products || NONE;

  const [appointment, setAppointment] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [pickerStaffId, setPickerStaffId] = useState("");
  const [pickerGender, setPickerGender] = useState("F");
  const [discount, setDiscount] = useState(0);

  // ---- membership (same rules as the old screen) ----
  const [memberships, setMemberships] = useState([]); // the client's active ones
  const [activeMembership, setActiveMembership] = useState({});
  const [membershipApplied, setMembershipApplied] = useState(false);
  // Credits already taken from the membership for this bill. While there are
  // any, services and the discount stay as they are: changing them would
  // leave the credit taken out of step with the bill.
  const [storedCredit, setStoredCredit] = useState(0);
  const creditLocked = storedCredit > 0;

  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removingMembership, setRemovingMembership] = useState(false);

  useEffect(() => {
    dispatch(fetchParlors());
    getApiCall(
      "owner/getStaff",
      (res) => setStaffData((res || []).filter((s) => s.isActive)),
      () => { }
    );
  }, [dispatch]);

  useEffect(() => {
    getApiCall(
      `appointment/getSingleAppointmentDetails?id=${id}`,
      (resp) => {
        if (!resp || typeof resp !== "object") {
          setLoadFailed(true);
          return;
        }
        setAppointment(resp);
        setServices(
          (resp.services || []).map((l) => ({
            ...l,
            staffId: l?.staffId || "",
            staffName: l?.staffName || l?.satffName || "",
          }))
        );
        // Lines from before GST picks existed have none; show the default the
        // GST box would display anyway.
        setProducts((resp.products || []).map((p) => ({ ...p, gst: p?.gst || 18 })));
        setDiscount(resp.discountPercentage || 0);
        setMembershipApplied(!!resp.membershipUsed);
        setActiveMembership(resp.userMembership || {});
        setStoredCredit(Number(resp.membershipCreditUsed) || 0);
        setPickerGender(resp.customer?.gender === "M" ? "M" : "F");
      },
      () => setLoadFailed(true)
    );
  }, [id]);

  const phoneNumber = appointment?.customer?.phoneNumber;
  const loadMemberships = useCallback(() => {
    if (!phoneNumber) return;
    postApiData(
      "/membership/getActiveMembershipOfUser",
      { phoneNumber },
      (resp) => setMemberships(resp?.[0]?.activeMembership || []),
      () => { }
    );
  }, [phoneNumber]);
  useEffect(loadMemberships, [loadMemberships]);

  // ---- totals ----
  const totals = computeTotals({
    services,
    products,
    discount,
    gstApplied,
    serviceUnits: ONE_UNIT,
  });
  const membershipCreditUsed = creditLocked
    ? storedCredit
    : membershipApplied
      ? Math.max(0, Math.floor(Math.min(activeMembership?.creditsLeft || 0, totals.serviceTotal)))
      : 0;
  const summaryRows = summaryRowsFor(totals, { gstApplied, hasProducts: products.length > 0 });

  const applyMembership = (membershipId) => {
    if (!membershipId) {
      setActiveMembership({});
      setMembershipApplied(false);
      return;
    }
    const m = memberships.find((elm) => elm._id === membershipId);
    if (!m) return;
    const next = membershipDiscount(m, {
      current: discount,
      previous: activeMembership,
      dob: appointment?.customer?.dob,
      aniversary: appointment?.customer?.aniversary,
    });
    if (next !== undefined) setDiscount(next);
    setActiveMembership(m);
    setMembershipApplied(true);
  };

  // Gives the credits back to the client's membership and unlocks the bill.
  const removeMembership = () => {
    if (removingMembership) return;
    setRemovingMembership(true);
    postApiData(
      "membership/applyMembership",
      {
        creditsUsed: storedCredit,
        userId: appointment?.customer?._id,
        memId: activeMembership?._id,
        isMembershipUsed: false,
        appointmentId: appointment?._id,
      },
      (res) => {
        setRemovingMembership(false);
        if (!res) return;
        toast.success("Membership removed, credits returned");
        setStoredCredit(0);
        setMembershipApplied(false);
        setActiveMembership({});
        loadMemberships();
      },
      () => {
        setRemovingMembership(false);
        toast.error("Could not remove the membership");
      }
    );
  };

  // ---- picker ----
  const pickerStaff = staffData.find((s) => s._id === pickerStaffId);
  const serviceRows = useMemo(() => {
    const counts = new Map();
    services.forEach((l) => counts.set(serviceKey(l), (counts.get(serviceKey(l)) || 0) + 1));
    return counts;
  }, [services]);
  const productRows = useMemo(() => new Set(products.map(productKey)), [products]);

  // Unticking a service removes every row of it (the picker shows "×n" when
  // there is more than one); a single row goes with its own delete button.
  const toggleService = (s) => {
    const key = serviceKey(s);
    if (serviceRows.has(key)) {
      setServices((prev) => prev.filter((l) => serviceKey(l) !== key));
      return;
    }
    setServices((prev) => [
      ...prev,
      {
        ...s,
        miniSubcategory: s.name,
        price: toPrice(s.price),
        quantity: 1,
        ...withStaff(pickerStaff),
      },
    ]);
  };

  const toggleProduct = (p) => {
    const key = productKey(p);
    if (productRows.has(key)) {
      setProducts((prev) => prev.filter((l) => productKey(l) !== key));
      return;
    }
    setProducts((prev) => [
      ...prev,
      {
        ...p,
        price: toPrice(p.price),
        quantity: 1,
        gst: p?.gst || 18,
        ...withStaff(pickerStaff),
      },
    ]);
  };

  // Picking a staff member also fills every row that has none yet.
  const choosePickerStaff = (staffId) => {
    setPickerStaffId(staffId);
    const staff = staffData.find((s) => s._id === staffId);
    if (!staff) return;
    const fill = (lines) => lines.map((l) => (l.staffId ? l : { ...l, ...withStaff(staff) }));
    if (!creditLocked) setServices(fill);
    setProducts(fill);
  };

  // ---- rows ----
  const onLineChange = (kind, index, field, value) => {
    if (kind === "service") setServices((prev) => editLine(prev, index, field, value, staffData));
    else setProducts((prev) => editLine(prev, index, field, value, staffData));
  };

  const removeLine = (kind, index) => {
    if (kind === "service") setServices((prev) => prev.filter((_, i) => i !== index));
    else setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  // Another unit of the same service right under it, same staff to start
  // with; the copy is a new line, so it does not keep the original's _id.
  const duplicateService = (index) =>
    setServices((prev) => {
      const { _id, ...copy } = prev[index];
      return [...prev.slice(0, index + 1), { ...copy, quantity: 1 }, ...prev.slice(index + 1)];
    });

  // ---- save ----
  const handleUpdate = () => {
    if (services.length + products.length === 0) {
      toast.error("Add at least one service or product");
      return;
    }
    if (services.some(serviceLineInvalid) || products.some(productLineInvalid)) {
      setShowErrors(true);
      document.getElementById("edit-items")?.scrollIntoView({ behavior: "smooth", block: "start" });
      toast.error("Every item needs a staff and a price");
      return;
    }

    const {
      serviceGst,
      serviceSubTotal,
      serviceTotal,
      updatedProducts,
      productGstTotal,
      productBaseAmountTotal,
      productTotal,
    } = handleProductAndServiceGst(totals.servicePayable, products, appointment?.appointmentDate);

    const data = {
      services: services.map((l) => ({ ...l, quantity: parseInt(l.quantity) || 1 })),
      serviceSubTotal: serviceSubTotal || 0,
      serviceGst: serviceGst || 0,
      serviceTotal: serviceTotal || 0,
      productGst: productGstTotal,
      productSubTotal: productBaseAmountTotal,
      productTotal: productTotal || 0,
      subTotal: totals.serviceSubtotal,
      total: totals.totalPayable,
      membershipUsed: membershipApplied,
      membershipId: membershipApplied ? activeMembership?._id : "",
      isMembershipApplied: membershipApplied,
      membershipCreditUsed,
      products: updatedProducts,
      discount: totals.discountAmount,
      discountPercentage: totals.discountPct,
    };

    setSaving(true);
    postApiData(
      `appointment/editAppointmentBookedFromCrm?id=${id}`,
      data,
      (resp) => {
        setSaving(false);
        if (!resp) return;
        toast.success("Appointment updated");
        navigate("/?tab=1");
      },
      (error) => {
        setSaving(false);
        toast.error(error?.response?.data?.message || "Could not update the appointment");
      }
    );
  };

  const renderUpdateButton = (className = "") => (
    <button
      type="button"
      onClick={handleUpdate}
      disabled={saving || !appointment}
      className={`h-11 items-center justify-center rounded-lg bg-ternary px-6 py-0 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ternary/90 disabled:opacity-60 ${className}`}
    >
      {saving ? "Saving…" : "Update Appointment"}
    </button>
  );

  const backButton = (
    <button
      type="button"
      onClick={() => navigate("/?tab=1")}
      aria-label="Back to appointments"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-transparent p-0 text-gray2 hover:bg-black/5"
    >
      <MdArrowBack className="h-5 w-5" />
    </button>
  );

  if (!appointment) {
    return (
      <section className={`${CARD} flex items-center gap-3 p-4`}>
        {backButton}
        <p className="text-sm text-secondary">
          {loadFailed ? "Could not load this appointment." : "Loading appointment…"}
        </p>
      </section>
    );
  }

  const customer = appointment.customer || {};
  const itemCount = services.length + products.length;
  const lockMessage = `${rupees(storedCredit)} of membership credit is already used on this bill. Remove the membership to change services or the discount.`;

  return (
    <div className="w-full">
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-4">
          {/* ---- who and when ---- */}
          <section className={`${CARD} flex items-center gap-3 p-4`}>
            {backButton}
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ternary text-base font-semibold uppercase text-white">
              {(customer.name || "?").charAt(0)}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <h1 className="truncate text-left text-base font-semibold capitalize text-gray2">
                {customer.name || "Client"}
                <span className="font-normal text-secondary"> · {customer.phoneNumber}</span>
              </h1>
              <p className="mt-0.5 text-sm text-secondary">
                {appointment.appointmentDate &&
                  moment.utc(appointment.appointmentDate).format("ddd, D MMM YYYY · h:mm A")}
                {customer.gender && ` · ${customer.gender === "M" ? "Male" : "Female"}`}
                {memberships.length > 0 && (
                  <span className="ml-2 rounded bg-secondaryGreen/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-secondaryGreen">
                    Member
                  </span>
                )}
              </p>
              {customer.note && (
                <p className="mt-0.5 truncate text-xs text-secondary">Note: {customer.note}</p>
              )}
            </div>
          </section>

          {/* ---- items ---- */}
          <section id="edit-items" className={`${CARD} scroll-mt-24 p-4`}>
            <h2 className="mb-2 text-left text-base font-semibold text-gray2">
              Items <span className="font-normal text-secondary">({itemCount})</span>
            </h2>
            {creditLocked && (
              <div className="mb-3 flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-start gap-2">
                  <MdLockOutline className="mt-0.5 h-4 w-4 shrink-0" />
                  {lockMessage}
                </span>
                <button
                  type="button"
                  onClick={removeMembership}
                  disabled={removingMembership}
                  className="h-9 shrink-0 rounded-md bg-rose-600 px-3 py-0 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                >
                  {removingMembership ? "Removing…" : "Remove membership"}
                </button>
              </div>
            )}
            <CartItems
              services={services}
              products={products}
              staffData={staffData}
              showErrors={showErrors}
              onLineChange={onLineChange}
              onRemove={removeLine}
              onDuplicateService={duplicateService}
              servicesLocked={creditLocked}
            />
          </section>

          {/* ---- picker ---- */}
          <ItemPicker
            services={catalogueServices}
            products={catalogueProducts}
            loading={parlorLoading}
            staffData={staffData}
            staffId={pickerStaffId}
            onStaffChange={choosePickerStaff}
            gender={pickerGender}
            onGenderChange={setPickerGender}
            serviceCount={(s) => serviceRows.get(serviceKey(s)) || 0}
            productChecked={(p) => productRows.has(productKey(p))}
            onToggleService={toggleService}
            onToggleProduct={toggleProduct}
            servicesLocked={creditLocked ? "Remove the membership above to change services." : undefined}
          />
        </div>

        {/* ---- summary ---- */}
        <aside className="xl:sticky xl:top-24">
          <section className={`${CARD} p-4`}>
            <h2 className="mb-3 text-left text-base font-semibold text-gray2">Summary</h2>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
              <label className="min-w-0">
                <span className={LABEL}>Discount %</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discount}
                  disabled={creditLocked}
                  onChange={(e) =>
                    setDiscount(
                      e.target.value === "" ? "" : Math.min(Math.max(+e.target.value, 0), 100)
                    )
                  }
                  className={CONTROL}
                />
              </label>
              <label className="min-w-0">
                <span className={LABEL}>Membership</span>
                <select
                  value={membershipApplied ? activeMembership?._id || "" : ""}
                  onChange={(e) => applyMembership(e.target.value)}
                  disabled={creditLocked || memberships.length === 0}
                  className={CONTROL}
                >
                  {creditLocked && activeMembership?._id && (
                    <option value={activeMembership._id}>{activeMembership.name || "Applied"}</option>
                  )}
                  <option value="">{memberships.length ? "Not applied" : "No membership"}</option>
                  {memberships
                    .filter((m) => !(creditLocked && m._id === activeMembership?._id))
                    .map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} · {rupees(m.creditsLeft)} left
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <TotalsList
              rows={summaryRows}
              totalPayable={totals.totalPayable}
              creditUsed={membershipCreditUsed}
            />
            {renderUpdateButton("mt-4 hidden w-full xl:flex")}
          </section>
        </aside>
      </div>

      <MobileTotalBar itemCount={itemCount} totalPayable={totals.totalPayable}>
        {renderUpdateButton("flex shrink-0")}
      </MobileTotalBar>
    </div>
  );
};

export default EditAppointment;
