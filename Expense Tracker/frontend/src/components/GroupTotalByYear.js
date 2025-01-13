import React, { useState, useEffect } from "react";
import axios from "axios";

const GroupTotalByYear = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [year, setYear] = useState("");
  const [total, setTotal] = useState(null);
  const [error, setError] = useState("");
  const [groupName, setGroupName] = useState("");

  // Fetch the list of groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/groups");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, []);

  // Fetch total spent for the selected group in the specified year
  const fetchTotal = async () => {
    if (!year || !selectedGroup) {
      setError("Please select a group and enter a year.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:5000/expenses/total_year_group", {
        params: { year, group_id: selectedGroup },
      });

      // Set the total and clear errors
      setTotal(response.data.total_spent);
      setError("");

      // Dynamically update group name
      const selectedGroupData = groups.find((group) => group.id === parseInt(selectedGroup));
      setGroupName(selectedGroupData ? selectedGroupData.name : "");
    } catch (error) {
      console.error("Error fetching total by year and group:", error);
      setError("Failed to fetch total for the year and group. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <select
          id="group-select"
          value={selectedGroup}
          onChange={(e) => {
            const groupId = e.target.value;
            setSelectedGroup(groupId);

            // Dynamically update groupName when group changes
            const selectedGroupData = groups.find((group) => group.id === parseInt(groupId));
            setGroupName(selectedGroupData ? selectedGroupData.name : "");
          }}
          required
        >
          <option value="">--Select Category--</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          id="year-input"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Enter year (e.g., 2024)"
          required
        />
      </div>

      <button onClick={fetchTotal}>Calculate</button>

      {/* Display result dynamically */}
      {total !== null && (
        <div>
          <h3 className="output">
            Total spent for <span className="highlight">{groupName}</span> in {year}:{" "}
            <span className="result">{total.toFixed(2)}</span>лв.
          </h3>
        </div>
      )}

      {/* Display error if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GroupTotalByYear;

