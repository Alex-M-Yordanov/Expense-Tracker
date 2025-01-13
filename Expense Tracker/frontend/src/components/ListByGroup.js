import React, { useState, useEffect } from "react";
import axios from "axios";

const ListByGroup = () => {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(""); // Store selected group ID
  const [expenses, setExpenses] = useState([]); // Store the expenses for the selected group

  // Fetch groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/groups");
        setGroups(response.data); // Set groups state with the data
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };
    fetchGroups();
  }, []);

  // Fetch expenses for the selected group
  useEffect(() => {
    if (groupId) {
      const fetchExpenses = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/expenses/group/${groupId}`);
          setExpenses(response.data); // Set expenses state with the fetched data
        } catch (error) {
          console.error("Error fetching expenses", error);
        }
      };
      fetchExpenses();
    }
  }, [groupId]); // Run when the groupId changes

  return (
    <div>
      {/* Dropdown to select a group */}
      <select value={groupId} onChange={(e) => setGroupId(e.target.value)} required>
        <option value="">--Select Category--</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>

      <div>
        
        {expenses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{expense.amount} лв.</td>
                  <td>{expense.date}</td>
                  <td>{expense.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses available for this group.</p>
        )}
      </div>
    </div>
  );
};

export default ListByGroup;
