import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Employee } from '../types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
  onAddBank: () => void;
  onAddEXCHCode: () => void;
}

export function EmployeeTable({ employees, onAddEmployee, onAddBank, onAddEXCHCode }: EmployeeTableProps) {
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showEXCHCodeForm, setShowEXCHCodeForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: '',
    name: '',
    role: '',
    access: 'read-write',
    department: '',
    joinDate: '',
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmployee.name && newEmployee.role && newEmployee.department) {
      onAddEmployee(newEmployee);
      setNewEmployee({
        id: '',
        name: '',
        role: '',
        access: 'read-write',
        department: '',
        joinDate: '',
      });
      setShowEmployeeForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Management</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowEmployeeForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Employee</span>
          </button>
          <button
            onClick={() => setShowBankForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Bank</span>
          </button>
          <button
            onClick={() => setShowEXCHCodeForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>EXCH</span>
          </button>
        </div>
      </div>

      {/* Show Employee Form */}
      {showEmployeeForm && (
        <form className="mb-6 p-4 border border-gray-100 rounded-lg" onSubmit={handleAddEmployee}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Employee Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              type="text"
              placeholder="Role"
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              type="text"
              placeholder="Department"
              value={newEmployee.department}
              onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              type="date"
              value={newEmployee.joinDate}
              onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowEmployeeForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Employee
            </button>
          </div>
        </form>
      )}

      {/* Show Bank Form */}
      {showBankForm && (
        <form className="mb-6 p-4 border border-gray-100 rounded-lg">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Bank Name"
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowBankForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Bank
            </button>
          </div>
        </form>
      )}

      {/* Show EXCH Code Form */}
      {showEXCHCodeForm && (
        <form className="mb-6 p-4 border border-gray-100 rounded-lg">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="EXCH Code"
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowEXCHCodeForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Save EXCH Code
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left">Employee Name</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Join Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">{employee.name}</td>
                <td className="px-4 py-3">{employee.role}</td>
                <td className="px-4 py-3">{employee.department}</td>
                <td className="px-4 py-3">{employee.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
