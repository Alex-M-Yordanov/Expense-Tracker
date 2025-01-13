import React, { useState, useEffect } from "react";
import axios from "axios";

const GroupTotalByMonth = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [month, setMonth] = useState("");
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

  // Fetch total spent for the selected group in the specified month/year
  const fetchTotal = async () => {
    if (!month || !year || !selectedGroup) {
      setError("Please select a group and provide both month and year.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:5000/expenses/total_month_year_group", {
        params: { month, year, group_id: selectedGroup },
      });

      // Set the total and clear errors
      setTotal(response.data.total_spent);
      setError("");

      // Dynamically update group name
      const selectedGroupData = groups.find((group) => group.id === parseInt(selectedGroup));
      setGroupName(selectedGroupData ? selectedGroupData.name : ""); // Update groupName if valid
    } catch (error) {
      console.error("Error fetching total by month, year, and group:", error);
      setError("Failed to fetch total for the specified period and group. Please try again.");
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
            setGroupName(selectedGroupData ? selectedGroupData.name : ""); // Update groupName
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
          id="month-input"
          type="number"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="Enter month (1-12)"
          required
        />
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

      
      {total !== null && (
        <div>
          <h3 className="output">
            Total spent for <span className="highlight">{groupName}</span> in {month}/{year}:{" "}
            <span className="result">{total.toFixed(2)}</span>лв.
          </h3>
        </div>
      )}

      
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GroupTotalByMonth;
