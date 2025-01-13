import React, { useState, useEffect } from "react";
import axios from "axios";

const AddExpense = () => {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
     const response = await axios.get("http://127.0.0.1:5000/groups");
      setGroups(response.data);
    };
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await axios.post("http://127.0.0.1:5000/expenses", {
        group_id: groupId,
        amount: parseFloat(amount),
        date,
        description,
      });
      alert("Expense added!");
      setGroupId("");
      setAmount("");
      setDate("");
      setDescription("");
    } catch (error) {
      console.error("Error adding expense", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description (optional)"
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddExpense;
