"use client";
import { useState, useEffect } from "react";
import Card from "./components/Card";
import Payment from "./components/Payment";

/**
 * Type definitions for the utility accounts
 */
type AccountType = "ELECTRICITY" | "GAS" | "ALL";
type Account = {
  id: string;
  type: "ELECTRICITY" | "GAS";
  address: string;
  balance: number;
};

/**
 * Home Page Component
 *
 * Main dashboard for utility accounts management. Displays a list of utility accounts
 * (electricity and gas) and provides functionality to make payments.
 *
 * Features:
 * - Account filtering by type (ALL, ELECTRICITY, GAS)
 * - Payment modal integration
 * - Loading state handling
 * - Responsive design
 */
export default function Home() {
  /**
   * Component State
   */
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null); // Currently selected account for payment
  const [accounts, setAccounts] = useState<Account[]>([]); // List of all utility accounts
  const [selectedType, setSelectedType] = useState<AccountType>("ALL"); // Current filter type
  const [loading, setLoading] = useState(true); // Loading state for initial data fetch

  /**
   * Event Handlers
   */

  /**
   * Opens the payment modal for a specific account
   * @param account - The account to process payment for
   */
  const handleOpenPayment = (account: Account) => {
    setSelectedAccount(account);
  };

  /**
   * Closes the payment modal and resets the selected account
   */
  const handleClosePayment = () => {
    setSelectedAccount(null);
  };

  /**
   * Creates a handler for filter type selection
   * @param type - The account type to filter by
   */
  const handleTypeFilter = (type: AccountType) => () => {
    setSelectedType(type);
  };

  /**
   * Data Fetching
   */

  /**
   * Fetches the list of utility accounts from the API
   * Handles loading state and error cases
   */
  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/getAccounts");
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  /**
   * Helper Functions
   */

  /**
   * Filters accounts based on the selected type
   * @returns Filtered array of accounts
   */
  const getFilteredAccounts = () => {
    return accounts.filter((account) =>
      selectedType === "ALL" ? true : account.type === selectedType
    );
  };

  /**
   * Generates the CSS class for filter buttons based on selected state
   * @param type - The account type to generate classes for
   * @returns String of CSS classes
   */
  const getFilterButtonClass = (type: AccountType) => {
    return `px-4 py-2 rounded-lg ${
      selectedType === type
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;
  };

  /**
   * UI Rendering Functions
   */

  /**
   * Renders the page header with filter buttons
   */
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">My Accounts</h1>
      <div className="flex space-x-2">
        <button
          onClick={handleTypeFilter("ALL")}
          className={getFilterButtonClass("ALL")}
        >
          All
        </button>
        <button
          onClick={handleTypeFilter("ELECTRICITY")}
          className={getFilterButtonClass("ELECTRICITY")}
        >
          Electricity
        </button>
        <button
          onClick={handleTypeFilter("GAS")}
          className={getFilterButtonClass("GAS")}
        >
          Gas
        </button>
      </div>
    </div>
  );

  /**
   * Renders the loading spinner and message
   */
  const renderLoading = () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading accounts...</p>
    </div>
  );

  /**
   * Renders the list of filtered accounts
   */
  const renderAccounts = () => (
    <div className="space-y-4">
      {getFilteredAccounts().map((account) => (
        <Card
          key={account.id}
          id={account.id}
          type={account.type}
          address={account.address}
          balance={account.balance}
          onPaymentClick={() => handleOpenPayment(account)}
        />
      ))}
    </div>
  );

  // Main render
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {renderHeader()}
        {loading ? renderLoading() : renderAccounts()}
      </div>

      {selectedAccount && (
        <Payment
          onClose={handleClosePayment}
          accountId={selectedAccount.id}
          accountType={selectedAccount.type}
        />
      )}
    </main>
  );
}
