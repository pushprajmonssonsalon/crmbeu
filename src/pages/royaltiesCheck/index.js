import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaWallet, FaFileInvoiceDollar, FaCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { loadRazorpay } from "../../utils/services";
import { setRoyaltyStatus } from "../../redux/reducers";

const LOCAL_BASE_URL = process.env.REACT_APP_BASE_URI;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);
  return `₹${numericValue.toLocaleString("en-IN")}`;
};

const getMonthLabel = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  const { month, year } = item;
  if (typeof month === "number" && month >= 1 && month <= 12) {
    return `${MONTH_NAMES[month - 1]}${year ? ` ${year}` : ""}`;
  }
  return `${month || ""}${year ? ` ${year}` : ""}`.trim();
};

const createRoyaltyOrder = async () => {
  const token = localStorage.getItem("token");
  const instance = axios.create({
    baseURL: LOCAL_BASE_URL,
    timeout: 30000,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const res = await instance.post("royalty/createRoyaltyOrder");
  return res.data;
};

const getRoyaltyStatus = async (dispatch) => {
  const token = localStorage.getItem("token");
  const instance = axios.create({
    baseURL: LOCAL_BASE_URL,
    timeout: 30000,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const res = await instance.get("royalty/getRoyaltyStatus");
  const data = res.data;

  dispatch(
    setRoyaltyStatus({
      royaltyDue: Boolean(data?.royaltyDue),
      royaltyOverdue: Boolean(data?.royaltyOverdue),
    })
  );

  return data;
};

// Small status pill — color communicates urgency at a glance
const StatusBadge = ({ status }) => {
  const isOverdue = status === "overdue";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${isOverdue ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
        }`}
    >
      <FaCircle className="h-1.5 w-1.5" />
      {isOverdue ? "Overdue" : "Pending"}
    </span>
  );
};

const verifyPayment = async (orderId) => {

   const token = localStorage.getItem("token");
  const instance = axios.create({
    baseURL: LOCAL_BASE_URL,
    timeout: 30000,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const res = await instance.get(`royalty/verifyRoyaltyPayment/${orderId}`);
  const data = res.data;
  return data;
};

const RoyaltiesCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [royaltyPaidStatus, setRoyaltyPaidStatus] = useState("Pending");
  const [count, setCount] = useState(0);
  const [breakdown, setBreakdown] = useState([]);
  const [royaltyAmount, setRoyaltyAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [totalAmountWithGST, setTotalAmountWithGST] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);

const handlePay = async () => {
  if (isProcessing) return;

  setIsProcessing(true);

  try {
    const isLoaded = await loadRazorpay();

    if (!isLoaded) {
      toast.error("Razorpay failed to load. Please refresh.");
      setIsProcessing(false);
      return;
    }

    const orderResponse = await createRoyaltyOrder();
    const orderData = orderResponse?.order;

    if (!orderData) {
      toast.error("Invalid order response");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ROYALTY,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Smart Salon",
      description: "Royalty Payment",
      order_id: orderData.id,

      handler: async (response) => {
        try {
          const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          } = response;

          let paymentStatus = "pending";

          // Wait for webhook confirmation
          for (let i = 0; i < 5; i++) {
            const result = await verifyPayment(razorpay_order_id);

            paymentStatus = result.status;

            if (paymentStatus === "paid") {
              break;
            }

            // wait 2 seconds before checking again
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

          if (paymentStatus === "paid") {
            await getRoyaltyStatus(dispatch);
            toast.success("Payment successful!");
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            toast("Payment received. Verification is still in progress.");
          }
        } catch (error) {
          console.error("Payment verification error", error);
          toast.error("Payment verification failed.");
        } finally {
          setIsProcessing(false);
        }
      },

      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        },
      },

      theme: {
        color: "#2563eb",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response) => {
      console.log("Payment failed", response.error);
      toast.error("Payment failed");
      setIsProcessing(false);
    });

    razorpay.open();
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong.");
    setIsProcessing(false);
  }
};

  useEffect(() => {
    const fetchRoyaltyStatus = async () => {
      try {
        const res = await getRoyaltyStatus(dispatch);

        const baseRoyaltyAmount = Number(res?.royaltyAmount || 0);
        const gstValue = Number(res?.gstAmount || 0);
        const payableAmount = Number(res?.totalAmountWithGST || baseRoyaltyAmount + gstValue);

        const breakdownItems = Array.isArray(res?.breakdown) ? res.breakdown : [];
        const monthsCount = Number(res?.count || breakdownItems.length || 0);
        const perMonth = monthsCount ? Math.round(payableAmount / monthsCount) : 0;

        setRoyaltyAmount(baseRoyaltyAmount);
        setGstAmount(gstValue);
        setTotalAmountWithGST(payableAmount);
        setBreakdown(breakdownItems);
        setCount(monthsCount);
        setMonthlyAmount(perMonth);

        let status = "Pending";
        if (res.royaltyOverdue) {
          status = "Overdue";
        } else if (!res.royaltyDue) {
          status = "Paid";
        }
        setRoyaltyPaidStatus(status);
      } catch (error) {
        console.error("Error fetching royalty status:", error);
      }
    };

    fetchRoyaltyStatus();
  }, []);

useEffect(() => {
  getRoyaltyStatus(dispatch);
}, [location.pathname]);

  return (
    <div className="py-8">
      {/* Header / due-amount banner */}
      <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Franchise Royalty</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Royalties Check</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {royaltyPaidStatus === "Pending" ? (
                <span>
                  Your royalty payment is pending. Please pay by the 15th to avoid CRM access suspension.
                </span>
              ) : royaltyPaidStatus === "Overdue" ? (
                <span>
                  Your payment is overdue. Pay your outstanding dues to continue using CRM services.
                </span>
              ) : (
                <span>
                  Manage and pay royalty fees from your franchise locations. Review due amounts and settle invoices below.
                </span>
              )}
            </p>
          </div>
          {royaltyPaidStatus !== "Paid" && (
            <div className="inline-flex rounded-3xl bg-indigo-50 px-5 py-4 text-indigo-700 shadow-sm">
              <FaWallet className="mr-3 h-6 w-6 shrink-0" />
              <div>
                <p className="text-sm uppercase tracking-[0.18em]">Due Amount</p>
                <p className="mt-1 text-2xl font-semibold">{formatCurrency(totalAmountWithGST)}</p>
                {count > 0 ? (
                  <p className="mt-2 max-w-xs text-sm text-slate-600">
                    {count === 1
                      ? `Pending for ${getMonthLabel(breakdown[0]) || "the current month"}.`
                      : `Pending for the last ${count} months`}
                  </p>
                ) : null}
              </div>
            </div>)}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between text-slate-500">
              <p className="text-sm font-medium">Invoice Status</p>
              <FaFileInvoiceDollar className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xl font-semibold text-slate-900">{royaltyPaidStatus}</p>
          </div>
        </div>
      </div>

      {/* Main content: pay card + breakdown, side by side so nothing needs scrolling to see */}
      {royaltyPaidStatus !== "Paid" && (
        <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
          {/* Pay action card */}
          <aside className="flex flex-col rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#EFF6FF] to-[#EEF2FF] p-6 shadow-lg">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Total Payable</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(totalAmountWithGST)}</p>
              <div className="mt-4 flex flex-col gap-1.5 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Royalty Amount</span>
                  <span className="font-medium text-slate-800">{formatCurrency(royaltyAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-medium text-slate-800">{formatCurrency(gstAmount)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              className={`mt-6 inline-flex w-full items-center justify-center rounded-3xl px-6 py-4 text-base font-semibold text-white shadow-lg transition ${isProcessing ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-700 hover:bg-indigo-800"
                }`}
            >
              {isProcessing ? "Opening Razorpay..." : "Pay Royalty Now"}
            </button>

            {paymentStatus ? (
              <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="font-semibold">Payment confirmed</p>
                <p className="mt-1">{paymentStatus}</p>
              </div>
            ) : null}
          </aside>

          {/* Breakdown card — always visible, no scrolling needed */}
          {count > 0 ? (
            <div className="flex flex-col rounded-[28px] border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  Royalty Breakdown <span className="ml-1 font-normal text-slate-400">({count} {count === 1 ? "month" : "months"})</span>
                </p>
              </div>

              <div className="flex flex-col divide-y divide-slate-100 px-6">
                {breakdown.map((item) => (
                  <div key={item.royaltyId} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
                        {getMonthLabel(item).slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{getMonthLabel(item)}</p>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(item.totalAmountWithGST ?? (item.amount + (item.gstAmount || 0)))}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatCurrency(item.amount)} + {formatCurrency(item.gstAmount)} GST
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sticky totals footer so the number is reinforced right under the list */}
              <div className="mt-2 flex items-center justify-between rounded-b-[28px] bg-slate-50 px-6 py-4">
                <span className="text-sm font-medium text-slate-500">Total Payable</span>
                <span className="text-lg font-bold text-slate-900">{formatCurrency(totalAmountWithGST)}</span>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default RoyaltiesCheck;