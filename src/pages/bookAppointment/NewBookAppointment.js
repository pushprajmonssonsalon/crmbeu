import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-hot-toast";
import { MdClose, MdPersonAddAlt1, MdSearch } from "react-icons/md";
import {
  newUpdateService,
  productAdded,
  removeAppointmentProductsData,
  serviceAdded,
  updateProducts,
} from "../../redux/actions";
import { fetchParlors } from "../../redux/reducers";
import {
  formatDateWOYear,
  getApiCall,
  handleProductAndServiceGst,
  postApiData,
} from "../../utils/services";
import AddCustomerModal from "../../components/modals/AddCustomerModal";
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
  lineQty,
  membershipDiscount,
  productKey,
  productLineInvalid,
  rupees,
  newProductLine,
  newServiceLine,
  serviceKey,
  serviceLineInvalid,
  summaryRowsFor,
  unitsByKey,
  withStaff,
} from "./bookingParts";

// Booking screen laid out like a POS: client/date/time on top, the cart under
// it, a tick-to-add picker under that, and the totals in a panel that stays in
// view (a sticky side column on wide screens, a sticky bottom bar otherwise).
//
// It sends the same request as the old BookAppointment.js and keeps its price,
// discount and GST maths, with one addition: a quantity on services. The
// backend and every report count a service line as one service at `price`, so
// a service with Qty n is sent as n identical lines (see
// expandServicesForBooking) and nothing downstream has to change.

const EMPTY_CUSTOMER = {
  name: "",
  phoneNumber: "",
  email: "",
  gender: "F",
  "dob-date": "",
  "dob-month": "",
  "aniversary-date": "",
  "aniversary-month": "",
  dob: "",
  aniversary: "",
  gstNumber: "",
  note: "",
};

const MIN_CLIENT_QUERY = 2;

const todayISO = () => moment().format("YYYY-MM-DD");

export const expandServicesForBooking = (lines) =>
  lines.flatMap((line) =>
    Array.from({ length: lineQty(line) }, () => ({ ...line, quantity: 1 }))
  );

// The backend searches with $regex, where a stray "(" or "+" fails the query.
const cleanQuery = (q) => q.trim().replace(/[.*+?^${}()|[\]\\]/g, "");

const NewBookAppointment = ({ onTabChange }) => {
  const dispatch = useDispatch();
  const gstApplied = localStorage.getItem("gstApplied") === "true";

  const { parlorLoading, parlorData } = useSelector((s) => s.parlorReducer);
  const cartServices = useSelector((s) => s.serviceAddReducer.serviceData) || NONE;
  const cartProducts = useSelector((s) => s.ProductAddReducer.ProductData) || NONE;
  const catalogueServices = parlorData?.services || NONE;
  const catalogueProducts = parlorData?.products || NONE;
  // Past dates only while the owner has switched it on in Salon Details; the
  // backend enforces the same rule.
  const allowPastDates = parlorData?.allowPastAppointments === true;

  // ---- client ----
  const [client, setClient] = useState(null); // the user record picked
  const [customerDetails, setCustomerDetails] = useState(EMPTY_CUSTOMER);
  const [clientQuery, setClientQuery] = useState("");
  const [clientResults, setClientResults] = useState([]);
  const [clientOpen, setClientOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const clientBoxRef = useRef(null);
  const clientInputRef = useRef(null);
  const searchSeq = useRef(0);
  const [isModalOpen, setModalOpen] = useState(false);

  // ---- when ----
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState(moment().format("HH:mm"));

  // ---- picker ----
  const [staffData, setStaffData] = useState([]);
  const [pickerStaffId, setPickerStaffId] = useState("");
  const [pickerGender, setPickerGender] = useState("F");

  // ---- discount / membership ----
  const [discount, setDiscount] = useState(0);
  const [activeMembership, setActiveMembership] = useState({});
  const [membershipApplied, setMembershipApplied] = useState(false);

  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const cartRef = useRef(null);

  useEffect(() => {
    dispatch(fetchParlors());
    getApiCall(
      "owner/getStaff",
      (res) => setStaffData((res || []).filter((s) => s.isActive)),
      () => { }
    );
  }, [dispatch]);

  // Client search: debounced, and only the latest request's answer is used.
  useEffect(() => {
    const q = cleanQuery(clientQuery);
    if (client || q.length < MIN_CLIENT_QUERY) {
      setClientResults([]);
      setSearching(false);
      return undefined;
    }
    setSearching(true);
    const seq = ++searchSeq.current;
    const timer = setTimeout(() => {
      postApiData(
        "user/searchUser",
        { phoneNumber: q },
        (resp) => {
          if (seq !== searchSeq.current) return;
          setClientResults(Array.isArray(resp) ? resp : []);
          setActiveResult(0);
          setSearching(false);
        },
        () => {
          if (seq !== searchSeq.current) return;
          setClientResults([]);
          setSearching(false);
        }
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [clientQuery, client]);

  useEffect(() => {
    const onDown = (e) => {
      if (clientBoxRef.current && !clientBoxRef.current.contains(e.target)) {
        setClientOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const resetMembership = () => {
    if (membershipApplied) setDiscount(0);
    setActiveMembership({});
    setMembershipApplied(false);
  };

  const selectClient = (user) => {
    setClient(user);
    setCustomerDetails({
      ...EMPTY_CUSTOMER,
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
      gender: user?.gender === "M" ? "M" : "F",
      gstNumber: user?.gstNumber || "",
      note: user?.note || "",
      dob: user?.dob,
      aniversary: user?.aniversary,
    });
    setPickerGender(user?.gender === "M" ? "M" : "F");
    setClientQuery("");
    setClientResults([]);
    setClientOpen(false);
    // Another client's membership must not carry over.
    resetMembership();
  };

  const clearClient = () => {
    setClient(null);
    setCustomerDetails(EMPTY_CUSTOMER);
    resetMembership();
    setTimeout(() => clientInputRef.current?.focus(), 0);
  };

  const onClientKeyDown = (e) => {
    if (!clientOpen || clientResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveResult((i) => Math.min(i + 1, clientResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveResult((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectClient(clientResults[activeResult]);
    } else if (e.key === "Escape") {
      setClientOpen(false);
    }
  };

  // ---- new client modal (same fields and API as before) ----
  const openNewClient = () => {
    const q = clientQuery.trim();
    const isPhone = /^\d+$/.test(q);
    setCustomerDetails({
      ...EMPTY_CUSTOMER,
      phoneNumber: isPhone ? q.slice(0, 10) : "",
      name: isPhone ? "" : q,
    });
    setClientOpen(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    // Half-typed details of a client that was never added must not be booked.
    if (!client) setCustomerDetails(EMPTY_CUSTOMER);
  };

  const handleCustomerFieldChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({
      ...prev,
      [name]: name === "phoneNumber" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
  };

  const submitNewClient = () => {
    const payload = {
      ...customerDetails,
      dob: formatDateWOYear(customerDetails["dob-date"], customerDetails["dob-month"]),
      aniversary: formatDateWOYear(
        customerDetails["aniversary-date"],
        customerDetails["aniversary-month"]
      ),
    };
    if (payload.phoneNumber?.length !== 10) return toast.error("Enter a valid 10-digit phone number");
    if (!payload.name?.trim()) return toast.error("Enter the client's name");

    postApiData(
      "parlor/registerUserForCrm",
      payload,
      (resp) => {
        toast.success("Client added");
        setModalOpen(false);
        selectClient(
          resp && typeof resp === "object" ? resp : { ...payload, activeMembership: [] }
        );
      },
      (error) => {
        const message = error?.response?.data?.message;
        // Already a client of this salon: pick their existing record instead.
        if (message === "user already registered") {
          postApiData(
            "user/searchUser",
            { phoneNumber: payload.phoneNumber },
            (list) => {
              const match = (list || []).find((u) => u.phoneNumber === payload.phoneNumber);
              if (!match) return toast.error(message);
              setModalOpen(false);
              selectClient(match);
              toast.success("Client already exists, selected them");
            },
            () => toast.error(message)
          );
          return;
        }
        toast.error(message || "Could not add the client");
      }
    );
  };

  const addCustomerFields = [
    { name: "name", label: "Enter Name", placeholder: "Enter Name", value: customerDetails.name },
    {
      name: "phoneNumber",
      label: "Mobile Number",
      placeholder: "Enter Mobile Number",
      value: customerDetails.phoneNumber,
    },
    {
      name: "email",
      label: "Email Address",
      placeholder: "Enter Email Address",
      value: customerDetails.email,
    },
    {
      name: "gender",
      label: "Gender",
      value: customerDetails.gender,
      options: [
        { name: "Male", value: "M" },
        { name: "Female", value: "F" },
      ],
    },
    {
      name: "dob",
      label: "Birthday",
      value1: customerDetails["dob-date"],
      value2: customerDetails["dob-month"],
    },
    {
      name: "aniversary",
      label: "Aniversary",
      value1: customerDetails["aniversary-date"],
      value2: customerDetails["aniversary-month"],
      placeholder: "Enter Aniversary",
    },
    {
      name: "gstNumber",
      label: "Gst Number",
      placeholder: "Gst Number",
      value: customerDetails.gstNumber,
    },
  ];

  // ---- membership (same rules as the old screen) ----
  const memberships = client?.activeMembership || [];
  const applyMembership = (id) => {
    if (!id) {
      setActiveMembership({});
      setMembershipApplied(false);
      toast.success("Membership removed");
      return;
    }
    const m = memberships.find((elm) => elm._id === id);
    if (!m) return;
    const next = membershipDiscount(m, {
      current: discount,
      previous: activeMembership,
      dob: customerDetails.dob,
      aniversary: customerDetails.aniversary,
    });
    if (next !== undefined) setDiscount(next);
    setActiveMembership(m);
    setMembershipApplied(true);
    toast.success("Membership applied");
  };

  // ---- totals (same maths as the old screen; services now x quantity) ----
  const totals = computeTotals({
    services: cartServices,
    products: cartProducts,
    discount,
    gstApplied,
  });
  const {
    discountPct,
    serviceSubtotal: subtotalPrice,
    discountAmount: countdiscount,
    servicePayable: payableAmount,
    serviceTotal,
    totalPayable,
  } = totals;
  const membershipCreditUsed = membershipApplied
    ? Math.max(0, Math.floor(Math.min(activeMembership?.creditsLeft || 0, serviceTotal)))
    : 0;
  const summaryRows = summaryRowsFor(totals, { gstApplied, hasProducts: cartProducts.length > 0 });

  // ---- picker ----
  const pickerStaff = staffData.find((s) => s._id === pickerStaffId);
  const serviceUnits = useMemo(() => unitsByKey(cartServices, serviceKey), [cartServices]);
  const productUnits = useMemo(() => unitsByKey(cartProducts, productKey), [cartProducts]);

  // Ticking adds an item, unticking removes every line of it.
  const toggleService = (s) => {
    const key = serviceKey(s);
    if (serviceUnits.has(key)) {
      dispatch(newUpdateService(cartServices.filter((l) => serviceKey(l) !== key)));
      return;
    }
    dispatch(serviceAdded(newServiceLine(s, pickerStaff)));
  };

  const toggleProduct = (p) => {
    const key = productKey(p);
    if (productUnits.has(key)) {
      dispatch(updateProducts(cartProducts.filter((l) => productKey(l) !== key)));
      return;
    }
    dispatch(productAdded(newProductLine(p, pickerStaff)));
  };

  // "Add again": the same item on a line of its own, so it can go to another
  // staff member. (productAdded would merge it into the existing line.)
  const addServiceAgain = (s) =>
    dispatch(newUpdateService([...cartServices, newServiceLine(s, pickerStaff)]));
  const addProductAgain = (p) =>
    dispatch(updateProducts([...cartProducts, newProductLine(p, pickerStaff)]));

  // Picking a staff member also fills every cart line that has none yet, so
  // "tick everything, then pick the staff" works too.
  const choosePickerStaff = (id) => {
    setPickerStaffId(id);
    const staff = staffData.find((s) => s._id === id);
    if (!staff) return;
    const fill = (lines) => lines.map((l) => (l.staffId ? l : { ...l, ...withStaff(staff) }));
    if (cartServices.some((l) => !l.staffId)) dispatch(newUpdateService(fill(cartServices)));
    if (cartProducts.some((l) => !l.staffId)) dispatch(updateProducts(fill(cartProducts)));
  };

  // ---- cart edits ----
  const onLineChange = (kind, index, field, value) => {
    if (kind === "service") {
      dispatch(newUpdateService(editLine(cartServices, index, field, value, staffData)));
    } else {
      dispatch(updateProducts(editLine(cartProducts, index, field, value, staffData)));
    }
  };

  const removeLine = (kind, index) => {
    if (kind === "service") {
      dispatch(newUpdateService(cartServices.filter((_, i) => i !== index)));
    } else {
      dispatch(updateProducts(cartProducts.filter((_, i) => i !== index)));
    }
  };

  const itemCount = cartServices.length + cartProducts.length;

  // ---- book ----
  const handleBook = () => {
    if (!client || !customerDetails.phoneNumber) {
      toast.error("Select a client first");
      clientInputRef.current?.focus();
      return;
    }
    if (!time) {
      toast.error("Pick a time");
      return;
    }
    if (!allowPastDates && date < todayISO()) {
      toast.error("Previous dates are not allowed");
      return;
    }
    if (cartServices.some(serviceLineInvalid) || cartProducts.some(productLineInvalid)) {
      setShowErrors(true);
      cartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      toast.error("Every item needs a staff and a price");
      return;
    }

    const {
      serviceGst: gst,
      serviceSubTotal,
      serviceTotal: totalForServices,
      updatedProducts,
      productGstTotal,
      productBaseAmountTotal,
      productTotal,
    } = handleProductAndServiceGst(payableAmount, cartProducts, date);

    const { name, phoneNumber, email, gender, gstNumber, note } = customerDetails;
    const data = {
      services: expandServicesForBooking(cartServices),
      customer: {
        name,
        phoneNumber,
        email,
        gender,
        dob: formatDateWOYear(customerDetails["dob-date"], customerDetails["dob-month"]),
        aniversary: formatDateWOYear(
          customerDetails["aniversary-date"],
          customerDetails["aniversary-month"]
        ),
        gstNumber,
        note,
      },
      subTotal: subtotalPrice,
      serviceSubTotal: serviceSubTotal || 0,
      serviceGst: gst || 0,
      serviceTotal: totalForServices || 0,
      productGst: productGstTotal,
      productSubTotal: productBaseAmountTotal,
      productTotal,
      total: totalPayable,
      appointmentDate: `${date}T${time}:00.000Z`,
      membershipUsed: membershipApplied,
      isMembershipApplied: membershipApplied,
      membershipCreditUsed: membershipApplied ? membershipCreditUsed : 0,
      products: updatedProducts,
      discount: +countdiscount,
      discountPercentage: discountPct,
      membershipId: activeMembership?._id,
    };

    setLoading(true);
    postApiData(
      "appointment/bookAppointmentFromCrm",
      data,
      (resp) => {
        setLoading(false);
        if (!resp) return;
        toast.success("Appointment booked");
        dispatch(removeAppointmentProductsData());
        onTabChange?.(1);
      },
      (error) => {
        setLoading(false);
        toast.error(error?.response?.data?.message || "Booking failed");
      }
    );
  };

  const salonVisit = client?.salons?.find(
    (s) => String(s?.salonId) === String(parlorData?._id)
  );

  // A render helper, not a component: a component defined in here would be a
  // new type every render and remount each time.
  const renderBookButton = (className = "") => (
    <button
      type="button"
      onClick={handleBook}
      disabled={loading}
      className={`h-11 items-center justify-center rounded-lg bg-ternary px-6 py-0 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ternary/90 disabled:opacity-60 ${className}`}
    >
      {loading ? "Booking…" : "Book Appointment"}
    </button>
  );

  return (
    <div className="w-full">
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-4">
          {/* ---- client, date, time ---- */}
          <section className={`${CARD} p-4`}>
            <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <div ref={clientBoxRef} className="relative min-w-0">
                <span className={LABEL}>Client</span>
                {client ? (
                  <div className="flex min-h-10 items-center gap-3 rounded-lg border border-ternary/30 bg-ternary/5 px-3 py-1">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ternary text-sm font-semibold uppercase text-white">
                      {(client.name || "?").charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="truncate text-sm font-semibold capitalize text-gray2">
                        {client.name}
                        <span className="font-normal text-secondary"> · {client.phoneNumber}</span>
                      </p>
                      <p className="truncate text-xs text-secondary">
                        {salonVisit?.totalVisit
                          ? `${salonVisit.totalVisit} visit${salonVisit.totalVisit > 1 ? "s" : ""}${salonVisit.lastVisited
                            ? ` · last ${moment(salonVisit.lastVisited).format("D MMM YYYY")}`
                            : ""
                          }`
                          : "New client"}
                        {memberships.length > 0 && (
                          <span className="ml-2 rounded bg-secondaryGreen/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-secondaryGreen">
                            Member
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearClient}
                      aria-label="Change client"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-transparent p-0 text-secondary hover:bg-black/5"
                    >
                      <MdClose className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative min-w-0 flex-1">
                      <MdSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ternaryGray" />
                      <input
                        ref={clientInputRef}
                        value={clientQuery}
                        onChange={(e) => {
                          setClientQuery(e.target.value);
                          setClientOpen(true);
                        }}
                        onFocus={() => setClientOpen(true)}
                        onKeyDown={onClientKeyDown}
                        placeholder="Search by phone or name"
                        autoComplete="off"
                        className={`${CONTROL} pl-10`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={openNewClient}
                      className="flex h-10 shrink-0 items-center gap-1 rounded-lg bg-ternary px-3 py-0 text-sm font-medium text-white hover:bg-ternary/90"
                    >
                      <MdPersonAddAlt1 className="h-5 w-5" />
                      <span className="hidden sm:inline">New</span>
                    </button>
                  </div>
                )}

                {!client && clientOpen && cleanQuery(clientQuery).length >= MIN_CLIENT_QUERY && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-lg border border-lightGray bg-white py-1 shadow-card">
                    {searching && clientResults.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-secondary">Searching…</p>
                    ) : clientResults.length > 0 ? (
                      clientResults.map((u, i) => (
                        <button
                          key={u._id || i}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onMouseEnter={() => setActiveResult(i)}
                          onClick={() => selectClient(u)}
                          className={`flex w-full items-center justify-between gap-3 rounded-none px-3 py-2 text-left text-sm ${i === activeResult ? "bg-ternary/10" : "bg-white"
                            }`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-medium capitalize text-gray2">{u.name}</span>
                            {u.note && <span className="block truncate text-xs text-secondary">{u.note}</span>}
                          </span>
                          <span className="shrink-0 text-secondary">{u.phoneNumber}</span>
                        </button>
                      ))
                    ) : (
                      <div className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm text-secondary">
                        <span>No client found</span>
                        <button
                          type="button"
                          onClick={openNewClient}
                          className="rounded-md bg-transparent px-2 py-1 font-medium text-ternary hover:bg-ternary/10"
                        >
                          + Add as new client
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* date + time share a row on phones, then join the main grid */}
              <div className="grid grid-cols-2 gap-3 md:contents">
                <label className="min-w-0">
                  <span className={LABEL}>Date</span>
                  <input
                    type="date"
                    value={date}
                    min={allowPastDates ? undefined : todayISO()}
                    onChange={(e) => setDate(e.target.value)}
                    className={CONTROL}
                  />
                </label>
                <label className="min-w-0">
                  <span className={LABEL}>Time</span>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={CONTROL}
                  />
                </label>
              </div>
            </div>

            {client && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="min-w-0">
                  <span className={LABEL}>Note</span>
                  <input
                    name="note"
                    value={customerDetails.note}
                    onChange={handleCustomerFieldChange}
                    placeholder="Additional info"
                    className={CONTROL}
                  />
                </label>
                <label className="min-w-0">
                  <span className={LABEL}>Client GST</span>
                  <input
                    name="gstNumber"
                    value={customerDetails.gstNumber}
                    onChange={handleCustomerFieldChange}
                    placeholder="GST number"
                    className={CONTROL}
                  />
                </label>
              </div>
            )}
          </section>

          {/* ---- cart ---- */}
          <section ref={cartRef} className={`${CARD} scroll-mt-24 p-4`}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-left text-base font-semibold text-gray2">
                Items <span className="font-normal text-secondary">({itemCount})</span>
              </h2>
              {itemCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(removeAppointmentProductsData());
                    setShowErrors(false);
                  }}
                  className="rounded-md bg-transparent px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Clear all
                </button>
              )}
            </div>

            <CartItems
              services={cartServices}
              products={cartProducts}
              staffData={staffData}
              showErrors={showErrors}
              onLineChange={onLineChange}
              onRemove={removeLine}
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
            serviceCount={(svc) => serviceUnits.get(serviceKey(svc)) || 0}
            productCount={(p) => productUnits.get(productKey(p)) || 0}
            onToggleService={toggleService}
            onToggleProduct={toggleProduct}
            onAddServiceAgain={addServiceAgain}
            onAddProductAgain={addProductAgain}
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
                  disabled={memberships.length === 0}
                  className={CONTROL}
                >
                  <option value="">
                    {memberships.length ? "Not applied" : client ? "No membership" : "Select a client"}
                  </option>
                  {memberships.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} · {rupees(m.creditsLeft)} left
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <TotalsList
              rows={summaryRows}
              totalPayable={totalPayable}
              creditUsed={membershipCreditUsed}
            />
            {renderBookButton("mt-4 hidden w-full xl:flex")}
          </section>
        </aside>
      </div>

      <MobileTotalBar itemCount={itemCount} totalPayable={totalPayable}>
        {renderBookButton("flex shrink-0")}
      </MobileTotalBar>

      <AddCustomerModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addCustomerFields={addCustomerFields}
        handleChange={handleCustomerFieldChange}
        handleSubmit={submitNewClient}
        heading="Add New Client"
      />
    </div>
  );
};

export default NewBookAppointment;
