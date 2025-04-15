"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, type PaymentFormData } from "../utils/validationSchema";
import {
  formatCardNumber,
  formatExpiryDate,
  formatCVV,
} from "../utils/formatters";
import { toast } from "react-toastify";

/**
 * Props for the PaymentForm component
 * @property {() => void} onClose - Callback function to close the payment modal
 * @property {string} accountId - Unique identifier for the utility account
 * @property {"ELECTRICITY" | "GAS"} accountType - Type of utility account
 */
interface PaymentProps {
  onClose: () => void;
  accountId: string;
  accountType: "ELECTRICITY" | "GAS";
}

/**
 * PaymentForm Component
 *
 * A modal component that handles utility bill payments. It provides a form for users
 * to enter payment details including amount and credit card information.
 *
 * Features:
 * - Real-time form validation using react-hook-form and zod
 * - Credit card information formatting
 * - Interactive card preview
 * - Toast notifications for payment status
 */
export default function PaymentForm({
  onClose,
  accountId,
  accountType,
}: PaymentProps) {
  // Component state management
  const [focused, setFocused] = useState(""); // Tracks currently focused input field
  const [isProcessing, setIsProcessing] = useState(false); // Payment processing state
  const [paymentError, setPaymentError] = useState<string | null>(null); // Payment error message

  // Form setup with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange", // Enable real-time validation
  });

  // Watch form fields for the card preview
  const watchedFields = watch();

  // Event Handlers

  /**
   * Creates a focus handler for input fields
   * @param field - The field identifier to set when focused
   */
  const handleFocus = (field: string) => () => {
    setFocused(field);
  };

  /**
   * Handles amount input changes
   * Formats the input to ensure valid currency format (max 2 decimal places)
   */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitized = value.replace(/[^\d.]/g, "");
    const parts = sanitized.split(".");
    let formatted;

    if (parts.length === 1) {
      formatted = sanitized;
    } else if (parts.length === 2) {
      const whole = parts[0];
      const decimal = parts[1].slice(0, 2);
      formatted = `${whole}.${decimal}`;
    } else {
      formatted = parts[0] + "." + parts.slice(1).join("").slice(0, 2);
    }

    setValue("amount", formatted);
  };

  /**
   * Handles card number input changes
   * Applies formatting (adds spaces every 4 digits)
   */
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("cardNumber", formatCardNumber(e.target.value));
  };

  /**
   * Handles expiry date input changes
   * Formats input to MM/YY format
   */
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("expiryDate", formatExpiryDate(e.target.value));
  };

  /**
   * Handles CVV input changes
   * Limits input to 3-4 digits
   */
  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("cvv", formatCVV(e.target.value));
  };

  /**
   * Handles form submission
   * Processes the payment and manages the payment flow including success/error states
   */
  const handlePaymentSubmit = async (data: PaymentFormData) => {
    try {
      setIsProcessing(true);
      setPaymentError(null);

      toast.loading("Processing payment...", {
        position: "top-right",
        toastId: "payment-processing",
      });

      const response = await fetch("/api/processPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          accountId,
          accountType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Payment failed");
      }

      toast.dismiss("payment-processing");
      toast.success("Payment successful! 🎉", {
        position: "top-right",
        autoClose: 3000,
      });

      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Payment failed";
      setPaymentError(errorMessage);

      toast.dismiss("payment-processing");
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // UI Rendering Functions

  /**
   * Renders the interactive card preview section
   * Shows real-time updates of card information as user types
   */
  const renderCardPreview = () => (
    <div className="mb-8 relative">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium">Credit Card</div>
            <div className="text-sm opacity-75">
              {watchedFields.cardNumber
                ? watchedFields.cardNumber
                : "•••• •••• •••• ••••"}
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs opacity-75 mb-1">Expiry Date</div>
              <div>{watchedFields.expiryDate || "MM/YY"}</div>
            </div>
            <div>
              <div className="text-xs opacity-75 mb-1">CVV</div>
              <div>{focused === "cvc" ? watchedFields.cvv : "•••"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renders the payment amount input section
   * Includes validation and formatting for currency input
   */
  const renderAmountInput = () => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-blue-700">
        How much would you like to pay?
      </label>
      <input
        type="text"
        placeholder="0.00"
        {...register("amount")}
        onChange={handleAmountChange}
        className={`w-full p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.amount ? "border-red-500" : ""
        }`}
        onFocus={handleFocus("amount")}
      />
      {errors.amount && (
        <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
      )}
    </div>
  );

  /**
   * Renders the card number input section
   * Includes validation and formatting for card number
   */
  const renderCardNumberInput = () => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-blue-700">
        How would you like to pay?
      </label>
      <input
        type="text"
        placeholder="Card Number"
        {...register("cardNumber")}
        onChange={handleCardNumberChange}
        className={`w-full p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.cardNumber ? "border-red-500" : ""
        }`}
        onFocus={handleFocus("number")}
      />
      {errors.cardNumber && (
        <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
      )}
    </div>
  );

  /**
   * Renders the expiry date and CVV input section
   * Includes validation and formatting for both fields
   */
  const renderExpiryAndCVV = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Expiry Date"
          {...register("expiryDate")}
          onChange={handleExpiryDateChange}
          className={`w-full p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.expiryDate ? "border-red-500" : ""
          }`}
          onFocus={handleFocus("expiry")}
        />
        {errors.expiryDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.expiryDate.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="CVV"
          {...register("cvv")}
          onChange={handleCVVChange}
          className={`w-full p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.cvv ? "border-red-500" : ""
          }`}
          onFocus={handleFocus("cvc")}
        />
        {errors.cvv && (
          <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
        )}
      </div>
    </div>
  );

  /**
   * Renders the action buttons (Pay Now and Cancel)
   * Handles loading state and disabled states
   */
  const renderActionButtons = () => (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-semibold">
          {isProcessing ? "Processing..." : "Pay Now"}
        </span>
      </button>
      <button
        type="button"
        onClick={onClose}
        disabled={isProcessing}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-2xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-semibold">Cancel</span>
      </button>
    </div>
  );

  // Main render
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-3xl max-w-md p-8 w-full border shadow-lg">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Make a Payment
          </h2>
        </div>

        {renderCardPreview()}

        <form
          onSubmit={handleSubmit(handlePaymentSubmit)}
          className="space-y-6"
        >
          {renderAmountInput()}
          {renderCardNumberInput()}
          {renderExpiryAndCVV()}

          {paymentError && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
              {paymentError}
            </div>
          )}

          {renderActionButtons()}
        </form>
      </div>
    </div>
  );
}
