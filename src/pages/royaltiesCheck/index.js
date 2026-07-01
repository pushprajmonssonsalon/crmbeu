import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaCalendarAlt, FaCheckCircle, FaFileInvoiceDollar, FaMoneyBillWave } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { loadRazorpay } from "../../utils/services";

// Local base URL for royalties-specific requests (kept local to avoid changing shared services)
const LOCAL_BASE_URL = "https://coat-daycare-uncombed.ngrok-free.dev/";

const createRoyaltyOrder = async (payload) => {
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
      "royalty/createRoyaltyOrder",
      payload
    );

    return res?.data;
  } catch (error) {
    throw error;
  }
};

const getRoyaltyStatus = async () => {
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

    const res = await instance.get(
      "royalty/getRoyaltyStatus"
    );
    console.log("getRoyaltyStatus response:", res);

    return res?.data; 
  } catch (error) {
    throw error;
  }
};

const RoyaltiesCheck = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(10000);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePay = async () => {
    if (amount <= 0) {
      toast.error("Enter a valid royalty amount.");
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      toast.error("Unable to load Razorpay checkout. Please refresh and try again.");
      setIsProcessing(false);
      return;
    }

    const payload = {
      amount: 0,
      paymentMethod: "",
      description: "Royalty payment",
    };

    createRoyaltyOrder(payload)
      .then((orderResponse) => {
        console.log("orderResponse", orderResponse);
        const orderData = orderResponse?.order || orderResponse;

        const options = {
          // key: "rzp_live_ReLPWPX0nsXIfA",
          key: "rzp_test_T6FgyMoebY9qEy",
          amount: orderData.amount,
          currency: "INR",
          name: "Smart Salon",
          description: "Royalties Check Payment",
          order_id: orderData.id,
          notes: {
            paymentMethod,
          },
          handler: async (paymentResponse) => {
            try {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              // after payment is done, check the royalty status from the backend
              const royaltyStatus = await getRoyaltyStatus();

              console.log("royaltyStatus", royaltyStatus);

              const data = royaltyStatus?.data || royaltyStatus;

              // if royality clear
              if (
                data?.royaltyOverdue === false &&
                data?.royaltyDue === false
              ) {
                localStorage.setItem("royaltyOverdue", "false");
                localStorage.setItem("royaltyDue", "false");
                localStorage.setItem("royaltyCheckRequired", "false");

                setPaymentStatus(
                  `Payment successful: ₹${amount.toLocaleString()} paid by ${
                    paymentMethod === "upi"
                      ? "UPI"
                      : paymentMethod === "card"
                      ? "Card"
                      : "Net Banking"
                  }.`
                );

                toast.success("Royalty payment completed successfully.");

                setTimeout(() => {
                  navigate("/");
                }, 2000);
              } else {
                localStorage.setItem(
                  "royaltyOverdue",
                  String(data?.royaltyOverdue)
                );

                localStorage.setItem(
                  "royaltyDue",
                  String(data?.royaltyDue)
                );

                toast.error(
                  "Payment is not verified yet. Please try again in a few seconds."
                );
              }
            } catch (error) {
              console.log("Error message:", error.message);
              console.log("Response:", error.response);
              console.log("Request:", error.request);
              console.log("Full error:", error);
              console.log("getRoyaltyStatus error", error);
              toast.error("Unable to verify royalty status.");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            contact: "",
          },
          theme: {
            color: "#2563eb",
          },
        };

        try {
          const razorpay = new window.Razorpay(options);
          razorpay.open();
          razorpay.on("close", () => {
            setIsProcessing(false);
            if (!paymentStatus) {
              toast.error("Payment cancelled by user.");
            }
          });
        } catch (error) {
          console.error("Razorpay open failed", error);
          toast.error("Unable to open Razorpay checkout.");
          setIsProcessing(false);
        }
      })
      .catch((error) => {
        console.error("Order creation failed", error);
        toast.error("Could not initiate payment. Please try again.");
        setIsProcessing(false);
      });
  };

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
              <p className="mt-4 text-xl font-semibold text-slate-900">Pending</p>
              <p className="mt-1 text-sm text-slate-600">1 invoice awaiting payment</p>
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
