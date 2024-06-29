import React from "react";

const TodoItem = ({ todo, onDelete }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {todo.label}
      <button className="btn btn-danger btn-sm" onClick={onDelete}>
        <i className="fas fa-trash-alt"></i>
      </button>
    </li>
  );
};

export default TodoItem;
