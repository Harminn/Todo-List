import React, { useState, useEffect, useImperativeHandle } from "react";
import "./Form.css";

const Form = () => {
  const [formData, setFormData] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingValue, setEditingValue] = useState("");
  const [completionStatus, setCompletionStatus] = useState({});

  console.log("This is learning React");

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    const storedCompletionStatus = localStorage.getItem("completionStatus");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
    if (storedCompletionStatus) {
      setCompletionStatus(JSON.parse(storedCompletionStatus));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
    localStorage.setItem("completionStatus", JSON.stringify(completionStatus));
  }, [formData, completionStatus]);

  const handleChange = (e) => {
    setNewItem(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setFormData([...formData, newItem.trim()]);
      setCompletionStatus((prevStatus) => ({
        ...prevStatus,
        [formData.length]: false,
      }));
      setNewItem("");
    }
    if (newItem === "") {
      alert("Please enter something");
    }
  };

  const handleDelete = (index) => {
    const updatedData = [...formData];
    updatedData.splice(index, 1);
    setFormData(updatedData);
    setEditingIndex(-1);
    setEditingValue("");
    const updatedCompletionStatus = { ...completionStatus };
    delete updatedCompletionStatus[index];
    setCompletionStatus(updatedCompletionStatus);
  };

  const handleEdit = (index, value) => {
    setEditingIndex(index);
    setEditingValue(value);
  };

  const handleEditSave = () => {
    if (editingValue.trim()) {
      const updatedData = [...formData];
      updatedData[editingIndex] = editingValue.trim();
      setFormData(updatedData);
      setEditingIndex(-1);
      setEditingValue("");
    }
  };

  const handleCheckboxChange = (index) => {
    setCompletionStatus((prevStatus) => ({
      ...prevStatus,
      [index]: !prevStatus[index],
    }));
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newItem}
          onChange={handleChange}
          placeholder="Enter a new todo"
        />
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
      <ul className="todo-list">
        {formData.map((item, index) => (
          <li key={index} className="todo-item">
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                />
                <button className="delete-btn" onClick={handleEditSave}>
                  Save
                </button>
              </>
            ) : (
              <>
                {item}
                <span
                  className={completionStatus[index] ? "success" : "pending"}
                >
                  {completionStatus[index] ? "Success" : "Pending"}
                </span>
                <input
                  type="checkbox"
                  checked={completionStatus[index] || false}
                  onChange={() => handleCheckboxChange(index)}
                />
                <button onClick={() => handleEdit(index, item)}>Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Form;
