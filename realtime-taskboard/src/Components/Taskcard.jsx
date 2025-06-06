import React, { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ task, columnId, deleteTask, updateTask }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleUpdate = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.title) {
      updateTask(columnId, task.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Delete confirmation - this is normally instant, if slow check your environment
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(columnId, task.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-100 rounded p-2 flex justify-between items-center shadow"
    >
      {isEditing ? (
        <div className="flex-grow flex items-center gap-2">
          <input
            type="text"
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdate();
              else if (e.key === "Escape") handleCancel();
            }}
            className="flex-grow border rounded p-1"
          />
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-2 py-1 rounded"
            aria-label="Save Task"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-2 py-1 rounded"
            aria-label="Cancel Edit"
          >
            Cancel
          </button>
        </div>
      ) : (
        <span onDoubleClick={() => setIsEditing(true)} className="flex-grow cursor-text">
          {task.title}
        </span>
      )}

      {!isEditing && (
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => setIsEditing(true)}
            title="Edit Task"
            className="text-blue-600 font-bold"
            aria-label="Edit Task"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            title="Delete Task"
            className="text-red-600 font-bold"
            aria-label="Delete Task"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
