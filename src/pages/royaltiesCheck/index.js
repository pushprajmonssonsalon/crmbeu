import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaWallet, FaCalendarAlt, FaCheckCircle, FaFileInvoiceDollar, FaMoneyBillWave } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { loadRazorpay } from "../../utils/services";
import { setRoyaltyStatus } from "../../redux/reducers";

// Local base URL for royalties-specific requests (kept local to avoid changing shared services)
const LOCAL_BASE_URL = "http://192.168.2.23:4002/"; // Replace with your actual local base URL

const createRoyaltyOrder = async () => {
  try {
    const token = localStorage.getItem("token");

    const instance = axios.create({
      baseURL: LOCAL_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await instance.post(
      "royalty/createRoyaltyOrder"
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

const getRoyaltyStatus = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    const instance = axios.create({
      baseURL: LOCAL_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
  } catch (error) {
    throw error;
  }
};

const RoyaltiesCheck = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [royaltyPaidStatus, setRoyaltyPaidStatus] = useState("Pending");

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
      key: "rzp_test_T6FgyMoebY9qEy",
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Smart Salon",
      description: "Royalty Payment",
      order_id: orderData.id,

      handler: async () => {
        try {
          await getRoyaltyStatus(dispatch);

          toast.success("Payment successful!");

          setTimeout(() => {
            navigate("/");
          }, 1000);

        } catch (error) {
          toast.error("Payment verification failed.");
        } finally {
          setIsProcessing(false);
        }
      },

      theme: {
        color: "#2563eb",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

    razorpay.on("payment.failed", () => {
      toast.error("Payment failed");
      setIsProcessing(false);
    });

    razorpay.on("close", () => {
      setIsProcessing(false);
    });

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


      setAmount(res?.royaltyAmount || 0);

      let status = "Pending";
      if(res.royaltyOverdue){
        status = "Overdue";
      }else if(!res.royaltyDue){
        status = "Paid";
      }
      setRoyaltyPaidStatus(status);

    } catch (error) {
      console.error("Error fetching royalty status:", error);
    }
  };

  fetchRoyaltyStatus();
}, []);

  return (
      <div className="py-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Franchise Royalty</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Royalties Check</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Manage and pay royalty fees from your franchise locations. This page helps you review due amounts, payment history, and settle royalty invoices quickly.
              </p>
            </div>
            <div className="inline-flex rounded-3xl bg-indigo-50 px-5 py-4 text-indigo-700 shadow-sm">
              <FaWallet className="mr-3 h-6 w-6" />
              <div>
                <p className="text-sm uppercase tracking-[0.18em]">Due Amount</p>
                <p className="mt-1 text-2xl font-semibold">₹{amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between text-slate-500">
                <p className="text-sm font-medium">Invoice Status</p>
                <FaFileInvoiceDollar className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xl font-semibold text-slate-900">{royaltyPaidStatus}</p>
              {/* <p className="mt-1 text-sm text-slate-600">1 invoice awaiting payment</p> */}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <aside className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#EFF6FF] to-[#EEF2FF] p-8 shadow-lg">
            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              className={`mt-6 inline-flex w-full items-center justify-center rounded-3xl px-6 py-4 text-base font-semibold text-white shadow-lg transition ${isProcessing ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-700 hover:bg-indigo-800"}`}
            >
              {isProcessing ? "Opening Razorpay..." : "Pay Royalty Now"}
            </button>

            {paymentStatus ? (
              <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="font-semibold">Payment confirmed</p>
                <p className="mt-2">{paymentStatus}</p>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
  );
};

export default RoyaltiesCheck;
