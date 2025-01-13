import React, { useState } from "react";
import axios from "axios";

const AddGroup = () => {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/groups", {
        name: groupName,
      });
      alert("Group added: " + response.data.name);
      setGroupName("");
    } catch (error) {
      console.error("Error adding group", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        className="addgroup"
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
        required
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddGroup;
