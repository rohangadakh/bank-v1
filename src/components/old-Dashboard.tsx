import { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BankEntry, BankName } from '../types/banking';
import { Employee } from '../types/employee';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';
import { ChevronDown, Calendar } from 'lucide-react';

interface DashboardProps {
  entries: BankEntry[];
  employees: Employee[];
  dateFilter: Date;
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
const bankOptions: BankName[] = ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One'];

export function Dashboard({ entries, employees, dateFilter }: DashboardProps) {
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const filteredEntries = entries.filter(entry => {
    const entryDate = parseISO(entry.date);
    const dateMatch = isWithinInterval(entryDate, {
      start: startOfMonth(dateFilter),
      end: endOfMonth(dateFilter)
    });
    const bankMatch = selectedBank === 'all' || entry.bankName === selectedBank;
    return dateMatch && bankMatch;
  });

  const totalAmount = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalBalance = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0); // Assuming balance data is included here

  const accessData = [
    { name: 'Read Only', value: employees.filter(e => e.access === 'read').length },
    { name: 'Write Only', value: employees.filter(e => e.access === 'write').length },
    { name: 'Read & Write', value: employees.filter(e => e.access === 'read-write').length },
  ];

  const bankData = entries.reduce((acc, entry) => {
    const existing = acc.find(item => item.name === entry.bankName);
    if (existing) {
      existing.value += entry.amount;
    } else {
      acc.push({ name: entry.bankName, value: entry.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-gray-600">
            Amount: ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Charts Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Amount by Bank</h3>
            <div className="relative">
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="appearance-none bg-white text-gray-900 border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Banks</option>
                {bankOptions.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div ref={chartContainerRef} className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bankData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#374151' }} />
                <YAxis tick={{ fill: '#374151' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Employee Access Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={accessData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                fill="#2563eb"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {accessData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Cards */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Total Amount</h3>
            <p className="text-3xl font-bold text-blue-600">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Total Balance</h3>
            <p className="text-3xl font-bold text-blue-600">${totalBalance.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-gray-900">Bank Name</th>
                  <th className="px-4 py-3 text-left text-gray-900">Master Code</th>
                  <th className="px-4 py-3 text-left text-gray-900">Amount</th>
                  <th className="px-4 py-3 text-left text-gray-900">Balance</th>
                  <th className="px-4 py-3 text-left text-gray-900">Inital Balance</th>
                  <th className="px-4 py-3 text-left text-gray-900">Date</th>
                  <th className="px-4 py-3 text-left text-gray-900">UTR No</th> {/* Added UTR No */}
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{entry.bankName}</td>
                    <td className="px-4 py-3 text-gray-900">{entry.masterCode}</td>
                    <td className="px-4 py-3 text-gray-900">${entry.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-900">${entry.amount.toLocaleString()}</td> {/* Balance assumed as same as amount */}
                    <td className="px-4 py-3 text-gray-900">
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{entry.date}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{entry.utrNo}</td> {/* Display UTR No */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}