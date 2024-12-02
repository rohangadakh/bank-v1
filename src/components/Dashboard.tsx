import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "./firebase";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Transaction {
  bankName: string;
  site: string;
  amount: number;
  utr: string;
  date: string;
  timestamp: string;
  actionType: string;
}

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState({
    totalDeposit: 0,
    totalWithdraw: 0,
    currentBalance: 0,
    totalInitialBalance: 0,
    totalMistakes: 0,
    totalBonus: 0,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankData, setBankData] = useState<any>({});
  const [siteData, setSiteData] = useState<any>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchData = async () => {
    const depositsRef = ref(database, "deposits");
    const banksRef = ref(database, "banks");
    const sitesRef = ref(database, "sites");

    try {
      const [depositsSnapshot, banksSnapshot, sitesSnapshot] = await Promise.all([
        get(depositsRef),
        get(banksRef),
        get(sitesRef),
      ]);

      const depositData = depositsSnapshot.val() || {};
      const bankData = banksSnapshot.val() || {};
      const siteData = sitesSnapshot.val() || {};

      // Calculate statistics based on deposits (if any) and banks/sites data
      let totalDeposit = 0;
      let totalWithdraw = 0;
      let totalBonus = 0;
      let totalMistakes = 0;
      let totalInitialBalance = 0;

      if (Object.keys(depositData).length > 0) {
        // Process deposit data if it exists
        const transactionList: Transaction[] = Object.keys(depositData).map((key) => ({
          bankName: depositData[key].bank || "",
          site: depositData[key].site || "",
          amount: depositData[key].amount || 0,
          utr: depositData[key].utr || "",
          bonus: depositData[key].bonus || "",
          date: depositData[key].date || "",
          timestamp: depositData[key].timestamp || "",
          actionType: depositData[key].actionType || "",
        }));

        // Filter and calculate totals from deposit data
        transactionList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const filteredTransactions = transactionList.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            (!startDate || transactionDate >= startDate) &&
            (!endDate || transactionDate <= endDate)
          );
        });

        totalDeposit = filteredTransactions
          .filter((transaction) => transaction.actionType === "deposit")
          .reduce((acc, curr) => acc + curr.amount, 0);

        totalWithdraw = filteredTransactions
          .filter((transaction) => transaction.actionType === "withdraw")
          .reduce((acc, curr) => acc + curr.amount, 0);

        totalBonus = Object.values(depositData)
          .map((deposit: any) => deposit.bonus || 0)
          .reduce((acc, curr) => acc + curr, 0);

        setTransactions(filteredTransactions);
      }

      // Calculate totalMistakes from siteData
      totalMistakes = Object.values(siteData)
        .map((site: any) => site.mistake || 0) // Fetch mistakes or default to 0
        .reduce((acc, curr) => acc + curr, 0);

      // Calculate totalInitialBalance from bankData
      totalInitialBalance = Object.values(bankData)
        .map((bank: any) => bank.initialBalance || 0)
        .reduce((acc, curr) => acc + curr, 0);

      const currentBalance = totalDeposit - totalWithdraw;

      setStatistics({
        totalDeposit,
        totalWithdraw,
        currentBalance,
        totalInitialBalance,
        totalMistakes,
        totalBonus,
      });

      // Process data for charts (even if deposits are empty)
      const bankWise = Object.values(depositData).reduce<Record<string, number>>((acc, curr) => {
        acc[curr.bankName] = (acc[curr.bankName] || 0) + curr.amount;
        return acc;
      }, {});

      const siteWise = Object.values(depositData).reduce<Record<string, number>>((acc, curr) => {
        acc[curr.site] = (acc[curr.site] || 0) + curr.amount;
        return acc;
      }, {});

      // Update chart data, use empty sets if no deposits data
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
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-700">Select Date Range</h2>
        <div className="flex space-x-4">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            placeholderText="Start Date"
            className="p-2 border rounded"
            dateFormat="dd/MM/yyyy"
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            placeholderText="End Date"
            className="p-2 border rounded"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-gray-700">Total Initial Balance</h2>
          <p className="text-2xl font-extrabold text-gray-700 mt-2">
            ₹{statistics.totalInitialBalance.toLocaleString()}
          </p>
        </div>
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
          <h2 className="text-lg font-bold text-gray-700">Total Mistakes</h2>
          <p className="text-2xl font-extrabold text-yellow-600 mt-2">
            ₹{statistics.totalMistakes.toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-gray-700">Total Bonus</h2>
          <p className="text-2xl font-extrabold text-green-600 mt-2">
            ₹{statistics.totalBonus.toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-gray-700">Current Balance</h2>
          <p className="text-2xl font-extrabold text-purple-600 mt-2">
            ₹{statistics.currentBalance.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Recent Transactions</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="border border-gray-600 bg-gray-200">
              <th className="border border-gray-600 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-600 px-4 py-2 text-left">Bank</th>
              <th className="border border-gray-600 px-4 py-2 text-left">Site</th>
              <th className="border border-gray-600 px-4 py-2 text-left">Amount</th>
              <th className="border border-gray-600 px-4 py-2 text-left">Action Type</th>
              <th className="border border-gray-600 px-4 py-2 text-left">UTR</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.utr} className="border border-gray-600">
                <td className="border border-gray-600 px-4 py-2">{new Date(transaction.date).toLocaleDateString()}</td>
                <td className="border border-gray-600 px-4 py-2">{transaction.bankName}</td>
                <td className="border border-gray-600 px-4 py-2">{transaction.site}</td>
                <td className="border border-gray-600 px-4 py-2">₹{transaction.amount.toLocaleString()}</td>
                <td className="border border-gray-600 px-4 py-2">{transaction.actionType}</td>
                <td className="border border-gray-600 px-4 py-2">{transaction.utr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;