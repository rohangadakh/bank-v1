import React, { useState, useEffect } from "react";
import { Send, Trash2 } from "lucide-react";
import { ref, set, remove, get } from "firebase/database";
import { database } from "./firebase"; // Import the initialized database

const Bank: React.FC = () => {
  const [bankName, setBankName] = useState<string>("");
  const [banks, setBanks] = useState<any[]>([]);

  // Add Bank Functionality
  const handleSubmit = () => {
    if (bankName.trim() !== "") {
      const newBankRef = ref(database, "banks/" + bankName);
      set(newBankRef, { name: bankName })
        .then(() => {
          console.log("Bank added successfully");
          setBankName(""); // Clear the input field
          fetchBanks();  // Refresh the list of banks
        })
        .catch((error) => {
          console.error("Error adding bank: ", error);
        });
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
            srNo: index + 1,
          }));
          setBanks(bankArray);  // Update the banks state
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
        fetchBanks();  // Refresh the list after deletion
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
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Enter Bank name"
            className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
                <th className="border- border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr key={bank.id}>
                  <td className="border-r border-gray-300 px-4 py-2">{bank.srNo}</td>
                  <td className="border-r border-gray-300 px-4 py-2">{bank.name}</td>
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