import React, { useState, useEffect } from "react";
import { FileText, Sheet } from "lucide-react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getDatabase, ref, onValue } from "firebase/database";

// Define the Deposit interface
interface Deposit {
  utr: string;
  actionType: string;
  amount: number;
  bank: string;
  date: string;
  name: string;
  remark: string;
  site: string;
  timestamp: string;
}

const Reports: React.FC = () => {
  const [data, setData] = useState<Deposit[]>([]);
  const [filteredData, setFilteredData] = useState<Deposit[]>([]);
  const [filters, setFilters] = useState({
    site: "",
    bank: "",
    startDate: "",
    endDate: "",
  });

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    const db = getDatabase();
    const depositsRef = ref(db, "deposits");

    onValue(depositsRef, (snapshot) => {
      const firebaseData: Deposit[] = []; // Explicitly type firebaseData as Deposit[]
      snapshot.forEach((childSnapshot) => {
        firebaseData.push(childSnapshot.val() as Deposit); // Cast each entry to Deposit
      });
      setData(firebaseData);
      setFilteredData(firebaseData); // Initialize filtered data
    });
  }, []);

  // Handle filter changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  useEffect(() => {
    const { site, bank, startDate, endDate } = filters;

    const filtered = data.filter((item) => {
      const matchesSite = site ? item.site === site : true;
      const matchesBank = bank ? item.bank === bank : true;
      const matchesStartDate = startDate
        ? new Date(item.date) >= new Date(startDate)
        : true;
      const matchesEndDate = endDate
        ? new Date(item.date) <= new Date(endDate)
        : true;
      return matchesSite && matchesBank && matchesStartDate && matchesEndDate;
    });

    setFilteredData(filtered);
  }, [filters, data]);

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Sr. No.",
      "UTR",
      "Action Type",
      "Amount",
      "Bank",
      "Date",
      "Name",
      "Remark",
      "Site",
    ];
    const tableRows = filteredData.map((row, index) => [
      index + 1,
      row.utr,
      row.actionType,
      row.amount,
      row.bank,
      row.date,
      row.name,
      row.remark,
      row.site,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });
    doc.save("report.pdf");
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((row, index) => ({
        SrNo: index + 1,
        UTR: row.utr,
        ActionType: row.actionType,
        Amount: row.amount,
        Bank: row.bank,
        Date: row.date,
        Name: row.name,
        Remark: row.remark,
        Site: row.site,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Site</label>
            <select
              name="site"
              value={filters.site}
              onChange={handleFilterChange}
              className="w-full border rounded-xl p-2"
            >
              <option value="">All Sites</option>
              {Array.from(new Set(data.map((item) => item.site))).map(
                (site) => (
                  <option key={site} value={site}>
                    {site}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bank</label>
            <select
              name="bank"
              value={filters.bank}
              onChange={handleFilterChange}
              className="w-full border rounded-xl p-2"
            >
              <option value="">All Banks</option>
              {Array.from(new Set(data.map((item) => item.bank))).map(
                (bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full border rounded-xl p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full border rounded-xl p-2"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={exportToPDF}
            className="bg-red-500 text-white px-4 py-2 rounded-xl"
          >
            <FileText className="w-4 h-4 inline" /> Get PDF
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-xl"
          >
            <Sheet className="w-4 h-4 inline" /> Get Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Report Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">Sr. No.</th>
                <th className="border border-gray-400  px-4 py-2">UTR</th>
                <th className="border border-gray-400  px-4 py-2">Action Type</th>
                <th className="border border-gray-400  px-4 py-2">Amount</th>
                <th className="border border-gray-400  px-4 py-2">Bank</th>
                <th className="border border-gray-400  px-4 py-2">Date</th>
                <th className="border border-gray-400  px-4 py-2">Name</th>
                <th className="border border-gray-400  px-4 py-2">Remark</th>
                <th className="border border-gray-400  px-4 py-2">Site</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400  px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-400  px-4 py-2">{row.utr}</td>
                    <td className="border border-gray-400  px-4 py-2">{row.actionType}</td>
                    <td className="border border-gray-400  px-4 py-2">{row.amount}</td>
                    <td className="border border-gray-400  px-4 py-2">{row.bank}</td>
                    <td className="border border-gray-400  px-4 py-2">{row.date}</td>
                    <td className="border border-gray-400  px-4 py-2">{row.name}</td>
                    <td className="border border-gray-400  px-4 py-2">{row.remark}</td>
                    <td className="border border-gray-400  px-4 py-2">{row.site}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="border px-4 py-2 text-center">
                    No data available
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

export default Reports;