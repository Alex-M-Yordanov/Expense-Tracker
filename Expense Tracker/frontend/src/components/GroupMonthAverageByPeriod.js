import React, { useState, useEffect } from "react";
import axios from "axios";

const GroupMonthAverageByPeriod = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [average, setAverage] = useState(null);
  const [error, setError] = useState("");

  // Fetch groups on component mount
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

  const fetchAverage = async () => {
    if (!selectedGroup || !startDate || !endDate) {
      setError("Please select a group and provide both start and end dates.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:5000/expenses/average_monthly", {
        params: {
          group_id: selectedGroup,
          start_date: startDate,
          end_date: endDate,
        },
      });
      setAverage(response.data.average_monthly_spent);
      setError("");
    } catch (error) {
      console.error("Error fetching average monthly spending:", error);
      setError("Failed to fetch average monthly spending. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <label>
          Select Group:
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            required
          >
            <option value=""></option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Start Date:
          <input
            type="month"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          End Date:
          <input
            type="month"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
      </div>
      <button onClick={fetchAverage}>Calculate</button>
      {average !== null && (
        <div>
          <h3 className="output">
           Average monthly spending:{" "}
           <span className="result">{average.toFixed(2)}</span>лв.
          </h3>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GroupMonthAverageByPeriod;
