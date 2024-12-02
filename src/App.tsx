import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import Site from "./components/Site";
import Bank from "./components/Bank";
import Deposit from "./components/Deposit";
import Reports from "./components/Reports";
import Dashboard from "./components/Dashboard";
import Admin from "./components/Admin";
import { ref, get } from "firebase/database";
import { database } from "./components/firebase"; // Import the initialized database

export default function App() {
  const [currentView, setCurrentView] = useState<'site' | 'bank' | 'deposit' | 'reports' | 'dashboard' | 'admin'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login state
  const [id, setId] = useState("");  // Track input for ID
  const [password, setPassword] = useState("");  // Track input for Password
  const [userCredentials, setUserCredentials] = useState<any>(null); // Track user credentials fetched from DB
  const [isAdminLogin, setIsAdminLogin] = useState(false); // Track if admin login is being initiated
  const [adminPassword, setAdminPassword] = useState(""); // Store admin password input
  const [loading, setLoading] = useState(false); // Track loading state
  const [loginAttempted, setLoginAttempted] = useState(false);  // Track if login was attempted

  // Fetch user credentials from Firebase
  const fetchUserCredentials = async () => {
    setLoading(true); // Set loading state to true
    const userRef = ref(database, "employees/" + id);  // Assuming "employees" is the node storing user data
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      setUserCredentials(snapshot.val());
    } else {
      alert("User not found.");
    }
    setLoading(false); // Set loading state to false after fetching data
  };

  // Handle login form submission
  const handleLogin = async () => {
    setLoginAttempted(true);  // Mark login as attempted
    await fetchUserCredentials();
  };

  // Handle admin login
  const handleAdminLogin = () => {
    if (adminPassword === "d78khjryw") {
      setIsLoggedIn(true);
      setCurrentView("admin");
      setIsAdminLogin(true); // Set admin login state to true
    } else {
      alert("Invalid admin password.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);  // Reset logged in state
    setId("");  // Clear ID
    setPassword("");  // Clear Password
    setUserCredentials(null);  // Clear credentials
    setIsAdminLogin(false); // Reset admin login state
  };

  // Perform the validation when the user credentials are fetched or login is attempted
  useEffect(() => {
    if (loginAttempted && userCredentials) {
      if (userCredentials.password === password) {
        setIsLoggedIn(true);  // Set logged in state
      } else {
        alert("Invalid credentials, please try again.");
      }
      setLoginAttempted(false); // Reset the login attempt flag
    }
  }, [userCredentials, loginAttempted, password]);

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
              {loading ? "Loading..." : "Login"}
            </button>
            <div className="text-center mt-4">
              <p
                onClick={() => setIsAdminLogin(true)}
                className="text-sm text-gray-400 cursor-pointer hover:text-gray-100"
              >
                Continue as Admin
              </p>
            </div>
          </div>
        </div>

        {/* Admin Login Prompt */}
        {isAdminLogin && (
          <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 fixed inset-0 z-10">
            <div className="bg-gray-800 p-8 rounded-3xl shadow-md w-96">
              <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    id="adminPassword"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-xl text-gray-200"
                    placeholder="Enter Admin Password"
                  />
                </div>
                <button
                  onClick={handleAdminLogin}
                  className="w-full mt-4 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Login as Admin
                </button>
                <button
                  onClick={() => setIsAdminLogin(false)}
                  className="w-full mt-4 p-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <Sidebar 
        onViewChange={setCurrentView} 
        currentView={currentView} 
        onLogout={handleLogout}
        isAdminLoggedIn={isAdminLogin}  // Pass admin login status
      />

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {currentView === "dashboard" && <Dashboard />}
          {currentView === "site" && <Site />}
          {currentView === "bank" && <Bank />}
          {currentView === "deposit" && <Deposit accessType={userCredentials?.accessType} />}
          {currentView === "reports" && <Reports />}
          {currentView === "admin" && <Admin />}
        </div>
      </main>
    </div>
  );
}