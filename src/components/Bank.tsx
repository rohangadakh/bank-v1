import React, { useState, useEffect } from "react";
import { Send, Trash2 } from "lucide-react";
import { ref, set, remove, get } from "firebase/database";
import { database } from "./firebase"; // Import the initialized database

const Bank: React.FC = () => {
  const [bankName, setBankName] = useState<string>("");
  const [initialBalance, setInitialBalance] = useState<string>(""); // Initial balance as a string
  const [banks, setBanks] = useState<any[]>([]);

  // Add Bank Functionality
  const handleSubmit = () => {
    if (bankName.trim() !== "" && initialBalance.trim() !== "") {
      const newBankRef = ref(database, "banks/" + bankName);

      // Convert `initialBalance` to a number safely
      const balance = parseFloat(initialBalance);
      if (isNaN(balance)) {
        alert("Please enter a valid number for Initial Balance!");
        return;
      }

      set(newBankRef, {
        name: bankName,
        initialBalance: balance, // Store in 'initialBalance' field
        totalAmount: balance, // Add totalAmount field, same as initialBalance
      })
        .then(() => {
          console.log("Bank added successfully");
          setBankName(""); // Clear the input field
          setInitialBalance(""); // Clear the balance input
          fetchBanks(); // Refresh the list of banks
        })
        .catch((error) => {
          console.error("Error adding bank: ", error);
        });
    } else {
      alert("Please enter both Bank Name and Initial Balance!");
    }
  };

  // Fetch Banks Functionality
  const fetchBanks = () => {
    const banksRef = ref(database, "banks");
    get(banksRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const banksData = snapshot.val();
          const bankArray = Object.keys(banksData).map((key, index) => ({
            id: key,
            name: banksData[key].name,
            initialBalance: banksData[key].initialBalance || 0, // Include initialBalance
            totalAmount: banksData[key].totalAmount || 0, // Include totalAmount
            srNo: index + 1,
          }));
          setBanks(bankArray); // Update the banks state
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching banks: ", error);
      });
  };

  // Handle Delete Functionality
  const handleDelete = (id: string) => {
    const bankRef = ref(database, "banks/" + id);
    remove(bankRef)
      .then(() => {
        console.log("Bank deleted successfully");
        fetchBanks(); // Refresh the list after deletion
      })
      .catch((error) => {
        console.error("Error deleting bank: ", error);
      });
  };

  // Fetch banks on initial load
  useEffect(() => {
    fetchBanks();
  }, []);

  return (
    <div className="space-y-6">
      {/* Add Bank Card */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Add Bank</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Enter Bank Name"
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)} // Keep as a string
            placeholder="Enter Initial Balance"
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Manage Banks Card */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Manage Banks</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="border-r border-gray-300 px-4 py-2 text-left">S.No</th>
                <th className="border-r border-gray-300 px-4 py-2 text-left">Bank Name</th>
                <th className="border-r border-gray-300 px-4 py-2 text-left">Initial Balance</th>
                <th className="border-r border-gray-300 px-4 py-2 text-left">Total Amount</th>
                <th className="border- border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr key={bank.id}>
                  <td className="border-r border-gray-300 px-4 py-2">{bank.srNo}</td>
                  <td className="border-r border-gray-300 px-4 py-2">{bank.name}</td>
                  <td className="border-r border-gray-300 px-4 py-2">{bank.initialBalance}</td>
                  <td className="border-r border-gray-300 px-4 py-2">{bank.totalAmount}</td> {/* Display Total Amount */}
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleDelete(bank.id)}
                      className="bg-red-500 text-white px-8 py-2 rounded-xl hover:bg-red-600 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bank;