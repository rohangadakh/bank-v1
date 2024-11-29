import React, { useState, useEffect } from "react";
import { Send, Edit2, Trash2 } from "lucide-react";
import { ref, set, get, update } from "firebase/database";
import { database } from "./firebase"; // Import the initialized database

const Admin: React.FC = () => {
  const [password, setPassword] = useState<string>(""); // Admin password
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Admin authentication state
  const [username, setUsername] = useState<string>(""); // Employee username
  const [userId, setUserId] = useState<string>(""); // Employee ID
  const [employeePassword, setEmployeePassword] = useState<string>(""); // Employee password
  const [accessType, setAccessType] = useState<string>("readonly"); // Employee access type
  const [employees, setEmployees] = useState<any[]>([]); // List of employees

  // Handle admin password submission
  const handlePasswordSubmit = () => {
    if (password === "778899") {
      setIsAuthenticated(true);
      setPassword(""); // Clear the password input field
    } else {
      alert("Incorrect password!");
    }
  };

  // Handle employee data submission (including employee password)
  const handleAddEmployee = () => {
    if (username.trim() && userId.trim() && accessType && employeePassword.trim()) {
      const newEmployeeRef = ref(database, "employees/" + userId);
      set(newEmployeeRef, {
        username,
        userId,
        accessType,
        password: employeePassword, // Store the employee's password
      })
        .then(() => {
          console.log("Employee added successfully");
          setUsername("");
          setUserId("");
          setEmployeePassword(""); // Clear the employee password field
          setAccessType("readonly");
          fetchEmployees(); // Refresh the employee list
        })
        .catch((error) => {
          console.error("Error adding employee: ", error);
        });
    } else {
      alert("Please fill in all fields!");
    }
  };

  // Fetch employees from Firebase Realtime Database
  const fetchEmployees = () => {
    const employeesRef = ref(database, "employees");
    get(employeesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const employeesData = snapshot.val();
          const employeeArray = Object.keys(employeesData).map((key, index) => ({
            id: key,
            username: employeesData[key].username,
            userId: employeesData[key].userId,
            accessType: employeesData[key].accessType,
          }));
          setEmployees(employeeArray); // Update the employees state
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching employees: ", error);
      });
  };

  // Update access type of an employee
  const handleEditEmployee = (userId: string, newAccessType: string) => {
    const employeeRef = ref(database, "employees/" + userId);
    update(employeeRef, {
      accessType: newAccessType,
    })
      .then(() => {
        console.log("Employee updated successfully");
        fetchEmployees(); // Refresh the employee list
      })
      .catch((error) => {
        console.error("Error updating employee: ", error);
      });
  };

  // Fetch employees on initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchEmployees();
    }
  }, [isAuthenticated]);

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        // Admin login form
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Admin Password"
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handlePasswordSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 flex items-center space-x-2 mt-4"
          >
            <Send className="w-4 h-4" />
            <span>Login</span>
          </button>
        </div>
      ) : (
        // Admin form to add new employee
        <div>
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Add Employee</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                value={employeePassword}
                onChange={(e) => setEmployeePassword(e.target.value)}
                placeholder="Enter Employee Password"
                className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={accessType}
                onChange={(e) => setAccessType(e.target.value)}
                className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="readonly">Read Only</option>
                <option value="readwrite">Read - Write</option>
              </select>
            </div>
            <button
              onClick={handleAddEmployee}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 flex items-center space-x-2 mt-4"
            >
              <Send className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>

          {/* Display Employees Table */}
          <div className="bg-white shadow-md rounded-xl p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Employee List</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-300">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="border-r border-gray-300 px-4 py-2 text-left">Username</th>
                    <th className="border-r border-gray-300 px-4 py-2 text-left">User ID</th>
                    <th className="border-r border-gray-300 px-4 py-2 text-left">Access Type</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="border-r border-gray-300 px-4 py-2">{employee.username}</td>
                      <td className="border-r border-gray-300 px-4 py-2">{employee.userId}</td>
                      <td className="border-r border-gray-300 px-4 py-2">{employee.accessType}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button
                          onClick={() =>
                            handleEditEmployee(
                              employee.userId,
                              employee.accessType === "readonly" ? "readwrite" : "readonly"
                            )
                          }
                          className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;