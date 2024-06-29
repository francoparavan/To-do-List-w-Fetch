import React, { useEffect, useState } from "react";
import TodoItem from "./TodoItem";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetch("https://playground.4geeks.com/todo/users/francop", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.todos)) {
          setTodos(data.todos);
        } else {
          setTodos([]);
        }
      })
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const handleAddTask = (e) => {
    if (e.key === 'Enter' && task.trim() !== "") {
      const newTask = { label: task.trim(), done: false };

      fetch('https://playground.4geeks.com/todo/users/francop', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      })
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          } else {
            throw new Error('Failed to add task');
          }
        })
        .then((data) => {
          setTodos([...todos, { ...newTask, id: data.id }]);
          setTask("");
          alert("Task added successfully.");
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const handleDelete = (taskId) => {
    const taskToDelete = todos.find(task => task.id === taskId);
    const resp = window.confirm(`Do you want to delete the task "${taskToDelete.label}"?`);
    if (resp) {
      fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
        .then((response) => {
          if (response.ok) {
            setTodos(todos.filter(task => task.id !== taskId));
            alert('Task deleted successfully.');
          } else {
            alert('Error deleting the task.');
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  const filteredTodos = todos.filter((todo) =>
    todo.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Insert task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleAddTask}
        />
      </div>

      <ul className="list-group">
        <h3 className="badge bg-primary my-1 py-2 d-flex">
          <span>Search tasks</span>
          <span className="ms-auto">
            <i
              className="fas fa-search"
              onClick={() => setShowSearch(!showSearch)}
            ></i>
          </span>
        </h3>
        {showSearch && (
          <input
            type="search"
            className="form-control mb-3"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onDelete={() => handleDelete(todo.id)} />
        ))}
      </ul>
    </div>
  );
};

export default App;
