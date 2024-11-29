import { useState } from 'react';
import { BankEntry } from '../types/banking';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react'; // Import the Download icon

interface BankingTableWithFiltersProps {
  entries: BankEntry[];
}

export function BankingTableWithFilters({ entries }: BankingTableWithFiltersProps) {
  const [filters, setFilters] = useState({
    bankName: '',
    exchCode: '',
    action: '',
    dateRange: { startDate: '', endDate: '' },
  });

  // Filter entries based on user input
  const filteredEntries = entries.filter((entry) => {
    const matchesBankName = filters.bankName ? entry.bankName.includes(filters.bankName) : true;
    const matchesExchCode = filters.exchCode ? entry.masterCode.includes(filters.exchCode) : true;
    const matchesAction = filters.action ? entry.action.includes(filters.action) : true;
    const matchesDateRange =
      filters.dateRange.startDate && filters.dateRange.endDate
        ? new Date(entry.date) >= new Date(filters.dateRange.startDate) &&
          new Date(entry.date) <= new Date(filters.dateRange.endDate)
        : true;

    return matchesBankName && matchesExchCode && matchesAction && matchesDateRange;
  });

  // Function to download filtered entries as Excel
  const handleDownloadReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEntries.map(({ id, ...entry }) => entry) // Remove `id` from the export
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');
    XLSX.writeFile(workbook, 'Filtered_Report.xlsx');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Filter Transactions</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Bank Name"
          value={filters.bankName}
          onChange={(e) => setFilters({ ...filters, bankName: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="text"
          placeholder="Filter by EXCH Code"
          value={filters.exchCode}
          onChange={(e) => setFilters({ ...filters, exchCode: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          type="text"
          placeholder="Filter by Action"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
        <div className="flex space-x-2">
          <input
            type="date"
            placeholder="Start Date"
            value={filters.dateRange.startDate}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, startDate: e.target.value },
              })
            }
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="date"
            placeholder="End Date"
            value={filters.dateRange.endDate}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, endDate: e.target.value },
              })
            }
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <button
  onClick={handleDownloadReport}
  className="mb-4 bg-green-600 text-white flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-green-700 transition"
>
  <Download className="w-5 h-5" /> {/* Add the icon */}
  <span>Download Report</span>
</button>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Bank Name</th>
            <th className="border border-gray-300 px-4 py-2">EXCH Code</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">UTR No.</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map((entry) => (
            <tr key={entry.id}>
              <td className="border border-gray-300 px-4 py-2">{entry.bankName}</td>
              <td className="border border-gray-300 px-4 py-2">{entry.masterCode}</td>
              <td className="border border-gray-300 px-4 py-2">{entry.action}</td>
              <td className="border border-gray-300 px-4 py-2">{entry.amount}</td>
              <td className="border border-gray-300 px-4 py-2">{entry.utrNo}</td>
              <td className="border border-gray-300 px-4 py-2">{entry.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}