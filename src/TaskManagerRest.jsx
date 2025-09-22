// src/TaskManager.jsx
import React, { useState, useEffect } from "react";
import { get, post, put, del } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";

export default function TaskManager({name}) {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [sortField, setSortField] = useState("title"); // 👈 sort by "title" or "status"
  const [sortAsc, setSortAsc] = useState(true);
console.log(name)
  // 👇 helper to get the token once
  async function getAuthHeaders() {
    const session = await fetchAuthSession();
    
    const token = session.tokens?.idToken.toString();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async function fetchTasks() {
    try {
      const headers = await getAuthHeaders();

      const { body } = await get({
        apiName: "TaskAPI",
        path: "/tasks",
        options: { headers },
      }).response;

      const data = await body.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }

  async function addTask() {
    if (!newTaskTitle.trim()) return;
    try {
      const headers = await getAuthHeaders();

      await post({
        apiName: "TaskAPI",
        path: "/tasks",
        options: { headers, body: { title: newTaskTitle, done: false } },
      }).response;

      await fetchTasks();
      setNewTaskTitle("");
    } catch (err) {
      console.error("Error creating task:", err);
    }
  }

  async function markTaskDone(taskId) {
    try {
      const headers = await getAuthHeaders();

      await put({
        apiName: "TaskAPI",
        path: `/tasks/${taskId}`,
        options: { headers },
      }).response;

      await fetchTasks();
    } catch (err) {
      console.error("Error marking task done:", err);
    }
  }

  async function deleteTask(taskId) {
    try {
      const headers = await getAuthHeaders();

      await del({
        apiName: "TaskAPI",
        path: `/tasks/${taskId}`,
        options: { headers },
      }).response;

      await fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // 👇 Sorting logic (title or status)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortField === "title") {
      if (a.title < b.title) return sortAsc ? -1 : 1;
      if (a.title > b.title) return sortAsc ? 1 : -1;
      return 0;
    } else if (sortField === "status") {
      // Pending before Done if ascending
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
      <h2>My Tasks { name}</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newTaskTitle}
          placeholder="Enter task title..."
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
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
                  <button onClick={() => markTaskDone(t.taskId)}>Done</button>
                )}
                <button onClick={() => deleteTask(t.taskId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
