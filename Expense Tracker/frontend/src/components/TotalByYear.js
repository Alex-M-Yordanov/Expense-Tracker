import React, { useState } from "react";
import axios from "axios";

const TotalByYear = () => {
  const [year, setYear] = useState("");
  const [total, setTotal] = useState(null);
  const [error, setError] = useState("");

  const fetchTotal = async () => {
    if (!year) {
      setError("Please enter a year.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:5000/expenses/total_year", {
        params: { year },
      });
      setTotal(response.data.total_spent);
      setError("");
    } catch (error) {
      console.error("Error fetching total by year:", error);
      setError("Failed to fetch total for the year. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year (e.g., 2024)"
            required
          />
        </label>
      </div>
      <button onClick={fetchTotal}>Calculate</button>
      {total !== null && (
        <div>
          <h3 className="output">
            Total spent in {year}:{" "}
            <span className="result">{total.toFixed(2)}</span>лв.
          </h3>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TotalByYear;
