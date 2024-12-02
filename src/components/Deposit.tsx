import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { ref, set, get, update } from "firebase/database";
import { database } from "./firebase"; // Import the initialized database

interface DepositProps {
  accessType: string;  // Access type (readonly or readwrite)
}

const Deposit: React.FC<DepositProps> = ({ accessType }) => {
  const [banks, setBanks] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [actionType, setActionType] = useState("deposit"); // For deposit or withdraw
  const [depositData, setDepositData] = useState({
    name: "",
    amount: 0,
    bonus: 0, // New bonus field
    utr: "",
    bank: "",
    site: "",
    remark: "",
    date: new Date().toISOString().split("T")[0],
    actionType: "Deposit",
  });

  const [existingDeposits, setExistingDeposits] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState(""); // To hold error message

  // Fetch Banks
  const fetchBanks = () => {
    const banksRef = ref(database, "banks");
    get(banksRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const banksData = snapshot.val();
          const banksArray = Object.keys(banksData).map((key) => ({
            id: key,
            name: banksData[key].name,
            totalAmount: banksData[key].totalAmount || 0, // Initialize totalAmount if not present
          }));
          setBanks(banksArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching banks: ", error);
      });
  };

  // Fetch Sites
  const fetchSites = () => {
    const sitesRef = ref(database, "sites");
    get(sitesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const sitesData = snapshot.val();
          const sitesArray = Object.keys(sitesData).map((key) => ({
            id: key,
            name: sitesData[key].name,
          }));
          setSites(sitesArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching sites: ", error);
      });
  };

  // Fetch Existing Deposits
  const fetchExistingDeposits = () => {
    const depositsRef = ref(database, "deposits");
    get(depositsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const depositsData = snapshot.val();
          const depositsArray = Object.keys(depositsData).map((key) => ({
            id: key,
            utr: depositsData[key].utr,
            userName: depositsData[key].name,
            amount: depositsData[key].amount,
            bonus: depositsData[key].bonus || 0,
            date: depositsData[key].date,
            bank: depositsData[key].bank,
            site: depositsData[key].site,
            remark: depositsData[key].remark,
            actionType: depositsData[key].actionType,
            timestamp: depositsData[key].timestamp,
          }));          
          setExistingDeposits(depositsArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching existing deposits: ", error);
      });
  };

  // Check if UTR exists in the database
  const checkUTRExists = (utr: string) => {
    return existingDeposits.some((deposit) => deposit.utr === utr);
  };

  // Handle Form Submit
  const handleSubmit = () => {
    if (accessType === "readonly") {
      alert("You do not have permission to make deposits.");
      return;
    }
    const { name, amount, utr, bank, site, remark, date } = depositData;

    // Check if all required fields are filled
    if (name && amount && utr && bank && site && remark && date) {
      // Check if the UTR already exists
      if (checkUTRExists(utr)) {
        setErrorMessage("Error: UTR already exists! Please enter a unique UTR.");
        return; // Prevent form submission if UTR exists
      } else {
        setErrorMessage(""); // Clear error message if UTR doesn't exist

        const timestamp = new Date().toISOString();
        const newDepositRef = ref(database, "deposits/" + utr); // Use UTR as the unique key
        const actionData = {
          name,
          amount,
          bonus: depositData.bonus, // Add bonus field here
          utr,
          bank,
          site,
          remark,
          date,
          timestamp,
          actionType,
        };        

        if (actionType === "deposit") {
          // Update bank's total deposit amount
          const bankRef = ref(database, `banks/${bank}`);
          get(bankRef).then((snapshot) => {
            if (snapshot.exists()) {
              const currentTotal = snapshot.val().totalAmount || 0;
              const newTotalAmount = currentTotal + amount;

              update(bankRef, { totalAmount: newTotalAmount })
                .then(() => {
                  set(newDepositRef, actionData)
                    .then(() => {
                      console.log("Deposit added successfully");
                      fetchExistingDeposits(); // Refresh the list
                      clearForm(); // Clear the form fields after submit
                    })
                    .catch((error) => {
                      console.error("Error adding deposit: ", error);
                    });
                })
                .catch((error) => {
                  console.error("Error updating bank total: ", error);
                });
            }
          });
        } else if (actionType === "withdraw") {
          // Withdraw amount and deduct from the selected bank's total
          const bankRef = ref(database, `banks/${bank}`);
          get(bankRef).then((snapshot) => {
            if (snapshot.exists()) {
              const currentTotal = snapshot.val().totalAmount || 0;
              if (currentTotal >= amount) {
                const newTotalAmount = currentTotal - amount;

                update(bankRef, { totalAmount: newTotalAmount })
                  .then(() => {
                    set(newDepositRef, actionData)
                      .then(() => {
                        console.log("Withdrawal added successfully");
                        fetchExistingDeposits(); // Refresh the list
                        clearForm(); // Clear the form fields after submit
                      })
                      .catch((error) => {
                        console.error("Error adding withdrawal: ", error);
                      });
                  })
                  .catch((error) => {
                    console.error("Error updating bank total: ", error);
                  });
              } else {
                alert("Insufficient balance in the selected bank");
              }
            }
          });
        }
      }
    } else {
      alert("Please fill in all fields!");
    }
  };

  // Clear Form Fields
  const clearForm = () => {
    setDepositData({
      name: "",
      amount: 0,
      bonus: 0, // Reset bonus field
      utr: "",
      bank: "",
      site: "",
      remark: "",
      date: "",
      actionType: "Deposit",
    });
    setActionType("deposit");
  };  

  // Handle Delete
  const handleDelete = (id: string) => {
    const depositRef = ref(database, "deposits/" + id);
    set(depositRef, null)
      .then(() => {
        console.log("Deposit deleted successfully");
        fetchExistingDeposits(); // Refresh the list
      })
      .catch((error) => {
        console.error("Error deleting deposit: ", error);
      });
  };

  useEffect(() => {
    fetchBanks();
    fetchSites();
    fetchExistingDeposits();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Error Message */}
      {errorMessage && <div className="text-red-500 font-bold">{errorMessage}</div>}

      {/* Deposit Details Card */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Deposit Details</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Action Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Type <span className="text-red-500">*</span>
            </label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
            </select>
          </div>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={depositData.name}
              onChange={(e) => setDepositData({ ...depositData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={depositData.amount}
              onChange={(e) => setDepositData({ ...depositData, amount: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* UTR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UTR</label>
            <input
              type="text"
              value={depositData.utr}
              onChange={(e) => setDepositData({ ...depositData, utr: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Bank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
            <select
              value={depositData.bank}
              onChange={(e) => setDepositData({ ...depositData, bank: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Bank</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          {/* Site */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
            <select
              value={depositData.site}
              onChange={(e) => setDepositData({ ...depositData, site: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
          {/* Remark */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
            <input
              type="text"
              value={depositData.remark}
              onChange={(e) => setDepositData({ ...depositData, remark: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={depositData.date}
              onChange={(e) => setDepositData({ ...depositData, date: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bonus</label>
            <input
              type="number"
              value={depositData.bonus}
              onChange={(e) => setDepositData({ ...depositData, bonus: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleSubmit}
            disabled={accessType === "readonly"}
            className={`bg-blue-500 text-white px-4 py-2 rounded-xl ${accessType === "readonly" ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Existing Deposits Table */}
      <div className="bg-white shadow-md rounded-xl p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Existing Deposits</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">UTR</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Bank</th>
                <th className="border border-gray-300 px-4 py-2">Bonus</th>
                <th className="border border-gray-300 px-4 py-2">Action Type</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {existingDeposits.map((deposit) => (
                <tr key={deposit.id}>
                  <td className="border border-gray-300 px-4 py-2">{deposit.userName}</td>
                  <td className="border border-gray-300 px-4 py-2">{deposit.utr}</td>
                  <td className="border border-gray-300 px-4 py-2">{deposit.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{deposit.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">{deposit.bank}</td>
                  <td className="border border-gray-300 px-4 py-2">{deposit.bonus || 0}</td>
                  <td className={`border border-gray-300 px-4 py-2 ${deposit.actionType === 'deposit' ? 'text-white bg-green-500' : 'text-white bg-red-500'}`}>
                    {deposit.actionType.charAt(0).toUpperCase() + deposit.actionType.slice(1)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDelete(deposit.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
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

export default Deposit;