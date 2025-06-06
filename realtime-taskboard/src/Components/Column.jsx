import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

const Column = ({ column, addTask, deleteTask, updateTask }) => {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      addTask(column.id, input.trim());
      setInput("");
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="w-80 bg-white p-4 rounded shadow flex flex-col"
    >
      <h2 className="text-xl font-bold mb-2">{column.title}</h2>
      <div className="flex-grow space-y-2 mb-2">
        {column.tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="New task"
          className="border p-2 rounded w-full"
          onKeyDown={e => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 py-1 rounded"
          title="Add Task"
        >
          ➕
        </button>
      </div>
    </div>
  );
};

export default Column;
