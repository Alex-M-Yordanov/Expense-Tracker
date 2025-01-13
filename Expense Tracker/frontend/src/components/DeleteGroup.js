import React, { useState, useEffect } from "react";
import axios from "axios";

const DeleteGroup = () => {
  const [groups, setGroups] = useState([]); // Store groups
  const [selectedGroup, setSelectedGroup] = useState(""); // Track selected group

  // Fetch groups from the server
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/groups");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };
    fetchGroups();
  }, []);

  // Handle group deletion
  const handleDeleteGroup = async () => {
    if (!selectedGroup) {
      alert("Please select a group to delete.");
      return;
    }

    // Confirmation dialog
    if (
      window.confirm(
        "Are you sure you want to delete this group? This will also delete all associated expenses."
      )
    ) {
      try {
        // Send DELETE request to remove the group and its associated expenses
        await axios.delete(`http://127.0.0.1:5000/groups/${selectedGroup}`);
        alert("Group and associated expenses deleted!");

        // Update the UI by removing the deleted group
        setGroups(groups.filter((group) => group.id !== parseInt(selectedGroup)));
        setSelectedGroup(""); // Reset selection
      } catch (error) {
        console.error("Error deleting group", error);
        alert("Failed to delete group. Please try again later.");
      }
    }
  };

  return (
    <div className="delete-group-container">
      {groups.length > 0 ? (
        <>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="delete-group-dropdown"
          >
            <option value="">Select a group to delete</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleDeleteGroup}
            className="delete-group-button"
            disabled={!selectedGroup}
          >
            Delete
          </button>
        </>
      ) : (
        <p>No groups available to delete.</p>
      )}
    </div>
  );
};

export default DeleteGroup;
