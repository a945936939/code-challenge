"use client";
import { ArrowRight } from "lucide-react";

interface CardProps {
  id: string;
  type: "ELECTRICITY" | "GAS";
  address: string;
  balance: number;
  onPaymentClick: () => void;
}

export default function Card({
  id,
  type,
  address,
  balance,
  onPaymentClick,
}: CardProps) {
  const getBalanceColor = (balance: number) => {
    if (balance < 0) return "text-red-600";
    if (balance === 0) return "text-gray-600";
    return "text-green-600";
  };

  return (
    <div className="bg-white rounded-3xl p-8  w-full border shadow-lg hover:shadow-xl transition-all duration-300">
      <div>
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">ID: {id}</span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                type === "ELECTRICITY"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {type}
            </span>
          </div>
        </div>

        {/* Content section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
            <span className="text-sm font-medium text-blue-700">Address</span>
            <span className="text-gray-700 text-sm">{address}</span>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl">
            <span className="text-sm font-medium text-gray-500">
              Available Balance
            </span>
            <p
              className={`text-3xl font-bold mt-2 ${getBalanceColor(balance)}`}
            >
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Button */}
        <button className="mt-8 w-full" onClick={onPaymentClick}>
          <div className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl transition-colors duration-300">
            <div className="flex items-center justify-center space-x-2">
              <span className="font-semibold">Make a Payment</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
