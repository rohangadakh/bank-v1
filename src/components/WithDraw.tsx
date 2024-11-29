import React, { useState } from "react";
import { ref, push, get } from "firebase/database";
import { database } from "./firebase"; // Replace with your Firebase config
import { FileText, Sheet, Trash2 } from "lucide-react";

const Withdraw: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    utr: "",
    bank: "",
    site: "",
    remark: "",
    date: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async () => {
    const { name, amount, utr, bank, site, remark, date } = formData;

    // Validate form fields
    if (!name || !amount || !utr || !bank || !site || !remark || !date) {
      setError("All fields are required.");
      return;
    }

    // Check if UTR already exists in the database
    try {
      const snapshot = await get(ref(database, "withdraws"));
      if (snapshot.exists()) {
        const existingUTRs = Object.values(snapshot.val() || {}).map(
          (record: any) => record.utr
        );
        if (existingUTRs.includes(utr)) {
          setError("UTR number already exists.");
          return;
        }
      }

      // Add data to the database
      await push(ref(database, "withdraws"), {
        name,
        amount: parseFloat(amount),
        utr,
        bank,
        site,
        remark,
        date,
        timestamp: new Date().toISOString(),
      });

      // Clear the form fields
      setFormData({
        name: "",
        amount: "",
        utr: "",
        bank: "",
        site: "",
        remark: "",
        date: "",
      });
      setError(""); // Clear error message on successful submission
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Withdraw Details Card */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Withdraw Details</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter User Name"
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter Amount"
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* UTR Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UTR <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="utr"
              value={formData.utr}
              onChange={handleInputChange}
              placeholder="Enter UTR Number"
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Bank Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bank"
              value={formData.bank}
              onChange={handleInputChange}
              placeholder="Enter Bank Name"
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Site Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="site"
              value={formData.site}
              onChange={handleInputChange}
              placeholder="Enter Site"
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Remark Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remark <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="remark"
              value={formData.remark}
              onChange={handleInputChange}
              placeholder="Enter Remark"
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {/* Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            onClick={() =>
              setFormData({
                name: "",
                amount: "",
                utr: "",
                bank: "",
                site: "",
                remark: "",
                date: "",
              })
            }
            className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
