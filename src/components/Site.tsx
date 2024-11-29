import React, { useState, useEffect } from "react";
import { Send, Trash2 } from "lucide-react";
import { ref, set, remove, get } from "firebase/database";
import { database } from "./firebase"; // Import the initialized database

const Site: React.FC = () => {
  const [siteName, setSiteName] = useState<string>("");
  const [sites, setSites] = useState<any[]>([]);

  const handleSubmit = () => {
    if (siteName.trim() !== "") {
      const newSiteRef = ref(database, "sites/" + siteName);
      set(newSiteRef, { name: siteName })
        .then(() => {
          console.log("Site added successfully");
          setSiteName(""); // Clear input field
          fetchSites();  // Refresh the list of sites
        })
        .catch((error) => {
          console.error("Error adding site: ", error);
        });
    }
  };

  const fetchSites = () => {
    const sitesRef = ref(database, "sites");
    get(sitesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const sitesData = snapshot.val();
          const siteArray = Object.keys(sitesData).map((key, index) => ({
            id: key,
            name: sitesData[key].name,
            srNo: index + 1,
          }));
          setSites(siteArray);  // Update the sites state
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching sites: ", error);
      });
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleDelete = (id: string) => {
    const siteRef = ref(database, "sites/" + id);
    remove(siteRef)
      .then(() => {
        console.log("Site deleted successfully");
        fetchSites();  // Refresh the list after deletion
      })
      .catch((error) => {
        console.error("Error deleting site: ", error);
      });
  };

  return (
    <div className="space-y-6">
      {/* Add Site Card */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Add Site</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Enter Site name"
            className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Manage Sites Card */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Manage Sites</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="border-r border-gray-300 px-4 py-2 text-left">S.No</th>
                <th className="border-r border-gray-300 px-4 py-2 text-left">Site Name</th>
                <th className="border- border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.id}>
                  <td className="border-r border-gray-300 px-4 py-2">{site.srNo}</td>
                  <td className="border-r border-gray-300 px-4 py-2">{site.name}</td>
                  <td className=" px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="bg-red-500 text-white px-8 py-2 rounded-xl hover:bg-red-600 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
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
