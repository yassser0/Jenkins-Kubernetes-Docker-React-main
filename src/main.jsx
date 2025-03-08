import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  // Add a new todo item as an object { text, completed }
  const addTodo = () => {
    if (todo.trim() !== "") {
      setTodos([...todos, { text: todo.trim(), completed: false }]);
      setTodo("");
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

  // Inline CSS styles with enhancements
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "50px auto",
      padding: "20px",
      border: "2px solid #ccc",
      borderRadius: "8px",
      fontFamily: "Arial, sans-serif",
      background: "#f9f9f9",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    input: {
      width: "70%",
      padding: "10px",
      fontSize: "16px",
      border: "1px solid #ddd",
      borderRadius: "4px"
    },
    button: {
      padding: "10px 15px",
      marginLeft: "5px",
      fontSize: "16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      background: "#007BFF",
      color: "#fff"
    },
    clearButton: {
      padding: "10px 15px",
      marginTop: "10px",
      fontSize: "16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      background: "#dc3545",
      color: "#fff"
    },
    todoItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid #eee"
    },
    todoText: {
      flex: "1",
      cursor: "pointer"
    },
    completedText: {
      textDecoration: "line-through",
      color: "#999"
    },
    actionButtons: {
      marginLeft: "10px"
    },
    editInput: {
      padding: "5px",
      fontSize: "14px",
      marginRight: "5px",
      border: "1px solid #ddd",
      borderRadius: "4px"
    }
  };

  return (
    <div style={styles.container}>
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <button onClick={addTodo} style={styles.button}>Add</button>
      </div>
      <p>Total Todos: {todos.length}</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((item, index) => (
          <li key={index} style={styles.todoItem}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={styles.editInput}
                />
                <button onClick={() => saveEdit(index)} style={styles.button}>Save</button>
                <button onClick={() => setEditingIndex(null)} style={styles.button}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    ...styles.todoText,
                    ...(item.completed ? styles.completedText : {})
                  }}
                  onClick={() => toggleComplete(index)}
                >
                  {item.text}
                </span>
                <div style={styles.actionButtons}>
                  <button onClick={() => { setEditingIndex(index); setEditText(item.text); }} style={styles.button}>Edit</button>
                  <button onClick={() => deleteTodo(index)} style={{ ...styles.button, background: "#dc3545" }}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {todos.length > 0 && (
        <button onClick={clearTodos} style={styles.clearButton}>Clear All</button>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
