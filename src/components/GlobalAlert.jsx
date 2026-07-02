import React from "react";
import { X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

const ReminderModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <AlertCircle className="h-8 w-8 text-yellow-600" />
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-center text-xl font-semibold text-gray-800">
          Royalty Payment Reminder
        </h2>

        {/* Message */}
        <p className="mt-3 text-center text-sm text-gray-600">
          Your royalty payment is pending. Please complete the payment to
          continue enjoying uninterrupted services.
        </p>


        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 py-2.5 text-gray-700 transition hover:bg-gray-100"
          >
            Remind Me Later
          </button>

          <button
            onClick={()=> {onClose(); navigate('/royalties-check')}}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Pay Now 
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;