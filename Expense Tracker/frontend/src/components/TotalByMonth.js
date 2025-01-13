import React, { useState } from "react";
import axios from "axios";

const TotalByMonth = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [total, setTotal] = useState(null);
  const [error, setError] = useState("");

  const fetchTotal = async () => {
    if (!month || !year) {
      setError("Please select both month and year.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:5000/expenses/total", {
        params: { month, year },
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
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">--Select Month--</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year"
            min="2000"
            max="2100"
            required
          />
        </label>
      </div>
      <button onClick={fetchTotal}>Calculate</button>
      {total !== null && (
        <div>
          <h3 className="output">
            Total Spent in {new Date(0, month - 1).toLocaleString("default", { month: "long" })}{" "}
            {year}:{" "}
            <span className="result">{total.toFixed(2)}</span>лв.
          </h3>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TotalByMonth;
