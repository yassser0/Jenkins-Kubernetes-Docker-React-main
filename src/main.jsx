import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // Import a CSS file for additional styling

const App = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "completed", "incomplete"
  const [priority, setPriority] = useState("low"); // "low", "medium", "high"
  const [dueDate, setDueDate] = useState("");
  const [theme, setTheme] = useState("light"); // "light" or "dark"

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Add a new todo item as an object { text, completed, priority, dueDate }
  const addTodo = () => {
    if (todo.trim() !== "") {
      setTodos([
        ...todos,
        { text: todo.trim(), completed: false, priority, dueDate },
      ]);
      setTodo("");
      setPriority("low");
      setDueDate("");
    }
  };

  // Delete a todo item by its index
  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  // Toggle the complete status of a todo item
  const toggleComplete = (index) => {
    setTodos(
      todos.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Save edited todo text
  const saveEdit = (index) => {
    if (editText.trim() !== "") {
      setTodos(
        todos.map((item, i) =>
          i === index ? { ...item, text: editText.trim() } : item
        )
      );
      setEditingIndex(null);
      setEditText("");
    }
  };

  // Clear all todos
  const clearTodos = () => {
    setTodos([]);
  };

  // Allow adding todo with Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  // Filter todos based on completion status
  const filteredTodos = todos.filter((item) => {
    if (filter === "completed") return item.completed;
    if (filter === "incomplete") return !item.completed;
    return true; // "all"
  });

  // Sort todos by priority
  const sortedTodos = filteredTodos.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className={`container ${theme}`}>
      <h1>Todo App</h1>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          className="todo-input"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="due-date-input"
        />
        <button onClick={addTodo} className="add-button">
          Add
        </button>
      </div>
      <div className="filter-section">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active" : ""}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className={filter === "incomplete" ? "active" : ""}
        >
          Incomplete
        </button>
      </div>
      <p>Total Todos: {todos.length}</p>
      <ul className="todo-list">
        {sortedTodos.map((item, index) => (
          <li key={index} className={`todo-item ${item.completed ? "completed" : ""}`}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-input"
                />
                <button onClick={() => saveEdit(index)} className="save-button">
                  Save
                </button>
                <button onClick={() => setEditingIndex(null)} className="cancel-button">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  className={`todo-text ${item.completed ? "completed-text" : ""}`}
                  onClick={() => toggleComplete(index)}
                >
                  {item.text} <span className={`priority ${item.priority}`}>{item.priority}</span>
                  {item.dueDate && <span className="due-date">Due: {item.dueDate}</span>}
                </span>
                <div className="action-buttons">
                  <button
                    onClick={() => {
                      setEditingIndex(index);
                      setEditText(item.text);
                    }}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteTodo(index)} className="delete-button">
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {todos.length > 0 && (
        <button onClick={clearTodos} className="clear-button">
          Clear All Todos
        </button>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);