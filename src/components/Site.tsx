import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { ref, set, get, remove, update } from "firebase/database";
import { database } from "./firebase"; // Import the initialized Firebase database

const Site: React.FC = () => {
  const [sites, setSites] = useState<any[]>([]);
  const [newSiteName, setNewSiteName] = useState<string>(""); // For adding a new site
  const [selectedSite, setSelectedSite] = useState<string>(""); // For site selection
  const [mistake, setMistake] = useState<number>(0); // Mistake value for selected site
  const [showSiteInput, setShowSiteInput] = useState(false); // Toggle for adding a new site

  // Fetch sites from Firebase
  const fetchSites = async () => {
    const sitesRef = ref(database, "sites");
    const snapshot = await get(sitesRef);
    if (snapshot.exists()) {
      const sitesData = snapshot.val();
      const sitesArray = Object.keys(sitesData).map((key) => ({
        id: key,
        name: sitesData[key].name,
        mistake: sitesData[key].mistake || 0, // Default value
      }));
      setSites(sitesArray);
    }
  };

  // Add a new site to Firebase
  const handleAddSite = () => {
    if (newSiteName.trim() !== "") {
      const newSiteRef = ref(database, `sites/${newSiteName}`);
      set(newSiteRef, { name: newSiteName, mistake: 0 }) // Default mistake value is 0
        .then(() => {
          console.log("Site added successfully");
          setNewSiteName("");
          setShowSiteInput(false);
          fetchSites(); // Refresh site list
        })
        .catch((error) => console.error("Error adding site:", error));
    }
  };

  // Update mistake value for a selected site in Firebase
  const handleUpdateMistake = () => {
    if (selectedSite) {
      const siteRef = ref(database, `sites/${selectedSite}`);
      update(siteRef, { mistake }) // Update mistake value
        .then(() => {
          console.log("Mistake value updated successfully");
          fetchSites(); // Refresh site list
        })
        .catch((error) => console.error("Error updating mistake:", error));
    }
  };

  // Delete a site from Firebase
  const handleDeleteSite = (id: string) => {
    const siteRef = ref(database, `sites/${id}`);
    remove(siteRef)
      .then(() => {
        console.log("Site deleted successfully");
        fetchSites(); // Refresh site list
      })
      .catch((error) => console.error("Error deleting site:", error));
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Site Management Form */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Manage Sites</h2>

        {/* Add New Site */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <select
              value={selectedSite}
              onChange={(e) => {
                const selectedId = e.target.value;
                setSelectedSite(selectedId);
                const selectedSiteData = sites.find((site) => site.id === selectedId);
                setMistake(selectedSiteData ? selectedSiteData.mistake : 0);
              }}
              className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowSiteInput(!showSiteInput)}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Add Site
            </button>
          </div>
          {showSiteInput && (
            <div className="mt-2">
              <input
                type="text"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                placeholder="Enter site name"
                className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddSite}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          )}
        </div>

        {/* Update Mistake Value */}
        {selectedSite && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mistake</label>
            <input
              type="number"
              value={mistake}
              onChange={(e) => setMistake(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUpdateMistake}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Update Mistake
            </button>
          </div>
        )}
      </div>

      {/* Sites Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Sites List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">S.No</th>
                <th className="border border-gray-300 px-4 py-2">Site Name</th>
                <th className="border border-gray-300 px-4 py-2">Mistake</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site, index) => (
                <tr key={site.id}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{site.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{site.mistake}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDeleteSite(site.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Site;
