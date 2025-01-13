import React, { useState } from "react";
import axios from "axios";

const TotalByRange = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [total, setTotal] = useState(null);
  const [error, setError] = useState("");

  const fetchTotal = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:5000/expenses/total_range", {
        params: { start_date: startDate, end_date: endDate },
      });
      setTotal(response.data.total_spent);
      setError("");
    } catch (error) {
      console.error("Error fetching total:", error);
      setError("Failed to fetch total spent. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <label>
          Start Date:
          <input
            type="date"
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
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
      </div>
      <button onClick={fetchTotal}>Calculate</button>
      {total !== null && (
        <div>
          <h3 className="output">
            Total Spent from {startDate} to {endDate}:{" "}
            <span className="result">{total.toFixed(2)}</span>лв.
          </h3>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TotalByRange;
