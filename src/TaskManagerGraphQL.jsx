// src/TaskManager.jsx
import React, { useState } from "react";
import TaskPriorityGrapgQL from "./TaskPriorityGrapgQL";
import { addTask  } from "./apiGraphQl/addTask"
import { markTaskDone  } from "./apiGraphQl/markTaskDone"
import { deleteTask   } from "./apiGraphQl/deleteTask"

export default function TaskManager({tasks,onTaskAddedQl}) {
  // const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortAsc, setSortAsc] = useState(true);
  
  // Add task
  async function handleAddTask() {
    const created = await addTask(newTaskTitle);
    if (created) {
      setNewTaskTitle("");
      if (onTaskAddedQl) onTaskAddedQl();
      // await loadTasks();
    }
  }

// Mark done
  async function handleMarkDone(taskId) {
    await markTaskDone(taskId);
   if (onTaskAddedQl) onTaskAddedQl();
  }

 // Delete
  async function handleDelete(taskId) {
    await deleteTask(taskId);
    if (onTaskAddedQl) onTaskAddedQl();
  }


  // 👇 Sorting logic
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
      <h2>My Tasks</h2>

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
                  <button onClick={() => handleMarkDone(t.taskId)}>Done</button>
                )}
                <button onClick={() => handleDelete(t.taskId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TaskPriorityGrapgQL tasks={tasks} />
    </div>
  );
}
