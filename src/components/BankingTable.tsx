import { ChevronDown, Calendar, Plus } from 'lucide-react';
import { BankEntry, BankName } from '../types/banking';

const bankOptions: BankName[] = ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One'];

interface BankingTableProps {
  entries: BankEntry[];
  onAddEntry: () => void;
  onUpdateEntry: (id: string, field: keyof BankEntry, value: string | number) => void;
}

export function BankingTable({ entries, onAddEntry, onUpdateEntry }: BankingTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bank Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">EXCH Code</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">UTR No.</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="relative">
                  <select
                    value={entry.bankName}
                    onChange={(e) => onUpdateEntry(entry.id, 'bankName', e.target.value)}
                    className="appearance-none w-28 bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    {bankOptions.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={entry.masterCode}
                  onChange={(e) => onUpdateEntry(entry.id, 'masterCode', e.target.value)}
                  className="w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </td>
              <td className="px-4 py-3">
                <select
                  value={entry.action}
                  onChange={(e) => onUpdateEntry(entry.id, 'action', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="withdrawal">Withdrawal</option>
                  <option value="deposit">Deposit</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={entry.amount}
                  onChange={(e) => onUpdateEntry(entry.id, 'amount', parseFloat(e.target.value))}
                  className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={entry.utrNo}
                  onChange={(e) => onUpdateEntry(entry.id, 'utrNo', e.target.value)}
                  className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{entry.date}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button
        onClick={onAddEntry}
        className="mt-4 flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>Add Entry</span>
      </button>
    </div>
  );
}
