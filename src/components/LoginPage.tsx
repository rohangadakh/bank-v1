import React, { useState } from 'react';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Default credentials
  const DEFAULT_ID = '8804789764';
  const DEFAULT_PASSWORD = '8804789764';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (userId === DEFAULT_ID && password === DEFAULT_PASSWORD) {
      setError('');
      setIsLoggedIn(true);
    } else {
      setError('Invalid ID or Password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Login</h1>
        {!isLoggedIn ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your User ID"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your Password"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-600">Welcome!</h2>
            <p className="mt-4 text-gray-700">You have successfully logged in.</p>
          </div>
        )}
      </div>
    </div>
  );
}
