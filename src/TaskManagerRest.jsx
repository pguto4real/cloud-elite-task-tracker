import React, { useState } from "react";
import { addTask } from "./api/addTask";
import { markTaskDone } from "./api/markTaskDone";
import { deleteTask } from "./api/deleteTask";
import TaskPriority from "./TaskPriority";

export default function TaskManager({ name, userId, tasks, onTaskAdded }) {

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortAsc, setSortAsc] = useState(true);

  async function handleAddTask() {
    try {
      const success = await addTask(newTaskTitle, userId);
      if (success) {
        setNewTaskTitle("");
        if (onTaskAdded) onTaskAdded(); // 👈 notify parent
      }
    } catch (err) {
      console.error("Add task failed:", err);
    }
  }

  async function handleMarkTaskDone(taskId) {
    try {
      const success = await markTaskDone(taskId);
      if (success && onTaskAdded) onTaskAdded(); // 👈 notify parent
    } catch (err) {
      console.error("Mark done failed:", err);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      const success = await deleteTask(taskId);
      if (success && onTaskAdded) onTaskAdded(); // 👈 notify parent
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  // ❌ no need for local loadTasks here — parent owns the refresh

  // sorting logic (unchanged)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortField === "title") {
      if (a.title < b.title) return sortAsc ? -1 : 1;
      if (a.title > b.title) return sortAsc ? 1 : -1;
      return 0;
    } else if (sortField === "status") {
      const orderA = a.status === "done" ? 1 : 0;
      const orderB = b.status === "done" ? 1 : 0;
      if (orderA < orderB) return sortAsc ? -1 : 1;
      if (orderA > orderB) return sortAsc ? 1 : -1;
      return 0;
    }
    return 0;
  });

  return (
    <div>
      <h2>My Tasks ({name})</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newTaskTitle}
          placeholder="Enter task title..."
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>
              Title{" "}
              <button
                onClick={() => {
                  setSortField("title");
                  setSortAsc(sortField === "title" ? !sortAsc : true);
                }}
              >
                {sortField === "title" ? (sortAsc ? "↑" : "↓") : "↕"}
              </button>
            </th>
            <th>
              Status{" "}
              <button
                onClick={() => {
                  setSortField("status");
                  setSortAsc(sortField === "status" ? !sortAsc : true);
                }}
              >
                {sortField === "status" ? (sortAsc ? "↑" : "↓") : "↕"}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((t) => (
            <tr key={t.taskId}>
              <td>{t.taskId}</td>
              <td>{t.title}</td>
              <td>{t.status === "done" ? "Done" : "Pending"}</td>
              <td>
                {t.status !== "done" && (
                  <button onClick={() => handleMarkTaskDone(t.taskId)}>Done</button>
                )}
                <button onClick={() => handleDeleteTask(t.taskId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TaskPriority tasks={tasks} />
    </div>
  );
}
