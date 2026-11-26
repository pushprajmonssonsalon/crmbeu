import { MdOutlineClose } from "react-icons/md";
import { postApiData } from "../../utils/services";
import { useEffect, useState } from "react";

const paise = amount => Math.round(Number(amount || 0) * 100);
const rupees = amount => (amount / 100).toFixed(2).replace(/\.00$/, "");
const validCashbackInput = value => /^\d+(\.\d{0,2})?$/.test(value);

const ViewPopup = ({
  isVisible,
  isPaid,
  onClose,
  setActiveAppointment,
  activeAppointment,
  onUpdate,
  comment = null,
  setComment = () => { }
}) => {
  const { customer, paymentMethod, status } = activeAppointment;
  const settlePending = status === 4;
  const [advanceBalance, setAdvanceBalance] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useAdvance, setUseAdvance] = useState(false);
  const [useCashback, setUseCashback] = useState(false);
  const [cashbackInput, setCashbackInput] = useState("");

  const bill = paise(activeAppointment.total);
  const membership = paise(activeAppointment.membershipCreditUsed);
  const productTotal = activeAppointment.productTotal || (activeAppointment.products || []).reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0,
  );
  const afterProducts = bill - paise(productTotal);
  const serviceDue = Math.max(0, Math.min(paise(activeAppointment.serviceTotal) || afterProducts, afterProducts) - membership);
  const cashbackMax = advanceUsed => Math.max(0, Math.min(
    walletBalance, serviceDue - advanceUsed, bill - membership - advanceUsed
  ));
  const requested = paise(cashbackInput);
  const advanceUsed = settlePending ? paise(activeAppointment.advanceUsed) : useAdvance
    ? Math.max(0, Math.min(advanceBalance, serviceDue, bill - membership))
    : 0;
  const maxCashback = cashbackMax(advanceUsed);
  const invalidCashback = useCashback && (!validCashbackInput(cashbackInput) || requested > maxCashback);
  const cashbackUsed = settlePending ? paise(activeAppointment.cashbackUsed)
    : useCashback && !invalidCashback ? requested : 0;
  const payTotal = Math.max(0, bill - membership - advanceUsed - cashbackUsed);
  const userId = customer?._id;

  useEffect(() => {
    if (!isVisible || !userId || settlePending) return;
    let current = true;
    postApiData("advance/getAdvance", { userId }, res => {
      if (!current) return;
      setAdvanceBalance(paise(res?.advance?.balance));
      setWalletBalance(Math.max(0, Math.floor(Number(res?.wallet?.balance || 0) * 100 + 1e-8)));
    }, () => {});
    return () => { current = false; };
  }, [isVisible, userId, settlePending]);

  const resetPaymentSplit = () => setActiveAppointment(prev => ({
    ...prev, paymentMethod: prev.paymentMethod.map(method => ({ ...method, amount: 0 }))
  }));

  const handleChange = ({ target: { name, value } }) => {
    setActiveAppointment(prev => {
      const other = prev.paymentMethod.reduce((sum, method) =>
        sum + (method.name === name ? 0 : paise(method.amount)), 0);
      const amount = Math.max(0, Math.min(paise(value), payTotal - other)) / 100;
      return { ...prev, paymentMethod: prev.paymentMethod.map(method =>
        method.name === name ? { ...method, amount } : method) };
    });
  };

  const changeAdvance = checked => {
    setUseAdvance(checked);
    const nextAdvance = checked ? Math.max(0, Math.min(advanceBalance, serviceDue, bill - membership)) : 0;
    const nextMax = cashbackMax(nextAdvance);
    if (checked && useCashback && requested > nextMax) setCashbackInput(rupees(nextMax));
    if (checked) resetPaymentSplit();
  };

  const changeCashback = checked => {
    setUseCashback(checked);
    setCashbackInput(checked ? rupees(maxCashback) : "");
    if (checked) resetPaymentSplit();
  };

  const editCashback = value => {
    setCashbackInput(value);
    const next = paise(value);
    const paid = paymentMethod.reduce((sum, method) => sum + paise(method.amount), 0);
    if (validCashbackInput(value) && next <= maxCashback && paid > bill - membership - advanceUsed - next) {
      resetPaymentSplit();
    }
  };

  const submit = () => {
    if (!invalidCashback) onUpdate({
      userId,
      advanceUsed: settlePending ? 0 : advanceUsed / 100,
      cashbackUsed: settlePending ? 0 : cashbackUsed / 100,
    });
  };

  if (!isVisible) return null;
  return (
    <div className='fixed z-40 inset-0 bg-black/20 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain'>
      <div className=' w-full sm:w-[350px] md:w-[450px] bg-white p-4 rounded-xl relative mx-auto my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden'>

        <div className="">
          <div className='flex justify-between items-center mb-6'>
            <h1 className={`text-2xl text-black `}> PAY : {rupees(payTotal)}</h1>
            <button className='text-black text-xl' onClick={onClose}><MdOutlineClose /></button>

          </div>
          <div className="">
            <div className="flex mb-1 items-center justify-between">
              <span className="text-gray-700 uppercase font-medium text-md ">Total</span>
              <span className="text-gray-700 uppercase font-medium text-md ">Rs {rupees(bill)}</span>
            </div>
            <div className="flex mb-1 items-center justify-between">
              <span className="text-gray-700 uppercase font-medium text-md ">Advance</span>
              <span className="text-green-600 font-medium text-xs">- Rs {rupees(advanceUsed)}</span>
            </div>
            <div className="flex mb-1 items-center justify-between">
              <span className="text-gray-700 uppercase font-medium text-md ">Cashback</span>
              <span className="text-green-600 font-medium text-xs">- Rs {rupees(cashbackUsed)}</span>
            </div>
            <div className="flex mb-4 items-center justify-between">
              <span className="text-gray-700 uppercase font-medium text-md ">Payable Amount</span>
              <span className="text-gray-700 uppercase font-medium text-md ">Rs {rupees(payTotal)}</span>
            </div>
          </div>
          {!settlePending && !isPaid && (
            <div className="space-y-3">
              <label className="flex items-center gap-3 bg-gray-200 p-3 text-black">
                <input type="checkbox" checked={useAdvance}
                  disabled={!useAdvance && (advanceBalance <= 0 || serviceDue <= 0)}
                  onChange={e => changeAdvance(e.target.checked)} />
                <span className="flex-1">Advance</span>
                <span>₹{rupees(advanceBalance)}</span>
              </label>
              <div className="bg-gray-200 p-3 text-black">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={useCashback}
                    disabled={!useCashback && maxCashback <= 0}
                    onChange={e => changeCashback(e.target.checked)} />
                  <span className="flex-1">Use cashback</span>
                  <span>₹{rupees(walletBalance)} available</span>
                </label>
                {useCashback && (
                  <div className="mt-3 text-sm">
                    <label htmlFor="cashback-amount">Cashback amount (₹)</label>
                    <input id="cashback-amount" type="number" min="0" step="0.01"
                      max={maxCashback / 100} value={cashbackInput}
                      onChange={e => editCashback(e.target.value)}
                      aria-invalid={invalidCashback} aria-describedby="cashback-limit"
                      className="mt-1 w-full rounded border bg-white px-2 py-1" />
                    <p id="cashback-limit" className={invalidCashback ? "text-red-700" : "text-gray-600"}>
                      Enter an amount from ₹0 to ₹{rupees(maxCashback)}, with up to two decimal places.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="max-h-[calc(100%-110px)] overflow-y-auto overflow-x-hidden">

            <div className="table-responsive">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Distribution</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethod?.map((item, index) => (
                  <tr key={index} className="relative">
                    <td className="font-bold capitalize text-lg">{item?.name}</td>
                    <td className="">
                      <div className="flex flex-col gap-2">
                        <input
                          disabled={isPaid}
                          name={item.name}
                          type="number"
                          min={0}
                          max={payTotal / 100}
                          step="0.01"
                          className="w-full max-w-[250px] outline-none "
                          aria-label={`${item.name} amount`}
                          placeholder="0"
                          value={paise(item.amount) === 0 ? "" : item.amount}
                          onChange={handleChange}
                        />
                        {item.name === "Online" && <>
                          <input
                            value={comment}
                            placeholder="Enter Comment"
                            onChange={(e) => setComment(e.target.value)}
                            type="text"
                            className="py-1 px-2 rounded-[10px] "
                          />

                        </>
                        }

                      </div>


                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {!isPaid && <div className="flex items-center justify-end gap-4 mt-6 flex-wrap">
              <button
                className="rounded-[5px] w-[120px] text-sm  border border-ternary text-ternary py-[5px] px-[24px]"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-[5px] w-[120px] border border-transparent text-sm text-white bg-ternary py-[5px] px-[24px]"
                onClick={submit}
                disabled={invalidCashback}
              >
                Submit
              </button>
            </div>}


          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPopup;
