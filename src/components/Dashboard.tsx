import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "./firebase";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the type for a transaction
interface Transaction {
  bankName: string;
  site: string;
  amount: number;
  utr: string;
  date: string;
  timestamp: string;
  actionType: string; // Action type (Deposit/Withdraw)
}

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState({
    totalDeposit: 0,
    totalWithdraw: 0,
    currentBalance: 0,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [bankData, setBankData] = useState<any>({});
  const [siteData, setSiteData] = useState<any>({});

  // Fetch data from the database
  const fetchData = () => {
    const depositsRef = ref(database, "deposits");
    get(depositsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const transactionList: Transaction[] = Object.keys(data).map((key) => ({
            bankName: data[key].bank || "",
            site: data[key].site || "",
            amount: data[key].amount || 0,
            utr: data[key].utr || "",
            date: data[key].date || "",
            timestamp: data[key].timestamp || "",
            actionType: data[key].actionType || "", // Assuming actionType exists in your database
          }));

          // Sort transactions by timestamp (most recent first)
          transactionList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          // Calculate statistics
          const totalDeposit = transactionList
            .filter((transaction) => transaction.actionType === "deposit")
            .reduce((acc, curr) => acc + curr.amount, 0);

          const totalWithdraw = transactionList
            .filter((transaction) => transaction.actionType === "withdraw")
            .reduce((acc, curr) => acc + curr.amount, 0);

          const currentBalance = totalDeposit - totalWithdraw;

          // Aggregate data for graphs
          const bankWise = transactionList.reduce<Record<string, number>>((acc, curr) => {
            acc[curr.bankName] = (acc[curr.bankName] || 0) + curr.amount;
            return acc;
          }, {});

          const siteWise = transactionList.reduce<Record<string, number>>((acc, curr) => {
            acc[curr.site] = (acc[curr.site] || 0) + curr.amount;
            return acc;
          }, {});

          setStatistics({
            totalDeposit,
            totalWithdraw,
            currentBalance,
          });
          setTransactions(transactionList);

          // Prepare data for graphs
          setBankData({
            labels: Object.keys(bankWise),
            datasets: [
              {
                label: "Bank-wise Deposits",
                data: Object.values(bankWise),
                backgroundColor: "rgba(54, 162, 235, 0.5)",
              },
            ],
          });

          setSiteData({
            labels: Object.keys(siteWise),
            datasets: [
              {
                label: "Site-wise Deposits",
                data: Object.values(siteWise),
                backgroundColor: "rgba(75, 192, 192, 0.5)",
              },
            ],
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-gray-700">Total Deposit</h2>
          <p className="text-2xl font-extrabold text-blue-600 mt-2">
            ₹{statistics.totalDeposit.toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-gray-700">Total Withdraw</h2>
          <p className="text-2xl font-extrabold text-red-600 mt-2">
            ₹{statistics.totalWithdraw.toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-gray-700">Current Balance</h2>
          <p className="text-2xl font-extrabold text-purple-600 mt-2">
            ₹{statistics.currentBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bank Wise Graph */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Bank Wise</h2>
          <div className="h-64">
            {bankData.labels ? (
              <Bar data={bankData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            ) : (
              <p className="text-gray-500 text-center">No data available</p>
            )}
          </div>
        </div>
        {/* Site Wise Graph */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Site Wise</h2>
          <div className="h-64">
            {siteData.labels ? (
              <Bar data={siteData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            ) : (
              <p className="text-gray-500 text-center">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Bank Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                <th className="border border-gray-300 px-4 py-2 text-left">UTR</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{transaction.bankName}</td>
                    <td className="border border-gray-300 px-4 py-2">₹{transaction.amount.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{transaction.utr}</td>
                    <td className="border border-gray-300 px-4 py-2">{transaction.date}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.timestamp
                        ? new Date(transaction.timestamp).toLocaleTimeString()
                        : ""}
                    </td>
                    <td className={`border-l border-gray-300 px-4 py-2 ${transaction.actionType === 'deposit' ? 'text-white bg-green-500' : 'text-white bg-red-500'}`}>
                      {transaction.actionType.charAt(0).toUpperCase() + transaction.actionType.slice(1)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;