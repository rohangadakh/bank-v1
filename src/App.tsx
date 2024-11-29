import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import Site from "./components/Site";
import Bank from "./components/Bank";
import Deposit from "./components/Deposit";
import Withdraw from "./components/WithDraw";
import Reports from "./components/Reports";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [currentView, setCurrentView] = useState<'site' | 'bank' | 'deposit' | 'withdraw' | 'reports' | 'dashboard'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login state
  const [id, setId] = useState("");  // Track input for ID
  const [password, setPassword] = useState("");  // Track input for Password

  // Handle login form submission
  const handleLogin = () => {
    if (id === "8804789764" && password === "8804789764") {
      setIsLoggedIn(true);  // Set logged in state
    } else {
      alert("Invalid credentials, please try again.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);  // Reset logged in state
    setId("");  // Clear ID
    setPassword("");  // Clear Password
  };

  if (isLoggedIn) {
    // If not logged in, show the login form
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
        <div className="bg-gray-800 p-8 rounded-3xl shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Login to System</h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-xl text-gray-200"
                placeholder="Enter your ID"
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-xl text-gray-200"
                placeholder="Enter your Password"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full mt-4 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <Sidebar onViewChange={setCurrentView} currentView={currentView} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {currentView === "dashboard" && <Dashboard />}
          {currentView === "site" && <Site />}
          {currentView === "bank" && <Bank />}
          {currentView === "deposit" && <Deposit />}
          {currentView === "withdraw" && <Withdraw />}
          {currentView === "reports" && <Reports />}
        </div>
      </main>
    </div>
  );
}
