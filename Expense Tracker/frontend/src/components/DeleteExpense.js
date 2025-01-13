import React, { useState } from "react";
import axios from "axios";

const DeleteExpense = () => {
  const [expenseId, setExpenseId] = useState("");

  const handleDelete = async () => {
    if (!expenseId) {
      alert("Please enter an expense ID.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:5000/expenses/${expenseId}`);
      alert("Expense deleted!");
      setExpenseId(""); // Clear the input field after successful deletion
    } catch (error) {
      console.error("Error deleting expense", error);
      alert("Failed to delete expense, please check the ID.");
    }
  };

  return (
    <div>
      <input
        type="number"
        value={expenseId}
        onChange={(e) => setExpenseId(e.target.value)}
        placeholder="Enter Expense ID"
        required
      />
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeleteExpense;

