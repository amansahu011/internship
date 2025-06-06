import React, { useState } from "react";
import Column from "./Column";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { v4 as uuid } from "uuid";

const TaskBoard = () => {
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do List", tasks: [] },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "complete", title: "Complete", tasks: [] },
  ]);

  const addTask = (columnId, title) => {
    if (!title) return;
    const newTask = { id: uuid(), title };
    setColumns(cols =>
      cols.map(col =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );
  };

  const deleteTask = (columnId, taskId) => {
    setColumns(cols =>
      cols.map(col =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
          : col
      )
    );
  };

  const updateTask = (columnId, taskId, newTitle) => {
    setColumns(cols =>
      cols.map(col =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.map(task =>
                task.id === taskId ? { ...task, title: newTitle } : task
              ),
            }
          : col
      )
    );
  };

  const findTaskLocation = (taskId) => {
    for (const col of columns) {
      const index = col.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) return { columnId: col.id, index };
    }
    return null;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const source = findTaskLocation(active.id);
    const destination = findTaskLocation(over.id);

    if (!source || !destination) return;

    const newColumns = [...columns];
    const sourceCol = newColumns.find(c => c.id === source.columnId);
    const destCol = newColumns.find(c => c.id === destination.columnId);

    if (source.columnId === destination.columnId) {
      sourceCol.tasks = arrayMove(sourceCol.tasks, source.index, destination.index);
    } else {
      const [movedTask] = sourceCol.tasks.splice(source.index, 1);
      destCol.tasks.splice(destination.index, 0, movedTask);
    }

    setColumns(newColumns);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-auto">
        {columns.map(col => (
          <SortableContext key={col.id} items={col.tasks.map(t => t.id)}>
            <Column
              column={col}
              addTask={addTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};

export default TaskBoard;
